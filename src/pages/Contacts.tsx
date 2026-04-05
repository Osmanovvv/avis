import FadeIn from "@/components/FadeIn";
import { Phone, Send, Mail, MapPin } from "lucide-react";
import SEO from "@/components/SEO";

const contactActions = [
  {
    href: "tel:+70000000000",
    icon: Phone,
    label: "ПОЗВОНИТЬ",
    value: "[ТЕЛЕФОН]",
    sub: "Пн-Пт, 9:00-18:00",
    primary: false,
  },
  {
    href: "https://t.me/username",
    icon: Send,
    label: "НАПИСАТЬ В TELEGRAM",
    value: "@[TELEGRAM]",
    sub: "Основной канал — быстрее всего",
    primary: true,
    external: true,
  },
  {
    href: "mailto:info@example.com",
    icon: Mail,
    label: "НАПИСАТЬ НА EMAIL",
    value: "[EMAIL]",
    sub: "Для документов и расчётов",
    primary: false,
  },
];

const Contacts = () => {
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

        {/* Bottom info row */}
        <FadeIn delay={0.3}>
          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: "#4a5568", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#4a5568" }}>[АДРЕС]</span>
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
