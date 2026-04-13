import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import FadeIn from "@/components/FadeIn";
import { Phone, Send, Mail, MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { useContent } from "@/hooks/use-content";
import { useSettings } from "@/hooks/use-settings";
import { api } from "@/lib/api";

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

const Contacts = () => {
  const isMobile = useIsMobile();
  const { content } = useContent();
  const { settings } = useSettings();
  const cPhone = content?.contacts?.phone || settings?.phone || "";
  const cEmail = content?.contacts?.email || settings?.email || "";
  const cAddress = content?.contacts?.address || settings?.address || "";
  const cTgUsername = (content?.contacts?.telegram || settings?.telegram || "").replace(/^@/, "");
  const cTelHref = cPhone ? `tel:${cPhone.replace(/[^+\d]/g, "")}` : "#";
  const cTgHref = cTgUsername ? `https://t.me/${cTgUsername}` : "#";
  const cMailHref = cEmail ? `mailto:${cEmail}` : "#";
  const [name, setName] = useState("");
  const [digits, setDigits] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const displayPhone = formatPhone(digits);

  useLayoutEffect(() => {
    const el = phoneInputRef.current;
    if (el && el === document.activeElement) {
      const len = displayPhone.length;
      el.setSelectionRange(len, len);
    }
  }, [displayPhone]);

  const handlePhoneKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setDigits((prev) => prev.slice(0, -1));
    } else if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      setDigits((prev) => (prev.length < 10 ? prev + e.key : prev));
    }
  }, []);

  const handlePhonePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let d = e.clipboardData.getData("text").replace(/\D/g, "");
    if (d.length >= 11 && (d[0] === "7" || d[0] === "8")) d = d.slice(1);
    setDigits(d.slice(0, 10));
  }, []);
  const formRef = useRef<HTMLFormElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(true);

  useEffect(() => {
    if (!isMobile || !formRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(formRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.length !== 10) {
      setSubmitError("Введите 10 цифр номера");
      phoneInputRef.current?.focus();
      return;
    }
    setSubmitError("");
    setSubmitting(true);
    try {
      await api.createLead(`+7${digits}`, name.trim(), "/contacts");
      setSubmitted(true);
      toast.success("Заявка отправлена! Перезвоним в течение 2 часов.");
    } catch {
      setSubmitError("Ошибка отправки. Попробуйте ещё раз или позвоните.");
      toast.error("Ошибка отправки заявки");
    } finally {
      setSubmitting(false);
    }
  }, [digits, name]);

  return (
    <div style={{ background: "#0d0f12", minHeight: "100vh", paddingBottom: isMobile ? 80 : 0 }}>
      <SEO
        title="Контакты: запросить аудит защиты от БПЛА | АВИС"
        description="Запросите бесплатный аудит защищённости вашего объекта от БПЛА. Ответим в течение 2 часов. Telegram, телефон, email."
        keywords="защита от бпла аудит, заказать защиту от дронов"
        path="/contacts"
      />

      <div style={{ padding: isMobile ? "60px 20px 24px" : undefined }} className={isMobile ? "" : "py-12 px-5 md:py-20 md:px-[6vw]"}>
        {/* Header */}
        <FadeIn>
          <span className="block uppercase" style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.15em" }}>
            Контакты
          </span>
          <h1
            className="mt-2"
            style={{
              fontSize: isMobile ? "clamp(1.8rem, 8vw, 3rem)" : "clamp(28px, 3vw, 44px)",
              fontWeight: 800,
              color: "#e8eaf0",
              margin: 0,
              marginTop: 8,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Свяжитесь с нами
          </h1>
          <p className="mt-2" style={{ fontSize: 14, color: "#6b7280", margin: 0, marginTop: 8 }}>
            Ответим в течение 2 часов. Выберите удобный способ связи.
          </p>
        </FadeIn>

        {/* Mobile: Form → Contact Blocks → Map (stacked) */}
        {/* Desktop: Contact cards in 3-col grid */}

        {/* Contact Form */}
        <FadeIn delay={0.1}>
          {submitted ? (
            <div
              ref={formRef as any}
              className="mt-8 md:mt-12 rounded-xl text-center"
              style={{
                background: "rgba(74,127,165,0.08)",
                border: "1px solid rgba(74,127,165,0.3)",
                padding: isMobile ? "32px 20px" : "40px",
                maxWidth: isMobile ? "100%" : 560,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", margin: 0 }}>
                Заявка отправлена
              </h3>
              <p style={{ fontSize: 14, color: "#c0cdd8", marginTop: 12 }}>
                Перезвоним вам в течение 2 часов.
              </p>
            </div>
          ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-8 md:mt-12 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: isMobile ? "24px 20px" : "32px",
              maxWidth: isMobile ? "100%" : 560,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", margin: 0, textTransform: "none", letterSpacing: "0.01em" }}>
              Оставить заявку
            </h3>
            <p style={{ fontSize: 12, color: "#7a8394", marginTop: 4, marginBottom: 20 }}>
              Перезвоним в течение 2 часов
            </p>

            <div className="space-y-3">
              <div>
                <label style={{ fontSize: "0.8125rem", color: "#7a8394", display: "block", marginBottom: 6 }}>Имя</label>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md px-4"
                  style={{
                    height: 52,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#e8eaf0",
                    fontSize: 16,
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8125rem", color: "#7a8394", display: "block", marginBottom: 6 }}>Телефон</label>
                <input
                  ref={phoneInputRef}
                  type="tel"
                  inputMode="tel"
                  placeholder="+7 (900) 123-45-67"
                  value={displayPhone}
                  onChange={() => {}}
                  onKeyDown={handlePhoneKeyDown}
                  onPaste={handlePhonePaste}
                  autoComplete="tel"
                  className="w-full rounded-md px-4"
                  style={{
                    height: 52,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#e8eaf0",
                    fontSize: 16,
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8125rem", color: "#7a8394", display: "block", marginBottom: 6 }}>Сообщение</label>
                <textarea
                  placeholder="Опишите объект или задачу"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-md px-4 py-3 resize-none"
                  style={{
                    height: 120,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#e8eaf0",
                    fontSize: 16,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {submitError && (
              <p className="mt-3" style={{ fontSize: 13, color: "#e87171" }}>
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-gold w-full rounded-md font-bold disabled:opacity-60 mt-4"
              style={{
                height: 56,
                fontSize: isMobile ? "1rem" : 14,
                letterSpacing: "0.04em",
              }}
            >
              {submitting ? "Отправляем..." : "Отправить заявку"}
            </button>

            <p className="mt-3 text-center" style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>
              Нажимая кнопку, вы соглашаетесь с{" "}
              <a href="/privacy" style={{ color: "#4a7fa5", textDecoration: "underline" }}>
                политикой конфиденциальности
              </a>
            </p>
          </form>
          )}
        </FadeIn>

        {/* Direct Contact Blocks */}
        <div className={`mt-8 ${isMobile ? "space-y-3" : "grid grid-cols-3 gap-4 mt-10"}`}>
          {/* Phone */}
          <FadeIn delay={0.15}>
            <a
              href={cTelHref}
              className="flex items-center gap-4 rounded-xl no-underline"
              style={{
                padding: 20,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Phone size={20} style={{ color: "#4a7fa5", flexShrink: 0 }} strokeWidth={1.5} />
              <div>
                <span className="block" style={{ fontSize: "1.25rem", color: "#ffffff", fontWeight: 500 }}>{cPhone}</span>
                <span className="block" style={{ fontSize: 12, color: "#7a8394" }}>Пн-Пт, 9:00-18:00</span>
              </div>
            </a>
          </FadeIn>

          {/* Telegram */}
          <FadeIn delay={0.2}>
            <a
              href={cTgHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl no-underline transition-all hover:brightness-110"
              style={{
                height: 52,
                background: "#0088cc",
                color: "#ffffff",
                fontSize: "0.9375rem",
                fontWeight: 600,
              }}
            >
              <Send size={18} />
              Написать в Telegram
            </a>
          </FadeIn>

          {/* Email */}
          <FadeIn delay={0.25}>
            <a
              href={cMailHref}
              className="flex items-center gap-4 rounded-xl no-underline"
              style={{
                padding: 20,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Mail size={20} style={{ color: "#4a7fa5", flexShrink: 0 }} strokeWidth={1.5} />
              <div>
                <span className="block" style={{ fontSize: 15, color: "#c0cdd8" }}>{cEmail}</span>
                <span className="block" style={{ fontSize: 12, color: "#7a8394" }}>Для документов и расчётов</span>
              </div>
            </a>
          </FadeIn>
        </div>

        {/* Map placeholder */}
        <FadeIn delay={0.3}>
          <div
            className="mt-8 rounded-xl flex items-center justify-center"
            style={{
              height: isMobile ? 240 : 320,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              margin: isMobile ? "0" : undefined,
            }}
          >
            <div className="text-center">
              <MapPin size={24} style={{ color: "#4a5568", margin: "0 auto 8px" }} />
              <span style={{ fontSize: 13, color: "#4a5568" }}>{cAddress || "Адрес будет указан"}</span>
            </div>
          </div>
        </FadeIn>

        {/* Bottom info */}
        <FadeIn delay={0.35}>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: "#4a5568", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#4a5568" }}>{cAddress}</span>
            </div>
            <p className="sm:text-right" style={{ fontSize: 12, color: "#4a5568", maxWidth: 320, margin: 0 }}>
              Бесплатный аудит объекта · заполните запрос и мы отправим к{"\u00a0"}вам инженера
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Mobile sticky bottom bar */}
      {isMobile && showStickyBar && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: "rgba(13,15,18,0.95)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: "12px 20px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex gap-[10px]">
            <a
              href={cTelHref}
              className="btn-gold flex-1 flex items-center justify-center gap-2 rounded-lg font-semibold"
              style={{
                height: 48,
                fontSize: 13,
              }}
            >
              <Phone size={16} /> Позвонить
            </a>
            <a
              href={cTgHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-lg font-semibold transition-all"
              style={{
                height: 48,
                background: "#0088cc",
                color: "#ffffff",
                fontSize: 13,
              }}
            >
              <Send size={16} /> Telegram
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
