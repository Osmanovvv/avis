import { useState, useRef, useCallback, useEffect } from "react";
import FadeIn from "@/components/FadeIn";
import { Phone, Send, Mail, MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const Contacts = () => {
  const isMobile = useIsMobile();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Укажите номер телефона");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Заявка отправлена! Перезвоним в течение 2 часов.");
      setPhone("");
      setName("");
      setMessage("");
      setSubmitting(false);
    }, 800);
  }, [phone]);

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
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
          </form>
        </FadeIn>

        {/* Direct Contact Blocks */}
        <div className={`mt-8 ${isMobile ? "space-y-3" : "grid grid-cols-3 gap-4 mt-10"}`}>
          {/* Phone */}
          <FadeIn delay={0.15}>
            <a
              href="tel:+70000000000"
              className="flex items-center gap-4 rounded-xl no-underline"
              style={{
                padding: 20,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Phone size={20} style={{ color: "#4a7fa5", flexShrink: 0 }} strokeWidth={1.5} />
              <div>
                <span className="block" style={{ fontSize: "1.25rem", color: "#ffffff", fontWeight: 500 }}>[ТЕЛЕФОН]</span>
                <span className="block" style={{ fontSize: 12, color: "#7a8394" }}>Пн-Пт, 9:00-18:00</span>
              </div>
            </a>
          </FadeIn>

          {/* Telegram */}
          <FadeIn delay={0.2}>
            <a
              href="https://t.me/username"
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
              href="mailto:info@example.com"
              className="flex items-center gap-4 rounded-xl no-underline"
              style={{
                padding: 20,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Mail size={20} style={{ color: "#4a7fa5", flexShrink: 0 }} strokeWidth={1.5} />
              <div>
                <span className="block" style={{ fontSize: 15, color: "#c0cdd8" }}>[EMAIL]</span>
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
              <span style={{ fontSize: 13, color: "#4a5568" }}>[АДРЕС, карта будет добавлена]</span>
            </div>
          </div>
        </FadeIn>

        {/* Bottom info */}
        <FadeIn delay={0.35}>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: "#4a5568", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#4a5568" }}>[АДРЕС]</span>
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
              href="tel:+70000000000"
              className="btn-gold flex-1 flex items-center justify-center gap-2 rounded-lg font-semibold"
              style={{
                height: 48,
                fontSize: 13,
              }}
            >
              <Phone size={16} /> Позвонить
            </a>
            <a
              href="https://t.me/username"
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
