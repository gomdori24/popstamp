"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, Heart, Award, Sparkles } from "lucide-react";

/**
 * 교사 활용 후기 및 도안 갤러리 섹션 (ShowcaseSection)
 * - 실제 초등, 중등 교사들의 생생한 활용 후기
 * - 수업 흥미도 및 학급 참여도 증가 지표 제시
 */
const reviews = [
  {
    name: "이지은 선생님",
    role: "초등학교 2학년 담임",
    school: "서울 신림초",
    text: "학기 초에 아이들 얼굴 캐릭터와 이름이 들어간 칭찬 도장을 만들어 찍어줬더니, 숙제 검사받으려고 줄을 서는 진풍경이 벌어졌어요! 폼텍 라벨지에 오차 없이 쏙 들어가서 감동했습니다.",
    tag: "칭찬 스티커판 연동",
    stars: 5,
  },
  {
    name: "박성호 선생님",
    role: "중학교 체육 교사",
    school: "경기 성남중",
    text: "수업 태도 점수용 도장을 찾다가 팝스탬프로 불꽃 아이콘 스탬프를 만들었습니다. 중학생들도 귀엽다고 난리네요. 번호별 엑셀 명렬표로 30명 도안을 1분 만에 뽑을 수 있는 게 최고입니다.",
    tag: "명렬표 일괄 생성",
    stars: 5,
  },
  {
    name: "정수연 선생님",
    role: "초등학교 전담 (영어)",
    school: "부산 해운대초",
    text: "영어 시간 전용 'Great Job!', 'Keep Going!' 도안을 제작했어요. 시중에서 파는 판에 박힌 도장보다 선생님이 직접 커스텀한 느낌이라 아이들과의 라포 형성에 큰 도움이 됩니다.",
    tag: "영어 교과 특화",
    stars: 5,
  },
];

const sampleStamps = [
  { title: "숙제 완성! 💯", color: "from-pink-500 to-rose-600", border: "border-pink-500", text: "꼼꼼한 정리왕" },
  { title: "오늘의 배려왕 🤝", color: "from-purple-500 to-indigo-600", border: "border-purple-500", text: "친구를 돕는 따뜻한 마음" },
  { title: "질문 천재 💡", color: "from-cyan-400 to-blue-600", border: "border-cyan-400", text: "반짝이는 호기심" },
  { title: "급식 잔반 ZERO 🍚", color: "from-emerald-400 to-teal-600", border: "border-emerald-400", text: "골고루 냠냠" },
];

export default function ShowcaseSection() {
  return (
    <section id="showcase" className="py-24 relative overflow-hidden bg-[#0c0e14]">
      {/* 배경 조명 */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[300px] bg-purple-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 섹션 헤더 */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400">
            <Heart className="w-3.5 h-3.5" />
            선생님들의 생생한 교실 이야기
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            선생님의 작은 칭찬 하나가 <br />
            <span className="text-gradient-neon">아이들의 하루를 바꿉니다</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            선생님의 따뜻한 진심이 담긴 팝스탬프로 더욱 활기차고 긍정적인 학급 분위기를 만들어보세요.
          </p>
        </div>

        {/* 인기 도안 갤러리 카드 미리보기 */}
        <div className="mb-20">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            선생님들이 가장 많이 뽑는 인기 테마 TOP 4
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleStamps.map((stamp, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center group cursor-pointer transition-all"
              >
                <div className={`w-32 h-32 rounded-full border-4 border-dashed ${stamp.border} p-2 flex items-center justify-center mb-4 bg-white/[0.02] group-hover:scale-105 transition-transform`}>
                  <div className="w-full h-full rounded-full border flex flex-col items-center justify-center p-2">
                    <Award className="w-5 h-5 text-white mb-1" />
                    <span className="text-sm font-black text-white">{stamp.title}</span>
                    <span className="text-[10px] text-slate-400">{stamp.text}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-300 group-hover:text-pink-300 transition-colors">
                  {stamp.title} 도안
                </span>
                <span className="text-[11px] text-slate-500 mt-1">인쇄 규격: 28mm 원형</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 교사 후기 카드 3종 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="glass-card p-8 rounded-3xl border border-white/5 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  {/* 별점 */}
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 font-semibold border border-pink-500/20">
                    {rev.tag}
                  </span>
                </div>

                <Quote className="w-8 h-8 text-white/10 mb-3" />
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  "{rev.text}"
                </p>
              </div>

              {/* 작성 교사 프로필 */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <span className="text-xs text-slate-400">{rev.role}</span>
                </div>
                <span className="text-xs text-slate-500">{rev.school}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
