import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/FadeIn";
import { ArrowRight } from "lucide-react";
import { catalog, type Category, type Product } from "@/data/catalog";
import SEO from "@/components/SEO";

/* Placeholder icon SVG */
const PlaceholderIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-10">
    <path d="M24 4L42 14V34L24 44L6 34V14L24 4Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M24 4V44" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <path d="M6 14L42 34" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <path d="M42 14L6 34" stroke="currentColor" strokeWidth="1" opacity="0.3" />
  </svg>
);

/* Product card */
const ProductCard = ({ product }: { product: Product }) => (
  <div
    data-product-id={product.id}
    className="group flex flex-col overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-[2px] hover:shadow-card-hover"
    style={{
      background: "hsl(var(--card))",
      border: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden" style={{ background: "hsl(var(--card))" }}>
      {product.image ? (
        <img
          src={product.image}
          srcSet={product.image1x ? `${product.image1x} 1x, ${product.image} 2x` : undefined}
          alt={product.name}
          className="w-full h-full object-cover card-img-industrial"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <PlaceholderIcon />
      )}
    </div>
    <div className="flex flex-1 flex-col gap-1.5 p-7">
      <h3 className="text-[17px] font-medium normal-case" style={{ color: "#e8eaf0", letterSpacing: "0" }}>{product.name}</h3>
      <p className="text-[13px] line-clamp-1" style={{ color: "#6b7280" }}>{product.description}</p>
      <Link
        to="/contacts"
        className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[12px] uppercase tracking-[0.08em] text-highlight transition-colors hover:text-foreground"
      >
        Запросить расчёт <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  </div>
);

const Solutions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const setCategory = (id: string) => {
    if (id === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: id });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredCategories = activeCategory === "all"
    ? catalog
    : catalog.filter((c) => c.id === activeCategory);

  return (
    <div>
      <SEO
        title="Каталог средств защиты от БПЛА — антидроновые сетки, ограждения | АВИС"
        description="Антидроновые сетки, бетонные ограждения, защитные шторы, роллеты, убежища. Изготовление от 5 дней, гарантия 3 года."
        path="/solutions"
      />
      {/* Header */}
      <section className="bg-grid">
        <div className="container py-16 lg:py-32">
          <FadeIn>
            <h1 className="font-extralight">Каталог решений</h1>
            <p className="mt-3 max-w-[480px] text-[14px] mb-8" style={{ color: "#6b7280" }}>
              Инженерная защита объектов. Полный цикл от проектирования до монтажа
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section>
        <div className="container py-16 lg:py-32">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar — desktop */}
            <aside className="hidden lg:block w-[220px] flex-shrink-0">
              <div className="sticky top-[90px] space-y-1">
                <button
                  onClick={() => setCategory("all")}
                  className="w-full text-left px-3 py-2 text-[13px] leading-[1.8] transition-colors"
                  style={activeCategory === "all"
                    ? { color: "#c0cdd8", borderLeft: "2px solid #4a7fa5", paddingLeft: "10px" }
                    : { color: "#6b7280", borderLeft: "2px solid transparent", paddingLeft: "10px" }
                  }
                  onMouseEnter={(e) => { if (activeCategory !== "all") e.currentTarget.style.color = "#9ca3af"; }}
                  onMouseLeave={(e) => { if (activeCategory !== "all") e.currentTarget.style.color = "#6b7280"; }}
                >
                  Все категории
                </button>
                {catalog.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className="w-full text-left px-3 py-2 text-[13px] leading-[1.8] transition-colors"
                    style={activeCategory === cat.id
                      ? { color: "#c0cdd8", borderLeft: "2px solid #4a7fa5", paddingLeft: "10px" }
                      : { color: "#6b7280", borderLeft: "2px solid transparent", paddingLeft: "10px" }
                    }
                    onMouseEnter={(e) => { if (activeCategory !== cat.id) e.currentTarget.style.color = "#9ca3af"; }}
                    onMouseLeave={(e) => { if (activeCategory !== cat.id) e.currentTarget.style.color = "#6b7280"; }}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            </aside>

            {/* Mobile filter tabs */}
            <div className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-2">
                <button
                  onClick={() => setCategory("all")}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-[0.08em] transition-colors
                    ${activeCategory === "all"
                      ? "bg-highlight/20 text-highlight"
                      : "text-muted-foreground"}`}
                  style={{ border: `1px solid ${activeCategory === "all" ? "hsl(var(--highlight))" : "rgba(255,255,255,0.08)"}` }}
                >
                  Все
                </button>
                {catalog.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-[0.08em] transition-colors
                      ${activeCategory === cat.id
                        ? "bg-highlight/20 text-highlight"
                        : "text-muted-foreground"}`}
                    style={{ border: `1px solid ${activeCategory === cat.id ? "hsl(var(--highlight))" : "rgba(255,255,255,0.08)"}` }}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Product grid */}
            <div className="flex-1">
              {filteredCategories.map((cat, gi) => (
                <div key={cat.id} className={gi > 0 ? "mt-10" : ""}>
                  {(activeCategory === "all") && (
                    <FadeIn>
                      <h2 className="text-xl md:text-[1.375rem] mb-4">{cat.title}</h2>
                    </FadeIn>
                  )}
                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {cat.products.map((p, pi) => (
                      <FadeIn key={p.id} delay={pi * 0.04}>
                        <ProductCard product={p} />
                      </FadeIn>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="container py-16 lg:py-32 text-center">
          <FadeIn>
            <p className="text-muted-foreground mb-4 text-[14px]">
              Не нашли подходящее решение? Мы спроектируем индивидуальную систему защиты.
            </p>
            <Link to="/contacts">
              <Button variant="hero" size="lg">
                Обсудить проект <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default Solutions;
