import { useState } from "react";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import ServiceModal from "@/components/ServiceModal";
import { catalogServices, type CatalogService } from "@/data/servicesCatalog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useStaggerReveal } from "@/hooks/use-animations";

const SolutionsCatalog = () => {
  const [selectedService, setSelectedService] = useState<CatalogService | null>(null);
  const isMobile = useIsMobile();
  const { containerRef, revealed } = useStaggerReveal();

  return (
    <>
      <section>
        <div className="px-5 md:px-10 lg:container pt-10 pb-10 lg:pt-[120px] lg:pb-[120px]">
          <FadeIn direction="left">
            <div className="mb-4 lg:mb-6">
              <h2 style={{ fontSize: isMobile ? "clamp(1.8rem, 8vw, 2.4rem)" : undefined }}>Наши решения</h2>
            </div>
            <p className="mb-8 lg:mb-16" style={{ fontSize: isMobile ? 14 : "0.9375rem", color: "#7a8394", maxWidth: isMobile ? "100%" : 480, lineHeight: 1.65 }}>
              Комплексная защита объектов от{"\u00a0"}БПЛА и{"\u00a0"}наземных угроз
            </p>
          </FadeIn>

          <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {catalogServices.map((service, i) => (
              <div
                key={service.id}
                className="catalog-card-wrapper"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 0.5s ease ${i * (isMobile ? 40 : 80)}ms, transform 0.5s ease ${i * (isMobile ? 40 : 80)}ms`,
                  willChange: revealed ? "auto" : "opacity, transform",
                }}
              >
                <button
                  onClick={() => setSelectedService(service)}
                  className="catalog-card group relative block overflow-hidden rounded-xl w-full text-left cursor-pointer"
                  style={{ aspectRatio: isMobile ? "16/9" : "4/3" }}
                >
                  <img
                    src={service.cardImage}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Bottom gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
                  {/* Hover border */}
                  <div className="absolute inset-0 rounded-xl border border-transparent transition-colors duration-300 group-hover:border-[rgba(212,160,23,0.4)]" />
                  {/* Top label */}
                  <span
                    className="absolute top-3 left-3 px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-wide line-clamp-1"
                    style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", color: "#c0cdd8" }}
                  >
                    {service.shortDesc}
                  </span>
                  {/* Bottom content */}
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex items-end justify-between">
                    <span className="flex-1 pr-3 text-white font-semibold" style={{ fontSize: isMobile ? "1.1rem" : "1.15rem", letterSpacing: "0.01em" }}>
                      {service.title}
                    </span>
                    <div
                      className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full border transition-colors duration-300 group-hover:border-gold group-hover:text-gold"
                      style={{ borderColor: "rgba(74,127,165,0.5)", color: "rgba(74,127,165,0.8)" }}
                    >
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceModal
        service={selectedService}
        open={!!selectedService}
        onClose={() => setSelectedService(null)}
      />

      <style>{`
        .catalog-card {
          transform: translateZ(0);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        @media (hover: hover) {
          .catalog-card:hover {
            transform: translateY(-4px) translateZ(0);
            box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,160,23,0.3);
          }
        }
      `}</style>
    </>
  );
};

export default SolutionsCatalog;
