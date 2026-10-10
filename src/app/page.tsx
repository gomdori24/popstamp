'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppHeader from '@/components/header/AppHeader';
import WelcomeModal from '@/components/modals/WelcomeModal';
import DesktopLayout from '@/components/stamp-editor/DesktopLayout';
import MobileWizardLayout from '@/components/stamp-editor/MobileWizardLayout';
import NameStampControls from '@/components/name-stamp/NameStampControls';
import PrintSheetView from '@/components/print-sheet/PrintSheetView';
import {
  StampSettings,
  NameStampSettings,
  PrintItem,
} from '@/types/stamp';
import {
  loadStampSettings,
  saveStampSettings,
  loadNameStampSettings,
  saveNameStampSettings,
  loadPrintItems,
  savePrintItems,
  loadViewMode,
  saveViewMode,
  DEFAULT_STAMP_SETTINGS,
  DEFAULT_NAME_STAMP_SETTINGS,
} from '@/lib/storage';

export default function StampStudioPage() {
  const [activeTab, setActiveTab] = useState<'stamp' | 'namestamp' | 'print'>('stamp');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 도안 생성기 설정
  const [stampSettings, setStampSettings] = useState<StampSettings>(DEFAULT_STAMP_SETTINGS);

  // 서명인/결재인 설정
  const [nameStampSettings, setNameStampSettings] = useState<NameStampSettings>(
    DEFAULT_NAME_STAMP_SETTINGS
  );

  // 인쇄 대기 아이템 목록
  const [printItems, setPrintItems] = useState<PrintItem[]>([]);

  // 1. 초기 로컬스토리지 로드 (새로고침 유지 지원)
  useEffect(() => {
    const savedStamp = loadStampSettings();
    const savedNameStamp = loadNameStampSettings();
    const savedPrints = loadPrintItems();
    const savedMode = loadViewMode();

    setStampSettings(savedStamp);
    setNameStampSettings(savedNameStamp);
    setPrintItems(savedPrints);
    setViewMode(savedMode);

    // 첫 방문자 확인
    const welcomeDismissed = localStorage.getItem('popstamp_welcome_dismissed');
    if (!welcomeDismissed) {
      setIsWelcomeOpen(true);
    }

    setIsLoaded(true);
  }, []);

  // 2. 도안 설정 변경 시 디바운스 자동 저장
  const saveStampTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!isLoaded) return;
    if (saveStampTimeout.current) clearTimeout(saveStampTimeout.current);
    saveStampTimeout.current = setTimeout(() => {
      saveStampSettings(stampSettings);
    }, 400);
  }, [stampSettings, isLoaded]);

  // 3. 서명인 설정 자동 저장
  useEffect(() => {
    if (!isLoaded) return;
    saveNameStampSettings(nameStampSettings);
  }, [nameStampSettings, isLoaded]);

  // 4. 인쇄 아이템 목록 자동 저장
  useEffect(() => {
    if (!isLoaded) return;
    savePrintItems(printItems);
  }, [printItems, isLoaded]);

  // 환경 모드 변경 핸들러
  const handleSetViewMode = (mode: 'desktop' | 'mobile') => {
    setViewMode(mode);
    saveViewMode(mode);
  };

  // 모달 닫기 핸들러
  const handleCloseWelcome = () => {
    setIsWelcomeOpen(false);
    localStorage.setItem('popstamp_welcome_dismissed', 'true');
  };

  // 도안 설정 업데이트 핸들러
  const handleUpdateStampSettings = (updated: Partial<StampSettings>) => {
    setStampSettings((prev) => ({ ...prev, ...updated }));
  };

  // 이미지 삭제 핸들러
  const handleClearImage = () => {
    setStampSettings((prev) => ({
      ...prev,
      imageDataUrl: null,
      imageOffsetX: 0,
      imageOffsetY: 0,
    }));
  };

  // 인쇄 목록 추가 핸들러
  const handleAddToPrintList = (item: PrintItem) => {
    setPrintItems((prev) => [item, ...prev]);
    alert(`[${item.name}] 도안이 인쇄실 목록에 추가되었습니다.`);
  };

  // 인쇄 아이템 삭제 핸들러
  const handleRemovePrintItem = (id: string) => {
    setPrintItems((prev) => prev.filter((it) => it.id !== id));
  };

  // 인쇄 아이템 전체 비우기
  const handleClearPrintItems = () => {
    if (confirm('인쇄 대기 목록을 모두 비우시겠습니까?')) {
      setPrintItems([]);
    }
  };

  // 인쇄 수량 변경
  const handleUpdatePrintQuantity = (id: string, qty: number) => {
    setPrintItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: Math.max(1, qty) } : it))
    );
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
        스튜디오 환경을 불러오는 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* 1. 상단 내비게이션 바 */}
      <AppHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={handleSetViewMode}
        printItemCount={printItems.length}
        onOpenHelp={() => setIsWelcomeOpen(true)}
      />

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'stamp' && (
          <>
            {viewMode === 'desktop' ? (
              <DesktopLayout
                settings={stampSettings}
                onUpdateSettings={handleUpdateStampSettings}
                onAddToPrintList={handleAddToPrintList}
                onClearImage={handleClearImage}
              />
            ) : (
              <MobileWizardLayout
                settings={stampSettings}
                onUpdateSettings={handleUpdateStampSettings}
                onAddToPrintList={handleAddToPrintList}
                onClearImage={handleClearImage}
              />
            )}
          </>
        )}

        {activeTab === 'namestamp' && (
          <NameStampControls
            settings={nameStampSettings}
            onChange={(updated) =>
              setNameStampSettings((prev) => ({ ...prev, ...updated }))
            }
            onAddToPrintList={handleAddToPrintList}
          />
        )}

        {activeTab === 'print' && (
          <PrintSheetView
            localItems={printItems}
            onRemoveLocalItem={handleRemovePrintItem}
            onClearLocalItems={handleClearPrintItems}
            onUpdateQuantity={handleUpdatePrintQuantity}
          />
        )}
      </main>

      {/* 3. 첫 접속 웰컴 및 환경 선택 모달 */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onSelectMode={handleSetViewMode}
        onClose={handleCloseWelcome}
      />
    </div>
  );
}
