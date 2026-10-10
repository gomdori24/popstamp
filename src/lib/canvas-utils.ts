/**
 * 캔버스 이미지 처리 및 블롭 지우개 유틸리티
 */

export interface FloodFillResult {
  modified: boolean;
  erasedPixels: number;
}

/**
 * 이미지 데이터에서 특정 좌표 (startX, startY)에 위치한 연결된 검은색 픽셀 컴포넌트(블롭)를 지웁니다.
 * BFS 알고리즘을 사용하여 클릭 지점과 연결된 모든 흑색 픽셀을 투명하게(Alpha=0) 변환합니다.
 */
export function eraseConnectedComponent(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  width: number,
  height: number,
  colorThreshold = 128
): FloodFillResult {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  startX = Math.floor(startX);
  startY = Math.floor(startY);

  if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
    return { modified: false, erasedPixels: 0 };
  }

  const startIndex = (startY * width + startX) * 4;
  const startA = data[startIndex + 3];
  const startR = data[startIndex];
  const startG = data[startIndex + 1];
  const startB = data[startIndex + 2];

  // 투명하거나(배경) 밝은 색인 경우 지울 요소가 아님
  const isBlack = (r: number, g: number, b: number, a: number) => {
    if (a < 50) return false;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < colorThreshold;
  };

  if (!isBlack(startR, startG, startB, startA)) {
    return { modified: false, erasedPixels: 0 };
  }

  // BFS Queue
  const queue: [number, number][] = [[startX, startY]];
  const visited = new Uint8Array(width * height);
  visited[startY * width + startX] = 1;

  let erasedCount = 0;

  // 4방향 이동
  const dx = [1, -1, 0, 0];
  const dy = [0, 0, 1, -1];

  while (queue.length > 0) {
    const [cx, cy] = queue.pop()!;
    const idx = (cy * width + cx) * 4;

    // 해당 픽셀 투명화
    data[idx + 3] = 0;
    erasedCount++;

    for (let i = 0; i < 4; i++) {
      const nx = cx + dx[i];
      const ny = cy + dy[i];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIndex = ny * width + nx;
        if (!visited[nIndex]) {
          visited[nIndex] = 1;
          const pixelIdx = nIndex * 4;
          if (
            isBlack(
              data[pixelIdx],
              data[pixelIdx + 1],
              data[pixelIdx + 2],
              data[pixelIdx + 3]
            )
          ) {
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  if (erasedCount > 0) {
    ctx.putImageData(imgData, 0, 0);
    return { modified: true, erasedPixels: erasedCount };
  }

  return { modified: false, erasedPixels: 0 };
}

/**
 * 캔버스에 흑백 임계값 및 두께 조정을 적용한 이진화 이미지를 그립니다.
 */
export function applyThresholdAndThickness(
  sourceCanvas: HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement,
  threshold: number,
  thick: number,
  invert: boolean,
  speckSize: number
) {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  targetCanvas.width = width;
  targetCanvas.height = height;

  const sCtx = sourceCanvas.getContext('2d');
  const tCtx = targetCanvas.getContext('2d');
  if (!sCtx || !tCtx) return;

  const srcData = sCtx.getImageData(0, 0, width, height);
  const src = srcData.data;

  // 1. 임계값 적용 1비트 마스크 버퍼
  const binary = new Uint8Array(width * height);

  for (let i = 0; i < width * height; i++) {
    const p = i * 4;
    const a = src[p + 3];
    if (a < 30) {
      binary[i] = 0;
      continue;
    }
    const brightness = (src[p] * 299 + src[p + 1] * 587 + src[p + 2] * 114) / 1000;
    let isInk = brightness < threshold;
    if (invert) isInk = !isInk;
    binary[i] = isInk ? 1 : 0;
  }

  // 2. 작은 점 지우기 (speckle filter - 단순 연결 크기 미만 제거)
  if (speckSize > 0) {
    removeSmallSpecks(binary, width, height, speckSize);
  }

  // 3. 선 굵기 확장 (Dilation)
  let finalBinary: Uint8Array<ArrayBufferLike> = binary;
  if (thick > 0) {
    finalBinary = dilateBinary(binary, width, height, thick);
  }

  // 4. 타겟 캔버스에 결과 출력 (검은색 또는 투명)
  const outData = tCtx.createImageData(width, height);
  const out = outData.data;

  for (let i = 0; i < width * height; i++) {
    const p = i * 4;
    if (finalBinary[i] === 1) {
      out[p] = 0;       // R
      out[p + 1] = 0;   // G
      out[p + 2] = 0;   // B
      out[p + 3] = 255; // A
    } else {
      out[p + 3] = 0;   // 완전 투명
    }
  }

  tCtx.putImageData(outData, 0, 0);
}

/**
 * 지정된 픽셀 수 미만의 고립된 점들을 필터링합니다.
 */
function removeSmallSpecks(
  binary: Uint8Array,
  width: number,
  height: number,
  maxSpeckPixels: number
) {
  const visited = new Uint8Array(width * height);
  const dx = [1, -1, 0, 0];
  const dy = [0, 0, 1, -1];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (binary[idx] === 1 && !visited[idx]) {
        // Connected Component 탐색
        const queue: [number, number][] = [[x, y]];
        const component: number[] = [idx];
        visited[idx] = 1;

        while (queue.length > 0) {
          const [cx, cy] = queue.pop()!;
          for (let d = 0; d < 4; d++) {
            const nx = cx + dx[d];
            const ny = cy + dy[d];
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nIdx = ny * width + nx;
              if (binary[nIdx] === 1 && !visited[nIdx]) {
                visited[nIdx] = 1;
                queue.push([nx, ny]);
                component.push(nIdx);
              }
            }
          }
        }

        if (component.length <= maxSpeckPixels) {
          for (let i = 0; i < component.length; i++) {
            binary[component[i]] = 0;
          }
        }
      }
    }
  }
}

