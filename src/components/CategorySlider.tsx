import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Shield, Grid3x3, Building2, Layers, Square, Radio, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CategoryChip {
  id: string;
  label: string;
  icon?: LucideIcon;
}

const categories: CategoryChip[] = [
  { id: "all", label: "Все" },
  { id: "shelters", label: "Убежища", icon: Shield },
  { id: "nets", label: "Антидрон сетки", icon: Grid3x3 },
  { id: "barriers", label: "Ограждения", icon: Building2 },
  { id: "equipment", label: "Оборудование", icon: Layers },
  { id: "windows", label: "Окна и проёмы", icon: Square },
  { id: "reb", label: "РЭБ-защита", icon: Radio },
  { id: "design", label: "Проектирование", icon: FileText },
];

interface CategorySliderProps {
  active: string;
  onChange: (id: string) => void;
}

const CategorySlider = ({ active, onChange }: CategorySliderProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  return (
    <div className="relative w-full px-5 md:px-10 mb-8 lg:mb-10">
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center rounded-full transition-opacity"
          style={{ width: 36, height: 36, background: "rgba(255,255,255,0.08)" }}
        >
          <ChevronLeft size={16} color="#fff" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {categories.map((cat) => {
          const isActive = active === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className="flex-shrink-0 flex items-center gap-1.5 rounded-full cursor-pointer transition-all duration-[250ms]"
              style={{
                scrollSnapAlign: "start",
                height: 44,
                padding: "0 20px",
                whiteSpace: "nowrap",
                fontSize: "0.875rem",
                fontWeight: 500,
                background: isActive ? "rgba(74,127,165,0.15)" : "rgba(255,255,255,0.05)",
                border: isActive ? "1px solid #4a7fa5" : "1px solid rgba(255,255,255,0.1)",
                color: isActive ? "#ffffff" : "#7a8394",
              }}
              onMouseEnter={(e) => {
                if (isActive) return;
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                e.currentTarget.style.color = "#c0cdd8";
              }}
              onMouseLeave={(e) => {
                if (isActive) return;
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "#7a8394";
              }}
            >
              {Icon && <Icon size={14} />}
              {cat.label}
            </button>
          );
        })}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center rounded-full transition-opacity"
          style={{ width: 36, height: 36, background: "rgba(255,255,255,0.08)" }}
        >
          <ChevronRight size={16} color="#fff" />
        </button>
      )}

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export { categories };
export default CategorySlider;
