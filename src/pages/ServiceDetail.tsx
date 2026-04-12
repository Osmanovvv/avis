import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, Send } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import SEO from "@/components/SEO";
import { getServiceBySlug } from "@/data/services";
import NotFound from "./NotFound";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) return <NotFound />;

  return (
    <>
      <SEO title={`${service.h1} — АВИС`} description={service.description.slice(0, 155)} path={`/solutions/${service.slug}`} />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[340px] md:h-[56vh] overflow-hidden">
        <img
          src={service.heroImage}
          alt={service.h1}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.35) saturate(0.5)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(8,10,14,0.95) 100%)" }}
        />
        <div className="relative z-10 h-full flex flex-col justify-end px-5 md:px-[6vw] pb-10 md:pb-14">
          <FadeIn>
            <Link
              to="/solutions"
              className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.1em] mb-4 transition-colors"
              style={{ color: "#6b7280" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c0cdd8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Назад к каталогу
            </Link>
            <h1
              style={{
                fontSize: "clamp(24px, 3.2vw, 44px)",
                fontWeight: 200,
                color: "#d4dae2",
                letterSpacing: "0.01em",
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {service.h1}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Description */}
      <section style={{ background: "#090b0e" }} className="px-5 md:px-[6vw] py-14 md:py-20">
        <FadeIn>
          <div className="max-w-3xl">
            {service.description.split("\n\n").map((p, i) => (
              <p
                key={i}
                className="mb-4 last:mb-0"
                style={{ fontSize: 15, lineHeight: 1.75, color: "#8a95a5" }}
              >
                {p}
              </p>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Materials */}
      <section style={{ background: "#080a0d" }} className="px-5 md:px-[6vw] py-14 md:py-20">
        <FadeIn>
          <h2
            className="mb-10 md:mb-14"
            style={{
              fontSize: "clamp(18px, 2vw, 28px)",
              fontWeight: 300,
              color: "#c0cdd8",
              letterSpacing: "0.02em",
            }}
          >
            Применяемые материалы
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {service.materials.map((mat, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div
                className="rounded-lg overflow-hidden h-full flex flex-col"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {mat.photo && (
                  <div className="relative h-[180px] md:h-[200px] overflow-hidden">
                    <img
                      src={mat.photo}
                      alt={mat.name}
                      className="w-full h-full object-cover"
                      style={{ filter: "brightness(0.6) saturate(0.5)" }}
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3
                    style={{ fontSize: 15, fontWeight: 500, color: "#c0cdd8", margin: 0 }}
                  >
                    {mat.name}
                  </h3>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "#6b7280", margin: 0 }}>
                    {mat.specs}
                  </p>
                  {mat.badge && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {mat.badge.split(" · ").map((b) => (
                        <span
                          key={b}
                          className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-[0.06em]"
                          style={{
                            background: "rgba(74,127,165,0.12)",
                            color: "#4a7fa5",
                            border: "1px solid rgba(74,127,165,0.2)",
                          }}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* How we work */}
      <section style={{ background: "#090b0e" }} className="px-5 md:px-[6vw] py-14 md:py-20">
        <FadeIn>
          <h2
            className="mb-10 md:mb-14"
            style={{
              fontSize: "clamp(18px, 2vw, 28px)",
              fontWeight: 300,
              color: "#c0cdd8",
              letterSpacing: "0.02em",
            }}
          >
            Как мы работаем
          </h2>
        </FadeIn>

        <div className="flex flex-col md:flex-row gap-6 md:gap-0">
          {service.steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="flex md:flex-1 items-start gap-4 md:gap-0 md:flex-col">
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: 11, color: "#4a7fa5", letterSpacing: "0.06em" }}>
                    {step.num}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 500, color: "#c0cdd8" }}>
                    {step.title}
                  </span>
                  <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, margin: 0, marginTop: 4 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
              {/* Arrow between steps on desktop */}
              {i < service.steps.length - 1 && (
                <span
                  className="hidden md:inline-block self-center mx-6 mt-4"
                  style={{ fontSize: 16, color: "#2a3040" }}
                >
                  →
                </span>
              )}
              {/* Divider on mobile */}
              {i < service.steps.length - 1 && (
                <div
                  className="md:hidden ml-1"
                  style={{ width: 2, height: 16, background: "#2a3040", margin: "4px 0" }}
                />
              )}
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#080a0d" }} className="px-5 md:px-[6vw] py-14 md:py-20">
        <FadeIn>
          <div className="text-center">
            <h2
              style={{
                fontSize: "clamp(20px, 2.4vw, 34px)",
                fontWeight: 200,
                color: "#d4dae2",
                letterSpacing: "0.02em",
                margin: 0,
              }}
            >
              Запросить расчёт по этой услуге
            </h2>
            <p className="mt-3" style={{ fontSize: 14, color: "#6b7280" }}>
              Свяжитесь удобным способом. Ответим в течение 2 часов.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8">
              <a
                href="tel:+70000000000"
                className="btn-gold inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-md"
                style={{
                  padding: "0 36px",
                  height: 52,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  whiteSpace: "nowrap",
                }}
              >
                <Phone size={16} /> ПОЗВОНИТЬ
              </a>
              <a
                href="https://t.me/username"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-md transition-all duration-200"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(74,127,165,0.4)",
                  color: "#c0cdd8",
                  padding: "0 36px",
                  height: 52,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#4a7fa5";
                  e.currentTarget.style.background = "rgba(74,127,165,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(74,127,165,0.4)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Send size={16} style={{ color: "#4a7fa5" }} /> НАПИСАТЬ В TELEGRAM
              </a>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
};

export default ServiceDetail;
