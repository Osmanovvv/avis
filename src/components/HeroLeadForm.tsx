import { useState, useCallback, useLayoutEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";

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

const HeroLeadForm = () => {
  const [digits, setDigits] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const isMobile = useIsMobile();
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
    if (digits.length !== 10) {
      setError("Введите 10 цифр номера");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.createLead(displayValue, name.trim(), "/");
      setDone(true);
    } catch {
      setError("Ошибка отправки. Позвоните нам напрямую.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div
        className="w-full flex flex-col items-center justify-center gap-3"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: isMobile ? 16 : 12,
          padding: isMobile ? "32px 20px" : "clamp(20px, 4vw, 32px)",
          minHeight: 220,
        }}
      >
        <CheckCircle2 style={{ width: 40, height: 40, color: "#d4a017" }} />
        <p style={{ fontSize: 16, fontWeight: 600, color: "#ffffff", margin: 0 }}>
          Заявка принята
        </p>
        <p style={{ fontSize: 13, color: "#7a8394", margin: 0, textAlign: "center" }}>
          Перезвоним в течение 2 часов
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: isMobile ? 16 : 12,
        padding: isMobile ? "24px 20px" : "clamp(20px, 4vw, 32px)",
      }}
    >
      <h3
        style={{
          fontSize: "clamp(15px, 4vw, 18px)",
          fontWeight: 700,
          color: "#ffffff",
          margin: 0,
          textTransform: "none",
          letterSpacing: "0.01em",
        }}
      >
        Рассчитать стоимость
      </h3>
      <p style={{ fontSize: 12, color: "#7a8394", margin: "4px 0 14px" }}>
        Специалист перезвонит в течение 2 часов
      </p>

      <input
        ref={inputRef}
        type="tel"
        inputMode="tel"
        placeholder="+7 (___) ___-__-__"
        aria-label="Телефон"
        value={displayValue}
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        autoComplete="tel"
        className="w-full rounded-md px-4 mb-3"
        style={{
          height: isMobile ? 52 : 44,
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${error ? "#f87171" : "rgba(255,255,255,0.1)"}`,
          color: "#e8eaf0",
          fontSize: 16,
          outline: "none",
        }}
      />

      <textarea
        placeholder="Опишите объект (необязательно)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        rows={isMobile ? 2 : 3}
        className="w-full rounded-md px-4 py-3 mb-4 resize-none"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#e8eaf0",
          fontSize: 16,
          outline: "none",
        }}
      />

      {error && (
        <p style={{ fontSize: 12, color: "#f87171", marginTop: -8, marginBottom: 12 }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-gold w-full rounded-md font-bold disabled:opacity-60"
        style={{
          height: isMobile ? 52 : 48,
          fontSize: isMobile ? "1rem" : 14,
          letterSpacing: "0.04em",
        }}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Отправляем...
          </span>
        ) : "Отправить заявку"}
      </button>

      <p style={{ fontSize: 11, color: "#4a5568", marginTop: 12, lineHeight: 1.5 }}>
        Нажимая кнопку, вы соглашаетесь с{" "}
        <a href="/privacy" style={{ color: "#4a7fa5", textDecoration: "underline" }}>
          политикой конфиденциальности
        </a>
      </p>
    </form>
  );
};

export default HeroLeadForm;
