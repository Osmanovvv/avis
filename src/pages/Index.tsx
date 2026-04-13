import { useRef, useEffect, useState, useCallback } from "react";
import FadeIn from "@/components/FadeIn";
import { CheckCircle2, FileText, Mail, ArrowRight, Phone, Send, ChevronDown } from "lucide-react";
import SolutionsCatalog from "@/components/SolutionsCatalog";
import VideoSection from "@/components/VideoSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCountUp, useStaggerReveal } from "@/hooks/use-animations";
import SEO from "@/components/SEO";
import { useContent } from "@/hooks/use-content";
import { useSettings } from "@/hooks/use-settings";

const defaultTrustStats: Array<{ value: string; label: string }> = [
  { value: "9+", label: "лет на рынке" },
  { value: "150+", label: "объектов" },
  { value: "СП 542", label: "проектирование" },
  { value: "3 года", label: "гарантия" },
];

function parseStatValue(value: string): { num: number; prefix: string; suffix: string } {
  const match = value.match(/^([^\d]*)(\d+)(.*)$/);
  if (!match) return { num: 0, prefix: "", suffix: "" };
  return { num: parseInt(match[2], 10), prefix: match[1] || "", suffix: match[3] || "" };
}

/* ── Animated stat card ── */
const StatCard = ({ value, label }: { value: string; label: string }) => {
  const { num, prefix, suffix } = parseStatValue(value);
  const isNumeric = num > 0;
  const { count, ref } = useCountUp({
    end: num,
    duration: num > 100 ? 1500 : 1000,
    enabled: isNumeric,
  });

  return (
    <div
      ref={ref}
      className="rounded-lg text-center py-6 px-4 md:py-8 transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(74,127,165,0.3)]"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderTop: "2px solid rgba(74,127,165,0.5)",
      }}
    >
      <div
        style={{
          fontSize: "clamp(2rem, 6vw, 2.5rem)",
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {isNumeric ? `${prefix}${count}${suffix}` : value}
      </div>
      <div className="mt-2" style={{ fontSize: "0.75rem", color: "#7a8394" }}>
        {label}
      </div>
    </div>
  );
};

