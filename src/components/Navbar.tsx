"use client";

import React, { useState } from "react";
import { Sparkles, Menu, X, ArrowRight, Stamp } from "lucide-react";

/**
 * 상단 내비게이션 바 컴포넌트
 * - 반투명 Glassmorphism 디자인 적용
 * - 모바일 반응형 햄버거 메뉴 포함
 */
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#090a0f]/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* 로고 영역 */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-[2px] shadow-lg shadow-pink-500/20">
              <div className="w-full h-full bg-[#090a0f] rounded-[14px] flex items-center justify-center">
                <Stamp className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                PopStamp
                <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30 font-semibold">
                  For Teachers
                </span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">선생님 전용 도안 연구소</span>
            </div>
          </div>

          {/* 데스크톱 메뉴 링크 */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-pink-400 transition-colors">
              주요 기능
            </a>
            <a href="#simulator" className="text-sm font-medium text-slate-300 hover:text-pink-400 transition-colors">
              도안 시뮬레이터
            </a>
            <a href="#showcase" className="text-sm font-medium text-slate-300 hover:text-pink-400 transition-colors">
              선생님 갤러리
            </a>
            <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-pink-400 transition-colors">
              FAQ
            </a>
          </div>

          {/* 우측 CTA 버튼 */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#simulator"
              className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-full group-hover:opacity-90 transition-opacity"></span>
              <span className="relative flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#090a0f] text-sm font-semibold text-white group-hover:bg-opacity-80 transition-all">
                <Sparkles className="w-4 h-4 text-pink-400" />
                지금 도안 만들기
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </div>

          {/* 모바일 햄버거 토글 */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e1017] border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:text-pink-400"
          >
            주요 기능
          </a>
          <a
            href="#simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:text-pink-400"
          >
            도안 시뮬레이터
          </a>
          <a
            href="#showcase"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:text-pink-400"
          >
            선생님 갤러리
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:text-pink-400"
          >
            FAQ
          </a>
          <div className="pt-2">
            <a
              href="#simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg shadow-pink-500/20"
            >
              <Sparkles className="w-4 h-4" />
              지금 무료로 만들기
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
