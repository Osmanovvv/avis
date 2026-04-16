import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import SEO from "@/components/SEO";
import RequestModal from "@/components/RequestModal";
import { useContent } from "@/hooks/use-content";
import { useCategories } from "@/hooks/use-categories";

interface ProductCard {
  name?: string;
  description?: string;
  shortDesc?: string;
  image?: string;
  slug?: string;
  category?: string;
  featured?: boolean;
}

const EliteSubCard = ({
  card,
  catLabel,
  index,
  isMobile,
  onRequestClick,
}: {
  card: ProductCard;
  catLabel: string;
  index: number;
  isMobile: boolean;
  onRequestClick: (title: string) => void;
}) => {
  const navigate = useNavigate();
  const slug = card.slug || "";
  const title = card.name || "";
  const desc = card.shortDesc || card.description || "";

  return (
    <div
      onClick={() => slug && navigate(`/solutions/${slug}`)}
      className="relative overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
      style={{
        width: "100%",
        height: isMobile ? 280 : 320,
        borderRadius: 20,
        animation: `catalogFadeIn 0.3s ease ${index * 40}ms both`,
      }}
    >
      {card.image ? (
        <img
          src={card.image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a2535, #0d1118)", zIndex: 0 }} />
      )}
      <div
        className="absolute inset-0"
        style={{ zIndex: 1, background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.1) 100%)" }}
      />
      <div className="absolute bottom-0 left-0 right-0" style={{ zIndex: 2, padding: 20 }}>
        <span
          style={{
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.55)",
            marginBottom: 6,
            display: "block",
          }}
        >
          {catLabel}
        </span>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.3,
            marginBottom: 6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.5,
            marginBottom: 12,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {desc}
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRequestClick(title);
            }}
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#f5a623",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ArrowRight size={14} style={{ color: "#000" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterChip = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
  <button
    onClick={onClick}
    className="flex-shrink-0 transition-all duration-200 whitespace-nowrap"
    style={{
      display: "inline-block",
      background: active ? "rgba(74,127,165,0.2)" : "rgba(255,255,255,0.05)",
      color: active ? "#ffffff" : "#c0cdd8",
      border: `1px solid ${active ? "#4a7fa5" : "rgba(255,255,255,0.1)"}`,
      borderRadius: 20,
      padding: "6px 14px",
      fontSize: 12,
      cursor: "pointer",
    }}
  >
    {label}
  </button>
);

const SidebarBtn = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
  <button
    onClick={onClick}
    className="text-left px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200"
    style={{
      background: active ? "rgba(74,127,165,0.1)" : "transparent",
      color: active ? "#c0cdd8" : "#6b7280",
      borderLeft: active ? "2px solid #4a7fa5" : "2px solid transparent",
    }}
  >
    {label}
  </button>
);

