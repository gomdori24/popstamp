'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PrintItem, PrintSession } from '@/types/stamp';
import {
  Printer,
  Trash2,
  Users,
  Copy,
  Plus,
  RefreshCw,
  Send,
  Check,
  List,
  X,
  Clock,
} from 'lucide-react';

interface PrintSheetViewProps {
  localItems: PrintItem[];
  onRemoveLocalItem: (id: string) => void;
  onClearLocalItems: () => void;
  onUpdateQuantity: (id: string, qty: number) => void;
}

interface SessionSummary {
  id: string;
  title: string;
  createdAt: number;
  itemCount: number;
}

export default function PrintSheetView({
  localItems,
  onRemoveLocalItem,
  onClearLocalItems,
  onUpdateQuantity,
}: PrintSheetViewProps) {
  // 용지 설정 (도장 간격 기본값: 18mm)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [marginMm, setMarginMm] = useState(15);
  const [gapMm, setGapMm] = useState(18); // [요구사항 4] 기본값 18mm

  // [신규 기능] 가이드 (위치 잡기) 점선 설정: 도장 형태에 맞는 점선 라인 인쇄
  const [enableGuide, setEnableGuide] = useState(true);
  const [guideExtraMm, setGuideExtraMm] = useState<number>(3); // 기본값 3mm

  // [요구사항 4] '이름 추가' 기능: 가이드라인/도장 바깥쪽에 제출자 이름 라벨 인쇄
  const [showNameTag, setShowNameTag] = useState(true);

  // 멀티 기기 세션 상태
  const [currentSession, setCurrentSession] = useState<PrintSession | null>(null);
  const [sessionInputCode, setSessionInputCode] = useState('');
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitterName, setSubmitterName] = useState('사용자');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 세션 목록 선택 모달 상태 (요구사항 5)
  const [isSessionListModalOpen, setIsSessionListModalOpen] = useState(false);
  const [sessionList, setSessionList] = useState<SessionSummary[]>([]);
  const [isLoadingSessionList, setIsLoadingSessionList] = useState(false);

  // 1. 현재 세션이 있다면 주기적으로 제출된 도안 갱신 (3초 폴링)
  const fetchSessionData = useCallback(async (sessionId: string) => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`/api/print-sessions/${sessionId}`);
      const data = await res.json();
      if (data.success) {
        setCurrentSession(data.session);
      }
    } catch (err) {
      console.warn('세션 동기화 실패:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!currentSession?.id) return;
    const interval = setInterval(() => {
      fetchSessionData(currentSession.id);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentSession?.id, fetchSessionData]);

  // 전체 세션 목록 불러오기
  const loadAvailableSessions = async () => {
    try {
      setIsLoadingSessionList(true);
      const res = await fetch('/api/print-sessions');
      const data = await res.json();
      if (data.success) {
        setSessionList(data.sessions || []);
      }
    } catch (err) {
      console.warn('세션 목록 로드 실패:', err);
    } finally {
      setIsLoadingSessionList(false);
    }
  };

  const handleOpenSessionListModal = () => {
    setIsSessionListModalOpen(true);
    loadAvailableSessions();
  };

  // 관리자: 새 인쇄 세션 개설 (간단한 숫자 코드 자동 생성)
  const handleCreateSession = async () => {
    try {
      const res = await fetch('/api/print-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newSessionTitle || '스탬프 인쇄 모음' }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentSession(data.session);
        setIsCreatingSession(false);
        setNewSessionTitle('');
        alert(`새 인쇄 세션이 개설되었습니다!\n코드: ${data.session.id}`);
      }
    } catch {
      alert('세션 생성에 실패했습니다.');
    }
  };

  // 사용자: 기존 세션에 참여
  const handleJoinSession = async () => {
    if (!sessionInputCode.trim()) return;
    const code = sessionInputCode.trim().toUpperCase();
    await fetchSessionData(code);
    setSessionInputCode('');
  };

  // 세션 목록에서 세션 바로 선택
  const handleSelectSessionFromList = async (id: string) => {
    await fetchSessionData(id);
    setIsSessionListModalOpen(false);
  };

  // 사용자: 로컬에 있는 도안을 관리자 세션으로 전송
  const handleSubmitLocalItemToSession = async (item: PrintItem) => {
    if (!currentSession) return;
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/print-sessions/${currentSession.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          submittedBy: submitterName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`[${item.name}] 도안이 인쇄 목록에 등록되었습니다!`);
        fetchSessionData(currentSession.id);
      }
    } catch {
      alert('도안 제출에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 세션의 특정 도안 삭제
  const handleDeleteSessionItem = async (itemId: string) => {
    if (!currentSession) return;
    try {
      await fetch(`/api/print-sessions/${currentSession.id}?itemId=${itemId}`, {
        method: 'DELETE',
      });
      fetchSessionData(currentSession.id);
    } catch {
      alert('삭제 실패');
    }
  };

  // 인쇄 대상 목록
  const displayItems = currentSession ? currentSession.items : localItems;

  // [핵심 해결책] 독립 Iframe 인쇄 엔진: 웹사이트의 어떤 UI/UX도 포함되지 않고 오직 순수 A4 도안만 인쇄
  const handlePrint = () => {
    if (displayItems.length === 0) return;

    // 기존 임시 iframe이 있다면 제거
    const existingFrame = document.getElementById('stamp-print-iframe');
    if (existingFrame) existingFrame.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'stamp-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    const itemsHtml = displayItems
      .flatMap((item) =>
        Array.from({ length: item.quantity }).map(() => {
          const isCircle = item.shape === 'circle';
          const borderRadius = isCircle ? '50%' : '0';
          const extra = enableGuide ? Math.max(0, Number(guideExtraMm) || 0) : 0;
          const boxW = item.widthMm + extra;
          const boxH = item.heightMm + extra;
          const nameText = item.submittedBy || item.name;
          const nameHtml = showNameTag
            ? `<div class="stamp-name-tag">${nameText}</div>`
            : '';

          if (enableGuide && extra > 0) {
            return `
              <div class="stamp-unit">
                <div class="stamp-guide-box" style="width: ${boxW}mm; height: ${boxH}mm; border-radius: ${borderRadius};">
                  <div class="stamp-inner" style="width: ${item.widthMm}mm; height: ${item.heightMm}mm; border-radius: ${borderRadius};">
                    <img class="stamp-img" src="${item.imageDataUrl}" alt="${item.name}" />
                  </div>
                </div>
                ${nameHtml}
              </div>
            `;
          }

          return `
            <div class="stamp-unit">
              <div class="stamp-box" style="width: ${item.widthMm}mm; height: ${item.heightMm}mm; border-radius: ${borderRadius};">
                <img class="stamp-img" src="${item.imageDataUrl}" alt="${item.name}" />
              </div>
              ${nameHtml}
            </div>
          `;
        })
      )
      .join('');

    const pageW = orientation === 'portrait' ? '210mm' : '297mm';
    const pageH = orientation === 'portrait' ? '297mm' : '210mm';

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>도안 인쇄 - A4</title>
        <style>
          @page {
            size: A4 ${orientation};
            margin: 0;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            width: ${pageW};
            min-height: ${pageH};
            background: #ffffff;
            padding: ${marginMm}mm;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            gap: ${gapMm}mm;
            overflow: hidden;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .stamp-unit {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            page-break-inside: avoid;
            box-sizing: border-box;
          }
          .stamp-box {
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            padding: 0;
            page-break-inside: avoid;
            box-sizing: border-box;
          }
          .stamp-guide-box {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1.2px dashed #000000 !important;
            padding: 0;
            page-break-inside: avoid;
            box-sizing: border-box;
            background: transparent;
          }
          .stamp-inner {
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            box-sizing: border-box;
          }
          .stamp-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
          }
          .stamp-name-tag {
            font-size: 7.5pt;
            font-weight: bold;
            color: #333333;
            text-align: center;
            margin-top: 1.5mm;
            line-height: 1.2;
            word-break: keep-all;
            max-width: 45mm;
          }
        </style>
      </head>
      <body>
        ${itemsHtml}
      </body>
      </html>
    `);
    doc.close();

    // 이미지 렌더링 완료 후 인쇄 다이얼로그 호출
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      // 인쇄 완료 후 정리
      setTimeout(() => {
        iframe.remove();
      }, 2000);
    }, 400);
  };

  // 세션 코드 복사
  const handleCopyCode = () => {
    if (!currentSession) return;
    navigator.clipboard.writeText(currentSession.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. 상단: 관리자 및 다중 기기 실시간 취합 컨트롤 배너 */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 md:p-6 shadow-md border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">다중 기기 실시간 인쇄 취합 시스템</h3>
                {currentSession && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-xs font-semibold">
                    연결됨: 코드 {currentSession.id}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                관리자가 숫자 코드로 인쇄 세션을 개설하면, 다른 기기에서 제출한 도안이 실시간으로 모입니다.
              </p>
            </div>
          </div>

          {/* 세션 상태 액션 */}
          <div className="flex items-center gap-2 flex-wrap">
            {!currentSession ? (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="숫자 코드 (예: 1234)"
                  value={sessionInputCode}
                  onChange={(e) => setSessionInputCode(e.target.value)}
                  className="w-32 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 font-mono text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="button"
                  onClick={handleJoinSession}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  세션 참여
                </button>

                {/* [요구사항 5] 세션 목록 선택 버튼 */}
                <button
                  type="button"
                  onClick={handleOpenSessionListModal}
                  className="px-3 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                  title="개설된 세션 목록에서 선택"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>세션 목록</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCreatingSession(true)}
                  className="px-3.5 py-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 세션 개설 (숫자 코드)</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl font-mono text-sm">
                  <span className="text-indigo-300 font-bold">코드: {currentSession.id}</span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1 hover:bg-white/20 rounded transition-colors text-slate-300"
                    title="코드 복사"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleOpenSessionListModal}
                  className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-xs rounded-xl transition-colors"
                  title="다른 세션으로 변경"
                >
                  세션 변경
                </button>

                <button
                  type="button"
                  onClick={() => fetchSessionData(currentSession.id)}
                  disabled={isRefreshing}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs transition-colors"
                  title="새로고침"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentSession(null)}
                  className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs rounded-xl transition-colors"
                >
                  세션 나가기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 새 세션 만들기 입력창 */}
        {isCreatingSession && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              placeholder="인쇄 세션 이름 (예: 3학년 2반 스탬프)"
              value={newSessionTitle}
              onChange={(e) => setNewSessionTitle(e.target.value)}
              className="flex-1 max-w-xs px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400"
            />
            <button
              type="button"
              onClick={handleCreateSession}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              숫자 코드로 개설
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingSession(false)}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-slate-300 text-xs rounded-xl"
            >
              취소
            </button>
          </div>
        )}
      </div>

      {/* 2. 메인 영역: 좌측 컨트롤 & 우측 A4 인쇄 미리보기 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 좌측 설정 및 인쇄 목록 패널 (5열) */}
        <div className="lg:col-span-5 space-y-5">
          {/* 용지 및 배치 설정 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 text-sm">종이 및 여백 설정</span>
              {/* [요구사항 6] A4 미리보기만 인쇄되는 인쇄 버튼 */}
              <button
                type="button"
                onClick={handlePrint}
                disabled={displayItems.length === 0}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>A4 인쇄 / PDF 저장</span>
              </button>
            </div>

            <div className="text-[11px] text-indigo-800 bg-indigo-50/80 border border-indigo-200 rounded-xl p-2.5 space-y-0.5">
              <div className="font-bold flex items-center gap-1 text-indigo-900">
                <span>💡 실측 크기(mm) 1:1 인쇄 팁</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                인쇄 대화상자 설정에서 <b>배율(Scale)을 &apos;100%&apos; 또는 &apos;기본값&apos;</b>으로 지정해야 mm 단위가 자(ruler)로 쟀을 때 정확히 일치합니다. (&apos;용지에 맞춤&apos; 해제)
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-600 font-medium mb-1">용지 방향</label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                >
                  <option value="portrait">A4 세로</option>
                  <option value="landscape">A4 가로</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 font-medium mb-1">용지 여백</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={marginMm}
                  onChange={(e) => setMarginMm(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-mono text-center"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 font-medium mb-1">도장 간격</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={gapMm}
                  onChange={(e) => setGapMm(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-mono text-center"
                />
              </div>
            </div>

            {/* [신규 기능] 가이드 (위치 잡기) 점선 설정 */}
            <div className="pt-3 border-t border-gray-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={enableGuide}
                    onChange={(e) => setEnableGuide(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-gray-800">
                    가이드 (위치 잡기 점선) 함께 인쇄
                  </span>
                </label>
                {enableGuide && (
                  <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md">
                    +{guideExtraMm}mm
                  </span>
                )}
              </div>

              {enableGuide && (
                <div className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-xs">
                    <span className="font-semibold text-gray-700">가이드 여백 (도장보다 큰 크기)</span>
                    <p className="text-[10px] text-gray-400">지름/크기 추가 입력 (기본 3mm)</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0.5"
                      max="30"
                      step="0.5"
                      value={guideExtraMm}
                      onChange={(e) => setGuideExtraMm(Math.max(0, Number(e.target.value) || 0))}
                      className="w-20 px-2.5 py-1 border border-gray-300 rounded-lg text-xs text-right font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                    <span className="text-xs text-gray-500 font-semibold">mm</span>
                  </div>
                </div>
              )}
              <p className="text-[11px] text-gray-400 leading-tight">
                💡 도장의 형태(원형은 원형 점선, 사각형은 사각 점선)에 맞춰 도장보다 큰 점선 가이드라인이 함께 인쇄되어 가위/칼로 오려내거나 위치를 잡기 쉽습니다.
              </p>
            </div>

            {/* [신규 요구사항 4] 이름 추가 (도안 바깥 라벨 함께 인쇄) */}
            <div className="pt-2.5 border-t border-gray-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showNameTag}
                    onChange={(e) => setShowNameTag(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-gray-800">
                    이름 추가 (도안 바깥에 라벨 인쇄)
                  </span>
                </label>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                    showNameTag
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {showNameTag ? '이름 표시 중' : '꺼짐'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-tight">
                💡 도장(또는 가이드라인) 바깥쪽 하단에 제출자 이름을 인쇄하여, 도장 본체에 지장을 주지 않으면서 누구의 도장인지 쉽게 식별할 수 있습니다.
              </p>
            </div>
          </div>

          {/* 등록된 도안 목록 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="font-bold text-gray-900 text-sm">
                {currentSession ? `세션 취합 도안 (${displayItems.length}개)` : `인쇄 대기 도안 (${localItems.length}개)`}
              </span>
              {!currentSession && localItems.length > 0 && (
                <button
                  type="button"
                  onClick={onClearLocalItems}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  모두 비우기
                </button>
              )}
            </div>

            {displayItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">
                인쇄할 도안이 없습니다. 도안 만들기에서 <b>[인쇄 목록에 넣기]</b>를 클릭하세요.
              </div>
            ) : (
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {displayItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageDataUrl}
                        alt={item.name}
                        className="w-10 h-10 object-contain rounded-lg border bg-white p-0.5"
                      />
                      <div>
                        <div className="font-bold text-gray-900">{item.name}</div>
                        <div className="text-[11px] text-gray-500">
                          {item.widthMm}×{item.heightMm}mm
                          {item.submittedBy && <span className="ml-1 text-indigo-600 font-semibold">({item.submittedBy})</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-gray-500">수량</span>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={item.quantity}
                          onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value) || 1)}
                          className="w-12 px-1.5 py-1 border border-gray-300 rounded text-center font-mono"
                        />
                      </div>

                      {!currentSession ? (
                        <button
                          type="button"
                          onClick={() => onRemoveLocalItem(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteSessionItem(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentSession && localItems.length > 0 && (
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <input
                  type="text"
                  placeholder="제출자 이름"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  className="w-28 px-2 py-1.5 border border-gray-300 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleSubmitLocalItemToSession(localItems[0])}
                  disabled={isSubmitting}
                  className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>내 도안 세션에 전송하기</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 우측: A4 실측 인쇄 미리보기 시트 (7열) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <span className="font-bold text-gray-900 text-sm">A4 인쇄 미리보기</span>
              <span className="text-xs text-gray-500 font-mono">
                {orientation === 'portrait' ? '210mm × 297mm (세로)' : '297mm × 210mm (가로)'}
              </span>
            </div>

            {/* A4 종이 시뮬레이터 (프린트 시 @media print에 의해 이 영역만 백지에 인쇄됨) */}
            <div
              id="printSheetContainer"
              className="w-full bg-white border border-gray-300 shadow-lg p-4 overflow-hidden rounded transition-all"
              style={{
                aspectRatio: orientation === 'portrait' ? '210 / 297' : '297 / 210',
                padding: `${marginMm * 1.5}px`,
              }}
            >
              {displayItems.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-center text-gray-300 p-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <Printer className="w-10 h-10 mb-2 stroke-[1.5]" />
                  <span className="text-xs font-medium text-gray-400">
                    인쇄할 도안이 추가되면 이곳에 자동 정렬 배치됩니다.
                  </span>
                </div>
              ) : (
                <div
                  className="w-full h-full flex flex-wrap content-start"
                  style={{ gap: `${gapMm * 1.5}px` }}
                >
                  {displayItems.flatMap((item) =>
                    Array.from({ length: item.quantity }).map((_, qIdx) => {
                      const isCircle = item.shape === 'circle';
                      const extra = enableGuide ? Math.max(0, Number(guideExtraMm) || 0) : 0;
                      const boxW = (item.widthMm + extra) * 2.8;
                      const boxH = (item.heightMm + extra) * 2.8;
                      const innerW = item.widthMm * 2.8;
                      const innerH = item.heightMm * 2.8;

                      return (
                        <div
                          key={`${item.id}_${qIdx}`}
                          className="flex flex-col items-center justify-start shrink-0"
                        >
                          <div
                            className={`flex items-center justify-center transition-all ${
                              enableGuide && extra > 0
                                ? 'border border-dashed border-gray-700 bg-transparent'
                                : 'border border-dashed border-gray-200'
                            }`}
                            style={{
                              width: `${boxW}px`,
                              height: `${boxH}px`,
                              borderRadius: isCircle ? '50%' : '0',
                            }}
                            title={
                              enableGuide && extra > 0
                                ? `가이드 점선: ${item.widthMm + extra}mm (도장 본체: ${item.widthMm}mm)`
                                : item.name
                            }
                          >
                            <div
                              style={{
                                width: `${innerW}px`,
                                height: `${innerH}px`,
                                borderRadius: isCircle ? '50%' : '0',
                              }}
                              className="flex items-center justify-center overflow-hidden"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.imageDataUrl}
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                          {showNameTag && (
                            <span className="text-[9px] text-gray-800 font-bold mt-0.5 text-center truncate max-w-[75px] leading-tight select-none">
                              {item.submittedBy || item.name}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* [요구사항 5] 세션 목록 선택 모달 */}
      {isSessionListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-gray-900">개설된 인쇄 세션 선택</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSessionListModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {isLoadingSessionList ? (
                <div className="p-8 text-center text-xs text-gray-400">세션 목록 불러오는 중...</div>
              ) : sessionList.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400">
                  현재 개설된 인쇄 세션이 없습니다.
                </div>
              ) : (
                sessionList.map((ses) => (
                  <button
                    key={ses.id}
                    type="button"
                    onClick={() => handleSelectSessionFromList(ses.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-indigo-600 hover:bg-indigo-50/50 transition-all text-left"
                  >
                    <div>
                      <div className="font-bold text-sm text-gray-900">{ses.title}</div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono font-bold text-indigo-600">코드: {ses.id}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(ses.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg">
                      {ses.itemCount}개 도안
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSessionListModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