/**
 * 모폴로지 팽창 (Dilation)을 통해 선을 굵게 만듭니다.
 */
function dilateBinary(
  binary: Uint8Array,
  width: number,
  height: number,
  radius: number
): Uint8Array {
  const result = new Uint8Array(width * height);
  result.set(binary);
  const r2 = radius * radius;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (binary[y * width + x] === 1) {
        for (let dy = -radius; dy <= radius; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= height) continue;
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            if (nx < 0 || nx >= width) continue;
            if (dx * dx + dy * dy <= r2) {
              result[ny * width + nx] = 1;
            }
          }
        }
      }
    }
  }

  return result;
}

/**
 * [신규] 이진화된 캔버스에서 실제 잉크(검은색 픽셀)가 존재하는 Bounding Box를 계산하여
 * 불필요한 투명/흰색 여백을 제거하고, 실제 도안 내용의 중심이 정가운데에 오도록
 * 완벽한 정사각형(Square) 캔버스로 크롭하여 반환합니다.
 */
export function cropToContentSquare(
  canvas: HTMLCanvasElement,
  paddingRatio = 0.02
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const alpha = data[idx + 3];
      // 투명하지 않은 픽셀(실제 도안 잉크) 탐색
      if (alpha > 30) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // 검은색 도안 요소가 전혀 없는 빈 캔버스인 경우 원본 반환
  if (maxX < minX || maxY < minY) {
    return canvas;
  }

  const contentW = maxX - minX + 1;
  const contentH = maxY - minY + 1;
  const contentCenterX = minX + contentW / 2;
  const contentCenterY = minY + contentH / 2;

  // 가로/세로 중 큰 축을 기준으로 정사각형 생성 (여백 2% 포함)
  const maxDim = Math.max(contentW, contentH);
  const padding = Math.max(2, Math.round(maxDim * paddingRatio));
  const squareSize = maxDim + padding * 2;

  const cropped = document.createElement('canvas');
  cropped.width = squareSize;
  cropped.height = squareSize;
  const cCtx = cropped.getContext('2d');
  if (!cCtx) return canvas;

  // 실제 도안의 정중앙(contentCenterX, contentCenterY)이 새 정사각형 캔버스의 중심(squareSize/2, squareSize/2)에 일치하도록 복사
  const destX = squareSize / 2 - contentCenterX;
  const destY = squareSize / 2 - contentCenterY;

  cCtx.drawImage(canvas, destX, destY);
  return cropped;
}
