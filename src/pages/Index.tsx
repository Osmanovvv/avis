import { useRef, useEffect, useState, useCallback } from "react";
import FadeIn from "@/components/FadeIn";
import { CheckCircle2, CheckCircle, FileText, Shield, Mail, ArrowRight, Phone, Send, ChevronDown } from "lucide-react";
import SolutionsCatalog from "@/components/SolutionsCatalog";
import VideoSection from "@/components/VideoSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCountUp, useStaggerReveal } from "@/hooks/use-animations";
import SEO from "@/components/SEO";
import { useContent } from "@/hooks/use-content";
import { useSettings } from "@/hooks/use-settings";

const defaultTrustStats: Array<{ value: string; label: string }> = [
  { value: "200+", label: "Объектов защищено" },
  { value: "12", label: "Лет опыта" },
  { value: "5", label: "Типов решений" },
  { value: "100%", label: "Гарантия качества" },
];

function parseStatValue(value: string): { num: number; prefix: string; suffix: string } {
  const match = value.match(/^([^\d]*)(\d+)(.*)$/);
  if (!match) return { num: 0, prefix: "", suffix: "" };
  return { num: parseInt(match[2], 10), prefix: match[1] || "", suffix: match[3] || "" };
}

/* ── Animated stat card ── */
const StatCard = ({ value, label, isLast }: { value: string; label: string; isLast?: boolean }) => {
  const { num, prefix, suffix } = parseStatValue(value);
  const isNumeric = num > 0;
  const isMobile = useIsMobile();
  const { count, ref } = useCountUp({
    end: num,
    duration: num > 100 ? 1500 : 1000,
    enabled: isNumeric,
  });

  return (
    <div
      ref={ref}
      className="text-center"
      style={{
        padding: isMobile ? "28px 16px" : "40px 24px",
        borderRight: !isLast ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div
        style={{
          fontSize: isMobile ? "1.8rem" : "2.2rem",
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {isNumeric ? `${prefix}${count}${suffix}` : value}
      </div>
      <div style={{ fontSize: 12, color: "#7a8394", marginTop: 6 }}>
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
          poster="/hero-poster.webp"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: isMobile ? "brightness(0.3) saturate(0.35)" : "brightness(0.32) saturate(0.35)" }}
          preload="none"
        >
          <source src="/hero-video.webm" type="video/webm" />
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
                fontSize: isMobile ? 36 : "clamp(4rem, 6.5vw, 6.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                fontWeight: 900,
                color: "#ffffff",
                textTransform: "uppercase",
              }}
            >
              {heroData?.line1 || <>ЗАЩИТА<br />ОБЪЕКТОВ ОТ<br />БПЛА</>}
            </span>
          </h1>
        </FadeIn>

        {heroData?.subtitle && (
          <FadeIn delay={0.1}>
            <div
              className="flex items-center justify-center gap-3"
              style={{
                marginTop: isMobile ? 16 : 24,
                fontSize: isMobile ? 14 : "clamp(1.1rem, 2vw, 1.5rem)",
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "#4a7fa5",
              }}
            >
              {heroData.subtitle.split("·").map((part, i, arr) => (
                <span key={i} style={{ display: "contents" }}>
                  <span>{part.trim()}</span>
                  {i < arr.length - 1 && <span style={{ color: "#4a4e5a" }}>·</span>}
                </span>
              ))}
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0.15}>
          <div
            className={`flex ${isMobile ? "flex-col gap-[10px]" : "flex-wrap justify-center gap-x-6 gap-y-2"}`}
            style={{ marginTop: isMobile ? 20 : 28 }}
          >
            {features.map((text, i) => text && (
              <div key={i} className="flex items-center gap-2" style={{ fontSize: isMobile ? 12 : 14, color: "rgba(255,255,255,0.85)" }}>
                <CheckCircle size={14} style={{ color: "#4a7fa5", flexShrink: 0 }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.25} className={isMobile ? "w-full" : ""}>
          <div
            className={isMobile ? "flex flex-col gap-3 w-full" : "flex gap-4 justify-center"}
            style={{ marginTop: isMobile ? 28 : 40 }}
          >
            <a
              href={telHref}
              className="hero-cta-pulse inline-flex items-center justify-center gap-2.5 relative overflow-hidden"
              style={{
                width: isMobile ? "100%" : 260,
                height: 52,
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.06em",
                background: "#f5a623",
                color: "#000000",
                textDecoration: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 28px",
              }}
            >
              <Phone size={16} />
              Запросить аудит
              <ArrowRight size={16} />
            </a>
            <a
              href={tgHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 transition-all duration-200"
              style={{
                width: isMobile ? "100%" : 200,
                height: 52,
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.06em",
                background: "rgba(255,255,255,0.08)",
                color: "#ffffff",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.25)",
                cursor: "pointer",
                padding: "0 28px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ffffff";
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }}
            >
              <Send size={16} />
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
const allClients: string[] = [];
for (let i = 0; i < Math.max(clientsCol1.length, clientsCol2.length); i++) {
  if (clientsCol1[i]) allClients.push(clientsCol1[i]);
  if (clientsCol2[i]) allClients.push(clientsCol2[i]);
}

const certificates = [
  { name: "СРО", href: "/documents/sro-avis.pdf" },
  { name: "Свидетельство НАЛ", href: "/documents/nalog-uchet.pdf" },
  { name: "Свидетельство ГРН", href: "/documents/grn.pdf" },
  { name: "ISO 14001", href: "/documents/iso-14001.pdf" },
  { name: "ISO 9001", href: "/documents/iso-9001.pdf" },
  { name: "ISO 45001", href: "/documents/iso-45001.pdf" },
];

/* ── Client row component ── */
const ClientRow = ({ name, isMobile }: { name: string; isMobile?: boolean }) => (
  <div
    className="flex items-center gap-3"
    style={{
      padding: isMobile ? "12px 0" : "14px 0",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      fontSize: isMobile ? 13 : 14,
      color: "#b0bac8",
    }}
  >
    <span style={{ color: "#4a7fa5", fontSize: 8, flexShrink: 0 }}>●</span>
    {name}
  </div>
);

/* ── Trust section ── */
const TrustSection = ({ stats, email }: { stats: Array<{ value: string; label: string }>; email?: string }) => {
  const { containerRef, revealed } = useStaggerReveal();
  const isMobile = useIsMobile();
  const [showAllClients, setShowAllClients] = useState(false);

  const visibleClients = isMobile && !showAllClients ? allClients.slice(0, 6) : allClients;
  const hiddenCount = allClients.length - 6;

  return (
    <>
    <section style={{ background: "#0d0f12", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div
        ref={containerRef}
        className="mx-auto grid grid-cols-2 lg:grid-cols-4 gap-0"
        style={{ maxWidth: 1200 }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label + i}
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(24px)",
              transition: `opacity 0.5s cubic-bezier(0.25,0.46,0.45,0.94) ${i * (isMobile ? 40 : 80)}ms, transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94) ${i * (isMobile ? 40 : 80)}ms`,
            }}
          >
            <StatCard value={stat.value} label={stat.label} isLast={i === stats.length - 1} />
          </div>
        ))}
      </div>
    </section>

    <section style={{ background: "#0d0f12", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div
        className="mx-auto"
        style={{
          maxWidth: 1200,
          padding: isMobile ? "48px 20px" : "64px 40px",
        }}
      >
        {/* ── Clients ── */}
        <div>
          <h3
            style={{
              fontSize: "0.6875rem",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#4a7fa5",
              margin: 0,
              marginBottom: isMobile ? 24 : 32,
              fontWeight: 600,
            }}
          >
            Наши заказчики
          </h3>

          <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-0`}>
            {visibleClients.map((c) => (
              <ClientRow key={c} name={c} isMobile={isMobile} />
            ))}
          </div>
          {isMobile && !showAllClients && hiddenCount > 0 && (
            <button
              onClick={() => setShowAllClients(true)}
              style={{
                marginTop: 16,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                color: "#4a7fa5",
                letterSpacing: "0.1em",
              }}
            >
              Показать все ↓
            </button>
          )}
        </div>

        {/* ── Certificates ── */}
        <div style={{ marginTop: isMobile ? 48 : 64 }}>
          <h3
            style={{
              fontSize: "0.6875rem",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#4a7fa5",
              margin: 0,
              marginBottom: isMobile ? 16 : 24,
              fontWeight: 600,
            }}
          >
            Сертификаты и документы
          </h3>

          <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-6"} gap-3`}>
            {certificates.map((cert) => (
              <a
                key={cert.name}
                href={cert.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg transition-colors duration-200 hover:border-[rgba(74,127,165,0.4)]"
                style={{
                  padding: isMobile ? "14px 12px" : "16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  textDecoration: "none",
                }}
              >
                <Shield size={16} style={{ color: "#4a7fa5", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#c0cdd8" }}>{cert.name}</div>
                  <div style={{ fontSize: 11, color: "#4a7fa5", marginTop: 2 }}>Открыть PDF</div>
                </div>
              </a>
            ))}
          </div>

          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2"
              style={{ marginTop: isMobile ? 32 : 40, fontSize: 13, color: "#7a8394", textDecoration: "none" }}
            >
              <Mail size={14} style={{ color: "#4a7fa5" }} />
              {email}
            </a>
          )}
        </div>
      </div>
    </section>
    </>
  );
};

const LeadFormSection = ({ telHref, tgHref }: { telHref: string; tgHref: string }) => {
  const isMobile = useIsMobile();
  return (
    <section style={{ background: "#090b0e", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div
        className="mx-auto text-center"
        style={{ maxWidth: 640, padding: isMobile ? "56px 20px" : "80px 40px" }}
      >
        <FadeIn>
          <h2
            style={{
              fontSize: isMobile ? "1.5rem" : "clamp(1.8rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Бесплатный аудит объекта
          </h2>
          <p style={{ fontSize: 14, color: "#7a8394", marginTop: 12, lineHeight: 1.6 }}>
            Оценим угрозы и{"\u00a0"}предложим оптимальное решение защиты вашего объекта от{"\u00a0"}БПЛА
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div
            className={`flex ${isMobile ? "flex-col" : "flex-row"} items-center justify-center gap-3`}
            style={{ marginTop: 32 }}
          >
            <a
              href={telHref}
              className="hero-cta-pulse inline-flex items-center justify-center gap-2.5 font-semibold"
              style={{
                width: isMobile ? "100%" : 240,
                height: 52,
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.06em",
                background: "#f5a623",
                color: "#000000",
                textDecoration: "none",
              }}
            >
              <Phone size={16} />
              ПОЗВОНИТЬ
            </a>
            <a
              href={tgHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 font-semibold transition-colors duration-200"
              style={{
                width: isMobile ? "100%" : 240,
                height: 52,
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.06em",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#c0cdd8",
                textDecoration: "none",
              }}
            >
              <Send size={16} />
              TELEGRAM
            </a>
          </div>
        </FadeIn>
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
      <TrustSection stats={content?.stats?.length && content.stats.some((s) => s.value) ? content.stats : defaultTrustStats} email={content?.contacts?.email || settings?.email || ""} />
      <VideoSection />
      <LeadFormSection telHref={telHref} tgHref={tgHref} />
    </div>
  );
};

export default Index;
