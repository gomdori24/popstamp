'use client';

import React from 'react';
import { StampSettings, PrintItem } from '@/types/stamp';
import ShapeControls from './ShapeControls';
import ImageTuneControls from './ImageTuneControls';
import CircularTextControls from './CircularTextControls';
import CanvasPreview from './CanvasPreview';

interface DesktopLayoutProps {
  settings: StampSettings;
  onUpdateSettings: (updated: Partial<StampSettings>) => void;
  onAddToPrintList: (item: PrintItem) => void;
  onClearImage: () => void;
}

export default function DesktopLayout({
  settings,
  onUpdateSettings,
  onAddToPrintList,
  onClearImage,
}: DesktopLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* 좌측: 컨트롤 패널 (7열) */}
      <div className="lg:col-span-7 space-y-6">
        <ShapeControls settings={settings} onChange={onUpdateSettings} />

        <ImageTuneControls
          settings={settings}
          onChange={onUpdateSettings}
          onClearImage={onClearImage}
        />

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
      </div>

      {/* 우측: 스티키 캔버스 미리보기 패널 (5열) */}
      <div className="lg:col-span-5 sticky top-20">
        <CanvasPreview
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onAddToPrintList={onAddToPrintList}
        />
      </div>
    </div>
  );
}
