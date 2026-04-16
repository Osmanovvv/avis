import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "@/hooks/use-content";
import { useCategories } from "@/hooks/use-categories";

interface Props {
  mobile?: boolean;
  onNavigate?: () => void;
}

function slugifyRu(input: string): string {
  const m: Record<string, string> = {
    а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",
    с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
  };
  return (input || "").toLowerCase().trim()
    .split("").map((c) => (/[a-z0-9\s-]/.test(c) ? c : (m[c] ?? ""))).join("")
    .replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

const MegaMenu = ({ mobile = false, onNavigate }: Props) => {
  const { content } = useContent();
  const categories = useCategories();
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);

  const categoriesWithSubs = useMemo(() => {
    const products = (content?.products || []) as any[];
    return categories.map((cat) => ({
      ...cat,
      subs: products
        .filter((p) => p.category === cat.id && (p.name?.trim() || ""))
        .map((p) => ({ name: p.name, slug: p.slug || slugifyRu(p.name) })),
    }));
  }, [content?.products, categories]);

  if (mobile) {
    return <MobileAccordion categories={categoriesWithSubs} onNavigate={onNavigate} />;
  }

  const active = categoriesWithSubs[activeIdx];

  const goTo = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <div
      style={{
        width: 680,
        background: "#0d0f12",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        padding: "20px 0",
      }}
    >
      <div className="flex" style={{ minHeight: 320 }}>
        {/* Left column: categories */}
        <div style={{ width: 220, borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <div
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#4a7fa5",
              padding: "0 20px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              marginBottom: 8,
            }}
          >
            УСЛУГИ
          </div>

          {categoriesWithSubs.map((cat, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={cat.slug}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => goTo(`/solutions/category/${cat.slug}`)}
                className="w-full text-left flex items-center justify-between"
                style={{
                  padding: isActive ? "10px 20px 10px 18px" : "10px 20px",
                  fontSize: 13,
                  color: isActive ? "#ffffff" : "#c0cdd8",
                  background: isActive ? "rgba(74,127,165,0.12)" : "transparent",
                  borderLeft: isActive ? "2px solid #4a7fa5" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  border: "none",
                  borderRightWidth: 0,
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                }}
              >
                <span>{cat.label}</span>
                <ChevronRight size={12} style={{ color: isActive ? "#d4a017" : "rgba(255,255,255,0.3)" }} />
              </button>
            );
          })}

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, marginTop: 8 }}>
            <button
              onClick={() => goTo("/solutions")}
              className="w-full text-left"
              style={{ fontSize: 12, color: "#d4a017", padding: "8px 20px", cursor: "pointer", background: "transparent", border: "none" }}
            >
              Весь каталог →
            </button>
          </div>
        </div>

        {/* Right column: subcategories */}
        <div style={{ flex: 1, padding: "0 20px" }}>
          <div
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#4a7fa5",
              marginBottom: 10,
            }}
          >
            {active?.label}
          </div>
          <div className="space-y-0.5">
            {active?.subs.length ? (
              active.subs.map((sub) => (
                <button
                  key={sub.slug}
                  onClick={() => goTo(`/solutions/${sub.slug}`)}
                  className="block w-full text-left"
                  style={{
                    padding: "8px 12px",
                    fontSize: 13,
                    color: "#b0bec5",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 0.12s",
                    background: "transparent",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#b0bec5";
                  }}
                >
                  {sub.name}
                </button>
              ))
            ) : (
              <p style={{ fontSize: 12, color: "#6b7280", padding: "8px 12px", margin: 0 }}>
                Нет услуг в этой категории
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── MOBILE ACCORDION ─── */

interface CategoryWithSubs {
  id: string;
  label: string;
  slug: string;
  subs: Array<{ name: string; slug: string }>;
}

const MobileAccordion = ({
  categories,
  onNavigate,
}: {
  categories: CategoryWithSubs[];
  onNavigate?: () => void;
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <div>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a7fa5", padding: "16px 20px 8px" }}>
        УСЛУГИ
      </div>

      {categories.map((cat, i) => (
        <div key={cat.slug}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between"
            style={{
              padding: "12px 20px",
              fontSize: 15,
              color: "#ffffff",
              fontWeight: 500,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              cursor: "pointer",
              background: "transparent",
              border: "none",
              borderBottomWidth: 1,
              borderBottomStyle: "solid",
              borderBottomColor: "rgba(255,255,255,0.05)",
            }}
          >
            <span>{cat.label}</span>
            <ChevronDown
              size={16}
              style={{ color: "#4a7fa5", transition: "transform 0.2s", transform: openIdx === i ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>

          <AnimatePresence>
            {openIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div style={{ padding: "4px 0" }}>
                  {cat.subs.length ? (
                    cat.subs.map((sub) => (
                      <button
                        key={sub.slug}
                        onClick={() => go(`/solutions/${sub.slug}`)}
                        className="w-full text-left flex items-center"
                        style={{
                          padding: "10px 20px 10px 36px",
                          fontSize: 14,
                          color: "#b0bec5",
                          borderBottom: "1px solid rgba(255,255,255,0.03)",
                          cursor: "pointer",
                          background: "transparent",
                          border: "none",
                          borderBottomWidth: 1,
                          borderBottomStyle: "solid",
                          borderBottomColor: "rgba(255,255,255,0.03)",
                        }}
                      >
                        <span style={{ color: "#4a7fa5", marginRight: 8 }}>—</span>
                        {sub.name}
                      </button>
                    ))
                  ) : (
                    <p style={{ padding: "10px 36px", fontSize: 13, color: "#6b7280", margin: 0 }}>
                      Нет услуг
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <div style={{ margin: "12px 20px" }}>
        <button
          onClick={() => go("/solutions")}
          className="w-full flex items-center justify-center"
          style={{
            height: 44,
            border: "1px solid rgba(212,160,23,0.4)",
            color: "#d4a017",
            background: "transparent",
            borderRadius: 10,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Весь каталог →
        </button>
      </div>
    </div>
  );
};

export default MegaMenu;
