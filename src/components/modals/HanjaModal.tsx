'use client';

import React, { useState } from 'react';
import { getHanjaCandidates, HanjaEntry } from '@/lib/hanja-dict';
import { X, Check } from 'lucide-react';

interface HanjaModalProps {
  isOpen: boolean;
  name: string;
  initialHanjaList: string[];
  onApply: (selectedHanja: string[]) => void;
  onClose: () => void;
}

export default function HanjaModal({
  isOpen,
  name,
  initialHanjaList,
  onApply,
  onClose,
}: HanjaModalProps) {
  const chars = Array.from(name);
  const [selectedCharIndex, setSelectedCharIndex] = useState(0);
  const [hanjaState, setHanjaState] = useState<string[]>(() => {
    return chars.map((c, idx) => initialHanjaList[idx] || c);
  });

  if (!isOpen || chars.length === 0) return null;

  const currentChar = chars[selectedCharIndex] || '';
  const candidates: HanjaEntry[] = getHanjaCandidates(currentChar);

  const handleSelectHanja = (h: string) => {
    const updated = [...hanjaState];
    updated[selectedCharIndex] = h;
    setHanjaState(updated);

    // 다음 글자로 자동 이동 (마지막 글자가 아니면)
    if (selectedCharIndex < chars.length - 1) {
      setSelectedCharIndex(selectedCharIndex + 1);
    }
  };

  const handleConfirm = () => {
    onApply(hanjaState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">한자(漢字) 변환</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              도장에 새길 한자를 글자별로 선택하세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 글자 선택 탭 */}
        <div className="flex gap-2 my-4">
          {chars.map((char, idx) => {
            const isSelected = selectedCharIndex === idx;
            const currentHanja = hanjaState[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedCharIndex(idx)}
                className={`flex-1 py-2.5 px-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-red-600 bg-red-50/70 text-red-700 font-bold shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-xs text-gray-400">{char}</div>
                <div className="text-xl font-serif font-bold text-gray-900">
                  {currentHanja || char}
                </div>
              </button>
            );
          })}
        </div>

        {/* 한자 후보 목록 */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-[180px] border rounded-xl p-2 bg-gray-50">
          {candidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 text-gray-400 text-xs">
              <span>사전에 등록되지 않은 글자입니다.</span>
              <span className="mt-1">한글 그대로({currentChar}) 사용됩니다.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {candidates.map((entry, idx) => {
                const isCurrent = hanjaState[selectedCharIndex] === entry.hanja;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectHanja(entry.hanja)}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                      isCurrent
                        ? 'border-red-600 bg-red-600 text-white font-bold'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    <span className="text-2xl font-serif">{entry.hanja}</span>
                    <div className="truncate">
                      <div className="text-xs truncate">{entry.meaning}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-2 pt-4 mt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-1"
          >
            <Check className="w-4 h-4" />
            <span>도장에 적용</span>
          </button>
        </div>
      </div>
    </div>
  );
}
