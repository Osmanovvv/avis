import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowRight, Phone, Send, Home } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import SEO from "@/components/SEO";
import RequestModal from "@/components/RequestModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useContent } from "@/hooks/use-content";
import { useCategories } from "@/hooks/use-categories";
import NotFound from "./NotFound";

function slugifyRu(input: string): string {
  const m: Record<string, string> = {
    а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",
    с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
  };
  return (input || "").toLowerCase().trim()
    .split("").map((c) => (/[a-z0-9\s-]/.test(c) ? c : (m[c] ?? ""))).join("")
    .replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { content } = useContent();
  const categories = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const openModal = (title: string) => { setModalTitle(title); setModalOpen(true); };

  const categoryIdx = categories.findIndex((c) => c.slug === slug);
  const category = categoryIdx >= 0 ? categories[categoryIdx] : null;

  const cards = useMemo(() => {
    if (!category) return [];
    return (content?.products || []).filter((p: any) => p && p.category === category.id && p.name?.trim());
  }, [content?.products, category]);

  const cPhone = content?.contacts?.phone || "";
  const cTelHref = cPhone ? `tel:${cPhone.replace(/[^+\d]/g, "")}` : "#";
  const cTgUser = (content?.contacts?.telegram || "").replace(/^@/, "");
  const cTgHref = cTgUser ? `https://t.me/${cTgUser}` : "#";

  if (!category) return <NotFound />;

  const badge = String(categoryIdx + 1).padStart(2, "0");
  const heroImage = category.image || cards.find((c: any) => c.image)?.image || "";

  return (
    <div>
      <SEO
        title={`${category.label} — АВИС`}
        description={`Услуги по направлению «${category.label}». Бесплатный аудит и расчёт.`}
        path={`/solutions/category/${category.slug}`}
      />
      <RequestModal open={modalOpen} onClose={() => setModalOpen(false)} subcategoryTitle={modalTitle} />

      {/* HERO */}
      <section className="relative overflow-hidden flex items-end" style={{ height: isMobile ? 300 : 520 }}>
        {heroImage && (
          <img src={heroImage} alt={category.label} className="absolute inset-0 w-full h-full object-cover" loading="eager" style={{ objectPosition: "center" }} />
        )}
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />
        <div className="relative z-10 w-full" style={{ padding: isMobile ? "0 20px 24px" : "0 6vw 32px" }}>
          <nav className="flex items-center gap-1.5 mb-4" style={{ fontSize: isMobile ? 11 : 12 }}>
            {isMobile ? (
              <>
                <Link to="/" style={{ color: "#4a7fa5" }}><Home size={13} /></Link>
                <span style={{ color: "#4a4e5a" }}>&rsaquo;</span>
                <span style={{ color: "#7a8394" }}>{category.label}</span>
              </>
            ) : (
              <>
                <Link to="/" className="hover:underline" style={{ color: "#4a7fa5" }}>Главная</Link>
                <span style={{ color: "#4a4e5a" }}>&rsaquo;</span>
                <Link to="/solutions" className="hover:underline" style={{ color: "#4a7fa5" }}>Каталог</Link>
                <span style={{ color: "#4a4e5a" }}>&rsaquo;</span>
                <span style={{ color: "#7a8394" }}>{category.label}</span>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3 mb-2">
            <span
              className="inline-flex items-center justify-center rounded-md text-[11px] font-medium"
              style={{ minWidth: 32, height: 24, padding: "0 8px", border: "1px solid #4a7fa5", color: "#4a7fa5" }}
            >
              {badge}
            </span>
            <h1 style={{ fontSize: isMobile ? "clamp(1.8rem, 7vw, 3rem)" : "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#ffffff", margin: 0, lineHeight: 1.1 }}>
              {category.label}
            </h1>
          </div>
        </div>
      </section>

      {category.shortDesc && (
        <section style={{ padding: isMobile ? "32px 16px 0" : "48px 40px 0", marginBottom: isMobile ? 32 : 48 }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a7fa5" }}>
              Описание
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>
          <p style={{ fontSize: isMobile ? 15 : 17, color: "#c0cdd8", margin: 0, lineHeight: 1.55, paddingLeft: isMobile ? 12 : 20 }}>
            {category.shortDesc}
          </p>
        </section>
      )}

      {(category as any).materials && (category as any).materials.length > 0 && (
        <section style={{ padding: isMobile ? "0 16px" : "0 40px", marginBottom: isMobile ? 32 : 48 }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a7fa5" }}>
              Материалы
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, paddingLeft: isMobile ? 12 : 20 }}>
            {(category as any).materials.map((m: any, i: number) => (
              <li key={i} style={{ display: "flex", gap: 10, fontSize: isMobile ? 15 : 17, color: "#c0cdd8", lineHeight: 1.55, padding: "4px 0" }}>
                <span style={{ color: "#4a7fa5", flexShrink: 0 }}>—</span>
                <span>{m.specs ? `${m.name} (${m.specs})` : m.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CARDS */}
      <section style={{ background: "#090b0e", padding: isMobile ? "0 16px 40px" : "0 40px 60px" }}>
        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a7fa5" }}>
            УСЛУГИ — {cards.length}
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        </div>
        {cards.length > 0 ? (
          <div className="grid" style={{ gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(420px, 1fr))", gap: 14 }}>
            {cards.map((card: any, i: number) => {
              const cardSlug = card.slug || slugifyRu(card.name);
              return (
                <FadeIn key={cardSlug || i} delay={i * 0.06}>
                  <div
                    onClick={() => navigate(`/solutions/${cardSlug}`)}
                    className="relative overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                    style={{ width: "100%", height: 320, borderRadius: 20 }}
                  >
                    {card.image ? (
                      <img src={card.image} alt={card.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />
                    ) : (
                      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a2535, #0d1118)", zIndex: 0 }} />
                    )}
                    <div className="absolute inset-0" style={{ zIndex: 1, background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.1) 100%)" }} />
                    <div className="absolute bottom-0 left-0 right-0" style={{ zIndex: 2, padding: 20 }}>
                      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.6)", marginBottom: 10, display: "block" }}>
                        {category.label}
                      </span>
                      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", lineHeight: 1.25, margin: "0 0 14px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {card.name}
                      </h3>
                      <div className="flex items-center justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); openModal(card.name); }}
                          className="flex items-center justify-center flex-shrink-0"
                          style={{ width: 32, height: 32, borderRadius: "50%", background: "#f5a623", border: "none", cursor: "pointer" }}
                        >
                          <ArrowRight size={14} style={{ color: "#000" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        ) : (
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            В этой категории пока нет услуг. Добавьте их через админку.
          </p>
        )}
      </section>

      {/* AREAS */}
      {category.areas && category.areas.length > 0 && (
        <section style={{ padding: isMobile ? "0 16px" : "0 40px", marginBottom: isMobile ? 32 : 48 }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a7fa5" }}>
              Области применения
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>
          <div className="flex flex-wrap gap-2" style={{ paddingLeft: isMobile ? 12 : 20 }}>
            {category.areas.map((a) => (
              <span
                key={a}
                style={{ background: "rgba(74,127,165,0.1)", border: "1px solid rgba(74,127,165,0.25)", padding: "7px 16px", borderRadius: 20, fontSize: 15, color: "#c0cdd8" }}
              >
                {a}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* EXAMPLES (gallery) */}
      {category.gallery && category.gallery.length > 0 && (
        <section style={{ padding: isMobile ? "0 16px" : "0 40px", marginBottom: isMobile ? 32 : 48 }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a7fa5" }}>
              Примеры работ
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>
          <div className={`grid gap-3 ${isMobile ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3"}`} style={{ paddingLeft: isMobile ? 12 : 20 }}>
            {category.gallery.map((src, i) => (
              <div
                key={i}
                className="overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
                style={{ height: 200, borderRadius: 10 }}
              >
                <img src={src} alt={`Пример ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section style={{ background: "rgba(255,255,255,0.02)", padding: isMobile ? "56px 20px" : "72px 40px", textAlign: "center" }}>
        <FadeIn>
          <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: "#ffffff", margin: 0 }}>
            Нужна защита вашего объекта?
          </h2>
          <p style={{ fontSize: 15, color: "#7a8394", marginTop: 8, marginBottom: 0 }}>
            Выезжаем на объект. Расчёт за 24 часа.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <a
              href={cTelHref}
              className="inline-flex items-center justify-center gap-2 font-bold"
              style={{ background: "#f5a623", color: "#000", height: 48, padding: "0 28px", borderRadius: 10, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap", width: isMobile ? "100%" : "auto" }}
            >
              <Phone size={16} /> Позвонить
            </a>
            <a
              href={cTgHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200"
              style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#ffffff", height: 48, padding: "0 28px", borderRadius: 10, fontSize: 14, textDecoration: "none", background: "transparent", whiteSpace: "nowrap", width: isMobile ? "100%" : "auto" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
            >
              <Send size={16} /> Написать в Telegram
            </a>
          </div>
        </FadeIn>
      </section>
    </div>
  );
};

export default CategoryPage;
