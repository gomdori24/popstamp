export type StampShape = 'circle' | 'square' | 'rect' | 'none';

export type DotMarker = 'star' | 'dot' | 'none';

export interface CircularTextConfig {
  ringTop: string;
  ringBottom: string;
  ringFont: string;
  ringBold: boolean;
  ringSize: number;       // mm
  ringGap: number;        // 테두리와의 간격 mm
  ringSpacing: number;    // 자간 (-0.3 ~ 2.0)
  ringDot: DotMarker;     // 양옆 구분 기호
}

export interface RectTextConfig {
  text: string;
  font: string;
  bold: boolean;
  sizeMm: number;       // 글자 크기 (mm)
  offsetX: number;      // 드래그 이동 x 오프셋 (mm)
  offsetY: number;      // 드래그 이동 y 오프셋 (mm)
  spacing: number;      // 자간 (mm)
}

export interface StampSettings {
  // 1. 모양 및 크기
  shape: StampShape;
  sizeOne: number;        // 지름 또는 정사각형 한변 (mm)
  sizeW: number;          // 직사각형 가로 (mm)
  sizeH: number;          // 직사각형 세로 (mm)
  ratioX: number;
  ratioY: number;
  shrinkPercent: number;  // 잉크 안전 여백: 기본 90%
  noBorder: boolean;      // '테두리 없애기' (기존: 테두리 선 없이 모양대로만 자르기)
  borderWidth: number;    // 테두리 두께 (mm 또는 px 환산)

  // 2. 이미지 및 흑백 설정
  imageDataUrl: string | null;
  imageOffsetX: number;
  imageOffsetY: number;
  scale: number;          // 이미지 배율 (%)
  threshold: number;      // 흑백 대비 임계값 (0-255)
  thick: number;          // 선 굵기 (0-15)
  invert: boolean;        // 흑백 반전

  // 3. 더 다듬기
  speckSize: number;      // 작은 점 지우기 (넓이)
  smooth: number;         // 번짐 완화
  denoise: boolean;       // 잡티 제거

  // 4. 원형 글자
  circularText: CircularTextConfig;

  // 5. 사각형 글자 (정사각형, 직사각형 전용 텍스트 및 드래그 이동)
  rectText: RectTextConfig;

  // 메타정보
  name: string;           // 도안 이름
}

export type NameStampType = 'name3' | 'yakin';

export interface NameStampSettings {
  type: NameStampType;
  name: string;           // 한글 이름
  hanjaList: string[];    // 글자별 매핑된 한자 (한자 변환 시에만 채워짐)
  useHanja: boolean;      // 한자 사용 여부 (한자 변환 적용 시 true)
  fontStyle: 'go' | 'jeon' | 'myeongjo' | 'gothic';
  includeInMarker: boolean; // 3글자 시 '印' 첨가 (우측 하단 고정)
  offsetX: number;
  offsetY: number;
  scale: number;
  letterSpacing: number;    // 글자 사이 간격 (-20 ~ 30px)
  fontScale: number;        // 글꼴 크기 배율 (70% ~ 140%)
  fontBold: boolean;        // 굵게 여부
  noBorder: boolean;        // 테두리 없애기
  shrinkPercent: number;    // 잉크 안전 여백 (기본 90%)
  sizeMm: number;           // 도장 지름/크기 (mm)
}

export interface PrintItem {
  id: string;
  name: string;
  imageDataUrl: string;
  shape: StampShape | 'oval';
  widthMm: number;
  heightMm: number;
  quantity: number;
  createdAt: number;
  submittedBy?: string;   // 제출자 이름 또는 기기 ID
}

export interface PrintSession {
  id: string;             // 세션 코드 (예: STAMP-2401)
  title: string;
  createdAt: number;
  items: PrintItem[];
}
