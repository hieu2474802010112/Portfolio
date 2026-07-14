import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import edwardPhoto from "@/imports/image.png";
import cvFile from "@/imports/Dang_Nguyen_Ba_Hung_CV.pdf";
import {
  Megaphone, Droplets, Heart, Star, Sparkles, PenLine,
  ArrowRight, Mail, Phone, MapPin, ChevronRight, Linkedin, Download
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const LIME = "#a8ff47";
const ORANGE = "#ff6b2b";
const YELLOW = "#ffe047";
const PINK = "#ff6bbd";
const BLUE = "#4dc8ff";
const CREAM = "#f5f0e8";
const DARK = "#1a1a1a";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 22 };
const SPRING_SOFT = { type: "spring" as const, stiffness: 260, damping: 20 };

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useMouseNorm() {
  const [m, setM] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) => setM({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return m;
}

function useCountUp(target: number, trigger: boolean, duration = 1800) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.floor(e * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setV(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, trigger, duration]);
  return v;
}

function useVisible(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, vis };
}

// ─── Ticker ───────────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  "CREATING BUZZ", "DRIVING GROWTH", "360° MARKETING",
  "CỰU UNILEVER", "CỰU L'ORÉAL", "KÊNH14", "5M+ LƯỢT XEM",
  "+5% DOANH THU", "200+ KOLs", "IMC ĐA KÊNH",
];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="w-full overflow-hidden py-3 border-b-2 border-[#1a1a1a]" style={{ background: LIME }}>
      <div className="flex whitespace-nowrap" style={{ animation: "ticker 28s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} className="text-sm font-[Anton] tracking-widest text-[#1a1a1a] mx-6 flex items-center gap-2">
            {item} <span className="text-[#1a1a1a] opacity-40">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ active, onNav }: { active: string; onNav: (s: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { id: "hero", label: "Trang chủ" },
    { id: "campaigns", label: "Chiến dịch" },
    { id: "o2o", label: "O2O" },
    { id: "magazine", label: "Bài viết" },
    { id: "contact", label: "Liên hệ" },
  ];

  return (
    <nav
      className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.95)" : "#ffffff",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: `2px solid ${DARK}`,
        boxShadow: `0 5px 0 ${DARK}`,
      }}
    >
      <span className="font-[Anton] tracking-widest text-lg uppercase text-[#1a1a1a]">
        Edward<span style={{ color: ORANGE }}>.</span>N
      </span>
      <div className="hidden md:flex items-center gap-1">
        {links.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            className="px-4 py-2 rounded-lg text-sm font-[DM_Sans] font-medium transition-all duration-150"
            style={{
              background: active === id ? DARK : "transparent",
              color: active === id ? CREAM : DARK,
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <motion.button
        onClick={() => onNav("contact")}
        className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl font-[DM_Sans] font-semibold text-sm border-2 border-[#1a1a1a]"
        style={{ background: ORANGE, color: "#fff", boxShadow: "3px 3px 0px #1a1a1a" }}
        whileHover={{ x: -2, y: -2, boxShadow: "5px 5px 0px #1a1a1a" }}
        transition={SPRING}
      >
        Liên hệ ngay <ArrowRight size={14} />
      </motion.button>
    </nav>
  );
}

// ─── Hero Floating Objects ────────────────────────────────────────────────────

function ClayCard({ children, bg, className = "", style = {} }: {
  children: React.ReactNode; bg: string; className?: string; style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-3xl border-2 border-[#1a1a1a] flex items-center justify-center ${className}`}
      style={{ background: bg, boxShadow: "4px 4px 0px #1a1a1a", ...style }}
    >
      {children}
    </div>
  );
}

function HeroObjects({ mouse }: { mouse: { x: number; y: number } }) {
  const px = (d: number) => mouse.x * d;
  const py = (d: number) => mouse.y * d;

  return (
    <div className="relative w-full h-full" style={{ minHeight: 520 }}>
      {/* Polaroid avatar — prominent center */}
      <div
        className="absolute"
        style={{
          top: "10%",
          left: "20%",
          transform: `translate(${px(-5)}px, ${py(-5)}px) rotate(-2deg)`,
          transition: "transform 0.15s ease-out",
          zIndex: 10,
        }}
      >
        <motion.div
          whileHover={{ rotate: 0, scale: 1.02 }}
          transition={SPRING_SOFT}
          className="bg-white border-2 border-[#1a1a1a] p-4 pb-12"
          style={{ boxShadow: "8px 8px 0px #1a1a1a", width: 280 }}
        >
          <div className="overflow-hidden rounded-lg" style={{ height: 320 }}>
            <ImageWithFallback
              src={edwardPhoto}
              alt="Edward — Đặng Nguyễn Bá Hưng"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <p className="text-xs font-[DM_Mono] text-[#1a1a1a] font-bold">Edward N. ✦</p>
          </div>
        </motion.div>
      </div>

      {/* CleanTok badge */}
      <div
        className="absolute z-20"
        style={{ bottom: "10%", left: "5%", transform: `translate(${px(20)}px, ${py(10)}px)`, animation: "bob 3.5s ease-in-out infinite" }}
      >
        <ClayCard bg={DARK} className="px-5 py-3 flex-col gap-1.5">
          <Star size={24} color={LIME} fill={LIME} />
          <span className="text-xs font-[DM_Mono] font-bold uppercase tracking-wide" style={{ color: LIME }}>CleanTok</span>
          <span className="text-[11px] font-[DM_Mono] text-[#aaa]">5M+ Views</span>
        </ClayCard>
      </div>

      {/* KPI badge */}
      <div
        className="absolute z-20"
        style={{ top: "15%", right: "-5%", transform: `translate(${px(12)}px, ${py(-15)}px)`, animation: "bob 3.3s ease-in-out infinite 0.5s" }}
      >
        <ClayCard bg={YELLOW} className="px-5 py-4 flex-col gap-1">
          <span className="text-4xl font-[Anton] text-[#1a1a1a]">+5%</span>
          <span className="text-xs font-[DM_Mono] text-[#1a1a1a] font-bold">DOANH THU</span>
        </ClayCard>
      </div>

      {/* Viral headline snippet */}
      <div
        className="absolute z-20"
        style={{ bottom: "35%", right: "-10%", transform: `translate(${px(-15)}px, ${py(15)}px)`, animation: "bob 4.1s ease-in-out infinite 1s" }}
      >
        <div className="px-5 py-4 rounded-2xl border-2 border-[#1a1a1a] bg-white" style={{ boxShadow: "6px 6px 0 #1a1a1a", maxWidth: 220 }}>
          <div className="text-[11px] font-[DM_Mono] uppercase text-[#ff6b2b] font-bold mb-1.5">Kênh14 · Trending</div>
          <p className="text-sm font-[DM_Sans] font-semibold text-[#1a1a1a] leading-tight">"Gương Soi Nét" — Chiến dịch viral nhất 2023</p>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection({ onNav }: { onNav: (s: string) => void }) {
  const mouse = useMouseNorm();

  const words = [
    { text: "Tạo Buzz.", fill: DARK, outline: false },
    { text: "Đẩy Số.", fill: LIME, outline: false },
    { text: "Marketer 360°", fill: DARK, outline: false },
  ];

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden pt-20" style={{ background: CREAM }}>
      {/* Dot grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: `radial-gradient(circle, #1a1a1a 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-8 items-center min-h-[calc(100vh-80px)]">
        {/* Left: kinetic text */}
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Label */}
          <div className="flex items-center gap-2 w-fit px-4 py-2 rounded-full border-2 border-[#1a1a1a] bg-white" style={{ boxShadow: "2px 2px 0 #1a1a1a" }}>
            <span className="text-[10px] font-[DM_Mono] font-bold tracking-widest uppercase text-[#1a1a1a]">Marketer Hiện đại 360°</span>
          </div>

          {/* Kinetic headline */}
          <h1 className="font-[Anton] leading-[1.05] tracking-wide" style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}>
            {words.map((w, i) => (
              <motion.span
                key={i}
                className="inline-block mr-3"
                style={{ color: w.fill }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {w.text}
              </motion.span>
            ))}
          </h1>

          <p className="text-lg font-[DM_Sans] font-medium text-[#3a3a3a] max-w-sm leading-relaxed">
            Cựu Unilever · Cựu L'Oréal · Kênh14. Marketer trẻ định nghĩa lại ý nghĩa
            của marketing tích hợp — từ ATL đến KOC, từ trực tuyến đến cửa hàng.
          </p>

          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={() => onNav("campaigns")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-[DM_Sans] font-bold text-sm border-2 border-[#1a1a1a]"
              style={{ background: ORANGE, color: "#fff", boxShadow: "4px 4px 0 #1a1a1a" }}
              whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0 #1a1a1a" }}
              transition={SPRING}
            >
              Xem Chiến dịch <ArrowRight size={14} />
            </motion.button>
            <motion.a
              href={cvFile}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-[DM_Sans] font-bold text-sm border-2 border-[#1a1a1a] bg-white"
              style={{ boxShadow: "4px 4px 0 #1a1a1a", color: DARK }}
              whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0 #1a1a1a" }}
              transition={SPRING}
            >
              <Download size={14} /> Xem & Tải CV
            </motion.a>
          </div>

          {/* Brand pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { name: "Unilever VN", bg: "#e8f0ff", border: "#4a7cdc" },
              { name: "L'Oréal VN", bg: "#fff3d4", border: "#d4a017" },
              { name: "Kênh14", bg: "#ffe8e0", border: "#e85428" },
              { name: "WSU · GPA 3.42", bg: "#f0ffe0", border: "#7cbf2a" },
            ].map((b) => (
              <span key={b.name} className="px-3 py-1.5 rounded-full text-xs font-[DM_Sans] font-semibold border-2"
                style={{ background: b.bg, borderColor: b.border, color: DARK }}>
                {b.name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right: floating objects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <HeroObjects mouse={mouse} />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Campaign Booths ──────────────────────────────────────────────────────────

const KOL_COLORS = [LIME, ORANGE, YELLOW, PINK, BLUE, "#b47bff", DARK, "#ff4444",
  LIME, ORANGE, YELLOW, PINK, BLUE, "#b47bff", DARK, "#ff4444"];

function KOLCloud({ active }: { active: boolean }) {
  const positions = [
    [18, 15], [42, 8], [65, 18], [82, 10],
    [8, 38], [30, 32], [52, 40], [74, 30], [90, 42],
    [14, 60], [38, 55], [60, 62], [80, 55],
    [24, 78], [50, 74], [72, 80],
  ];
  return (
    <div className="relative" style={{ height: 130, width: "100%" }}>
      {positions.map(([x, y], i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-[#1a1a1a] flex items-center justify-center text-[7px] font-[DM_Mono] font-bold"
          style={{
            width: 28, height: 28,
            left: `${x}%`, top: `${y}%`,
            background: KOL_COLORS[i % KOL_COLORS.length],
            color: KOL_COLORS[i % KOL_COLORS.length] === DARK ? "#fff" : DARK,
          }}
          animate={active ? {
            y: [0, -8 - (i % 3) * 4, 0],
            transition: { duration: 0.8 + (i % 3) * 0.2, delay: i * 0.04, repeat: Infinity, repeatType: "loop" as const, ease: "easeInOut" },
          } : {}}
        >
          {String.fromCharCode(65 + (i % 26))}
        </motion.div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-4xl font-[Anton] text-[#1a1a1a] opacity-15">200+</span>
      </div>
    </div>
  );
}

function UnileverBooth() {
  const { ref } = useVisible(0.2);

  return (
    <motion.div
      ref={ref}
      className="rounded-3xl border-2 border-[#1a1a1a] overflow-hidden relative"
      style={{ background: "#0a1628", boxShadow: "6px 6px 0 #1a1a1a", minHeight: 420 }}
      whileHover={{ x: -3, y: -3, boxShadow: "9px 9px 0 #1a1a1a" }}
      transition={SPRING}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Header bar */}
      <div className="h-2 w-full" style={{ background: LIME }} />
      <div className="p-7 flex flex-col gap-5 h-full">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-[DM_Mono] tracking-widest uppercase mb-1 font-bold" style={{ color: LIME }}>Thực tập Marketing · 2023</p>
            <h3 className="text-2xl font-[Anton] tracking-wide text-white">Unilever Việt Nam</h3>
            <p className="text-xs font-[DM_Sans] text-[#8a9ab0] mt-0.5">FMCG Industry Leader</p>
          </div>
          <div className="px-3 py-1.5 rounded-xl text-[11px] font-[DM_Mono] font-bold border" style={{ background: `${LIME}15`, borderColor: `${LIME}40`, color: LIME }}>
            T5–T8/2023
          </div>
        </div>

        <p className="text-sm font-[DM_Sans] text-[#8a9ab0] leading-relaxed">
          Triển khai IMC 360° cho Vim Block. Kích hoạt CleanTok đạt lượt xem khủng, hợp tác 10 agency và 5 phòng ban nội bộ để đưa sản phẩm viral.
        </p>

        <div className="flex gap-4 mt-2">
          {[
            { val: "+5%", label: "Doanh thu", bg: LIME },
            { val: "5M+", label: "Lượt xem", bg: ORANGE },
            { val: "30%↑", label: "Vượt KPI", bg: YELLOW },
          ].map(({ val, label, bg }, i) => (
            <motion.div
              key={val}
              className="flex-1 rounded-2xl border-2 border-[#1a1a1a] flex flex-col items-center py-4 px-2"
              style={{ background: bg, boxShadow: "3px 3px 0 #1a1a1a" }}
              initial={{ scale: 0, y: 20 }}
              whileInView={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.1 * i }}
              viewport={{ once: true }}
            >
              <span className="text-2xl font-[Anton] text-[#1a1a1a]">{val}</span>
              <span className="text-[11px] font-[DM_Mono] text-[#1a1a1a] font-bold">{label}</span>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-auto pt-4">
          {["ATL/BTL/TTL", "50+ KOLs", "ESG 50 Trường", "Omnichannel"].map((t) => (
            <span key={t} className="px-2.5 py-1.5 rounded-lg text-[11px] font-[DM_Mono] border font-bold" style={{ background: `${LIME}12`, borderColor: `${LIME}35`, color: LIME }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function LorealBooth() {
  return (
    <motion.div
      className="rounded-3xl border-2 border-[#1a1a1a] overflow-hidden relative"
      style={{ background: "#1c1200", boxShadow: "6px 6px 0 #1a1a1a", minHeight: 420 }}
      whileHover={{ x: -3, y: -3, boxShadow: "9px 9px 0 #1a1a1a" }}
      transition={SPRING}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="h-2 w-full" style={{ background: YELLOW }} />
      <div className="p-7 flex flex-col gap-5 h-full">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-[DM_Mono] tracking-widest uppercase mb-1 font-bold" style={{ color: YELLOW }}>Consultant Leader · 2022–23</p>
            <h3 className="text-2xl font-[Anton] tracking-wide text-white">L'Oréal Việt Nam</h3>
            <p className="text-xs font-[DM_Sans] text-[#9a8a6a] mt-0.5">Beauty Industry Leader</p>
          </div>
          <div className="px-3 py-1.5 rounded-xl text-[11px] font-[DM_Mono] font-bold border" style={{ background: `${YELLOW}15`, borderColor: `${YELLOW}40`, color: YELLOW }}>
            T9/22–T4/23
          </div>
        </div>

        <p className="text-sm font-[DM_Sans] text-[#8a7a5a] leading-relaxed">
          Xây dựng mạng lưới KOL/KOC cực khủng. Đào tạo 300 cố vấn nội bộ và 30 đối tác B2B, đóng góp hơn 300 triệu VNĐ doanh thu mỗi tháng.
        </p>

        <div className="flex gap-4 mt-2">
          {[
            { val: "200+", label: "KOLs xây dựng", bg: YELLOW },
            { val: "15%↑", label: "Marketing Buzz", bg: PINK },
          ].map(({ val, label, bg }, i) => (
            <motion.div
              key={val}
              className="flex-1 rounded-2xl border-2 border-[#1a1a1a] py-6 px-3 flex flex-col items-center justify-center"
              style={{ background: bg, boxShadow: "3px 3px 0 #1a1a1a" }}
              initial={{ scale: 0, y: 20 }}
              whileInView={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.1 * i }}
              viewport={{ once: true }}
            >
              <span className="text-3xl font-[Anton] text-[#1a1a1a]">{val}</span>
              <span className="text-[11px] font-[DM_Mono] text-[#1a1a1a] font-bold text-center mt-1">{label}</span>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-auto pt-4">
          {["B2B Training", "KOC Network", "Event Curation"].map((t) => (
            <span key={t} className="px-2.5 py-1.5 rounded-lg text-[11px] font-[DM_Mono] border font-bold" style={{ background: `${YELLOW}12`, borderColor: `${YELLOW}35`, color: YELLOW }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CampaignSection() {
  return (
    <section id="campaigns" className="py-28 px-6" style={{ background: DARK }}>
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-14"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-3 w-3 rounded-full" style={{ background: LIME }} />
            <span className="text-[10px] font-[DM_Mono] tracking-widest uppercase text-[#6a6a6a]">Chiến dịch thực chiến</span>
          </div>
          <h2 className="font-[Anton] tracking-wide text-white leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            Gian hàng<br />
            <span style={{ color: LIME }}>Chiến dịch</span>
          </h2>
          <p className="mt-3 text-sm font-[DM_Sans] text-[#6a6a6a] max-w-md">
            Hover vào từng gian hàng để thấy con số thực tế từ các chiến dịch marketing của tôi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UnileverBooth />
          <LorealBooth />
        </div>

        {/* Kenh14 strip */}
        <motion.div
          className="mt-6 rounded-3xl border-2 border-[#1a1a1a] p-6 flex flex-col md:flex-row items-center gap-6"
          style={{ background: ORANGE, boxShadow: "6px 6px 0 #1a1a1a" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ x: -3, y: -3, boxShadow: "9px 9px 0 #1a1a1a" }}
        >
          <div className="flex-1">
            <p className="text-[10px] font-[DM_Mono] tracking-widest uppercase text-white opacity-70 mb-1">Cộng tác viên · Hiện tại</p>
            <h3 className="text-2xl font-[Anton] tracking-wide text-white">Kênh14 Articles</h3>
            <p className="text-sm font-[DM_Sans] text-white opacity-80 mt-1">TV Show · Phim ảnh · Học đường</p>
          </div>
          <div className="flex gap-4">
            {[
              { val: "100+", label: "Bài viết" },
              { val: "30+", label: "Chiến dịch PR" },
            ].map(({ val, label }) => (
              <div key={val} className="text-center">
                <p className="text-4xl font-[Anton] text-white">{val}</p>
                <p className="text-[11px] font-[DM_Mono] font-bold text-white opacity-80 uppercase mt-1">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── O2O Section ──────────────────────────────────────────────────────────────

function O2OSection() {
  const steps = [
    { icon: "📱", label: "Tạo Nhận Diện", sub: "TikTok · Meta", bg: BLUE },
    { icon: "🛒", label: "Chốt Số Online", sub: "Shopee · UShop", bg: YELLOW },
    { icon: "🚚", label: "Đẩy Hàng", sub: "MT · DT · GT", bg: ORANGE },
    { icon: "🏪", label: "Trải Nghiệm Thực", sub: "Offline Retail", bg: PINK },
  ];

  return (
    <section id="o2o" className="py-28 px-6 border-t-2 border-[#1a1a1a]" style={{ background: LIME }}>
      <div className="max-w-5xl mx-auto">
        <motion.div className="mb-14"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[#1a1a1a] bg-white mb-4" style={{ boxShadow: "2px 2px 0 #1a1a1a" }}>
            <span className="text-[10px] font-[DM_Mono] tracking-widest uppercase font-bold text-[#ff6b2b]">Mục tiêu: Tối ưu ROI & Chuyển đổi</span>
          </div>
          <h2 className="font-[Anton] tracking-wide text-[#1a1a1a] leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            Chiến lược <span style={{ color: "#fff", WebkitTextStroke: "2px #1a1a1a" }}>O2O</span>
          </h2>
          <p className="mt-4 text-sm font-[DM_Sans] text-[#1a1a1a] font-medium max-w-xl leading-relaxed">
            Mục tiêu tối thượng của Marketing không chỉ là lượt xem, mà là doanh số. Tôi thiết kế hành trình đa điểm chạm, biến người xem trên mạng xã hội thành khách hàng trung thành trên cả E-Commerce lẫn cửa hàng vật lý.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          {steps.map((step, i) => (
            <>
              <motion.div
                key={step.label}
                className="flex-1 rounded-3xl border-2 border-[#1a1a1a] p-6 flex flex-col items-center gap-3 text-center"
                style={{ background: step.bg, boxShadow: "4px 4px 0 #1a1a1a" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, boxShadow: "4px 10px 0 #1a1a1a" }}
              >
                <span style={{ fontSize: 36 }}>{step.icon}</span>
                <div>
                  <p className="font-[Anton] tracking-wide text-[#1a1a1a]">{step.label}</p>
                  <p className="text-[11px] font-[DM_Mono] text-[#1a1a1a] font-bold opacity-80 mt-1">{step.sub}</p>
                </div>
              </motion.div>
              {i < steps.length - 1 && (
                <div key={`arrows-${i}`} className="text-[#1a1a1a] font-bold text-2xl" style={{ flexShrink: 0 }}>
                  <span className="hidden md:inline">→</span>
                  <span className="inline md:hidden">↓</span>
                </div>
              )}
            </>
          ))}
        </div>

        {/* Skills grid */}
        <motion.div 
          className="mt-16 mb-8 text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-[Anton] tracking-wide text-[#1a1a1a] text-2xl mb-2">Bộ Kỹ Năng Thực Chiến</h3>
          <p className="text-sm font-[DM_Sans] text-[#3a4a2a] max-w-2xl mx-auto">
            Để vận hành trơn tru chiến lược O2O và mang lại chuyển đổi thực tế, đây là những kỹ năng cốt lõi tôi đã liên tục rèn luyện và áp dụng.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "IMC 360°", pct: 93 },
            { label: "Phân tích dữ liệu", pct: 86 },
            { label: "Quản lý KOL/KOC", pct: 91 },
            { label: "Quản lý Stakeholder", pct: 89 },
          ].map(({ label, pct }, i) => (
            <motion.div
              key={label}
              className="rounded-2xl border-2 border-[#1a1a1a] p-4 bg-white"
              style={{ boxShadow: "3px 3px 0 #1a1a1a" }}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: i * 0.08 }}
            >
              <div className="flex items-end justify-between mb-2">
                <span className="text-xs font-[DM_Sans] font-semibold text-[#1a1a1a]">{label}</span>
                <span className="text-sm font-[DM_Mono] font-bold text-[#ff6b2b]">{pct}%</span>
              </div>
              <div className="h-2.5 rounded-full border border-[#1a1a1a] bg-[#f0f0f0] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: DARK }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Magazine Section ─────────────────────────────────────────────────────────

const ARTICLES = [
  { title: "Top 10 OST Phim Việt Hay Nhất 2023", cat: "Phim ảnh", color: PINK, reads: "12.4K", url: "https://kenh14.vn" },
  { title: "Gen Z & Cuộc Cách Mạng 'Thrift Fashion'", cat: "Xu hướng", color: LIME, reads: "9.8K", url: "https://kenh14.vn" },
  { title: "TikTok Đang Thay Đổi Văn Hóa Học Đường", cat: "Học đường", color: YELLOW, reads: "15.2K", url: "https://kenh14.vn" },
  { title: "K-Drama & Làn Sóng Hallyu Thế Hệ Mới", cat: "TV Show", color: BLUE, reads: "11.1K", url: "https://kenh14.vn" },
  { title: "Review: Bộ Phim Việt Được Mong Chờ Nhất", cat: "Điện ảnh", color: ORANGE, reads: "8.7K", url: "https://kenh14.vn" },
  { title: "Họp báo: Phim hành động bom tấn Việt 2023", cat: "Sự kiện PR", color: "#b47bff", reads: "6.9K", url: "https://kenh14.vn" },
];

function MagazineSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="magazine" className="py-28 overflow-hidden" style={{ background: CREAM }}>
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="flex items-center gap-3 mb-3">
            <PenLine size={16} color={DARK} />
            <span className="text-[10px] font-[DM_Mono] tracking-widest uppercase text-[#6b6b6b]">Di sản biên tập</span>
          </div>
          <h2 className="font-[Anton] tracking-wide text-[#1a1a1a] leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            Kênh14 <span style={{ color: ORANGE }}>Archive</span>
          </h2>
          <p className="mt-3 text-sm font-[DM_Sans] text-[#5a5a5a]">
            100+ bài viết về phim ảnh, TV show và học đường. Hỗ trợ PR cho 30+ bộ phim.
          </p>
          <p className="mt-2 text-[11px] font-[DM_Mono] text-[#ff6b2b] font-bold uppercase tracking-wider hidden md:block">
            ✦ Lướt ngang để xem thêm →
          </p>
        </motion.div>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-5 px-6 overflow-x-auto pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {ARTICLES.map((art, i) => (
          <motion.a
            href={art.url}
            target="_blank"
            rel="noopener noreferrer"
            key={art.title}
            className="flex-shrink-0 rounded-3xl border-2 border-[#1a1a1a] overflow-hidden bg-white cursor-pointer flex flex-col"
            style={{ width: 260, boxShadow: "5px 5px 0 #1a1a1a" }}
            initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -1 : 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover={{ y: -8, rotate: 0, boxShadow: "8px 8px 0 #1a1a1a" }}
          >
            {/* Color header */}
            <div
              className="h-36 flex items-center justify-center border-b-2 border-[#1a1a1a]"
              style={{ background: art.color }}
            >
              <span className="font-[Anton] text-[#1a1a1a] tracking-widest opacity-30 text-6xl">14</span>
            </div>
            {/* Content */}
            <div className="p-4 flex flex-col gap-3 flex-grow">
              <div className="flex flex-col gap-2 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded-md text-[11px] font-[DM_Mono] font-bold border-2 border-[#1a1a1a]" style={{ background: art.color }}>
                    {art.cat}
                  </span>
                  <span className="text-[11px] font-[DM_Mono] font-bold text-[#6b6b6b]">{art.reads} đọc</span>
                </div>
                <p className="text-sm font-[DM_Sans] font-semibold text-[#1a1a1a] leading-tight">{art.title}</p>
              </div>
              
              <div className="flex items-end justify-between mt-auto pt-3 border-t-2 border-dashed border-[#e0e0e0]">
                <div className="flex flex-col">
                  <span className="text-[11px] font-[DM_Mono] text-[#ff6b2b] font-bold">KÊNH14</span>
                  <span className="text-[11px] font-[DM_Mono] text-[#8a8a8a] font-bold">Đặng Nguyễn Bá Hưng</span>
                </div>
                <span className="text-xs font-[DM_Sans] font-bold text-[#1a1a1a] bg-[#f0f0f0] px-2 py-1.5 rounded-lg border border-[#d0d0d0]">Đọc bài ↗</span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section id="contact" className="py-28 px-6 border-t-2 border-[#1a1a1a]" style={{ background: ORANGE }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="flex flex-col gap-8"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          <div>
            <p className="text-[10px] font-[DM_Mono] tracking-widest uppercase text-white opacity-70 mb-2">Sẵn sàng cho cơ hội mới</p>
            <h2 className="font-[Anton] tracking-wide text-white leading-[1.02]" style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}>
              Hãy cùng tạo ra<br />chiến dịch<br />tiếp theo.
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <motion.a
              href="mailto:dangnguyenbahung@gmail.com"
              className="flex items-center justify-center gap-3 px-7 py-4 rounded-2xl font-[DM_Sans] font-bold text-sm border-2 border-[#1a1a1a] bg-white"
              style={{ boxShadow: "4px 4px 0 #1a1a1a", color: DARK }}
              whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0 #1a1a1a" }}
              transition={SPRING}
            >
              <Mail size={16} /> dangnguyenbahung@gmail.com
            </motion.a>
            <motion.a
              href="tel:+84377684907"
              className="flex items-center justify-center gap-3 px-7 py-4 rounded-2xl font-[DM_Sans] font-bold text-sm border-2 border-[#1a1a1a]"
              style={{ background: DARK, color: "#fff", boxShadow: "4px 4px 0 rgba(0,0,0,0.3)" }}
              whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0 rgba(0,0,0,0.3)" }}
              transition={SPRING}
            >
              <Phone size={16} /> (+84) 377 684 907
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-7 py-4 rounded-2xl font-[DM_Sans] font-bold text-sm border-2 border-[#1a1a1a]"
              style={{ background: "#0077b5", color: "#fff", boxShadow: "4px 4px 0 rgba(0,0,0,0.3)" }}
              whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0 rgba(0,0,0,0.3)" }}
              transition={SPRING}
            >
              <Linkedin size={16} /> LinkedIn
            </motion.a>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={14} color="white" />
            <span className="text-sm font-[DM_Sans] text-white opacity-80">TP. Hồ Chí Minh, Việt Nam</span>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t-2 border-[rgba(255,255,255,0.3)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-[DM_Mono] text-white opacity-80">
            © 2024 Đặng Nguyễn Bá Hưng (Edward) · Marketer Hiện đại 360°
          </p>
          <div className="flex items-center gap-2">
            {["FMCG", "BEAUTY", "GEN Z", "DIGITAL"].map((tag) => (
              <span key={tag} className="text-[11px] font-[DM_Mono] font-bold px-2 py-1 rounded border-2 border-[rgba(255,255,255,0.4)] text-white">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState("hero");

  const onNav = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  }, []);

  useEffect(() => {
    const ids = ["hero", "campaigns", "o2o", "magazine", "contact"];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.3 }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: CREAM, fontFamily: "DM Sans, sans-serif", color: DARK }}>
      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes bob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>

      <Ticker />
      <Navbar active={active} onNav={onNav} />
      <HeroSection onNav={onNav} />
      <CampaignSection />
      <O2OSection />
      <MagazineSection />
      <ContactSection />
    </div>
  );
}
