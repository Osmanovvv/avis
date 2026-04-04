import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/FadeIn";
import { ArrowRight } from "lucide-react";
import SolutionsCatalog from "@/components/SolutionsCatalog";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import VideoCard from "@/components/VideoCard";
import netsPerimeter from "@/assets/catalog/nets-perimeter.webp";
import caseSubstation from "@/assets/case-energy-substation.webp";
import { useIsMobile } from "@/hooks/use-mobile";
import SEO from "@/components/SEO";

const stats = [
  { value: "200+", label: "объектов", numeric: 200, suffix: "+" },
  { value: "12", label: "лет опыта", numeric: 12 },
  { value: "5", label: "изготовление", numeric: 5 },
  { value: "100%", label: "производство", numeric: 100, suffix: "%" },
];

/* ── Animated counter ── */
const AnimatedNumber = ({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1200;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

/* ── Hero — full-viewport, no-scroll ── */
const HeroSection = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!gridRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      gridRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <section className="relative overflow-hidden flex items-center noise-overlay h-[100svh] min-h-[100svh] md:h-screen md:min-h-screen">
      {/* Video / Poster background */}
      <div className="absolute inset-0 overflow-hidden">
        {isMobile ? (
          <img
            src="/hero-poster.jpg"
            alt="Защита объектов от БПЛА. Антидроновые сетки АВИС"
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "saturate(0.35) brightness(0.32)", objectPosition: "center 20%" }}
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/hero-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.32) saturate(0.35)" }}
          >
            <source src="/hero-video.webm" type="video/webm" />
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: isMobile
              ? "linear-gradient(to bottom, rgba(8,10,14,0.82) 0%, rgba(8,10,14,0.82) 100%)"
              : "linear-gradient(to right, rgba(8,10,14,0.90) 0%, rgba(8,10,14,0.85) 40%, rgba(8,10,14,0.25) 100%)",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[80px] pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, hsl(220 18% 5%))" }}
        />
      </div>

      {/* Animated grid lines */}
      <div
        ref={gridRef}
        className="absolute inset-[-40px] pointer-events-none transition-transform ease-out"
        style={{
          transitionDuration: '800ms',
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content — vertically centered */}
      <div
        className="relative z-10 flex flex-col"
        style={{
          height: "calc(100vh - 96px)",
          paddingLeft: isMobile ? "24px" : "6vw",
          paddingRight: isMobile ? "24px" : "50%",
          justifyContent: isMobile ? "flex-end" : "center",
          paddingBottom: isMobile ? "80px" : "0",
        }}
      >
        <div>
          <FadeIn>
            <h1 className="text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]" style={{ margin: 0 }}>
              <span
                className="block"
                style={{
                  fontSize: isMobile ? "clamp(28px, 7.5vw, 40px)" : "clamp(32px, 3.8vw, 60px)",
                  lineHeight: 1.0,
                  letterSpacing: "0.01em",
                  fontWeight: 200,
                }}
              >
                ЗАЩИТА ОБЪЕКТОВ ОТ БПЛА
              </span>
              <span
                className="block text-highlight"
                style={{
                  fontSize: isMobile ? "clamp(22px, 6vw, 34px)" : "clamp(26px, 3.2vw, 50px)",
                  lineHeight: 1.0,
                  letterSpacing: "0.01em",
                  fontWeight: 200,
                  marginTop: 0,
                }}
              >
                СЕТКИ, ОГРАЖДЕНИЯ, УКРЫТИЯ
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] line-clamp-2 md:line-clamp-none"
              style={{ marginTop: 16, maxWidth: 400, fontSize: 14, lineHeight: 1.4, color: "rgba(176, 186, 200, 0.7)" }}
            >
              Пассивная инженерная защита. От аудита до монтажа под ключ
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ marginTop: 20 }}>
              <Link to="/contacts" className="inline-block w-full sm:w-auto">
                <Button
                  variant="hero"
                  className="whitespace-nowrap w-full max-w-[360px] sm:w-auto sm:min-w-fit h-[52px] text-[12px] sm:text-[13px] font-semibold tracking-[0.1em] px-6 sm:px-8 inline-flex items-center justify-center gap-2 animate-hero-pulse"
                >
                  ЗАПРОСИТЬ АУДИТ ОБЪЕКТА
                  <span className="shrink-0">→</span>
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};


