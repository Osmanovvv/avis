import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { X, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useContent } from "@/hooks/use-content";

function formatPhone(d: string): string {
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

interface Props {
  open: boolean;
  onClose: () => void;
  subcategoryTitle?: string;
}

const RequestModal = ({ open, onClose, subcategoryTitle }: Props) => {
  const { content } = useContent();
  const cPhone = content?.contacts?.phone || "";
  const cTelHref = cPhone ? `tel:${cPhone.replace(/[^+\d]/g, "")}` : "#";
  const cTgUser = (content?.contacts?.telegram || "").replace(/^@/, "");
  const cTgHref = cTgUser ? `https://t.me/${cTgUser}` : "#";

  const [name, setName] = useState("");
  const [digits, setDigits] = useState("");
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const phoneRef = useRef<HTMLInputElement>(null);
  const displayPhone = formatPhone(digits);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setError("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useLayoutEffect(() => {
    const el = phoneRef.current;
    if (el && el === document.activeElement) {
      const len = displayPhone.length;
      el.setSelectionRange(len, len);
    }
  }, [displayPhone]);

  const handlePhoneKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setDigits((p) => p.slice(0, -1));
    } else if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      setDigits((p) => (p.length < 10 ? p + e.key : p));
    }
  }, []);

  const handlePhonePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let d = e.clipboardData.getData("text").replace(/\D/g, "");
    if (d.length >= 11 && (d[0] === "7" || d[0] === "8")) d = d.slice(1);
    setDigits(d.slice(0, 10));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.length !== 10) {
      setError("Введите 10 цифр номера");
      phoneRef.current?.focus();
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const fullName = desc.trim() ? `${name.trim()} — ${desc.trim()}`.replace(/^— /, "") : name.trim();
      await api.createLead(`+7${digits}`, fullName, subcategoryTitle || "/catalog");
      setSubmitted(true);
      toast.success("Заявка отправлена! Перезвоним в течение 2 часов.");
    } catch {
      setError("Ошибка отправки. Попробуйте ещё раз или позвоните.");
      toast.error("Ошибка отправки заявки");
    } finally {
      setSubmitting(false);
    }
  }, [digits, name, subcategoryTitle]);

  if (!open) return null;

  const title = subcategoryTitle ? `Расчёт: ${subcategoryTitle}` : "Запросить расчёт";

  const inputStyle: React.CSSProperties = {
    height: 48,
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "0 16px",
    fontSize: 14,
    color: "#fff",
    outline: "none",
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111418",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "36px 32px",
          maxWidth: 420,
          width: "90vw",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute flex items-center justify-center"
          style={{
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          <X size={16} />
        </button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>
              Заявка отправлена
            </h3>
            <p style={{ fontSize: 14, color: "#c0cdd8", marginTop: 12 }}>
              Перезвоним вам в течение 2 часов.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0, textTransform: "none", letterSpacing: "normal" }}>{title}</h3>
            <p style={{ fontSize: 13, color: "#7a8a9a", marginTop: 6, marginBottom: 0 }}>
              Ответим за 24 часа. Выезд на объект бесплатно.
            </p>

            <div className="flex flex-col gap-3" style={{ marginTop: 24 }}>
              <input
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#4a7fa5"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
              <input
                ref={phoneRef}
                type="tel"
                inputMode="tel"
                placeholder="+7 (___) ___-__-__"
                value={displayPhone}
                onChange={() => {}}
                onKeyDown={handlePhoneKey}
                onPaste={handlePhonePaste}
                autoComplete="tel"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#4a7fa5"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
              <textarea
                placeholder="Тип объекта, задача, местоположение..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                style={{ ...inputStyle, height: 80, resize: "none", padding: "12px 16px" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#4a7fa5"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>

            {error && <p style={{ marginTop: 10, fontSize: 13, color: "#e87171" }}>{error}</p>}

            <div className="flex flex-col gap-[10px]" style={{ marginTop: 20 }}>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2"
                style={{
                  width: "100%",
                  height: 50,
                  background: "#f5a623",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 15,
                  borderRadius: 12,
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? "Отправляем..." : "Отправить заявку"}
              </button>
              <a
                href={cTgHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
                style={{
                  width: "100%",
                  height: 50,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: 15,
                  borderRadius: 12,
                  textDecoration: "none",
                }}
              >
                <Send size={16} /> Написать в Telegram
              </a>
            </div>

            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 16, marginBottom: 0 }}>
              Нажимая кнопку, вы соглашаетесь с{" "}
              <Link to="/privacy" style={{ color: "#4a7fa5", textDecoration: "underline" }}>
                обработкой персональных данных
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestModal;
