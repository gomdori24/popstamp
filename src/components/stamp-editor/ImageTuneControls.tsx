'use client';

import React, { useRef } from 'react';
import { StampSettings } from '@/types/stamp';
import { UploadCloud, Image as ImageIcon, Sliders, Sparkles, MousePointerClick } from 'lucide-react';

interface ImageTuneControlsProps {
  settings: StampSettings;
  onChange: (updated: Partial<StampSettings>) => void;
  onClearImage: () => void;
}

export default function ImageTuneControls({
  settings,
  onChange,
  onClearImage,
}: ImageTuneControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange({
        imageDataUrl: dataUrl,
        imageOffsetX: 0,
        imageOffsetY: 0,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange({
        imageDataUrl: dataUrl,
        imageOffsetX: 0,
        imageOffsetY: 0,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-5">
      {/* 2. 이미지 업로드 */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          2. 도안 이미지 업로드
        </label>

        {settings.imageDataUrl ? (
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.imageDataUrl}
                alt="업로드된 도안"
                className="w-12 h-12 object-contain rounded-lg border bg-white p-1"
              />
              <div>
                <span className="text-xs font-semibold text-gray-800">이미지 등록 완료</span>
                <p className="text-[11px] text-gray-400">마우스 드래그로 위치를 이동하세요</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs rounded-lg transition-colors"
              >
                변경
              </button>
              <button
                type="button"
                onClick={onClearImage}
                className="px-2.5 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs rounded-lg transition-colors"
              >
                삭제
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-colors"
          >
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-xs text-gray-700 font-medium">
                <span className="font-bold text-slate-900">클릭하여 파일 선택</span> 또는 드래그 앤 드롭
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, WEBP 이미지 지원</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* 3. 흑백 및 도안 미세 조정 */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
          <Sliders className="w-4 h-4 text-slate-700" />
          <span>3. 도안 미세 조정</span>
        </div>

        {/* 흑백 대비 (임계값) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-700 font-medium">흑백 대비 (임계값)</span>
            <span className="font-mono text-gray-900 font-semibold">{settings.threshold}</span>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={settings.threshold}
            onChange={(e) => onChange({ threshold: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
          <p className="text-[11px] text-gray-400 mt-0.5">값을 조절하여 회색 음영을 선명한 검은색으로 변환합니다.</p>
        </div>

        {/* 이미지 선 굵기 */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-700 font-medium">선 굵기 (진하게)</span>
            <span className="font-mono text-gray-900 font-semibold">
              {(settings.thick * 0.1).toFixed(1)}mm
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            value={settings.thick}
            onChange={(e) => onChange({ thick: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
          <p className="text-[11px] text-gray-400 mt-0.5">도안의 선이 얇아 끊어질 우려가 있을 때 굵게 덧칠합니다.</p>
        </div>

        {/* 이미지 크기 배율 */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-700 font-medium">그림 크기 (배율)</span>
            <span className="font-mono text-gray-900 font-semibold">{settings.scale}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="250"
            value={settings.scale}
            onChange={(e) => onChange({ scale: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
        </div>

        {/* 흑백 반전 */}
        <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            checked={settings.invert}
            onChange={(e) => onChange({ invert: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900"
          />
          <span className="text-xs text-gray-800 font-medium">흑백 뒤집기 (검은 배경 흰 그림일 때)</span>
        </label>
      </div>

      {/* 더블 클릭 지우개 스마트 안내 배너 (사용자 핵심 요구사항) */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
        <MousePointerClick className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-bold text-amber-900">
            더블 클릭 요소 지우기 기능 탑재!
          </div>
          <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
            미리보기 캔버스에서 불필요한 점, 얼룩, 잡티를 <b>더블 클릭</b>하면 연결된 해당 덩어리가 깔끔하게 사라집니다. (되돌리기: Ctrl+Z)
          </p>
        </div>
      </div>

      {/* 더 다듬기 (접을 수 있는 상세 설정) */}
      <details className="group border border-gray-200 rounded-xl bg-gray-50/60 p-3 text-xs">
        <summary className="flex items-center justify-between cursor-pointer font-bold text-gray-800 select-none">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>더 다듬기 (작은 점 · 번짐 · 잡티)</span>
          </span>
          <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>

        <div className="mt-3 space-y-3 pt-2 border-t border-gray-200/60">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">작은 점 지우기 (노이즈 필터)</span>
              <span className="font-mono text-gray-900 font-semibold">
                {(settings.speckSize * 0.05).toFixed(1)}mm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={settings.speckSize}
              onChange={(e) => onChange({ speckSize: Number(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded appearance-none cursor-pointer accent-slate-900"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">번짐 완화 (가장자리 매끄럽게)</span>
              <span className="font-mono text-gray-900 font-semibold">{settings.smooth}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              value={settings.smooth}
              onChange={(e) => onChange({ smooth: Number(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded appearance-none cursor-pointer accent-slate-900"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.denoise}
              onChange={(e) => onChange({ denoise: e.target.checked })}
              className="w-3.5 h-3.5 rounded border-gray-300 text-slate-900 focus:ring-slate-900"
            />
            <span className="text-gray-700">잡티 제거 (가장자리는 유지하고 배경 잡티 소거)</span>
          </label>
        </div>
      </details>
    </div>
  );
}
