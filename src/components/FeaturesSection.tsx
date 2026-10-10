"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Palette, 
  Printer, 
  Users, 
  ShieldCheck, 
  FileCheck2,
  Sparkles,
  Layers
} from "lucide-react";

/**
 * 주요 기능 소개 섹션 (Features Section)
 * - 교사들이 실제로 겪는 고충(포토샵의 어려움, 인쇄 규격 안 맞음 등)을 해결하는 기능 카드들
 * - 호버 시 네온 글로우 및 스크롤 등장 애니메이션 적용
 */
const features = [
  {
    icon: Zap,
    color: "from-pink-500 to-rose-500",
    glow: "group-hover:border-pink-500/50",
    badge: "초고속 제작",
    title: "이름과 문구만 넣으면 30초 완성",
    description: "디자인 툴을 다룰 줄 몰라도 괜찮습니다. 문구와 원하는 스타일만 고르면 AI와 템플릿이 자동으로 균형 잡힌 도안을 맞춰줍니다."
  },
  {
    icon: Palette,
    color: "from-purple-500 to-indigo-500",
    glow: "group-hover:border-purple-500/50",
    badge: "150+ 디자인",
    title: "학급 감성 저격 맞춤형 템플릿",
    description: "레트로 고무인, 귀여운 동물 캐릭터, 심플한 교과 칭찬 도장까지 학년별·과목별 다양한 테마를 무제한으로 선택할 수 있습니다."
  },
  {
    icon: Printer,
    color: "from-cyan-400 to-blue-500",
    glow: "group-hover:border-cyan-400/50",
    badge: "오차 없는 인쇄",
    title: "A4 라벨지·칼선 완벽 호환 PDF",
    description: "원형 라벨지(폼텍 등) 규격에 딱 맞는 정밀 칼선 가이드가 포함되어 있어, 학교 프린터로 인쇄해도 밀림 현상이 전혀 없습니다."
  },
  {
    icon: Users,
    color: "from-emerald-400 to-teal-500",
    glow: "group-hover:border-emerald-400/50",
    badge: "일괄 생성",
    title: "우리 반 학생 30명 번호별 일괄 생성",
    description: "학생 명렬표(엑셀)를 붙여넣으면 1번부터 30번까지 아이들 이름이 쏙 들어간 맞춤 도안 시트를 한 번에 생성해 드립니다."
  },
  {
    icon: Layers,
    color: "from-amber-400 to-orange-500",
    glow: "group-hover:border-amber-400/50",
    badge: "무제한 커스텀",
    title: "칭찬 스티커판 & 칭찬 통장 연동",
    description: "도장뿐만 아니라 교실 벽면에 부착하는 칭찬 스티커판, 독서 통장 양식까지 동일한 캐릭터 테마로 원클릭 패키징 출력이 가능합니다."
  },
  {
    icon: ShieldCheck,
    color: "from-violet-400 to-fuchsia-500",
    glow: "group-hover:border-violet-400/50",
    badge: "저작권 안심",
    title: "학교 및 교육용 상업적 무료 라이선스",
    description: "교실 수업, 학교 축제, 방과후 활동 등 어디서나 안심하고 사용하실 수 있도록 모든 폰트와 일러스트의 저작권을 보장합니다."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#0c0e14]">
      {/* 배경 장식 원 */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 섹션 헤더 */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-semibold text-pink-400"
          >
            <Sparkles className="w-3.5 h-3.5" />
            선생님의 시간과 에너지를 아끼는 솔루션
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight"
          >
            왜 수많은 선생님들이 <br className="hidden sm:block" />
            <span className="text-gradient-neon">팝스탬프</span>를 선택할까요?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg"
          >
            퇴근 후 포토샵과 씨름하던 시간은 이제 그만! 교직 생활에 꼭 필요한 핵심 편의 기능을 꽉 채웠습니다.
          </motion.p>
        </div>

        {/* 기능 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className={`group relative p-8 rounded-3xl glass-card transition-all duration-300 border border-white/5 ${feature.glow}`}
              >
                {/* 상단 아이콘 및 뱃지 */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feature.color} p-[1px] shadow-lg`}>
                    <div className="w-full h-full bg-[#131622] rounded-[15px] flex items-center justify-center group-hover:bg-transparent transition-colors">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/[0.04] text-slate-300 border border-white/10 font-mono">
                    {feature.badge}
                  </span>
                </div>

                {/* 타이틀 및 상세 설명 */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-normal">
                  {feature.description}
                </p>

                {/* 하단 인터랙티브 보더 하이라이트 */}
                <div className="absolute inset-x-8 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 group-hover:via-pink-500/50 to-transparent transition-all" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
