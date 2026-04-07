import { useState, useRef, useCallback, useLayoutEffect, useMemo } from "react";
import FadeIn from "@/components/FadeIn";
import { Phone, Send, Mail, MapPin, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { useContent } from "@/hooks/use-content";
import { api } from "@/lib/api";

/** Format 0-10 digits → "+7 (XXX) XXX-XX-XX" progressively */
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


async function sendToTelegram(phoneVal: string, name: string): Promise<boolean> {
  const token = import.meta.env.VITE_TG_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TG_CHAT_ID;
  if (!token || !chatId || token === "your_bot_token") return true; // mock mode

  const text = [
    "📩 *Новая заявка с сайта*",
    `📞 Телефон: ${phoneVal}`,
    name ? `👤 Имя/компания: ${name}` : "",
    `📄 Страница: /contacts`,
    `🕐 ${new Date().toLocaleString("ru-RU")}`,
  ].filter(Boolean).join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  });
  return res.ok;
}

const Contacts = () => {
  const { content } = useContent();
  const phone = content?.contacts?.phone || import.meta.env.VITE_PHONE || "+70000000000";
  const telegram = content?.contacts?.telegram || import.meta.env.VITE_TELEGRAM || "username";
  const email = content?.contacts?.email || import.meta.env.VITE_EMAIL || "info@example.com";
  const address = content?.contacts?.address || "г. Сочи, ул. Пригородная, 6, офис 5";

  const contactActions = useMemo(() => [
    {
      href: `tel:${phone}`,
      icon: Phone,
      label: "ПОЗВОНИТЬ",
      value: phone.replace(/\+?(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5"),
      sub: "Пн-Пт, 9:00-18:00",
      primary: false,
    },
    {
      href: `https://t.me/${telegram}`,
      icon: Send,
      label: "НАПИСАТЬ В TELEGRAM",
      value: `@${telegram}`,
      sub: "Основной канал — быстрее всего",
      primary: true,
      external: true,
    },
    {
      href: `mailto:${email}`,
      icon: Mail,
      label: "НАПИСАТЬ НА EMAIL",
      value: email,
      sub: "Для документов и расчётов",
      primary: false,
    },
  ], [phone, telegram, email]);
  const [digits, setDigits] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isComplete = digits.length === 10;
  const displayValue = formatPhone(digits);

  // After formatting, put cursor at end
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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) {
      setError("Введите корректный номер телефона");
      inputRef.current?.focus();
      return;
    }
    setSubmitting(true);
    setSubmitError(false);
    try {
      await api.createLead(displayValue, name, "/contacts");
      const ok = await sendToTelegram(displayValue, name);
      if (ok) {
        setSubmitted(true);
      } else {
        setSubmitError(true);
      }
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }, [isComplete, displayValue, name]);

  return (
    <div style={{ background: "#0d0f12", minHeight: "100vh" }}>
      <SEO
        title="Контакты — запросить аудит защиты объекта | АВИС"
        description="Позвоните или напишите в Telegram. Ответим в течение 2 часов. Бесплатный аудит объекта."
        path="/contacts"
      />

      <div className="py-12 px-5 md:py-20 md:px-[6vw]">
        {/* Header */}
        <FadeIn>
          <span
            className="block uppercase"
            style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.15em" }}
          >
            Контакты
          </span>
          <h1
            className="mt-2"
            style={{
              fontSize: "clamp(28px, 3vw, 44px)",
              fontWeight: 200,
              color: "#d4dae2",
              margin: 0,
              marginTop: 8,
              lineHeight: 1.1,
            }}
          >
            Свяжитесь с нами
          </h1>
          <p className="mt-2" style={{ fontSize: 14, color: "#6b7280", margin: 0, marginTop: 8 }}>
            Ответим в течение 2 часов. Выберите удобный способ связи.
          </p>
        </FadeIn>

        {/* Action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-10 md:mt-12">
          {contactActions.map((action, i) => (
            <FadeIn key={action.label} delay={i * 0.08}>
              <a
                href={action.href}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noopener noreferrer" : undefined}
                className="block rounded-xl p-6 md:p-8 no-underline transition-all duration-200 hover:-translate-y-0.5 group"
                style={{
                  background: action.primary ? "rgba(74,127,165,0.08)" : "rgba(20,23,32,1)",
                  border: `1px solid ${action.primary ? "rgba(74,127,165,0.3)" : "rgba(255,255,255,0.1)"}`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = action.primary
                    ? "rgba(74,127,165,0.6)"
                    : "rgba(74,127,165,0.4)";
                  el.style.background = action.primary
                    ? "rgba(74,127,165,0.12)"
                    : "rgba(74,127,165,0.06)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = action.primary
                    ? "rgba(74,127,165,0.3)"
                    : "rgba(255,255,255,0.1)";
                  el.style.background = action.primary
                    ? "rgba(74,127,165,0.08)"
                    : "rgba(20,23,32,1)";
                }}
              >
                <action.icon size={28} strokeWidth={1.5} style={{ color: "#4a7fa5" }} />
                <span
                  className="block mt-3 uppercase"
                  style={{ fontSize: 10, letterSpacing: "0.15em", color: "#4a5568" }}
                >
                  {action.label}
                </span>
                <span
                  className="block mt-2"
                  style={{ fontSize: 18, fontWeight: 300, color: "#c0cdd8" }}
                >
                  {action.value}
                </span>
                <span
                  className="block mt-1"
                  style={{ fontSize: 12, color: action.primary ? "#4a7fa5" : "#4a5568" }}
                >
                  {action.sub}
                </span>
              </a>
            </FadeIn>
          ))}
        </div>

        {/* Lead form */}
        <FadeIn delay={0.25}>
          <div className="mt-12 md:mt-16 mx-auto max-w-[520px]">
            <div
              className="rounded-xl p-6 md:p-8"
              style={{ background: "rgba(20,23,32,1)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <h2
                style={{ fontSize: 20, fontWeight: 200, color: "#c0cdd8", margin: 0 }}
              >
                Оставить заявку
              </h2>
              <p style={{ fontSize: 13, color: "#4a5568", margin: 0, marginTop: 6 }}>
                Перезвоним в течение 2 часов
              </p>

              {submitted ? (
                <div className="flex items-center gap-3 mt-6 py-4">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: "#4a7fa5" }} />
                  <p style={{ fontSize: 15, color: "#4a7fa5", margin: 0 }}>
                    Заявка принята. Инженер свяжется с вами в течение 2 часов.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-3">
                  {/* Phone */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Phone className="h-4 w-4" style={{ color: "#4a5568" }} />
                    </div>
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
                      className="w-full rounded-md pl-11 pr-4 text-[16px] font-light tracking-wide text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all h-[52px]"
                      style={{
                        background: "#141720",
                        border: `1px solid ${error ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)"}`,
                        color: "#c0cdd8",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "hsl(207 36% 47%)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,127,165,0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = error ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    {isComplete && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="h-5 w-5" style={{ color: "#4a7fa5" }} />
                      </div>
                    )}
                  </div>

                  {error && <p style={{ fontSize: 13, color: "#ef4444", margin: 0, paddingLeft: 4 }}>{error}</p>}

                  {/* Name (optional) */}
                  <input
                    type="text"
                    placeholder="Имя или компания (необязательно)"
                    aria-label="Имя или компания"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="organization"
                    className="w-full rounded-md px-4 text-[16px] font-light tracking-wide text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all h-[52px]"
                    style={{
                      background: "#141720",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#c0cdd8",
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

                  {submitError && (
                    <p style={{ fontSize: 13, color: "#ef4444", margin: 0, paddingLeft: 4 }}>
                      Ошибка отправки. Попробуйте позвонить или написать в Telegram.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-14 rounded-md font-semibold text-[14px] uppercase tracking-[0.08em] transition-all duration-200 hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #b8860b, #d4a017)",
                      color: "#0d0f12",
                    }}
                  >
                    {submitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Отправить заявку
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>

                  <p className="text-center" style={{ fontSize: 12, color: "#4a5568", margin: 0, marginTop: 8 }}>
                    Нажимая «Отправить заявку», вы соглашаетесь с{" "}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#4a7fa5", textDecoration: "underline" }}>
                      политикой конфиденциальности
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Bottom info row */}
        <FadeIn delay={0.3}>
          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: "#4a5568", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#4a5568" }}>{address}</span>
            </div>
            <p
              className="text-right"
              style={{ fontSize: 12, color: "#4a5568", maxWidth: 320, margin: 0 }}
            >
              Бесплатный аудит объекта — заполните запрос и мы свезём к вам инженера
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default Contacts;
