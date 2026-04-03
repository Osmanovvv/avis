import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";
import { catalog } from "@/data/catalog";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  mobile?: boolean;
  onNavigate?: () => void;
}

const MegaMenu = ({ mobile = false, onNavigate }: Props) => {
  const [activeIdx, setActiveIdx] = useState(0);

  if (mobile) {
    return <MobileMegaMenu onNavigate={onNavigate} />;
  }

  return (
    <div
      className="grid grid-cols-[220px_1fr] gap-0 rounded-lg overflow-hidden"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        minWidth: 520,
      }}
    >
      {/* Left: categories */}
      <div className="py-2 border-r" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {catalog.map((cat, i) => (
          <button
            key={cat.id}
            onMouseEnter={() => setActiveIdx(i)}
            onClick={() => setActiveIdx(i)}
            className={`w-full text-left px-4 py-2 text-[12px] uppercase tracking-[0.08em] flex items-center justify-between transition-colors duration-150
              ${i === activeIdx ? "text-highlight bg-secondary/60" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`}
          >
            <span className="truncate">{cat.title}</span>
            <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-50" />
          </button>
        ))}
      </div>

      {/* Right: subcategories */}
      <div className="py-3 px-4">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
          {catalog[activeIdx]?.title}
        </p>
        <div className="space-y-0.5">
          {catalog[activeIdx]?.products.map((p) => (
            <Link
              key={p.id}
              to={`/solutions?product=${p.id}`}
              onClick={onNavigate}
              className="block px-3 py-2 rounded text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors leading-snug"
            >
              {p.name}
            </Link>
          ))}
        </div>
        <div className="mt-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Link
            to="/solutions"
            onClick={onNavigate}
            className="text-[11px] uppercase tracking-[0.1em] text-highlight hover:text-foreground transition-colors"
          >
            Весь каталог →
          </Link>
        </div>
      </div>
    </div>
  );
};

/* Mobile: accordion */
const MobileMegaMenu = ({ onNavigate }: { onNavigate?: () => void }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-0.5 pl-4">
      {catalog.map((cat, i) => (
        <div key={cat.id}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between py-2 text-[12px] uppercase tracking-[0.08em] text-muted-foreground"
          >
            <span>{cat.title}</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform ${openIdx === i ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {openIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pl-3 pb-2 space-y-0.5">
                  {cat.products.map((p) => (
                    <Link
                      key={p.id}
                      to={`/solutions?product=${p.id}`}
                      onClick={onNavigate}
                      className="block py-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default MegaMenu;
