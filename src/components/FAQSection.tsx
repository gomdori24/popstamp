"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

/**
 * 자주 묻는 질문 (FAQSection)
 * - 아코디언 방식으로 클릭 시 부드럽게 펼쳐지는 인터랙션
 */
const faqs = [
  {
    q: "선생님은 정말 무료로 이용할 수 있나요?",
    a: "네, 공교육 현장에서 고생하시는 모든 초·중·고 및 유치원·특수학교 선생님들께 기본 도안 제작 및 A4 인쇄용 PDF 출력 기능을 전면 무료로 제공합니다."
  },
  {
    q: "시중에서 판매하는 라벨지(폼텍 등)와 규격이 맞나요?",
    a: "네! 가장 많이 사용하시는 원형 라벨지 규격(지름 25mm, 30mm, 35mm 등 폼텍 원형 라벨지 제품군)에 딱 맞춘 오차 0mm 칼선 템플릿을 자동으로 제공합니다. 그냥 학교 프린터에 넣고 인쇄만 하시면 됩니다."
  },
  {
    q: "컴퓨터나 포토샵을 잘 못 다루는데 어렵지 않을까요?",
    a: "전혀 걱정하지 마세요! 팝스탬프는 텍스트 입력창에 아이 이름이나 칭찬 문구를 입력하고 버튼만 누르면 모든 배치와 폰트 크기, 일러스트 정렬이 자동으로 완성됩니다."
  },
  {
    q: "상업적 폰트나 이미지 저작권 문제는 없나요?",
    a: "팝스탬프에서 제공하는 모든 캘리그라피, 폰트, 캐릭터 일러스트는 학교 및 교육 기관 내 온·오프라인 사용 라이선스가 완벽히 보장되어 있습니다. 저작권 걱정 없이 안심하고 사용하세요."
  },
  {
    q: "학생 30명 이름을 한 번에 넣어서 뽑을 수도 있나요?",
    a: "'일괄 도안 생성' 기능에서 나이스(NEIS)나 엑셀 명렬표의 이름 목록을 복사해 붙여넣으면, 1번부터 30번까지 각 학생의 이름이 들어간 라벨지 1장이 3초 만에 생성됩니다."
  }
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 relative bg-[#090a0f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 헤더 */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
            <HelpCircle className="w-3.5 h-3.5" />
            궁금한 점을 모았습니다
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            자주 묻는 질문 (FAQ)
          </h2>
          <p className="text-slate-400 text-base">
            선생님들께서 자주 문의하시는 내용을 친절히 안내해 드립니다.
          </p>
        </div>

        {/* 아코디언 목록 */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-white/5 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-bold text-white flex items-center gap-3">
                    <span className="text-pink-400 font-mono text-sm">Q{idx + 1}.</span>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 text-pink-400" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