const Solutions = () => {
  const isMobile = useIsMobile();
  const { content } = useContent();
  const categories = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [activeFilter, setActiveFilterState] = useState<string | null>(
    initialCategory && categories.some((c) => c.id === initialCategory) ? initialCategory : null
  );

  const setActiveFilter = (id: string | null) => {
    setActiveFilterState(id);
    if (id) {
      setSearchParams({ category: id }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && categories.some((c) => c.id === cat)) {
      setActiveFilterState(cat);
    } else if (!cat) {
      setActiveFilterState(null);
    }
  }, [searchParams, categories]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const products: ProductCard[] = useMemo(() => {
    return (content?.products || []).filter((p: any) => p && (p.name?.trim() || p.image?.trim()));
  }, [content?.products]);

  const activeCat = categories.find((c) => c.id === activeFilter);

  const visibleCategories = useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        products: products.filter((p) => p.category === cat.id),
      }))
      .filter((cat) => cat.products.length > 0);
  }, [products, categories]);

  const openModal = (title: string) => {
    setModalTitle(title);
    setModalOpen(true);
  };

  return (
    <div>
      <SEO
        title="Каталог услуг по защите от БПЛА | АВИС"
        description="Каталог: антидроновые сетки, полиамидные сетки, защита зданий, ограждения, убежища, проектирование. Изготовление от 5 дней."
        keywords="средства защиты от бпла, антидроновые сетки, защита зданий от бпла, каталог защиты от дронов"
        path="/solutions"
      />
      <RequestModal open={modalOpen} onClose={() => setModalOpen(false)} subcategoryTitle={modalTitle} />

      {/* Header */}
      <section className="bg-grid">
        <div className="container" style={{ padding: isMobile ? "48px 20px 24px" : "80px 40px 40px" }}>
          <FadeIn>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)", fontWeight: 800 }}>Каталог решений</h1>
            <p className="mt-3" style={{ color: "#4a7fa5", fontSize: isMobile ? "0.875rem" : "1rem", maxWidth: isMobile ? "100%" : 480 }}>
              Инженерная защита объектов{"\u00a0"}от{"\u00a0"}БПЛА. Полный цикл.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main */}
      <section style={{ background: "#090b0e" }}>
        <div className="container" style={{ padding: isMobile ? "24px 16px 48px" : "48px 40px 80px" }}>
          <div className={isMobile ? "flex flex-col gap-6" : "flex gap-10"}>
            <nav
              className={
                isMobile
                  ? "flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
                  : "w-[220px] flex-shrink-0 sticky top-[100px] self-start"
              }
              style={isMobile ? { padding: "12px 16px", whiteSpace: "nowrap" } : undefined}
            >
              {isMobile ? (
                <>
                  <FilterChip active={activeFilter === null} onClick={() => setActiveFilter(null)} label="Все услуги" />
                  {categories.map((cat) => (
                    <FilterChip key={cat.id} active={activeFilter === cat.id} onClick={() => setActiveFilter(cat.id)} label={cat.label} />
                  ))}
                </>
              ) : (
                <div className="flex flex-col gap-1">
                  <SidebarBtn active={activeFilter === null} onClick={() => setActiveFilter(null)} label="Все услуги" />
                  {categories.map((cat) => (
                    <SidebarBtn key={cat.id} active={activeFilter === cat.id} onClick={() => setActiveFilter(cat.id)} label={cat.label} />
                  ))}
                </div>
              )}
            </nav>

            <div className="flex-1" key={activeFilter || "all"} style={{ animation: "catalogFadeIn 0.2s ease" }}>
              {activeCat ? (
                <>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "#4a7fa5", margin: "0 0 12px", fontWeight: 600 }}>
                    {activeCat.label}
                  </div>
                  {products.filter((p) => p.category === activeCat.id).length > 0 ? (
                    <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-[14px]`}>
                      {products
                        .filter((p) => p.category === activeCat.id)
                        .map((card, i) => (
                          <EliteSubCard
                            key={`${activeCat.id}-${i}`}
                            card={card}
                            catLabel={activeCat.label}
                            index={i}
                            isMobile={isMobile}
                            onRequestClick={openModal}
                          />
                        ))}
                    </div>
                  ) : (
                    <p style={{ color: "#6b7280", fontSize: 14 }}>
                      В этой категории пока нет карточек. Добавьте их через админку.
                    </p>
                  )}
                </>
              ) : visibleCategories.length > 0 ? (
                visibleCategories.map((cat) => (
                  <div key={cat.id}>
                    <div
                      style={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "#4a7fa5",
                        margin: "24px 0 12px",
                        fontWeight: 600,
                      }}
                    >
                      {cat.label}
                    </div>
                    <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-[14px]`}>
                      {cat.products.map((card, i) => (
                        <EliteSubCard
                          key={`${cat.id}-${i}`}
                          card={card}
                          catLabel={cat.label}
                          index={i}
                          isMobile={isMobile}
                          onRequestClick={openModal}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#6b7280", fontSize: 14 }}>
                  Карточки ещё не заведены. Добавьте их в админке и проставьте категорию.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="container text-center" style={{ padding: isMobile ? "48px 20px" : "80px 40px" }}>
          <FadeIn>
            <h2 style={{ fontSize: isMobile ? "1.25rem" : "1.5rem", fontWeight: 700, color: "#e8eaf0", marginBottom: 12 }}>
              Не знаете, какое решение вам подходит?
            </h2>
            <p style={{ fontSize: isMobile ? "0.875rem" : "0.9375rem", color: "#6b7280", marginBottom: 28 }}>
              Аудит объекта бесплатно. Оценим риски и предложим решение.
            </p>
            <Link
              to="/contacts"
              className="btn-gold inline-flex items-center justify-center gap-2 rounded-md font-semibold"
              style={{ width: isMobile ? "100%" : 260, height: 56, fontSize: "0.875rem", letterSpacing: "0.04em" }}
            >
              Запросить аудит <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      <style>{`
        @keyframes catalogFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Solutions;
