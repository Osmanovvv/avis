import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MegaMenu from "@/components/MegaMenu";

const navItems = [
  { label: "Главная", path: "/", idx: "001" },
  { label: "Решения", path: "/solutions", idx: "002", hasMega: true },
  { label: "Проекты", path: "/cases", idx: "003" },
  { label: "О компании", path: "/about", idx: "004" },
  { label: "Контакты", path: "/contacts", idx: "005" },
];

const PAGE_COUNTER: Record<string, string> = {
  "/": "001 / 006  ГЛАВНАЯ",
  "/industries": "002 / 006  ОТРАСЛИ",
  "/solutions": "003 / 006  РЕШЕНИЯ",
  "/cases": "004 / 006  ПРОЕКТЫ",
  "/about": "005 / 006  О КОМПАНИИ",
  "/contacts": "006 / 006  КОНТАКТЫ",
};

/* Custom hamburger icon with animated transition to X */
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
      style={{
        background: "#c0cdd8",
        opacity: open ? 0 : 1,
      }}
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
  const [megaOpen, setMegaOpen] = useState(false);
  const megaTimeout = useRef<ReturnType<typeof setTimeout>>();
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

  useEffect(() => { setMobileOpen(false); setMegaOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const openMega = () => {
    clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 150);
  };

  const counter = PAGE_COUNTER[location.pathname] || "001 / 006  ГЛАВНАЯ";

  return (
    <>
      <header className="sticky top-0 z-50 bg-[rgba(13,15,18,0.92)] backdrop-blur-xl" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="container flex h-[52px] items-center justify-between lg:h-[72px]">
          {/* Logo + divider */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-[14px] lg:text-[18px] font-light uppercase text-white" style={{ letterSpacing: "0.25em" }}>АВИС</span>
            </Link>
            <div className="hidden lg:block w-px h-5 bg-white/15 mx-6" />
          </div>

          {/* Desktop Nav — centered */}
          <nav className="hidden items-center gap-1 lg:flex absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={item.hasMega ? openMega : undefined}
                onMouseLeave={item.hasMega ? closeMega : undefined}
              >
                <Link
                  to={item.path}
                  className={`px-3 py-2 text-[11px] uppercase tracking-[0.15em] font-light transition-colors duration-200 inline-flex items-center gap-1
                    ${location.pathname === item.path
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-accent"
                    }`}
                >
                  {item.label}
                  {item.hasMega && <ChevronDown className={`h-3 w-3 transition-transform ${megaOpen ? "rotate-180" : ""}`} />}
                </Link>

                {item.hasMega && (
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                        onMouseEnter={openMega}
                        onMouseLeave={closeMega}
                      >
                        <MegaMenu onNavigate={() => setMegaOpen(false)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* CTA right */}
          <div className="hidden lg:flex items-center ml-auto">
            <Link to="/contacts">
              <Button variant="cta" size="sm">
                Запросить аудит
              </Button>
            </Link>
          </div>

          {/* Mobile toggle — 44x44 touch target */}
          <button
            className="lg:hidden w-11 h-11 flex items-center justify-center relative z-[110]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Открыть меню навигации"
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </header>

      {/* Counter below header — desktop only */}
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

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex flex-col lg:hidden"
            style={{ background: "rgba(8,10,14,0.98)" }}
          >
            {/* Spacer for header */}
            <div className="h-[52px] flex-shrink-0" />

            {/* Centered nav items */}
            <div className="flex-1 flex flex-col justify-center px-8">
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
                      className="block flex items-center transition-colors"
                      style={{
                        fontSize: "24px",
                        fontWeight: 200,
                        letterSpacing: "0.06em",
                        height: "52px",
                        color: location.pathname === item.path ? "#ffffff" : "hsl(var(--text-nav))",
                      }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Bottom section: phone + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="px-8 pb-10 space-y-4 flex-shrink-0"
            >
              <a
                href="tel:+70000000000"
                className="flex items-center gap-2.5 text-[16px] font-light tracking-wide no-underline"
                style={{ color: "#c0cdd8" }}
              >
                <Phone className="h-4 w-4 text-highlight" />
                +7 (000) 000-00-00
              </a>
              <Link to="/contacts" onClick={() => setMobileOpen(false)}>
                <button
                  className="w-full h-14 rounded-md font-semibold text-[14px] uppercase tracking-[0.08em] flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #b8860b, #d4a017)",
                    color: "#0d0f12",
                  }}
                >
                  Запросить аудит
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
