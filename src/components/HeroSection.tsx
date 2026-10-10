"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Award, CheckCircle2, ChevronRight, Download } from "lucide-react";

/**
 * 히어로 섹션 (Hero Section)
 * - 시선을 끄는 네온 그라데이션 타이틀
 * - 부드러운 framer-motion 등장 애니메이션
 * - 3D 팝스탬프 인터랙티브 미리보기 카드
 */
export default function HeroSection() {
  return (
    <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* 배경 장식 광선 효과 (Mesh Glow) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-pink-600/20 via-purple-600/20 to-cyan-500/10 blur-[130px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-pink-500/10 blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-purple-600/15 blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* 좌측: 헤드카피 및 CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            {/* 상단 뱃지 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-ping" />
              <span className="text-xs font-semibold text-pink-300">
                전국 12,400+ 명의 선생님들이 함께 만드는 학급 문화
              </span>
            </div>

            {/* 메인 타이틀 */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15]">
              우리 반 아이들의 눈이 <br />
              반짝이는 순간, <br />
              <span className="text-gradient-neon">
                30초 팝스탬프 만들기
              </span>
            </h1>

            {/* 서브 설명 */}
            <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              복잡한 포토샵 없이 클릭 몇 번으로 끝! 아이들의 이름과 귀여운 캐릭터, 
              칭찬 한마디를 담은 고해상도 인쇄용 도안을 즉시 제작하세요.
            </p>

            {/* 특장점 체크 리스트 */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>칼선 포함 PDF 자동 생성</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>A4 라벨지·펠트지 규격 지원</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>교사용 무료 도안 제공</span>
              </div>
            </div>

            {/* 행동 유도 버튼들 */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#simulator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-5 h-5 text-yellow-300" />
                지금 나만의 도안 만들기
                <ChevronRight className="w-5 h-5" />
              </a>

              <a
                href="#showcase"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/[0.05] border border-white/10 text-slate-200 font-semibold text-base hover:bg-white/[0.1] hover:text-white transition-all"
              >
                도안 갤러리 둘러보기
              </a>
            </div>
          </motion.div>

          {/* 우측: 팝스탬프 시각적 쇼케이스 (다이내믹 카드) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 relative flex justify-center"
          >
            {/* 카드 배경 백라이트 */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-3xl blur-2xl transform rotate-3 scale-95" />

            <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl glass-card border border-white/10 shadow-2xl space-y-6">
              
              {/* 카드 상단 배지 */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-slate-400 font-mono">LIVE PREVIEW</span>
              </div>

              {/* 스탬프 도안 그래픽 영역 */}
              <div className="relative py-8 flex flex-col items-center justify-center bg-[#131622]/90 rounded-2xl border border-white/5 overflow-hidden group">
                
                {/* 배경 패턴 격자 */}
                <div className="absolute inset-0 bg-[radial-gradient(#333a52_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                {/* 움직이는 스탬프 원형 인영 */}
                <motion.div
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="relative z-10 w-44 h-44 rounded-full border-4 border-dashed border-pink-500/80 p-2 flex items-center justify-center shadow-lg shadow-pink-500/20 bg-pink-500/[0.03]"
                >
                  <div className="w-full h-full rounded-full border-2 border-pink-400 flex flex-col items-center justify-center p-3 text-center space-y-1">
                    <Heart className="w-6 h-6 text-pink-400 fill-pink-400 animate-pulse" />
                    <span className="text-xs font-bold text-pink-300 tracking-wider">햇살초등학교 3반</span>
                    <span className="text-lg font-black text-white drop-shadow-md">
                      최고의 집중력!
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-pink-400 font-medium">
                      <Award className="w-3.5 h-3.5" />
                      <span>담임선생님 인증</span>
                    </div>
                  </div>
                </motion.div>

                {/* 쾅! 찍힌 잉크 스탬프 효과 뱃지 */}
                <div className="absolute bottom-3 right-4 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-[11px] font-bold text-pink-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  방금 생성된 도안
                </div>
              </div>

              {/* 하단 인쇄 스펙 정보 */}
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="block text-[11px] text-slate-500">규격 사이즈</span>
                  <span className="font-semibold text-slate-200">지름 30mm / 원형</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="block text-[11px] text-slate-500">인쇄 해상도</span>
                  <span className="font-semibold text-slate-200">300 DPI 초고화질</span>
                </div>
              </div>

              {/* 즉시 다운로드 버튼 형태의 장식 */}
              <div className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 flex items-center justify-center gap-2 text-xs font-semibold text-pink-300">
                <Download className="w-4 h-4" />
                A4 칼선 라벨지 24칸 도안으로 바로 출력 가능
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
