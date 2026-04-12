import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoAvis from "@/assets/logo-avis.png";

const navItems = [
  { label: "Главная", path: "/" },
  { label: "Услуги", path: "/solutions" },
  { label: "О компании", path: "/about" },
  { label: "Контакты", path: "/contacts" },
];

const PAGE_COUNTER: Record<string, string> = {
  "/": "001 / 004  ГЛАВНАЯ",
  "/solutions": "002 / 004  УСЛУГИ",
  "/about": "003 / 004  О КОМПАНИИ",
  "/contacts": "004 / 004  КОНТАКТЫ",
};

const HamburgerIcon = ({ open }: { open: boolean }) => (
  <div className="w-[22px] h-[17px] relative flex flex-col justify-between">
    <span
      className="block w-full h-[1.5px] rounded-full transition-all duration-200 origin-center"
      style={{
        background: "#c0cdd8",
        transform: open ? "translateY(7.5px) rotate(45deg)" : "none",
      }}
    />
    <span
      className="block w-full h-[1.5px] rounded-full transition-all duration-200"
      style={{ background: "#c0cdd8", opacity: open ? 0 : 1 }}
    />
    <span
      className="block w-full h-[1.5px] rounded-full transition-all duration-200 origin-center"
      style={{
        background: "#c0cdd8",
        transform: open ? "translateY(-7.5px) rotate(-45deg)" : "none",
      }}
    />
  </div>
);

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [counterVisible, setCounterVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setCounterVisible(y < 10 || y < lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const counter = PAGE_COUNTER[location.pathname] || "";

  return (
    <>
      <header className="sticky top-0 z-50 bg-[rgba(13,15,18,0.92)] backdrop-blur-xl" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="container flex h-[52px] items-center justify-between lg:h-[72px]">
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoAvis} alt="АВИС" className="h-[32px] lg:h-[40px] w-auto" />
            </Link>
            <div className="hidden lg:block w-px h-5 bg-white/15 mx-6" />
          </div>

          <nav className="hidden items-center gap-1 lg:flex absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-[11px] uppercase tracking-[0.15em] font-light transition-colors duration-200
                  ${location.pathname === item.path ? "text-foreground" : "text-muted-foreground hover:text-accent"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4 ml-auto">
            <a
              href="tel:+70000000000"
              className="text-[12px] tracking-[0.06em] transition-colors duration-200"
              style={{ color: "#7a8394" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c0cdd8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7a8394")}
            >
              [ТЕЛЕФОН]
            </a>
            <Link to="/contacts">
              <Button variant="cta" size="sm">Запросить аудит</Button>
            </Link>
          </div>

          <button
            className="lg:hidden w-11 h-11 flex items-center justify-center relative z-[110]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Открыть меню навигации"
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </header>

      {counter && (
        <div
          className="hidden lg:block sticky top-[72px] z-40 pl-6 pt-1 pb-0.5 transition-all duration-300"
          style={{
            opacity: counterVisible ? 1 : 0,
            transform: counterVisible ? "translateY(0)" : "translateY(-8px)",
            pointerEvents: counterVisible ? "auto" : "none",
            height: 28,
          }}
        >
          <span className="text-[11px] tracking-[0.2em] uppercase font-light" style={{ color: "hsl(var(--text-label))" }}>
            {counter}
          </span>
        </div>
      )}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex flex-col lg:hidden"
            style={{ background: "rgba(8,10,14,0.98)" }}
            onClick={() => setMobileOpen(false)}
          >
            {/* X close button */}
            <button
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center z-[110]"
              onClick={() => setMobileOpen(false)}
              aria-label="Закрыть меню"
            >
              <X size={24} color="#ffffff" />
            </button>

            <div className="h-[52px] flex-shrink-0" />
            <div className="flex-1 flex flex-col justify-center px-5" onClick={(e) => e.stopPropagation()}>
              <nav className="space-y-0">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center transition-colors"
                      style={{
                        fontSize: "22px",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        padding: "18px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.07)",
                        color: location.pathname === item.path ? "hsl(var(--gold-light))" : "#ffffff",
                      }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
                className="mt-8 space-y-4"
              >
                <a
                  href="tel:+70000000000"
                  className="flex items-center gap-2.5 text-[18px] font-medium tracking-wide"
                  style={{ color: "#c0cdd8" }}
                >
                  <Phone className="h-[18px] w-[18px]" style={{ color: "#4a7fa5" }} />
                  +7 (000) 000-00-00
                </a>
                <Link to="/contacts" onClick={() => setMobileOpen(false)}>
                  <button
                    className="btn-gold w-full flex items-center justify-center gap-2 font-bold text-[14px] uppercase tracking-[0.08em]"
                    style={{
                      height: 52,
                      borderRadius: 12,
                      marginTop: 16,
                    }}
                  >
                    Запросить аудит
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
