'use client';

import React from 'react';
import { Monitor, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onSelectMode: (mode: 'desktop' | 'mobile') => void;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onSelectMode, onClose }: WelcomeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 text-white mb-3 shadow-md">
            <span className="text-2xl font-bold font-serif">印</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            스탬프 도안 생성기에 오신 것을 환영합니다
          </h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            학생·교사용 스탬프 도안부터 서명인·결재인 도장까지 손쉽게 제작하고,
            여러 기기에서 제출된 도안을 한곳에 모아 즉시 인쇄할 수 있습니다.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>주요 안내 및 특징</span>
          </div>
          <ul className="list-disc pl-4 space-y-1 text-slate-600">
            <li>흑백 도안 최적화 (더블 클릭으로 불필요한 점/얼룩 삭제)</li>
            <li>잉크 번짐 방지를 위한 <b>기본 90% 안전 여백</b> 적용</li>
            <li>서명인/결재인 도장 및 <b>한글 ➔ 한자 변환</b> 지원</li>
            <li>새로고침을 해도 작업 내용이 자동으로 보존됩니다.</li>
          </ul>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-800 mb-3 text-center">
            작업 환경을 선택해 주세요
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                onSelectMode('desktop');
                onClose();
              }}
              className="group flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-2 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <Monitor className="w-6 h-6" />
              </div>
              <span className="text-base font-bold text-slate-900">데스크탑</span>
              <span className="text-xs text-slate-500 mt-1">2열 넓은 화면에서 직관적 편집</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectMode('mobile');
                onClose();
              }}
              className="group flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-2 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="text-base font-bold text-slate-900">모바일</span>
              <span className="text-xs text-slate-500 mt-1">상단 미리보기 + 단계별 위저드</span>
            </button>
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-3">
            ※ 환경은 상단 헤더 메뉴에서 언제든지 다시 변경할 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>시작하기</span>
        </button>
      </div>
    </div>
  );
}
