"use client";

import React from "react";
import { Sparkles, Heart, Stamp, ArrowUp, Mail } from "lucide-react";

/**
 * 하단 CTA 배너 및 푸터 (Footer)
 * - 강렬한 전환 유도 CTA 영역
 * - 교사 전용 문의 및 카피라이트 안내
 */
export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#07080c] border-t border-white/10 pt-20 pb-12 overflow-hidden">
      {/* 하단 CTA 박스 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden border border-white/15 bg-gradient-to-r from-pink-900/30 via-purple-900/30 to-indigo-900/30 backdrop-blur-2xl text-center space-y-6">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.15),transparent_70%)] pointer-events-none" />

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            선생님을 위한 100% 무료 도안 서비스
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            내일 수업 시간, <br />
            아이들에게 잊지 못할 칭찬을 선물하세요
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            회원가입 없이도 바로 시뮬레이터에서 나만의 칭찬 스탬프를 디자인하고 인쇄해 볼 수 있습니다.
          </p>

          <div className="pt-2">
            <a
              href="#simulator"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-white font-bold text-base shadow-xl shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Stamp className="w-5 h-5" />
              지금 무료로 도안 만들기 시작
            </a>
          </div>
        </div>
      </div>

      {/* 푸터 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          
          {/* 로고 및 서비스 소개 */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">PopStamp</span>
              <p className="text-xs text-slate-500">대한민국 선생님들의 든든한 학급경영 메이트</p>
            </div>
          </div>

          {/* 링크 및 상단 이동 버튼 */}
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">주요 기능</a>
            <a href="#simulator" className="hover:text-white transition-colors">도안 시뮬레이터</a>
            <a href="#showcase" className="hover:text-white transition-colors">선생님 후기</a>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all"
              title="맨 위로 이동"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* 저작권 및 안내 */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>© 2026 PopStamp. All rights reserved. Made with ❤️ for Teachers.</p>
          <p className="flex items-center gap-1 justify-center">
            <span>본 서비스의 모든 교육용 템플릿과 폰트는 학교 현장 이용 저작권을 준수합니다.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