const VideoShowcase = () => (
  <section style={{ background: "#090b0e" }} className="py-14 px-4 lg:py-[96px] lg:px-[6vw]">
    {/* Header */}
    <div className="flex items-start justify-between mb-10">
      <div>
        <span className="block uppercase" style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.15em" }}>
          Показываем объекты
        </span>
        <h2 className="mt-2 text-[22px] lg:text-[clamp(22px,2.5vw,36px)] leading-[1.2] lg:leading-normal" style={{ fontWeight: 200, color: "#d4dae2", letterSpacing: "0.03em", margin: 0, marginTop: 8 }}>
          Инженерная защита в действии
        </h2>
      </div>
      <span className="hidden lg:block self-end pb-1" style={{ fontSize: 13, color: "#4a5568" }}>
        Нажмите на ролик для просмотра
      </span>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[62fr_38fr] lg:gap-4">
      <FadeIn>
        <div className="h-[220px] lg:h-[420px]">
          <VideoCard
            poster={netsPerimeter}
            number="01"
            title="Периметровая защита"
            large
          />
        </div>
      </FadeIn>
      <FadeIn delay={0.12}>
        <div className="h-[180px] lg:h-[420px]">
          <VideoCard
            poster={caseSubstation}
            number="02"
            title="Фасадная защита"
            posterFilter="brightness(0.55) saturate(0.3)"
          />
        </div>
      </FadeIn>
    </div>
  </section>
);

const Index = () => {
  return (
    <div>
      <SEO
        title="Защита от БПЛА — сетки, ограждения, укрытия | АВИС"
        description="Пассивная защита объектов от БПЛА: антидроновые сетки, бетонные ограждения, защитные шторы, убежища. Монтаж под ключ. 200+ объектов. Бесплатный аудит."
        keywords="защита от бпла, защита объектов от бпла, антидроновые сетки, сетки защита от бпла, пассивная защита от бпла"
        path="/"
      />
      <HeroSection />
      <SolutionsCatalog />

      {/* Industries strip */}
      <div
        className="w-full relative overflow-hidden z-[1] flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 flex"
        style={{
          padding: "16px 20px",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          marginTop: 0,
        }}
      >
        <style>{`.tags-scroll::-webkit-scrollbar{display:none}`}</style>
        <span
          className="flex-shrink-0 uppercase whitespace-nowrap text-[9px] sm:text-[10px]"
          style={{ color: "#4a5568", letterSpacing: "0.15em" }}
        >
          ОТРАСЛИ ПРИМЕНЕНИЯ
        </span>
        <div
          className="tags-scroll flex gap-2 items-center flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-x-visible"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {["Энергетика и ТЭК", "Транспорт", "Промышленность", "Гособъекты", "КИИ", "ОПК"].map((tag) => (
            <Link
              key={tag}
              to="/solutions"
              className="flex-shrink-0 rounded-[20px] px-4 py-1.5 text-[12px] transition-colors duration-200"
              style={{
                background: "transparent",
                border: "1px solid rgba(74,127,165,0.25)",
                color: "#7a8394",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor = "#4a7fa5";
                (e.target as HTMLElement).style.color = "#c0cdd8";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor = "rgba(74,127,165,0.25)";
                (e.target as HTMLElement).style.color = "#7a8394";
              }}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          padding: "48px 6vw",
        }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={[
                "text-center py-6 px-4 sm:py-0",
                // Desktop: right border except last
                i < 3 ? "sm:border-r sm:border-[rgba(255,255,255,0.05)]" : "",
                // Mobile 2x2: bottom border on first row
                i < 2 ? "border-b border-[rgba(255,255,255,0.05)] sm:border-b-0" : "",
                // Mobile 2x2: right border on left column
                i % 2 === 0 ? "border-r border-[rgba(255,255,255,0.05)] sm:border-r-0" + (i < 3 ? " sm:border-r sm:border-[rgba(255,255,255,0.05)]" : "") : "",
              ].join(" ")}
            >
              <div
                className="font-extralight leading-none"
                style={{
                  fontSize: "clamp(40px, 5vw, 64px)",
                  color: "#c0cdd8",
                  letterSpacing: "-0.02em",
                  fontWeight: 200,
                }}
              >
                <AnimatedNumber target={s.numeric} suffix={s.suffix} />
              </div>
              <div
                className="uppercase mt-2"
                style={{ fontSize: 10, letterSpacing: "0.12em", color: "#4a5568" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <VideoShowcase />
      <LeadCaptureForm />
    </div>
  );
};

export default Index;