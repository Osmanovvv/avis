import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import { ArrowRight } from "lucide-react";
import SolutionsCatalog from "@/components/SolutionsCatalog";
import { useIsMobile } from "@/hooks/use-mobile";
import SEO from "@/components/SEO";

const Solutions = () => {
  const isMobile = useIsMobile();

  return (
    <div>
      <SEO
        title="Средства защиты от БПЛА: каталог решений | АВИС"
        description="Каталог: антидроновые сетки, бетонные ограждения, защитные шторы, роллеты, убежища. Защита зданий и резервуаров от БПЛА. Изготовление от 5 дней."
        keywords="средства защиты от бпла, антидроновые сетки, защита зданий от бпла, защита резервуаров от бпла"
        path="/solutions"
      />

      {/* Header */}
      <section className="bg-grid">
        <div
          className="container"
          style={{
            padding: isMobile ? "48px 20px 32px" : "80px 40px 48px",
          }}
        >
          <FadeIn>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)", fontWeight: 800 }}>
              Услуги
            </h1>
            <p
              className="mt-3"
              style={{
                color: "#4a7fa5",
                fontSize: isMobile ? "0.875rem" : "1rem",
                maxWidth: isMobile ? "100%" : 480,
              }}
            >
              Инженерная защита объектов{"\u00a0"}от{"\u00a0"}БПЛА. Полный цикл.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Reuse exact same card grid + modals from home page */}
      <SolutionsCatalog />

      {/* Bottom CTA */}
      <section style={{ background: "rgba(255,255,255,0.02)" }}>
        <div
          className="container text-center"
          style={{ padding: isMobile ? "48px 20px" : "80px 40px" }}
        >
          <FadeIn>
            <h2
              style={{
                fontSize: isMobile ? "1.25rem" : "1.5rem",
                fontWeight: 700,
                color: "#e8eaf0",
                marginBottom: 12,
              }}
            >
              Не знаете, какое решение вам подходит?
            </h2>
            <p
              style={{
                fontSize: isMobile ? "0.875rem" : "0.9375rem",
                color: "#6b7280",
                marginBottom: 28,
              }}
            >
              Аудит объекта бесплатно. Оценим риски и предложим решение.
            </p>
            <Link
              to="/contacts"
              className="btn-gold inline-flex items-center justify-center gap-2 rounded-md font-semibold"
              style={{
                width: isMobile ? "100%" : 260,
                height: 56,
                fontSize: "0.875rem",
                letterSpacing: "0.04em",
              }}
            >
              Запросить аудит <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default Solutions;
