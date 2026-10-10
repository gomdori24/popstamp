import { StampSettings, NameStampSettings, PrintItem } from '@/types/stamp';

export const DEFAULT_STAMP_SETTINGS: StampSettings = {
  shape: 'circle',
  sizeOne: 30, // 30mm
  sizeW: 40,
  sizeH: 20,
  ratioX: 3,
  ratioY: 1,
  shrinkPercent: 90, // 사용자 요구사항: 기본값 90% 축소
  noBorder: false,   // '테두리 없애기'
  borderWidth: 12,
  imageDataUrl: null,
  imageOffsetX: 0,
  imageOffsetY: 0,
  scale: 90,
  threshold: 128,
  thick: 0,
  invert: false,
  speckSize: 0,
  smooth: 0,
  denoise: false,
  circularText: {
    ringTop: '',
    ringBottom: '',
    ringFont: 'Pretendard, sans-serif',
    ringBold: true,
    ringSize: 3.5,
    ringGap: 1.5,
    ringSpacing: 0.05,
    ringDot: 'star',
  },
  rectText: {
    text: '',
    font: 'Pretendard, sans-serif',
    bold: true,
    sizeMm: 4,
    offsetX: 0,
    offsetY: 0,
    spacing: 0.1,
  },
  name: '나의스탬프',
};

export const DEFAULT_NAME_STAMP_SETTINGS: NameStampSettings = {
  type: 'name3',
  name: '홍길동',
  hanjaList: [],
  useHanja: false, // 일단 한글로 입력 및 렌더링
  fontStyle: 'go',
  includeInMarker: true,
  offsetX: 0,
  offsetY: 0,
  scale: 100,
  letterSpacing: 0,
  fontScale: 100,
  fontBold: true,
  noBorder: false,
  shrinkPercent: 90,
  sizeMm: 18,
};

const STORAGE_KEYS = {
  STAMP: 'popstamp_stamp_settings',
  NAME_STAMP: 'popstamp_namestamp_settings',
  PRINT_ITEMS: 'popstamp_print_items',
  VIEW_MODE: 'popstamp_view_mode', // 'desktop' | 'mobile'
  ACTIVE_TAB: 'popstamp_active_tab', // 'stamp' | 'namestamp' | 'print'
  WELCOME_SHOWN: 'popstamp_welcome_dismissed',
};

export function loadStampSettings(): StampSettings {
  if (typeof window === 'undefined') return DEFAULT_STAMP_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STAMP);
    if (!raw) return DEFAULT_STAMP_SETTINGS;
    return { ...DEFAULT_STAMP_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STAMP_SETTINGS;
  }
}

export function saveStampSettings(settings: StampSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.STAMP, JSON.stringify(settings));
  } catch (e) {
    console.warn('로컬 저장 용량 초과 또는 저장 실패:', e);
  }
}

export function loadNameStampSettings(): NameStampSettings {
  if (typeof window === 'undefined') return DEFAULT_NAME_STAMP_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NAME_STAMP);
    if (!raw) return DEFAULT_NAME_STAMP_SETTINGS;
    return { ...DEFAULT_NAME_STAMP_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NAME_STAMP_SETTINGS;
  }
}

export function saveNameStampSettings(settings: NameStampSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.NAME_STAMP, JSON.stringify(settings));
  } catch (e) {
    console.warn('저장 실패:', e);
  }
}

export function loadPrintItems(): PrintItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRINT_ITEMS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePrintItems(items: PrintItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PRINT_ITEMS, JSON.stringify(items));
  } catch (e) {
    console.warn('저장 실패:', e);
  }
}

export function loadViewMode(): 'desktop' | 'mobile' {
  if (typeof window === 'undefined') return 'desktop';
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    if (saved === 'desktop' || saved === 'mobile') return saved;
    // 디바이스 너비 감지
    return window.innerWidth < 768 ? 'mobile' : 'desktop';
  } catch {
    return 'desktop';
  }
}

export function saveViewMode(mode: 'desktop' | 'mobile') {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
}
