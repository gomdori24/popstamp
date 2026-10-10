"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Stamp, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Smile, 
  Star, 
  Award, 
  Flame, 
  ThumbsUp, 
  CheckCircle,
  Copy
} from "lucide-react";
import confetti from "canvas-confetti";

/**
 * 인터랙티브 스탬프 시뮬레이터 (SimulatorSection)
 * - 사용자가 직접 문구, 색상, 아이콘을 변경하며 실시간으로 스탬프 모양을 조합
 * - '스탬프 쾅 찍기' 버튼 클릭 시 경쾌한 잉크 애니메이션 & 컨페티 효과 발생
 */
export default function SimulatorSection() {
  const [stampText, setStampText] = useState("참 잘했어요!");
  const [subText, setSubText] = useState("3학년 1반");
  const [selectedColor, setSelectedColor] = useState("#ec4899"); // 기본 핑크
  const [selectedIcon, setSelectedIcon] = useState<"star" | "smile" | "award" | "flame" | "thumb">("star");
  const [isStamped, setIsStamped] = useState(false);
  const [stampCount, setStampCount] = useState(1);

  // 색상 팔레트 옵션
  const colorOptions = [
    { name: "비비드 핑크", value: "#ec4899", ring: "ring-pink-500", glow: "shadow-pink-500/50" },
    { name: "일렉트릭 바이올렛", value: "#8b5cf6", ring: "ring-purple-500", glow: "shadow-purple-500/50" },
    { name: "네온 사이언", value: "#06b6d4", ring: "ring-cyan-500", glow: "shadow-cyan-500/50" },
    { name: "에너제틱 오렌지", value: "#f97316", ring: "ring-orange-500", glow: "shadow-orange-500/50" },
    { name: "클래식 레드", value: "#ef4444", ring: "ring-red-500", glow: "shadow-red-500/50" },
  ];

  // 추천 문구 프리셋
  const presets = [
    "참 잘했어요! 👍",
    "오늘의 독서왕 📖",
    "빛나는 성장 🌟",
    "노력하는 네가 최고야 ❤️",
    "발표 마스터 🎙️"
  ];

  // 스탬프 쾅 찍기 액션
  const handleStampAction = () => {
    setIsStamped(true);
    setStampCount((prev) => prev + 1);

    // 축하 꽃가루 폭죽(Confetti) 효과
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#ec4899", "#8b5cf6", "#06b6d4", "#f97316"]
    });

    setTimeout(() => {
      setIsStamped(false);
    }, 600);
  };

  // 아이콘 렌더러
  const renderIcon = () => {
    const props = { className: "w-8 h-8", style: { color: selectedColor } };
    switch (selectedIcon) {
      case "smile": return <Smile {...props} />;
      case "award": return <Award {...props} />;
      case "flame": return <Flame {...props} />;
      case "thumb": return <ThumbsUp {...props} />;
      default: return <Star {...props} />;
    }
  };

  return (
    <section id="simulator" className="py-24 relative overflow-hidden bg-[#090a0f]">
      {/* 배경 장식 */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 섹션 타이틀 */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            실시간 인터랙티브 체험
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            화면에서 바로 찍어보는 <br />
            <span className="text-gradient-neon">내 교실 전용 팝스탬프</span>
          </h2>
          <p className="text-slate-400 text-base">
            문구와 컬러, 아이콘을 원하는 대로 조합해 보세요. 실제 도장으로 인쇄될 모양을 실시간으로 확인하실 수 있습니다.
          </p>
        </div>

        {/* 메인 인터랙티브 작업판 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 좌측: 컨트롤 패널 (입력 폼) */}
          <div className="lg:col-span-6 space-y-6 glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <Stamp className="w-5 h-5 text-pink-400" />
              도안 상세 설정
            </h3>

            {/* 1. 빠른 문구 프리셋 */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">자주 쓰는 칭찬 문구 픽</label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStampText(preset)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 border border-white/5 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. 메인 칭찬 문구 입력 */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">메인 칭찬 문구 (최대 12자)</label>
              <input
                type="text"
                value={stampText}
                maxLength={15}
                onChange={(e) => setStampText(e.target.value)}
                placeholder="예: 참 잘했어요!"
                className="w-full px-4 py-3 rounded-xl bg-[#131622] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            {/* 3. 보조 문구 (학급/이름) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">보조 문구 (학급명 or 선생님 성함)</label>
              <input
                type="text"
                value={subText}
                maxLength={12}
                onChange={(e) => setSubText(e.target.value)}
                placeholder="예: 3학년 1반, 김선생님"
                className="w-full px-4 py-3 rounded-xl bg-[#131622] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            {/* 4. 아이콘 선택 */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">중앙 심볼 아이콘</label>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { id: "star", icon: Star, label: "별" },
                  { id: "smile", icon: Smile, label: "미소" },
                  { id: "award", icon: Award, label: "상장" },
                  { id: "flame", icon: Flame, label: "열정" },
                  { id: "thumb", icon: ThumbsUp, label: "최고" },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isSelected = selectedIcon === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedIcon(item.id as any)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        isSelected 
                          ? "bg-pink-500/20 border-pink-500 text-pink-300 scale-105" 
                          : "bg-white/[0.03] border-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      <IconComp className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. 잉크 컬러 선택 */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">잉크 색상 선택</label>
              <div className="flex items-center gap-3">
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setSelectedColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`w-9 h-9 rounded-full transition-transform ${c.ring} ${
                      selectedColor === c.value ? "scale-110 ring-4 ring-offset-2 ring-offset-[#090a0f]" : "hover:scale-105"
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* 우측: 실시간 스탬프 캔버스 & 쾅! 찍기 액션 */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full glass-card p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden bg-gradient-to-b from-[#131622]/90 to-[#0e1017]">
              
              {/* 공책 모눈종이 배경 효과 */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              {/* 스탬프 카운트 뱃지 */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>체험 도장 찍은 횟수: <strong className="text-pink-400 font-mono">{stampCount}</strong>회</span>
              </div>

              {/* 중앙 원형 스탬프 그래픽 (인터랙티브 렌더링) */}
              <div className="relative py-12 flex items-center justify-center">
                <motion.div
                  key={stampCount}
                  initial={{ scale: 1.4, opacity: 0, rotate: -15 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    rotate: 0,
                    transition: { type: "spring", stiffness: 400, damping: 20 }
                  }}
                  className="w-56 h-56 rounded-full border-[6px] border-dashed p-3 flex items-center justify-center relative cursor-pointer select-none group"
                  style={{ borderColor: selectedColor }}
                  onClick={handleStampAction}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* 도장 테두리 이중선 */}
                  <div 
                    className="w-full h-full rounded-full border-2 flex flex-col items-center justify-between py-5 px-3 text-center"
                    style={{ borderColor: selectedColor }}
                  >
                    {/* 상단 서브 텍스트 */}
                    <span 
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: selectedColor }}
                    >
                      {subText || "선생님 스탬프"}
                    </span>

                    {/* 중앙 아이콘 */}
                    <div className="my-1">
                      {renderIcon()}
                    </div>

                    {/* 메인 칭찬 텍스트 */}
                    <span 
                      className="text-xl font-black tracking-tight drop-shadow-sm px-2 break-keep"
                      style={{ color: selectedColor }}
                    >
                      {stampText || "참 잘했어요!"}
                    </span>

                    {/* 하단 뱃지 텍스트 */}
                    <span 
                      className="text-[10px] font-semibold tracking-tighter opacity-80"
                      style={{ color: selectedColor }}
                    >
                      ★ POP STAMP VERIFIED ★
                    </span>
                  </div>
                </motion.div>
              </div>

              <p className="text-xs text-slate-500 mt-2">
                * 도장을 클릭하면 화면에 실시간으로 '쾅!' 하고 찍힙니다.
              </p>

              {/* 하단 실행 버튼 그룹 */}
              <div className="w-full mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleStampAction}
                  className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Stamp className="w-5 h-5" />
                  스탬프 쾅! 찍어보기
                </button>

                <button
                  onClick={() => alert("도안 이미지가 저장되었습니다! 정식 런칭 시 초고화질 PDF 다운로드가 제공됩니다.")}
                  className="py-4 px-6 rounded-2xl bg-white/[0.05] border border-white/10 text-slate-200 font-semibold hover:bg-white/[0.1] flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-5 h-5 text-slate-400" />
                  도안 저장
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
