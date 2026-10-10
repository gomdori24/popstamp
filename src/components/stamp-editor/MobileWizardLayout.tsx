'use client';

import React, { useState } from 'react';
import { StampSettings, PrintItem } from '@/types/stamp';
import ShapeControls from './ShapeControls';
import ImageTuneControls from './ImageTuneControls';
import CircularTextControls from './CircularTextControls';
import CanvasPreview from './CanvasPreview';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MobileWizardLayoutProps {
  settings: StampSettings;
  onUpdateSettings: (updated: Partial<StampSettings>) => void;
  onAddToPrintList: (item: PrintItem) => void;
  onClearImage: () => void;
}

export default function MobileWizardLayout({
  settings,
  onUpdateSettings,
  onAddToPrintList,
  onClearImage,
}: MobileWizardLayoutProps) {
  // 모바일 스텝 (0: 모양/크기, 1: 이미지/흑백, 2: 원형글자)
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: '1. 모양 및 크기', shortTitle: '모양' },
    { title: '2. 이미지 & 다듬기', shortTitle: '이미지' },
    {
      title: settings.shape === 'circle' ? '3. 원형 글자' : '3. 글자 넣기',
      shortTitle: '글자',
    },
  ];

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* 1. 상단: 고정된 미리보기 영역 (모바일에서도 절대 짤리지 않음) */}
      <div className="w-full">
        <CanvasPreview
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onAddToPrintList={onAddToPrintList}
        />
      </div>

      {/* 2. 스텝 인디케이터 탭 */}
      <div className="bg-white rounded-xl p-2 border border-gray-200 flex items-center justify-between gap-1 shadow-sm">
        {steps.map((st, idx) => {
          const isActive = currentStep === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentStep(idx)}
              className={`flex-1 py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span>{st.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* 3. 하단: 현재 단계 폼 내용 */}
      <div className="w-full">
        {currentStep === 0 && (
          <ShapeControls settings={settings} onChange={onUpdateSettings} />
        )}

        {currentStep === 1 && (
          <ImageTuneControls
            settings={settings}
            onChange={onUpdateSettings}
            onClearImage={onClearImage}
          />
        )}

        {currentStep === 2 && (
          <CircularTextControls
            config={settings.circularText}
            onChange={(circ) =>
              onUpdateSettings({ circularText: { ...settings.circularText, ...circ } })
            }
            isCircle={settings.shape === 'circle'}
            shape={settings.shape}
            rectConfig={settings.rectText}
            onRectChange={(rect) =>
              onUpdateSettings({ rectText: { ...settings.rectText, ...rect } })
            }
          />
        )}
      </div>

      {/* 4. 최하단 고정 내비게이션 바 (이전 / 다음) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 flex items-center justify-between gap-3 shadow-lg max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all ${
            currentStep === 0
              ? 'opacity-40 border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100 bg-white shadow-sm'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>이전 단계</span>
        </button>

        <span className="text-xs font-bold text-gray-500 whitespace-nowrap px-1">
          {currentStep + 1} / {steps.length}
        </span>

        <button
          type="button"
          onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
          disabled={currentStep === steps.length - 1}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
            currentStep === steps.length - 1
              ? 'opacity-40 bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
          }`}
        >
          <span>다음 단계</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
