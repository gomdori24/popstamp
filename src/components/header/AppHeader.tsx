'use client';

import React from 'react';
import { Monitor, Smartphone, Printer, Stamp, FileSignature, HelpCircle, Check } from 'lucide-react';

interface AppHeaderProps {
  activeTab: 'stamp' | 'namestamp' | 'print';
  setActiveTab: (tab: 'stamp' | 'namestamp' | 'print') => void;
  viewMode: 'desktop' | 'mobile';
  setViewMode: (mode: 'desktop' | 'mobile') => void;
  printItemCount: number;
  onOpenHelp: () => void;
}

export default function AppHeader({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  printItemCount,
  onOpenHelp,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* 좌측: 로고 & 타이틀 */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm">
            印
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
              스탬프 도안 생성기
            </h1>
            <p className="text-[11px] text-gray-500 hidden sm:block">
              학생·교사용 도안 및 서명인 제작 & 다중 기기 취합 인쇄
            </p>
          </div>
        </div>

        {/* 중앙: 메인 기능 탭 */}
        <nav className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('stamp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'stamp'
                ? 'bg-white text-gray-900 shadow-sm font-bold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <Stamp className="w-4 h-4 text-indigo-600" />
            <span>도안 만들기</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('namestamp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'namestamp'
                ? 'bg-white text-gray-900 shadow-sm font-bold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <FileSignature className="w-4 h-4 text-red-600" />
            <span>서명인 도장</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('print')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
              activeTab === 'print'
                ? 'bg-white text-gray-900 shadow-sm font-bold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>인쇄실</span>
            {printItemCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-emerald-600 text-white rounded-full text-[11px] font-bold">
                {printItemCount}
              </span>
            )}
          </button>
        </nav>

        {/* 우측: 환경 토글 (데스크탑 / 모바일) & 안내 */}
        <div className="flex items-center gap-2">
          {/* 환경 선택 버튼 그룹 */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'desktop'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              title="데스크탑 환경으로 보기"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>데스크탑</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'mobile'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              title="모바일 단계별 환경으로 보기"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>모바일</span>
            </button>
          </div>

          {/* 자동 저장 표시 (소형) */}
          <div
            className="hidden lg:flex items-center gap-1 text-[11px] text-emerald-600 font-medium px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-100"
            title="작업 내용이 브라우저에 자동 보존됩니다"
          >
            <Check className="w-3 h-3 text-emerald-600" />
            <span>자동 저장됨</span>
          </div>

          {/* 사용 안내 버튼 */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="사용 안내 다시보기"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
