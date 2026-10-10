'use client';

import React from 'react';
import { StampSettings, StampShape } from '@/types/stamp';
import { Circle, Square, RectangleHorizontal, ShieldAlert, Scissors } from 'lucide-react';

interface ShapeControlsProps {
  settings: StampSettings;
  onChange: (updated: Partial<StampSettings>) => void;
}

export default function ShapeControls({ settings, onChange }: ShapeControlsProps) {
  const shapes: { id: StampShape; label: string; icon: React.ReactNode }[] = [
    { id: 'circle', label: '원형', icon: <Circle className="w-4 h-4" /> },
    { id: 'square', label: '정사각형', icon: <Square className="w-4 h-4" /> },
    { id: 'rect', label: '직사각형', icon: <RectangleHorizontal className="w-4 h-4" /> },
  ];

  const shrinkPresets = [80, 85, 90, 95, 100];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-5">
      {/* 1. 테두리 모양 및 테두리 없애기 통합 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-gray-900">
            1. 도장 모양 및 형태
          </label>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {shapes.map((item) => {
            const isSelected = settings.shape === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ shape: item.id })}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="mb-1">{item.icon}</div>
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* 테두리 없애기 통합 버튼 (사용자 요구사항) */}
          <button
            type="button"
            onClick={() => onChange({ noBorder: !settings.noBorder })}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
              settings.noBorder
                ? 'border-amber-600 bg-amber-500 text-white font-bold shadow-sm'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            title="테두리 선 없이 모양대로만 자르기 (검은 점선 가이드)"
          >
            <div className="mb-1">
              <Scissors className="w-4 h-4" />
            </div>
            <span>{settings.noBorder ? '테두리 없음' : '테두리 없애기'}</span>
          </button>
        </div>

        {settings.noBorder && (
          <p className="text-[11px] text-amber-700 font-medium mt-2 bg-amber-50 p-2 rounded-lg border border-amber-200">
            ✂️ <b>테두리 없애기 활성화</b>: 외곽선 없이 모양대로 재단할 수 있도록 <b>굵은 검은 점선</b>으로 가이드가 표시됩니다.
          </p>
        )}

        {/* 직사각형 비율 설정 */}
        {settings.shape === 'rect' && (
          <div className="mt-3 bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between text-xs text-gray-700">
            <span className="font-semibold">직사각형 비율 (가로:세로)</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10"
                value={settings.ratioX}
                onChange={(e) => onChange({ ratioX: Number(e.target.value) || 1 })}
                className="w-14 px-2 py-1 border border-gray-300 rounded text-center font-mono"
              />
              <span className="text-gray-400 font-bold">:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.ratioY}
                onChange={(e) => onChange({ ratioY: Number(e.target.value) || 1 })}
                className="w-14 px-2 py-1 border border-gray-300 rounded text-center font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. 도장 규격/크기 (mm) */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-bold text-gray-700">
            {settings.shape === 'circle' ? '도장 지름 (mm)' : '도장 크기 (mm)'}
          </label>
          <span className="text-xs font-mono font-semibold text-slate-800">
            {settings.shape === 'circle' || settings.shape === 'square'
              ? `${settings.sizeOne} mm`
              : `${settings.sizeW} × ${settings.sizeH} mm`}
          </span>
        </div>

        {settings.shape === 'circle' || settings.shape === 'square' ? (
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="10"
              max="100"
              value={settings.sizeOne}
              onChange={(e) => onChange({ sizeOne: Number(e.target.value) })}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <input
              type="number"
              min="5"
              max="150"
              value={settings.sizeOne}
              onChange={(e) => onChange({ sizeOne: Number(e.target.value) })}
              className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center text-xs font-mono"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">가로</span>
              <input
                type="number"
                min="10"
                max="150"
                value={settings.sizeW}
                onChange={(e) => onChange({ sizeW: Number(e.target.value) })}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg text-xs font-mono"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">세로</span>
              <input
                type="number"
                min="10"
                max="150"
                value={settings.sizeH}
                onChange={(e) => onChange({ sizeH: Number(e.target.value) })}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg text-xs font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. 잉크 안전 여백 (빨간색 점선으로 표시) */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span>잉크 안전 여백 (빨간 점선 표시)</span>
          </div>
          <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
            {settings.shrinkPercent}% 축소 (기본값 90%)
          </span>
        </div>
        <p className="text-[11px] text-gray-500 mb-2.5">
          도안 끝부분 잉크 번짐을 방지하는 안전 구역이며, 미리보기에 <b>빨간 점선</b>으로 표시됩니다.
        </p>

        {/* 프리셋 버튼 */}
        <div className="grid grid-cols-5 gap-1.5 mb-2.5">
          {shrinkPresets.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onChange({ shrinkPercent: val })}
              className={`py-1 rounded-lg text-xs font-medium transition-colors ${
                settings.shrinkPercent === val
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {val}%
            </button>
          ))}
        </div>

        <input
          type="range"
          min="70"
          max="100"
          value={settings.shrinkPercent}
          onChange={(e) => onChange({ shrinkPercent: Number(e.target.value) })}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
        />
      </div>

      {/* 4. 테두리 두께 조절 (테두리가 활성화되어 있을 때만) */}
      {!settings.noBorder && (
        <div className="pt-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-700 font-medium">테두리 선 두께</span>
            <span className="font-mono text-gray-900 font-semibold">
              {(settings.borderWidth * 0.06).toFixed(1)}mm
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="35"
            value={settings.borderWidth}
            onChange={(e) => onChange({ borderWidth: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
        </div>
      )}
    </div>
  );
}
