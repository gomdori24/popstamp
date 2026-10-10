'use client';

import React, { useState } from 'react';
import { CircularTextConfig, RectTextConfig, StampShape } from '@/types/stamp';
import { Type, SlidersHorizontal, Laptop, Move, RotateCcw } from 'lucide-react';

interface CircularTextControlsProps {
  config: CircularTextConfig;
  onChange: (updated: Partial<CircularTextConfig>) => void;
  isCircle: boolean;
  shape?: StampShape;
  rectConfig?: RectTextConfig;
  onRectChange?: (updated: Partial<RectTextConfig>) => void;
}

export default function CircularTextControls({
  config,
  onChange,
  isCircle,
  shape,
  rectConfig,
  onRectChange,
}: CircularTextControlsProps) {
  const [localFonts, setLocalFonts] = useState<string[]>([]);
  const [isLoadingFonts, setIsLoadingFonts] = useState(false);

  const defaultFontFamilies = [
    { label: '기본 고딕 (Pretendard)', value: 'Pretendard, sans-serif' },
    { label: '동글동글 (Jua)', value: 'Jua, sans-serif' },
    { label: '굵은 고딕 (Do Hyeon)', value: 'Do Hyeon, sans-serif' },
    { label: '붓글씨 (Nanum Brush)', value: 'Nanum Brush Script, cursive' },
    { label: '명조체 (Noto Serif KR)', value: 'Noto Serif KR, serif' },
    { label: '바탕체 (Gowun Batang)', value: 'Gowun Batang, serif' },
  ];

  // [요구사항 4] 컴퓨터에 설치된 글꼴 불러오기 (Local Font Access API)
  const handleLoadLocalFonts = async () => {
    if ('queryLocalFonts' in window) {
      try {
        setIsLoadingFonts(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const availableFonts = await (window as any).queryLocalFonts();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const families = Array.from(new Set(availableFonts.map((f: any) => f.family))) as string[];
        families.sort((a, b) => a.localeCompare(b, 'ko'));
        setLocalFonts(families);
        alert(`${families.length}개의 컴퓨터 설치 글꼴을 성공적으로 불러왔습니다!`);
      } catch (err) {
        console.warn('글꼴 불러오기 실패 또는 권한 거부:', err);
        alert('글꼴 접근 권한이 거부되었거나 지원되지 않는 브라우저입니다.');
      } finally {
        setIsLoadingFonts(false);
      }
    } else {
      alert(
        '현재 브라우저에서는 시스템 글꼴 직접 탐색이 지원되지 않습니다 (Chrome, Edge 등 Chromium 기반 브라우저 지원).'
      );
    }
  };

  // --- 사각형 / 직사각형 도장 글자 넣기 UI ---
  if (!isCircle && rectConfig && onRectChange) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
            <Type className="w-4 h-4 text-indigo-600" />
            <span>4. 글자 넣기 ({shape === 'square' ? '정사각형' : '직사각형'})</span>
          </div>
          <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
            마우스 드래그 이동 지원
          </span>
        </div>

        <div className="space-y-4">
          {/* 문구 내용 입력 */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-gray-700">도안 문구 입력</span>
              <span className="text-gray-400 text-[11px]">여러 줄 입력 시 엔터(줄바꿈)</span>
            </div>
            <textarea
              rows={2}
              value={rectConfig.text}
              onChange={(e) => onRectChange({ text: e.target.value })}
              placeholder="도장에 새길 글자를 입력하세요 (예: 확인, 결재, 칭찬합니다)"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none resize-none"
            />
          </div>

          {/* 폰트 선택 & 굵게 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-700 font-medium">글꼴 선택</label>
              <button
                type="button"
                onClick={handleLoadLocalFonts}
                disabled={isLoadingFonts}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded transition-colors"
                title="이 컴퓨터에 설치된 폰트 목록을 가져옵니다"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>{isLoadingFonts ? '불러오는 중...' : '💻 컴퓨터 글꼴 불러오기'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={rectConfig.font}
                onChange={(e) => onRectChange({ font: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
              >
                <optgroup label="웹 기본 글꼴">
                  {defaultFontFamilies.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </optgroup>
                {localFonts.length > 0 && (
                  <optgroup label="내 컴퓨터 설치 글꼴">
                    {localFonts.map((fontName) => (
                      <option key={fontName} value={`"${fontName}", sans-serif`}>
                        {fontName}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              {/* [굵게] 토글 버튼 */}
              <button
                type="button"
                onClick={() => onRectChange({ bold: !rectConfig.bold })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors shrink-0 ${
                  rectConfig.bold
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                굵게
              </button>
            </div>
          </div>

          {/* 글자 크기 (mm) 및 자간 (mm) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">글자 크기</span>
                <span className="font-mono text-gray-900 font-bold">{rectConfig.sizeMm}mm</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="18"
                step="0.5"
                value={rectConfig.sizeMm}
                onChange={(e) => onRectChange({ sizeMm: Number(e.target.value) })}
                className="w-full h-1.5 bg-gray-200 rounded appearance-none cursor-pointer accent-slate-900"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">글자 자간</span>
                <span className="font-mono text-gray-900 font-bold">{rectConfig.spacing}mm</span>
              </div>
              <input
                type="range"
                min="-1"
                max="5"
                step="0.2"
                value={rectConfig.spacing}
                onChange={(e) => onRectChange({ spacing: Number(e.target.value) })}
                className="w-full h-1.5 bg-gray-200 rounded appearance-none cursor-pointer accent-slate-900"
              />
            </div>
          </div>

          {/* 마우스 드래그 이동 안내 및 가운데 정렬 버튼 */}
          <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4 text-indigo-600 shrink-0" />
              <p className="text-[11px] text-indigo-900 leading-tight">
                미리보기 캔버스에서 글자를 <b>마우스 좌클릭한 상태로 드래그</b>하면 원하는 곳으로 자유롭게 이동할 수 있습니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRectChange({ offsetX: 0, offsetY: 0 })}
              className="px-2.5 py-1 text-xs bg-white hover:bg-gray-50 text-indigo-700 font-semibold border border-indigo-200 rounded-lg flex items-center gap-1 shrink-0 transition-colors shadow-sm"
              title="글자를 도장 정가운데로 초기화"
            >
              <RotateCcw className="w-3 h-3" />
              <span>가운데</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
          <Type className="w-4 h-4 text-indigo-600" />
          <span>4. 원형 글자 (위 · 아래)</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* 위/아래 텍스트 입력 */}
        <div className="space-y-2.5">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-gray-700">위쪽 텍스트 (상단 호)</span>
              <span className="text-gray-400 text-[11px]">예: 행복초등학교</span>
            </div>
            <input
              type="text"
              value={config.ringTop}
              onChange={(e) => onChange({ ringTop: e.target.value })}
              placeholder="도장 위쪽에 새길 문구"
              maxLength={40}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-gray-700">아래쪽 텍스트 (하단 호)</span>
              <span className="text-gray-400 text-[11px]">예: 참 잘했어요</span>
            </div>
            <input
              type="text"
              value={config.ringBottom}
              onChange={(e) => onChange({ ringBottom: e.target.value })}
              placeholder="도장 아래쪽에 새길 문구"
              maxLength={40}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* 폰트 선택 & 컴퓨터 설치 글꼴 불러오기 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-700 font-medium">글꼴 선택</label>
            <button
              type="button"
              onClick={handleLoadLocalFonts}
              disabled={isLoadingFonts}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded transition-colors"
              title="이 컴퓨터에 설치된 폰트 목록을 가져옵니다"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>{isLoadingFonts ? '불러오는 중...' : '💻 컴퓨터 글꼴 불러오기'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <select
                value={config.ringFont}
                onChange={(e) => onChange({ ringFont: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
              >
                <optgroup label="웹 추천 폰트">
                  {defaultFontFamilies.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </optgroup>

                {localFonts.length > 0 && (
                  <optgroup label="내 컴퓨터 설치 폰트">
                    {localFonts.map((fam) => (
                      <option key={fam} value={`"${fam}", sans-serif`}>
                        {fam}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* [요구사항] '굵게' 버튼 */}
            <button
              type="button"
              onClick={() => onChange({ ringBold: !config.ringBold })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors shrink-0 ${
                config.ringBold
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              굵게
            </button>

            <div className="w-32">
              <select
                value={config.ringDot}
                onChange={(e) => onChange({ ringDot: e.target.value as 'star' | 'dot' | 'none' })}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
              >
                <option value="star">★ 별표</option>
                <option value="dot">● 동그라미</option>
                <option value="none">양옆 기호 없음</option>
              </select>
            </div>
          </div>
        </div>

        {/* 글자 크기 */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-700 font-medium">글자 크기 (mm)</span>
            <span className="font-mono text-gray-900 font-semibold">{config.ringSize} mm</span>
          </div>
          <input
            type="range"
            min="1.5"
            max="10"
            step="0.2"
            value={config.ringSize}
            onChange={(e) => onChange({ ringSize: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
        </div>

        {/* 테두리와 간격 & 자간 슬라이더 */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
            <span>간격 및 자간 미세 조정 (슬라이더)</span>
          </div>

          {/* 테두리와 간격 */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">테두리와의 안쪽 간격 (Gap)</span>
              <span className="font-mono text-gray-900 font-semibold">{config.ringGap} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              step="0.1"
              value={config.ringGap}
              onChange={(e) => onChange({ ringGap: Number(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
          </div>

          {/* 자간 */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">글자 간격 (자간)</span>
              <span className="font-mono text-gray-900 font-semibold">{config.ringSpacing} mm</span>
            </div>
            <input
              type="range"
              min="-0.2"
              max="1.5"
              step="0.05"
              value={config.ringSpacing}
              onChange={(e) => onChange({ ringSpacing: Number(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