/* ── Hero — full-viewport, centered ── */
const HeroSection = ({
  heroData,
  telHref,
  tgHref,
}: {
  heroData?: { line1: string; subtitle: string; features?: string[]; line2?: string };
  telHref: string;
  tgHref: string;
}) => {
  const defaultFeatures = ["Собственное производство", "Монтаж\u00a0от\u00a05\u00a0дней", "Проектирование\u00a0по\u00a0СП\u00a0542"];
  const features = (heroData?.features || []).filter(Boolean).length
    ? heroData!.features!.map((f) => f || "")
    : defaultFeatures;
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    const handleMouse = (e: MouseEvent) => {
      if (!gridRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      gridRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [isMobile]);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden flex items-center justify-center noise-overlay h-[100svh] min-h-[100svh] md:h-screen md:min-h-screen">
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay muted loop playsInline
          webkit-playsinline=""
          x5-playsinline=""
          poster="/images/nets-main.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: isMobile ? "brightness(0.3) saturate(0.35)" : "brightness(0.32) saturate(0.35)" }}
          preload="auto"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background: isMobile
              ? "linear-gradient(to bottom, rgba(8,10,14,0.4) 0%, rgba(8,10,14,0.85) 60%, rgba(8,10,14,0.95) 100%)"
              : "radial-gradient(ellipse at 30% 50%, rgba(8,10,14,0.65) 0%, rgba(8,10,14,0.88) 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[100px] pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, hsl(220 18% 5%))" }}
        />
      </div>

      {!isMobile && (
        <div
          ref={gridRef}
          className="absolute inset-[-40px] pointer-events-none transition-transform duration-[800ms] ease-out"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      )}

      <div
        className={`relative z-10 w-full flex flex-col ${isMobile ? "items-start text-left px-5" : "items-center text-center px-[6vw]"}`}
        style={{ maxWidth: 960, marginTop: isMobile ? 20 : 0, marginLeft: isMobile ? 0 : "auto", marginRight: isMobile ? 0 : "auto" }}
      >
        <FadeIn>
          <h1 className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]" style={{ margin: 0 }}>
            <span
              className="block"
              style={{
                fontSize: isMobile ? "clamp(2.4rem, 10.5vw, 3.2rem)" : "clamp(3.5rem, 5.5vw, 5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                fontWeight: 800,
                background: "linear-gradient(135deg, #ffffff 0%, #c8d4e0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {heroData?.line1 || (isMobile ? <>ЗАЩИТА<br />ОБЪЕКТОВ<br />ОТ{"\u00a0"}БПЛА</> : <>ЗАЩИТА ОБЪЕКТОВ{"\u00a0"}ОТ{"\u00a0"}БПЛА</>)}
            </span>
          </h1>
        </FadeIn>

        {heroData?.subtitle && (
          <FadeIn delay={0.1}>
            <p
              style={{
                fontSize: isMobile ? "1rem" : "clamp(1.1rem, 2vw, 1.5rem)",
                letterSpacing: isMobile ? "0.04em" : "0.12em",
                fontWeight: 600,
                color: "#4a7fa5",
                marginTop: isMobile ? 8 : 16,
              }}
            >
              {heroData.subtitle}
            </p>
          </FadeIn>
        )}

        <FadeIn delay={0.15}>
          <div
            className={`flex ${isMobile ? "flex-col gap-[10px]" : "flex-wrap justify-center gap-x-6 gap-y-2"}`}
            style={{ marginTop: isMobile ? 20 : 28 }}
          >
            {features.map((text, i) => text && (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 size={isMobile ? 16 : 13} className="shrink-0" style={{ color: "#4a7fa5" }} />
                <span style={{ fontSize: isMobile ? 14 : 13, color: "#7a8394" }}>{text}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.25} className={isMobile ? "w-full" : ""}>
          <div
            className="flex flex-col sm:flex-row gap-[10px] sm:gap-3"
            style={{ marginTop: isMobile ? 28 : 44, width: isMobile ? "100%" : "auto" }}
          >
            <a
              href={telHref}
              className="btn-gold inline-flex items-center justify-center gap-2.5 font-semibold relative overflow-hidden"
              style={{
                width: isMobile ? "100%" : 260,
                height: 52,
                borderRadius: 12,
                fontSize: isMobile ? 15 : 14,
                letterSpacing: "0.04em",
              }}
            >
              <Phone size={16} />
              Запросить аудит
              <ArrowRight size={15} />
            </a>
            <a
              href={tgHref}
              target="_blank"
              rel="noopener noreferrer"
              className="tg-btn inline-flex items-center justify-center gap-2.5 font-semibold transition-all duration-200"
              style={{
                width: isMobile ? "100%" : 220,
                height: 52,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.04)",
                color: "#c0cdd8",
                fontSize: isMobile ? 15 : 14,
                letterSpacing: "0.04em",
                backdropFilter: "blur(8px)",
              }}
              
            >
              <Send size={15} />
              Telegram
            </a>
          </div>
        </FadeIn>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollDown}
        className="absolute z-10 flex flex-col items-center gap-2 transition-opacity duration-500 hover:opacity-100"
        style={{
          bottom: isMobile ? 24 : 40,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.4,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#4a7fa5",
        }}
      >
        <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Услуги
        </span>
        <ChevronDown size={18} className="animate-bounce" />
      </button>
    </section>
  );
};

/* ── Clients data ── */
const clientsCol1 = [
  'ОАО «ИНТЕР РАО – Электрогенерация»',
  'Межрайонная ИФНС №\u00a07 по Краснодарскому краю',
  'ФГБУ «Объединённый санаторий «Сочи»',
  'ГБУ КК «Дворец спорта Большой»',
  'ООО «КВАРЦ Групп»',
  'АО «МОРЕМОЛЛ»',
  'НАО «Центр Омега»',
  'ОАО «Отель «Звёздный»',
  'ПАО «ОГК-2»',
];
const clientsCol2 = [
  'АО «Галерея Краснодар»',
  'МУП «Водоканал» города Сочи',
  'ФГУП «Росморпорт»',
  'ПАО «Калужский турбинный завод»',
  'АО «Силовые машины»',
  'ООО «Группа Компаний „Rusagro"»',
  'УПРО «Объединённый санаторий „Русь"»',
];
const allClients = [...clientsCol1, ...clientsCol2];

const certificates = [
  { name: "СРО", href: "/documents/sro-avis.pdf" },
  { name: "Свидетельство НАЛ", href: "/documents/nalog-uchet.pdf" },
  { name: "Свидетельство ГРН", href: "/documents/grn.pdf" },
  { name: "ISO 14001", href: "/documents/iso-14001.pdf" },
  { name: "ISO 9001", href: "/documents/iso-9001.pdf" },
  { name: "ISO 45001", href: "/documents/iso-45001.pdf" },
];

