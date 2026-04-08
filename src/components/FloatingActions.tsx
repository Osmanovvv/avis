import { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { api } from "@/lib/api";
import { Phone, X, MessageSquare, PhoneCall } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

function formatPhone(digits: string): string {
  const d = digits.slice(0, 10);
  if (d.length === 0) return "+7 ";
  let r = "+7 (";
  r += d.slice(0, 3);
  if (d.length >= 3) r += ") "; else return r;
  r += d.slice(3, 6);
  if (d.length >= 6) r += "-"; else return r;
  r += d.slice(6, 8);
  if (d.length >= 8) r += "-"; else return r;
  r += d.slice(8, 10);
  return r;
}

const QuickFormModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  const [digits, setDigits] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = formatPhone(digits);

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (el && el === document.activeElement && displayValue) {
      const len = displayValue.length;
      el.setSelectionRange(len, len);
    }
  }, [displayValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setDigits(prev => prev.slice(0, -1));
      if (error) setError("");
    } else if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      setDigits(prev => prev.length < 10 ? prev + e.key : prev);
      if (error) setError("");
    }
  }, [error]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let d = e.clipboardData.getData("text").replace(/\D/g, "");
    if (d.length >= 11 && (d[0] === "7" || d[0] === "8")) d = d.slice(1);
    setDigits(d.slice(0, 10));
    if (error) setError("");
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.length !== 10) { setError("Введите 10 цифр номера"); return; }
    setLoading(true);
    try {
      await api.createLead(formatPhone(digits), "", "popup");
      setDone(true);
    } catch { setError("Ошибка отправки"); }
    finally { setLoading(false); }
  };

  const handleClose = (v: boolean) => {
    if (!v) { setDigits(""); setError(""); setDone(false); }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm" style={{ background: "#141720", border: "1px solid rgba(255,255,255,0.07)" }}>
        <DialogHeader>
          <DialogTitle className="text-lg font-light uppercase tracking-[0.08em] text-foreground">Обратный звонок</DialogTitle>
        </DialogHeader>
        {done ? (
          <div className="text-center space-y-3 py-4">
            <CheckCircle2 className="h-10 w-10 text-highlight mx-auto" />
            <p className="text-[15px] font-light text-foreground">Заявка принята</p>
            <p className="text-[13px] text-muted-foreground">Перезвоним в течение 2 часов</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="tel"
                inputMode="tel"
                placeholder="+7 (900) 123-45-67"
                aria-label="Телефон"
                value={displayValue}
                onChange={() => {}}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                autoComplete="off"
                className="w-full h-[52px] rounded-md pl-10 pr-4 text-[16px] text-foreground focus:outline-none transition-all"
                style={{
                  background: "#0d0f12",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "hsl(207 36% 47%)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,127,165,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
            {error && <p className="text-[12px] text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 min-h-[56px] rounded-md font-semibold text-[13px] uppercase tracking-[0.12em] flex items-center justify-center gap-2 transition-all hover:brightness-110 hover:shadow-gold-glow disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #b8860b, #d4a017)", color: "#0d0f12" }}
            >
              {loading ? (
                <><span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Отправляем...</>
              ) : (
                <>Перезвоните мне <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
            <p className="text-center" style={{ fontSize: 11, color: "#4a5568", margin: 0, marginTop: 6 }}>
              Нажимая «Перезвоните мне», вы соглашаетесь с{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#4a7fa5", textDecoration: "underline" }}>
                политикой конфиденциальности
              </a>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

const FloatingActions = () => {
  const [visible, setVisible] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // IntersectionObserver for footer
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const obs = new IntersectionObserver(
      ([entry]) => setNearFooter(entry.isIntersecting),
      { threshold: 0, rootMargin: "200px 0px 0px 0px" }
    );
    obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const check = () => setScrolledPast(window.scrollY > 100);
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, []);

  const showFab = visible && !nearFooter;
  const showMobileBar = scrolledPast && !nearFooter;

  return (
    <>
      {/* Mobile sticky bottom bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-all duration-300 ease-out ${showMobileBar ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
        style={{
          height: 60,
          background: "rgba(13,15,18,0.96)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="h-full px-4 flex items-center justify-between gap-3">
          <span className="text-[13px] font-light uppercase tracking-[0.15em] flex-shrink-0" style={{ color: "hsl(var(--text-label))" }}>
            АВИС
          </span>
          <Link to="/contacts" className="flex-1 max-w-[240px]">
            <button
              className="w-full h-[52px] rounded-md font-semibold text-[13px] uppercase tracking-[0.08em] flex items-center justify-center gap-2 transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg, hsl(var(--gold)), hsl(var(--gold-light)))", color: "#0a0c0f" }}
            >
              Аудит объекта <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* Desktop sidebar tab */}
      <div className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden lg:block transition-all duration-500 ${showFab ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}>
        <button onClick={() => setModalOpen(true)} aria-label="Аудит объекта" className="group flex items-center justify-center rounded-l-lg shadow-xl transition-all duration-200 px-2.5 py-6 border border-r-0 border-highlight/30 hover:bg-highlight/10" style={{ background: "rgba(13,15,18,0.7)", writingMode: "vertical-rl", textOrientation: "mixed" }}>
          <span className="text-[11px] font-light uppercase tracking-[0.15em] text-highlight rotate-180">
            Аудит объекта
          </span>
        </button>
      </div>

      <QuickFormModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};

export default FloatingActions;
