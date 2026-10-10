import { CircularTextConfig } from '@/types/stamp';

/**
 * 원형 스탬프 테두리 내부에 위쪽 및 아래쪽 호를 따라 텍스트를 정밀 렌더링합니다.
 * @param ctx 대상 캔버스 2D 컨텍스트
 * @param centerX 중심 X좌표
 * @param centerY 중심 Y좌표
 * @param radius 도장 외경 반지름 (px)
 * @param config 원형 글자 설정
 * @param pxPerMm mm당 픽셀 환산 비율
 */
export function drawCircularText(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  config: CircularTextConfig,
  pxPerMm: number
) {
  const { ringTop, ringBottom, ringFont, ringBold, ringSize, ringGap, ringSpacing, ringDot } = config;

  if (!ringTop && !ringBottom) return;

  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const fontSizePx = Math.max(8, ringSize * pxPerMm);
  ctx.font = `${ringBold ? 'bold ' : '500 '}${fontSizePx}px ${ringFont || 'sans-serif'}`;

  // 글자가 배치될 궤도 반지름: (외경 - 여백 - 글자크기/2)
  const gapPx = ringGap * pxPerMm;
  const textRadius = Math.max(10, radius - gapPx - fontSizePx / 2);

  // 구분 기호 심볼
  const marker = ringDot === 'star' ? ' ★ ' : ringDot === 'dot' ? ' ● ' : '';

  // 1. 위쪽 텍스트 (상단 호, -90도 중심)
  if (ringTop) {
    const topText = marker ? `${ringTop}${marker}` : ringTop;
    renderArcTextTop(ctx, topText, centerX, centerY, textRadius, fontSizePx, ringSpacing);
  }

  // 2. 아래쪽 텍스트 (하단 호, +90도 중심, 안쪽에서 똑바로 읽히도록 바깥쪽 회전)
  if (ringBottom) {
    const bottomText = marker ? `${marker}${ringBottom}` : ringBottom;
    renderArcTextBottom(ctx, bottomText, centerX, centerY, textRadius, fontSizePx, ringSpacing);
  }

  ctx.restore();
}

/**
 * 위쪽 호(12시 방향 중심)를 따라 텍스트를 그립니다.
 */
function renderArcTextTop(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  radius: number,
  fontSizePx: number,
  spacing: number
) {
  const chars = Array.from(text);
  if (chars.length === 0) return;

  // 각 글자의 너비와 각도 계산
  const charWidths = chars.map((ch) => ctx.measureText(ch).width + spacing * fontSizePx);
  const totalWidth = charWidths.reduce((a, b) => a + b, 0);

  // 총 호 각도 (라디안)
  const totalAngle = totalWidth / radius;
  let currentAngle = -Math.PI / 2 - totalAngle / 2;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const w = charWidths[i];
    const charAngle = w / radius;
    const midAngle = currentAngle + charAngle / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(midAngle + Math.PI / 2);
    ctx.translate(0, -radius);
    ctx.fillText(ch, 0, 0);
    ctx.restore();

    currentAngle += charAngle;
  }
}

/**
 * 아래쪽 호(6시 방향 중심)를 따라 텍스트를 그립니다.
 */
function renderArcTextBottom(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  radius: number,
  fontSizePx: number,
  spacing: number
) {
  const chars = Array.from(text);
  if (chars.length === 0) return;

  const charWidths = chars.map((ch) => ctx.measureText(ch).width + spacing * fontSizePx);
  const totalWidth = charWidths.reduce((a, b) => a + b, 0);

  const totalAngle = totalWidth / radius;
  // 좌에서 우로 읽히도록 각도 전개
  let currentAngle = Math.PI / 2 + totalAngle / 2;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const w = charWidths[i];
    const charAngle = w / radius;
    const midAngle = currentAngle - charAngle / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(midAngle - Math.PI / 2);
    ctx.translate(0, radius);
    ctx.fillText(ch, 0, 0);
    ctx.restore();

    currentAngle -= charAngle;
  }
}