/* ── Client row component ── */
const ClientRow = ({ name }: { name: string }) => (
  <div
    className="flex items-center gap-3 transition-colors duration-200 hover:bg-[rgba(74,127,165,0.05)]"
    style={{
      padding: "14px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <span
      className="flex-shrink-0 rounded-full"
      style={{ width: 4, height: 4, background: "#4a7fa5" }}
    />
    <span style={{ fontSize: 13, color: "#c0cdd8", lineHeight: 1.4 }}>{name}</span>
  </div>
);

/* ── Trust section ── */
const TrustSection = ({ stats }: { stats: Array<{ value: string; label: string }> }) => {
  const { containerRef, revealed } = useStaggerReveal();
  const isMobile = useIsMobile();
  const [showAllClients, setShowAllClients] = useState(false);

  const visibleClients = isMobile && !showAllClients ? allClients.slice(0, 6) : allClients;
  const hiddenCount = allClients.length - 6;

  return (
    <section style={{ background: "#090b0e" }}>
      <div
        className="mx-auto"
        style={{
          maxWidth: 1200,
          padding: isMobile ? "48px 20px" : "80px 40px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* ── Stats row ── */}
        <div ref={containerRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label + i}
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.5s cubic-bezier(0.25,0.46,0.45,0.94) ${i * (isMobile ? 40 : 80)}ms, transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94) ${i * (isMobile ? 40 : 80)}ms`,
              }}
            >
              <StatCard value={stat.value} label={stat.label} />
            </div>
          ))}
        </div>

        {/* ── Clients ── */}
        <div style={{ marginTop: 56 }}>
          <h3
            style={{
              fontSize: "0.6875rem",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#4a7fa5",
              marginBottom: 24,
              fontWeight: 600,
            }}
          >
            Наши заказчики
          </h3>

          {isMobile ? (
            <>
              <div
                style={{
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                  maxHeight: showAllClients ? allClients.length * 60 : 6 * 60,
                }}
              >
                {visibleClients.map((c) => (
                  <ClientRow key={c} name={c} />
                ))}
              </div>
              {!showAllClients && (
                <button
                  onClick={() => setShowAllClients(true)}
                  style={{
                    fontSize: 13,
                    color: "#4a7fa5",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "14px 20px",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  Показать все заказчики (ещё {hiddenCount})
                </button>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2" style={{ gap: 0 }}>
              <div>
                {clientsCol1.map((c) => (
                  <ClientRow key={c} name={c} />
                ))}
              </div>
              <div>
                {clientsCol2.map((c) => (
                  <ClientRow key={c} name={c} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Certificates ── */}
        <div style={{ marginTop: 48 }}>
          <h3
            style={{
              fontSize: "0.6875rem",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#4a7fa5",
              marginBottom: 24,
              fontWeight: 600,
            }}
          >
            Сертификаты и документы
          </h3>

          <div
            className="flex gap-3 overflow-x-auto pb-1"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {certificates.map((cert) => (
              <a
                key={cert.name}
                href={cert.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-link flex-shrink-0 flex items-center gap-2.5 rounded-[10px] transition-all duration-200"
                style={{
                  width: 160,
                  height: 56,
                  padding: "0 16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  textDecoration: "none",
                }}
              >
                <FileText size={16} style={{ color: "#4a7fa5", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#ffffff", lineHeight: 1.3 }}>
                    {cert.name}
                  </div>
                  <div style={{ fontSize: 10, color: "#4a7fa5" }}>Открыть PDF</div>
                </div>
              </a>
            ))}
          </div>

          <a
            href="mailto:avisooo708@gmail.com"
            className="inline-flex items-center gap-2 mt-4"
            style={{ fontSize: 13, color: "#7a8394", textDecoration: "none" }}
          >
            <Mail size={14} style={{ color: "#4a7fa5" }} />
            avisooo708@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const { content } = useContent();
  const { settings } = useSettings();
  const phone = content?.contacts?.phone || settings?.phone || "";
  const tgUsername = (content?.contacts?.telegram || settings?.telegram || "").replace(/^@/, "");
  const telHref = phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : "#";
  const tgHref = tgUsername ? `https://t.me/${tgUsername}` : "#";

  return (
    <div>
      <SEO
        title="Защита от БПЛА: сетки, ограждения, укрытия | АВИС"
        description="Пассивная защита объектов от БПЛА: антидроновые сетки, бетонные ограждения, защитные шторы, убежища. Системы защиты от дронов под ключ. 150+ объектов. Бесплатный аудит."
        keywords="защита от бпла, защита объектов от бпла, сетки защита от бпла, пассивная защита от бпла, антидроновые сетки, системы защиты от бпла"
        path="/"
        ogTitle="АВИС | Защита объектов от БПЛА"
        ogDescription="Антидроновые сетки, бетонные ограждения, защитные шторы. 150+ объектов. Монтаж под ключ."
      />
      <HeroSection heroData={content?.hero} telHref={telHref} tgHref={tgHref} />
      <SolutionsCatalog />
      <VideoSection />
      <TrustSection stats={content?.stats?.length && content.stats.some((s) => s.value) ? content.stats : defaultTrustStats} />
    </div>
  );
};

export default Index;
