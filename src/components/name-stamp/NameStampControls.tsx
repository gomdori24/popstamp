'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { NameStampSettings, PrintItem } from '@/types/stamp';
import HanjaModal from '@/components/modals/HanjaModal';
import {
  Languages,
  Download,
  Printer,
  ShieldAlert,
  RotateCcw,
  SlidersHorizontal,
  Send,
  X,
  Check,
} from 'lucide-react';

interface NameStampControlsProps {
  settings: NameStampSettings;
  onChange: (updated: Partial<NameStampSettings>) => void;
  onAddToPrintList: (item: PrintItem) => void;
}

export default function NameStampControls({
  settings,
  onChange,
  onAddToPrintList,
}: NameStampControlsProps) {
  const [isHanjaModalOpen, setIsHanjaModalOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 인쇄 목록 추가 / 세션 전송 모달 상태 (사용자 요구사항)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [sessionCodeInput, setSessionCodeInput] = useState('');
  const [submitterName, setSubmitterName] = useState('사용자');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 도장 캔버스 렌더링 (forExport가 true이면 가이드 점선을 일절 그리지 않고 순수 실선만 출력)
  const drawStampToCanvas = useCallback(
    (canvas: HTMLCanvasElement | null, forExport = false) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const W = forExport ? 1000 : 800;
      const H = forExport ? 1000 : 800;
      canvas.width = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);

      const centerX = W / 2;
      const centerY = H / 2;
      const strokeWidth = forExport ? 30 : 24;
      // forExport일 때는 도장 외경이 캔버스 100%에 꽉 차도록 여백 0으로 렌더링 -> 인쇄 시 실제 mm 크기와 1:1 일치
      const radius = forExport ? W / 2 - (settings.noBorder ? 0 : strokeWidth / 2) : 350;
      const safeRatio = settings.shrinkPercent / 100;
      const innerRadius = radius * safeRatio;

      // A. 테두리 그리기: 실선만 인쇄! forExport 시 테두리 없애기면 아무것도 그리지 않음
      if (!settings.noBorder) {
        ctx.save();
        ctx.strokeStyle = '#dc2626'; // 전통 붉은 인주 색상 실선
        ctx.lineWidth = strokeWidth;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else if (!forExport) {
        // [화면 미리보기 전용 가이드 점선] - 인쇄/내보내기 시에는 절대 출력되지 않음!
        ctx.save();
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // B. 글꼴 지정
      ctx.save();
      ctx.fillStyle = '#dc2626'; // 인주 붉은색
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let fontFamily = 'serif';
      if (settings.fontStyle === 'go') fontFamily = '"Gowun Batang", "Batang", serif';
      else if (settings.fontStyle === 'jeon') fontFamily = '"Black Han Sans", "Noto Sans KR", sans-serif';
      else if (settings.fontStyle === 'myeongjo') fontFamily = '"Noto Serif KR", serif';
      else fontFamily = '"Noto Sans KR", sans-serif';

      // [요구사항] '인'도 한글버전이면 한글 '인', 한자버전일 때만 '印'
      const inChar = settings.useHanja ? '印' : '인';

      const chars = Array.from(settings.name || '');
      const displayChars: string[] = chars.map((c, idx) => {
        if (settings.useHanja && settings.hanjaList[idx]) {
          return settings.hanjaList[idx];
        }
        return c;
      });

      if (settings.type === 'name3') {
        // 3글자(예: 홍길동)일 때 4번째 글자로 한글 '인' 또는 한자 '印'을 추가하여 상단: 홍길 / 하단: 동인 완성
        if (chars.length === 3) {
          displayChars.push(inChar);
        }

        if (displayChars.length === 4) {
          // 상단(홍, 길) / 하단(동, 인)
          const baseFontSize = innerRadius * 0.72;
          const fontSize = baseFontSize * (settings.fontScale / 100);
          ctx.font = `${settings.fontBold ? 'bold ' : 'normal '}${fontSize}px ${fontFamily}`;

          const colOffset = innerRadius * 0.44 + settings.letterSpacing;
          const rowOffset = innerRadius * 0.44 + settings.letterSpacing;

          // 0: 상단 좌측 (홍)
          ctx.fillText(displayChars[0] || '', centerX - colOffset + settings.offsetX, centerY - rowOffset + settings.offsetY);
          // 1: 상단 우측 (길)
          ctx.fillText(displayChars[1] || '', centerX + colOffset + settings.offsetX, centerY - rowOffset + settings.offsetY);
          // 2: 하단 좌측 (동)
          ctx.fillText(displayChars[2] || '', centerX - colOffset + settings.offsetX, centerY + rowOffset + settings.offsetY);
          // 3: 하단 우측 ('인' 또는 '印' 우측 하단 고정!)
          ctx.fillText(displayChars[3] || inChar, centerX + colOffset + settings.offsetX, centerY + rowOffset + settings.offsetY);
        } else if (displayChars.length === 2) {
          // 2글자: 상단 좌/우에 2글자, 하단 좌/우에 인/인
          const baseFontSize = innerRadius * 0.72;
          const fontSize = baseFontSize * (settings.fontScale / 100);
          ctx.font = `${settings.fontBold ? 'bold ' : 'normal '}${fontSize}px ${fontFamily}`;

          const colOffset = innerRadius * 0.44 + settings.letterSpacing;
          const rowOffset = innerRadius * 0.44 + settings.letterSpacing;

          ctx.fillText(displayChars[0] || '', centerX - colOffset + settings.offsetX, centerY - rowOffset + settings.offsetY);
          ctx.fillText(displayChars[1] || '', centerX + colOffset + settings.offsetX, centerY - rowOffset + settings.offsetY);
          ctx.fillText(settings.useHanja ? '之' : inChar, centerX - colOffset + settings.offsetX, centerY + rowOffset + settings.offsetY);
          ctx.fillText(inChar, centerX + colOffset + settings.offsetX, centerY + rowOffset + settings.offsetY);
        } else if (displayChars.length === 1) {
          const baseFontSize = innerRadius * 1.1;
          const fontSize = baseFontSize * (settings.fontScale / 100);
          ctx.font = `${settings.fontBold ? 'bold ' : 'normal '}${fontSize}px ${fontFamily}`;
          ctx.fillText(displayChars[0] || '', centerX + settings.offsetX, centerY + settings.offsetY);
        }
      } else if (settings.type === 'yakin') {
        // 약인 (정원형 1글자 성씨/대표자)
        const ch = displayChars[0] || inChar;
        const baseFontSize = innerRadius * 1.15;
        const fontSize = baseFontSize * (settings.fontScale / 100);
        ctx.font = `${settings.fontBold ? 'bold ' : 'normal '}${fontSize}px ${fontFamily}`;
        ctx.fillText(ch, centerX + settings.offsetX, centerY + settings.offsetY);
      }

      ctx.restore();
    },
    [settings]
  );

  // 화면 미리보기 렌더링 (가이드 점선 포함)
  useEffect(() => {
    drawStampToCanvas(canvasRef.current, false);
  }, [drawStampToCanvas]);

  // 이름 변경 시: 바로 한글로 입력 및 렌더링
  const handleNameChange = (newName: string) => {
    onChange({
      name: newName,
      useHanja: false,
      hanjaList: [],
    });
  };

  // 한자 변환 모달에서 적용 완료 시
  const handleApplyHanja = (selectedHanja: string[]) => {
    onChange({
      hanjaList: selectedHanja,
      useHanja: true,
    });
  };

  // 한글로 되돌리기
  const handleResetToKorean = () => {
    onChange({
      useHanja: false,
    });
  };

  // 점선이 전혀 없는 순수 실선/도안 DataURL 생성 헬퍼
  const getCleanStampDataUrl = (): string => {
    const offscreen = document.createElement('canvas');
    drawStampToCanvas(offscreen, true); // forExport = true (점선 제외)
    return offscreen.toDataURL('image/png');
  };

  // PNG 다운로드 (점선 없이 순수 도안만 저장)
  const handleDownload = () => {
    const url = getCleanStampDataUrl();
    const a = document.createElement('a');
    a.href = url;
    a.download = `${settings.name || '도장'}_서명인.png`;
    a.click();
  };

  // 인쇄 목록에 넣기 / 세션 전송 (점선 없이 순수 도안만 전송)
  const handleConfirmSubmit = async () => {
    const dataUrl = getCleanStampDataUrl();

    const item: PrintItem = {
      id: `namestamp_${Date.now()}`,
      name: `${settings.name || '성명'} 도장`,
      imageDataUrl: dataUrl,
      shape: 'circle',
      widthMm: settings.sizeMm,
      heightMm: settings.sizeMm,
      quantity: 1,
      createdAt: Date.now(),
      submittedBy: submitterName || '사용자',
    };

    if (sessionCodeInput.trim()) {
      try {
        setIsSubmitting(true);
        const code = sessionCodeInput.trim().toUpperCase();
        const res = await fetch(`/api/print-sessions/${code}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        const data = await res.json();
        if (data.success) {
          alert(`세션 [${code}]에 서명인 도안이 성공적으로 전송되었습니다!`);
          setIsSubmitModalOpen(false);
          onAddToPrintList(item);
        } else {
          alert(data.error || '세션 전송에 실패했습니다. 코드를 확인해주세요.');
        }
      } catch {
        alert('세션 전송 중 오류가 발생했습니다.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      onAddToPrintList(item);
      setIsSubmitModalOpen(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* 좌측: 컨트롤 폼 (7열) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-5">
          {/* 도장 유형 선택 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              1. 도장 종류 선택
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onChange({ type: 'name3' })}
                className={`py-3 px-3 rounded-xl border text-center transition-all ${
                  settings.type === 'name3'
                    ? 'border-red-600 bg-red-50 text-red-700 font-bold shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-sm font-bold">일반 성명인</div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  상단: 성명(2자) / 하단: 이름+인(우측 하단)
                </div>
              </button>

              <button
                type="button"
                onClick={() => onChange({ type: 'yakin' })}
                className={`py-3 px-3 rounded-xl border text-center transition-all ${
                  settings.type === 'yakin'
                    ? 'border-red-600 bg-red-50 text-red-700 font-bold shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-sm font-bold">약인 (1글자 정원형)</div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  정원형 대표 성씨 / 단자 도장
                </div>
              </button>
            </div>
          </div>

          {/* 이름 입력 및 한자 변환 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-900">
                2. 이름 입력 (한글 기본)
              </label>
              {settings.useHanja && (
                <button
                  type="button"
                  onClick={handleResetToKorean}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>한글로 되돌리기</span>
                </button>
              )}
            </div>

            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="홍길동"
                  maxLength={settings.type === 'yakin' ? 1 : 4}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-base font-bold text-center text-gray-900 focus:ring-2 focus:ring-red-500 focus:outline-none bg-white"
                />

                <button
                  type="button"
                  onClick={() => setIsHanjaModalOpen(true)}
                  disabled={!settings.name.trim()}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
                >
                  <Languages className="w-4 h-4" />
                  <span>한자 변환</span>
                </button>
              </div>

              <div className="mt-2 text-xs flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-gray-600">
                  {settings.useHanja ? (
                    <span className="text-red-700 font-bold">
                      한자 적용 중: {settings.hanjaList.join(' ')}
                    </span>
                  ) : (
                    <span>한글 입력 적용 중: <b>{settings.name}</b></span>
                  )}
                </span>
                <span className="text-[11px] text-gray-400">
                  {settings.type === 'name3' && settings.name.length === 3 && (
                    <span className="text-red-600 font-semibold">※ [홍][길] 상단 / [동][인] 하단 고정</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* 서체 스타일 및 굵게 버튼 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-gray-900">
                3. 글꼴 스타일
              </label>
              <button
                type="button"
                onClick={() => onChange({ fontBold: !settings.fontBold })}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  settings.fontBold
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                굵게
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onChange({ fontStyle: 'go' })}
                className={`py-2 px-2 rounded-xl border text-center transition-all ${
                  settings.fontStyle === 'go'
                    ? 'border-red-600 bg-red-50 text-red-700 font-bold shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-xs font-bold font-serif">고인체 (궁서)</div>
              </button>

              <button
                type="button"
                onClick={() => onChange({ fontStyle: 'jeon' })}
                className={`py-2 px-2 rounded-xl border text-center transition-all ${
                  settings.fontStyle === 'jeon'
                    ? 'border-red-600 bg-red-50 text-red-700 font-bold shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-xs font-bold">전서체 (굵은체)</div>
              </button>

              <button
                type="button"
                onClick={() => onChange({ fontStyle: 'myeongjo' })}
                className={`py-2 px-2 rounded-xl border text-center transition-all ${
                  settings.fontStyle === 'myeongjo'
                    ? 'border-red-600 bg-red-50 text-red-700 font-bold shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-xs font-bold font-serif">단아한 명조</div>
              </button>
            </div>
          </div>

          {/* [사용자 요구사항] 글자 사이 간격 및 글꼴 크기 조절 슬라이더 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <SlidersHorizontal className="w-4 h-4 text-red-600" />
              <span>글자 간격 및 크기 조절 (슬라이더)</span>
            </div>

            {/* 글꼴 크기 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">글꼴 크기 (비율)</span>
                <span className="font-mono text-gray-900 font-bold">{settings.fontScale}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="140"
                value={settings.fontScale}
                onChange={(e) => onChange({ fontScale: Number(e.target.value) })}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            {/* 글자 사이 간격 */}
            {settings.type === 'name3' && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">글자 사이 간격 (자간)</span>
                  <span className="font-mono text-gray-900 font-bold">
                    {(settings.letterSpacing * 0.1).toFixed(1)}mm
                  </span>
                </div>
                <input
                  type="range"
                  min="-25"
                  max="35"
                  value={settings.letterSpacing}
                  onChange={(e) => onChange({ letterSpacing: Number(e.target.value) })}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>
            )}
          </div>

          {/* 도장 규격 및 잉크 안전 여백 */}
          <div className="space-y-3 pt-1 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-700">도장 지름 (mm)</span>
              <span className="font-mono font-bold text-slate-800">{settings.sizeMm} mm</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              value={settings.sizeMm}
              onChange={(e) => onChange({ sizeMm: Number(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded appearance-none cursor-pointer accent-red-600"
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-bold text-gray-700 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                잉크 안전 여백 (기본 90%)
              </span>
              <span className="font-mono font-bold text-red-600">{settings.shrinkPercent}%</span>
            </div>
            <input
              type="range"
              min="75"
              max="100"
              value={settings.shrinkPercent}
              onChange={(e) => onChange({ shrinkPercent: Number(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded appearance-none cursor-pointer accent-red-600"
            />

            <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={settings.noBorder}
                onChange={(e) => onChange({ noBorder: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-xs font-bold text-gray-800">테두리 없애기</span>
              <span className="text-[11px] text-gray-400">(모양대로만 재단할 때)</span>
            </label>
          </div>
        </div>
      </div>

      {/* 우측: 인장 캔버스 미리보기 (5열) */}
      <div className="lg:col-span-5 sticky top-20">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <span className="font-bold text-gray-900 text-sm">서명인 미리보기</span>
            <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded">
              Ø{settings.sizeMm}mm ({settings.type === 'yakin' ? '정원형 약인' : '4자 배열 성명인'})
            </span>
          </div>

          <div
            className="w-full relative aspect-square max-w-[360px] rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%)',
              backgroundSize: '20px 20px',
            }}
          >
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          </div>

          <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleDownload}
              className="py-2.5 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>PNG 다운로드</span>
            </button>

            {/* [사용자 요구사항] 인쇄 목록에 넣기 (세션 코드 팝업 모달) */}
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>인쇄 목록에 넣기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 한자 변환 모달 */}
      <HanjaModal
        isOpen={isHanjaModalOpen}
        name={settings.name}
        initialHanjaList={settings.hanjaList}
        onApply={handleApplyHanja}
        onClose={() => setIsHanjaModalOpen(false)}
      />

      {/* [사용자 요구사항] 서명인 인쇄 목록 전송 / 세션 코드 모달 */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-bold text-gray-900">서명인 도안 인쇄 목록 등록</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  관리자 세션 코드 (선택)
                </label>
                <input
                  type="text"
                  placeholder="예: 1234 (관리자가 개설한 숫자 코드)"
                  value={sessionCodeInput}
                  onChange={(e) => setSessionCodeInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-mono font-bold text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 uppercase"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  코드를 입력하면 관리자의 인쇄실로 자동 전송되어 모입니다. 비워두면 내 컴퓨터 인쇄실에만 담깁니다.
                </p>
              </div>

              {sessionCodeInput.trim() && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">제출자 이름 / 닉네임</label>
                  <input
                    type="text"
                    placeholder="홍길동"
                    value={submitterName}
                    onChange={(e) => setSubmitterName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-xs hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                {sessionCodeInput.trim() ? (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>세션으로 전송</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>내 인쇄실에 추가</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
