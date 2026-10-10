'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StampSettings, PrintItem } from '@/types/stamp';
import {
  applyThresholdAndThickness,
  eraseConnectedComponent,
  cropToContentSquare,
} from '@/lib/canvas-utils';
import { drawCircularText } from '@/lib/circular-text';
import {
  Download,
  Printer,
  RotateCcw,
  Crosshair,
  Sparkles,
  Maximize2,
  Minimize2,
  Send,
  X,
  Check,
} from 'lucide-react';

interface CanvasPreviewProps {
  settings: StampSettings;
  onUpdateSettings: (updated: Partial<StampSettings>) => void;
  onAddToPrintList: (item: PrintItem) => void;
}

export default function CanvasPreview({
  settings,
  onUpdateSettings,
  onAddToPrintList,
}: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fullscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 로드된 이미지 객체 및 오프스크린 캔버스 캐시
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 실행 취소(Undo) 히스토리 스택
  const historyStackRef = useRef<ImageData[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  // 전체화면 상태 (요구사항)
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 인쇄 목록 추가 / 세션 전송 모달 상태 (요구사항)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [sessionCodeInput, setSessionCodeInput] = useState('');
  const [submitterName, setSubmitterName] = useState('사용자');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 마우스 인터랙션 상태
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 1. 이미지 로드
  useEffect(() => {
    if (!settings.imageDataUrl) {
      setSourceImg(null);
      processedCanvasRef.current = null;
      historyStackRef.current = [];
      setCanUndo(false);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = settings.imageDataUrl;
    img.onload = () => {
      setSourceImg(img);

      const off = document.createElement('canvas');
      off.width = img.width;
      off.height = img.height;
      const oCtx = off.getContext('2d');
      if (oCtx) {
        oCtx.drawImage(img, 0, 0);
      }

      const proc = document.createElement('canvas');
      applyThresholdAndThickness(
        off,
        proc,
        settings.threshold,
        settings.thick,
        settings.invert,
        settings.speckSize
      );
      // [사용자 요구사항] 실제 도안 잉크 영역만 정확한 정사각형으로 크롭하여 실제 중심을 정가운데로 일치시킴!
      const squared = cropToContentSquare(proc);
      processedCanvasRef.current = squared;
    };
  }, [settings.imageDataUrl]);

  // 2. 프로세싱 재실행
  useEffect(() => {
    if (!sourceImg) return;
    const off = document.createElement('canvas');
    off.width = sourceImg.width;
    off.height = sourceImg.height;
    const oCtx = off.getContext('2d');
    if (!oCtx) return;
    oCtx.drawImage(sourceImg, 0, 0);

    const proc = document.createElement('canvas');
    applyThresholdAndThickness(
      off,
      proc,
      settings.threshold,
      settings.thick,
      settings.invert,
      settings.speckSize
    );
    // [사용자 요구사항] 실제 도안 잉크 영역만 정확한 정사각형으로 크롭하여 실제 중심을 정가운데로 일치시킴!
    const squared = cropToContentSquare(proc);
    processedCanvasRef.current = squared;
  }, [sourceImg, settings.threshold, settings.thick, settings.invert, settings.speckSize]);

  // 3. 메인 캔버스 렌더링 함수
  // forExport = false: 화면 미리보기 (조작 편의를 위해 60mm 기준 캔버스에 여백과 가이드 점선 포함)
  // forExport = true: 인쇄 및 PNG 저장 (여백 0%, 도장 외경이 캔버스 100%에 딱 맞게 타이트하게 렌더링 -> 인쇄 시 실제 mm 크기와 1:1 일치)
  const drawToTargetCanvas = useCallback(
    (canvas: HTMLCanvasElement | null, forExport = false) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isCircle = settings.shape === 'circle';
      const isRect = settings.shape === 'rect';
      const widthMm = isRect ? settings.sizeW : settings.sizeOne;
      const heightMm = isRect ? settings.sizeH : settings.sizeOne;

      let W: number;
      let H: number;
      let pxPerMm: number;

      if (forExport) {
        // [인쇄 / 내보내기 전용: 실측 크기 100% 일치]
        // 캔버스 크기를 도장 크기에 100% 꽉 맞추어 여백을 0으로 만듦
        W = 1200;
        H = isRect ? Math.round((1200 * heightMm) / widthMm) : 1200;
        canvas.width = W;
        canvas.height = H;
        ctx.clearRect(0, 0, W, H);
        pxPerMm = W / widthMm;
      } else {
        // [화면 미리보기 전용: 60mm 기준 가상 작업 영역]
        W = 1000;
        H = 1000;
        canvas.width = W;
        canvas.height = H;
        ctx.clearRect(0, 0, W, H);
        pxPerMm = W / 60;
      }

      const centerX = W / 2;
      const centerY = H / 2;

      // 도장 크기 픽셀 계산
      const stampRadius = forExport ? W / 2 : (settings.sizeOne / 2) * pxPerMm;
      const stampW = forExport ? W : widthMm * pxPerMm;
      const stampH = forExport ? H : heightMm * pxPerMm;
      const safeRatio = settings.shrinkPercent / 100;

      // 선 굵기 비율 보정
      const effectiveBorderWidth = forExport
        ? settings.borderWidth * (pxPerMm / (1000 / 60))
        : settings.borderWidth;

      // --- A. 도장 외곽 테두리 선 그리기 (실선만 인쇄, 점선은 화면 미리보기 전용) ---
      if (!settings.noBorder) {
        ctx.save();
        ctx.strokeStyle = '#000000'; // 실제 제작/인쇄될 실선 테두리
        ctx.lineWidth = effectiveBorderWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (isCircle) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, stampRadius - effectiveBorderWidth / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (settings.shape === 'square') {
          const side = stampRadius * 2 - effectiveBorderWidth;
          ctx.strokeRect(centerX - side / 2, centerY - side / 2, side, side);
        } else if (isRect) {
          ctx.strokeRect(
            centerX - stampW / 2 + effectiveBorderWidth / 2,
            centerY - stampH / 2 + effectiveBorderWidth / 2,
            stampW - effectiveBorderWidth,
            stampH - effectiveBorderWidth
          );
        }
        ctx.restore();
      } else if (!forExport) {
        // [화면 미리보기 전용 가이드 점선] - 인쇄/PNG 저장 시에는 절대 들어가지 않음!
        ctx.save();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.setLineDash([12, 10]);

        if (isCircle) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, stampRadius, 0, Math.PI * 2);
          ctx.stroke();
        } else if (settings.shape === 'square') {
          const side = stampRadius * 2;
          ctx.strokeRect(centerX - side / 2, centerY - side / 2, side, side);
        } else if (isRect) {
          ctx.strokeRect(centerX - stampW / 2, centerY - stampH / 2, stampW, stampH);
        }
        ctx.restore();
      }

      // --- B. 잉크 안전 여백 (화면 미리보기 전용 빨간 점선, forExport 시에는 제외) ---
      if (!forExport) {
        ctx.save();
        ctx.strokeStyle = '#ef4444'; // 화면용 빨간색 점선
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 6]);

        if (isCircle) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, stampRadius * safeRatio, 0, Math.PI * 2);
          ctx.stroke();
        } else if (settings.shape === 'square') {
          const side = stampRadius * 2 * safeRatio;
          ctx.strokeRect(centerX - side / 2, centerY - side / 2, side, side);
        } else if (isRect) {
          ctx.strokeRect(
            centerX - (stampW * safeRatio) / 2,
            centerY - (stampH * safeRatio) / 2,
            stampW * safeRatio,
            stampH * safeRatio
          );
        }
        ctx.restore();
      }

      // --- C. 이미지 렌더링 (안전 여백 클리핑) ---
      if (processedCanvasRef.current) {
        ctx.save();
        ctx.beginPath();
        if (isCircle) {
          ctx.arc(centerX, centerY, stampRadius * safeRatio, 0, Math.PI * 2);
        } else if (settings.shape === 'square') {
          const s = stampRadius * 2 * safeRatio;
          ctx.rect(centerX - s / 2, centerY - s / 2, s, s);
        } else if (isRect) {
          const rw = stampW * safeRatio;
          const rh = stampH * safeRatio;
          ctx.rect(centerX - rw / 2, centerY - rh / 2, rw, rh);
        }
        ctx.clip();

        const proc = processedCanvasRef.current;
        const imgAspect = proc.width / proc.height;
        let drawW = stampRadius * 2 * (settings.scale / 100);
        let drawH = drawW / imgAspect;

        if (imgAspect < 1) {
          drawH = stampRadius * 2 * (settings.scale / 100);
          drawW = drawH * imgAspect;
        }

        // 오프셋도 화면 60mm 기준과 내보내기 캔버스 비율에 맞게 스케일
        const offsetScale = forExport ? pxPerMm / (1000 / 60) : 1;
        const imgX = centerX - drawW / 2 + settings.imageOffsetX * offsetScale;
        const imgY = centerY - drawH / 2 + settings.imageOffsetY * offsetScale;

        ctx.drawImage(proc, imgX, imgY, drawW, drawH);
        ctx.restore();
      }

      // --- D. 원형 글자 렌더링 ---
      if (isCircle) {
        const borderInset = settings.noBorder ? 0 : effectiveBorderWidth / 2;
        drawCircularText(
          ctx,
          centerX,
          centerY,
          stampRadius - borderInset,
          settings.circularText,
          pxPerMm
        );
      }

      // --- E. [신규 요구사항 1] 사각형 / 직사각형 글자 렌더링 ---
      if (!isCircle && settings.rectText?.text) {
        ctx.save();
        const cfg = settings.rectText;
        const fontMm = cfg.sizeMm || 4;
        const fontSizePx = fontMm * pxPerMm;
        ctx.font = `${cfg.bold ? 'bold ' : 'normal '}${fontSizePx}px ${cfg.font || 'sans-serif'}`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const textX = centerX + (cfg.offsetX || 0) * pxPerMm;
        const textY = centerY + (cfg.offsetY || 0) * pxPerMm;

        const lines = cfg.text.split('\n');
        const lineHeight = fontSizePx * 1.25;
        const totalHeight = lines.length * lineHeight;
        const startY = textY - totalHeight / 2 + lineHeight / 2;

        lines.forEach((line, idx) => {
          if (cfg.spacing && cfg.spacing !== 0) {
            const letterSpacingPx = cfg.spacing * pxPerMm;
            const chars = Array.from(line);
            const charWidths = chars.map((c) => ctx.measureText(c).width);
            const totalLineWidth =
              charWidths.reduce((a, b) => a + b, 0) + (chars.length - 1) * letterSpacingPx;
            let curX = textX - totalLineWidth / 2;
            const curY = startY + idx * lineHeight;
            chars.forEach((c, cIdx) => {
              ctx.fillText(c, curX + charWidths[cIdx] / 2, curY);
              curX += charWidths[cIdx] + letterSpacingPx;
            });
          } else {
            ctx.fillText(line, textX, startY + idx * lineHeight);
          }
        });

        // 화면 미리보기 중 글자 드래그 중일 때 보라색 선택 가이드 표시
        if (!forExport && isDraggingRef.current && activeDragTargetRef.current === 'text') {
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          const approxW = Math.max(40, cfg.text.length * fontSizePx * 0.85);
          ctx.strokeRect(
            textX - approxW / 2 - 8,
            startY - lineHeight / 2 - 4,
            approxW + 16,
            totalHeight + 8
          );
        }

        ctx.restore();
      }

      // --- F. [신규 요구사항 2] PPT 스타일 스마트 가이드 (가로/세로 중앙 도달 시 빨간 점선) ---
      if (!forExport && isDraggingRef.current && activeDragTargetRef.current === 'image') {
        ctx.save();
        ctx.strokeStyle = '#ef4444'; // 파워포인트 스타일 선명한 빨간 점선
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);

        // 세로 축 중앙선 (가로 가운데 x = centerX)
        if (snapGuideXRef.current) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - stampH / 2 - 25);
          ctx.lineTo(centerX, centerY + stampH / 2 + 25);
          ctx.stroke();
        }

        // 가로 축 중앙선 (세로 가운데 y = centerY)
        if (snapGuideYRef.current) {
          ctx.beginPath();
          ctx.moveTo(centerX - stampW / 2 - 25, centerY);
          ctx.lineTo(centerX + stampW / 2 + 25, centerY);
          ctx.stroke();
        }

        ctx.restore();
      }
    },
    [settings]
  );

  const renderCanvas = useCallback(() => {
    drawToTargetCanvas(canvasRef.current, false);
    if (isFullscreen) {
      drawToTargetCanvas(fullscreenCanvasRef.current, false);
    }
  }, [drawToTargetCanvas, isFullscreen]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // 4. 더블 클릭 요소 지우기 (전체화면에서도 동일하게 작동)
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!processedCanvasRef.current) return;
    const canvas = e.currentTarget;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const W = canvas.width;
    const centerX = W / 2;
    const pxPerMm = W / 60;
    const stampRadius = (settings.sizeOne / 2) * pxPerMm;

    const proc = processedCanvasRef.current;
    const imgAspect = proc.width / proc.height;
    let drawW = stampRadius * 2 * (settings.scale / 100);
    let drawH = drawW / imgAspect;

    if (imgAspect < 1) {
      drawH = stampRadius * 2 * (settings.scale / 100);
      drawW = drawH * imgAspect;
    }

    const imgX = centerX - drawW / 2 + settings.imageOffsetX;
    const imgY = centerX - drawH / 2 + settings.imageOffsetY;

    const relX = ((clickX - imgX) / drawW) * proc.width;
    const relY = ((clickY - imgY) / drawH) * proc.height;

    const pCtx = proc.getContext('2d');
    if (!pCtx) return;

    const prevState = pCtx.getImageData(0, 0, proc.width, proc.height);
    const result = eraseConnectedComponent(pCtx, relX, relY, proc.width, proc.height);

    if (result.modified) {
      historyStackRef.current.push(prevState);
      setCanUndo(true);
      renderCanvas();
    }
  };

  // 실행 취소
  const handleUndo = () => {
    if (!processedCanvasRef.current || historyStackRef.current.length === 0) return;
    const prev = historyStackRef.current.pop();
    if (!prev) return;

    const pCtx = processedCanvasRef.current.getContext('2d');
    if (pCtx) {
      pCtx.putImageData(prev, 0, 0);
      renderCanvas();
    }
    setCanUndo(historyStackRef.current.length > 0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // 마우스 인터랙션 타겟 및 스냅 상태
  const activeDragTargetRef = useRef<'image' | 'text' | null>(null);
  const snapGuideXRef = useRef(false);
  const snapGuideYRef = useRef(false);

  // 마우스 드래그 시작 (글자 클릭 시 글자 이동, 그 외 이미지 이동)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const W = canvas.width;
    const centerX = W / 2;
    const centerY = H_CANVAS(W) / 2;
    const pxPerMm = W / 60;

    // 사각형 글자가 존재하고 클릭 위치가 글자 바운딩 박스 근처인지 검사
    const isSquareOrRect = settings.shape === 'square' || settings.shape === 'rect';
    if (isSquareOrRect && settings.rectText?.text) {
      const textX = centerX + (settings.rectText.offsetX || 0) * pxPerMm;
      const textY = centerY + (settings.rectText.offsetY || 0) * pxPerMm;
      const fontMm = settings.rectText.sizeMm || 4;
      const fontSizePx = fontMm * pxPerMm;
      const approxW = Math.max(30, settings.rectText.text.length * fontSizePx * 0.9);
      const approxH = Math.max(
        24,
        fontSizePx * 1.5 * (settings.rectText.text.split('\n').length || 1)
      );

      if (
        Math.abs(clickX - textX) <= approxW / 2 + 15 &&
        Math.abs(clickY - textY) <= approxH / 2 + 15
      ) {
        activeDragTargetRef.current = 'text';
        isDraggingRef.current = true;
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        return;
      }
    }

    // 기본: 이미지 드래그 타겟
    activeDragTargetRef.current = 'image';
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  function H_CANVAS(w: number) {
    return w;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    if (activeDragTargetRef.current === 'text') {
      // [요구사항 1] 사각형 글자 드래그 이동 (mm 단위 변환)
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const pxPerMm = canvas.width / 60;
      const scaleFactor = canvas.width / rect.width;
      const deltaMmX = (dx * scaleFactor) / pxPerMm;
      const deltaMmY = (dy * scaleFactor) / pxPerMm;

      onUpdateSettings({
        rectText: {
          ...settings.rectText,
          offsetX: Math.round(((settings.rectText?.offsetX || 0) + deltaMmX) * 10) / 10,
          offsetY: Math.round(((settings.rectText?.offsetY || 0) + deltaMmY) * 10) / 10,
        },
      });
      renderCanvas();
    } else if (activeDragTargetRef.current === 'image') {
      // [요구사항 2] 이미지 이동 및 PPT 스타일 가로/세로 중앙 스냅 가이드
      let nextOffsetX = settings.imageOffsetX + dx * 2;
      let nextOffsetY = settings.imageOffsetY + dy * 2;

      // 가로 축 중앙 스냅 (세로 점선)
      if (Math.abs(nextOffsetX) <= 8) {
        nextOffsetX = 0;
        snapGuideXRef.current = true;
      } else {
        snapGuideXRef.current = false;
      }

      // 세로 축 중앙 스냅 (가로 점선)
      if (Math.abs(nextOffsetY) <= 8) {
        nextOffsetY = 0;
        snapGuideYRef.current = true;
      } else {
        snapGuideYRef.current = false;
      }

      onUpdateSettings({
        imageOffsetX: nextOffsetX,
        imageOffsetY: nextOffsetY,
      });
      renderCanvas();
    }
  };

  // 마우스 클릭 해제 시 즉시 가이드라인 제거
  const handleMouseUp = () => {
    isDraggingRef.current = false;
    activeDragTargetRef.current = null;
    snapGuideXRef.current = false;
    snapGuideYRef.current = false;
    renderCanvas();
  };

  // [핵심] 마우스 휠 줌: passive: false 리스너로 등록하여 브라우저 창 스크롤 방지 완벽 차단!
  useEffect(() => {
    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault(); // 페이지 스크롤 차단!
      e.stopPropagation();
      const delta = e.deltaY < 0 ? 5 : -5;
      const nextScale = Math.min(300, Math.max(10, settings.scale + delta));
      onUpdateSettings({ scale: nextScale });
    };

    const c1 = canvasRef.current;
    const c2 = fullscreenCanvasRef.current;

    if (c1) {
      c1.addEventListener('wheel', handleNativeWheel, { passive: false });
    }
    if (c2) {
      c2.addEventListener('wheel', handleNativeWheel, { passive: false });
    }

    return () => {
      if (c1) {
        c1.removeEventListener('wheel', handleNativeWheel);
      }
      if (c2) {
        c2.removeEventListener('wheel', handleNativeWheel);
      }
    };
  }, [settings.scale, onUpdateSettings, isFullscreen]);

  const handleCenterAlign = () => {
    onUpdateSettings({ imageOffsetX: 0, imageOffsetY: 0 });
  };

  // [핵심] 여백 0% 실측 1:1 크기 & 점선 없는 순수 도안 DataURL 생성 헬퍼
  const getCleanStampDataUrl = (): string => {
    const offscreen = document.createElement('canvas');
    drawToTargetCanvas(offscreen, true); // forExport = true (여백 0% 타이트 크롭, 실선만)
    return offscreen.toDataURL('image/png');
  };

  // PNG 다운로드 (점선 없이 순수 도안만 저장)
  const handleDownloadPng = () => {
    const url = getCleanStampDataUrl();
    const a = document.createElement('a');
    a.href = url;
    a.download = `${settings.name || '스탬프도안'}.png`;
    a.click();
  };

  // 세션 전송 또는 로컬 인쇄목록 추가 (점선 없이 순수 도안만 전송/인쇄)
  const handleConfirmSubmit = async () => {
    const dataUrl = getCleanStampDataUrl();

    const item: PrintItem = {
      id: `stamp_${Date.now()}`,
      name: settings.name || '스탬프 도안',
      imageDataUrl: dataUrl,
      shape: settings.shape,
      widthMm: settings.shape === 'rect' ? settings.sizeW : settings.sizeOne,
      heightMm: settings.shape === 'rect' ? settings.sizeH : settings.sizeOne,
      quantity: 1,
      createdAt: Date.now(),
      submittedBy: submitterName || '사용자',
    };

    if (sessionCodeInput.trim()) {
      // 관리자 세션 코드가 입력되었을 때: 바로 서버 세션으로 전송!
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
          alert(`세션 [${code}]에 도안이 성공적으로 전송되었습니다!`);
          setIsSubmitModalOpen(false);
          // 로컬에도 보관
          onAddToPrintList(item);
        } else {
          alert(data.error || '세션 전송에 실패했습니다. 코드를 확인해주세요.');
        }
      } catch {
        alert('세션 전송 중 네트워크 오류가 발생했습니다.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // 세션 코드가 없으면 내 컴퓨터 로컬 인쇄실에 추가
      onAddToPrintList(item);
      setIsSubmitModalOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col items-center">
        {/* 미리보기 상단 바 */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
          <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
            <span>도안 미리보기</span>
            <span className="text-xs text-gray-400 font-normal">
              ({settings.shape === 'circle' ? `Ø${settings.sizeOne}mm` : `${settings.sizeW}×${settings.sizeH}mm`})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {canUndo && (
              <button
                type="button"
                onClick={handleUndo}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                title="실행 취소 (Ctrl+Z)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>되돌리기</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCenterAlign}
              className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1 transition-colors"
              title="이미지를 정가운데로 정렬"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>가운데</span>
            </button>

            {/* [요구사항 3] 전체화면 버튼 */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center gap-1 transition-colors shadow-sm"
              title="크게 확대해서 보기 및 요소 지우기"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>전체화면</span>
            </button>
          </div>
        </div>

        {/* 캔버스 래퍼 */}
        <div
          ref={containerRef}
          className="w-full relative aspect-square max-w-[420px] rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center select-none"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        >
          <canvas
            ref={canvasRef}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
          />

          {!settings.imageDataUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none text-gray-400 bg-white/40 backdrop-blur-[1px]">
              <Sparkles className="w-8 h-8 mb-2 text-gray-300" />
              <p className="text-xs font-semibold text-gray-600">도안 이미지를 업로드하세요</p>
              <p className="text-[11px] text-gray-400 mt-1">
                더블 클릭으로 불필요한 점을 즉시 지울 수 있습니다
              </p>
            </div>
          )}
        </div>

        {/* 가이드 안내 라벨 */}
        <div className="w-full mt-2.5 flex items-center justify-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-red-600 font-semibold">
            <span className="inline-block w-3 h-0 border-t-2 border-dashed border-red-500" />
            빨간점선: 잉크안전여백({settings.shrinkPercent}%)
          </span>
          {settings.noBorder && (
            <span className="flex items-center gap-1 text-black font-semibold">
              <span className="inline-block w-3 h-0 border-t-2 border-dashed border-black" />
              검은점선: 재단선
            </span>
          )}
        </div>

        {/* 하단 액션 버튼 */}
        <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={handleDownloadPng}
            className="py-2.5 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>PNG 저장</span>
          </button>

          {/* [요구사항 5] 인쇄 목록에 넣기 (세션 코드 입력 연동) */}
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>인쇄 목록에 넣기</span>
          </button>
        </div>
      </div>

      {/* [요구사항 3] 전체화면 오버레이 모달 (밝은 흰색 배경 & 확실한 닫기 버튼) */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-white/98 backdrop-blur-md flex flex-col p-4 md:p-6 animate-in fade-in duration-200">
          {/* [핵심] 화면 우측 상단 고정 플로팅 닫기 버튼 - 언제 어디서나 확실하게 보이고 닫을 수 있음 */}
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="fixed top-4 right-4 z-[9999] px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-2xl flex items-center gap-2 border-2 border-white transition-all transform hover:scale-105 active:scale-95"
            title="전체화면 닫기 (ESC)"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span>전체화면 닫기 (ESC)</span>
          </button>

          {/* 상단 툴바 */}
          <div className="flex flex-wrap items-center justify-between pb-3 pr-44 border-b border-gray-200 text-gray-900 mb-3 gap-2">
            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-gray-900">도안 미리보기 (전체화면)</span>
              <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full font-medium">
                💡 불필요한 점이나 얼룩을 <b>더블 클릭</b>하여 즉시 지울 수 있습니다
              </span>
            </div>

            <div className="flex items-center gap-2">
              {canUndo && (
                <button
                  type="button"
                  onClick={handleUndo}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>되돌리기</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCenterAlign}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Crosshair className="w-4 h-4" />
                <span>가운데 정렬</span>
              </button>
            </div>
          </div>

          <div
            className="flex-1 w-full max-h-[86vh] rounded-2xl overflow-hidden border border-gray-300 bg-white shadow-inner flex items-center justify-center relative select-none"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%)',
              backgroundSize: '24px 24px',
              backgroundColor: '#ffffff',
            }}
          >
            <canvas
              ref={fullscreenCanvasRef}
              onDoubleClick={handleDoubleClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing p-4"
            />
          </div>
        </div>
      )}

      {/* [요구사항 5] 인쇄 목록에 넣기 & 세션 전송 모달 */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-gray-900">인쇄 목록에 도안 등록</h3>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-mono font-bold text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 uppercase"
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
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                {sessionCodeInput.trim() ? (
                  <>
                    <Send className="w-3.5 h-3.5 text-indigo-400" />
                    <span>세션으로 전송</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>내 인쇄실에 추가</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
