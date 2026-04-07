import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useContent } from "@/hooks/use-content";
import { useSettings } from "@/hooks/use-settings";

const navLinks = [
  { label: "Главная", path: "/" },
  { label: "Решения", path: "/solutions" },
  { label: "Проекты", path: "/cases" },
  { label: "О компании", path: "/about" },
  { label: "Контакты", path: "/contacts" },
];

const Footer = () => {
  const { content } = useContent();
  const { settings } = useSettings();
  const phone = content?.contacts?.phone || import.meta.env.VITE_PHONE || "+70000000000";
  const telegram = content?.contacts?.telegram || import.meta.env.VITE_TELEGRAM || "username";
  const email = content?.contacts?.email || import.meta.env.VITE_EMAIL || "info@example.com";
  const address = content?.contacts?.address || "[АДРЕС]";

  const contacts = useMemo(() => [
    { icon: Phone, text: phone.replace(/\+?(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5"), href: `tel:${phone}`, highlight: false },
    { icon: Mail, text: email, href: `mailto:${email}`, highlight: false },
    { icon: MapPin, text: address, href: undefined, highlight: false },
    { icon: Send, text: `@${telegram}`, href: `https://t.me/${telegram}`, highlight: true },
  ], [phone, telegram, email, address]);
  return (
    <footer style={{ background: "#080a0d", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="px-5 pt-9 pb-6 md:px-[6vw] md:pt-12 md:pb-8">
        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-[30%_30%_40%] gap-10 md:gap-6">
          {/* Brand */}
          <div className="order-1">
            <span
              className="block text-[16px] font-light uppercase"
              style={{ letterSpacing: "0.22em", color: "#e8eaf0" }}
            >
              АВИС
            </span>
            <p className="mt-2 max-w-[200px]" style={{ fontSize: 13, color: "#8a95a3" }}>
              Инженерная защита объектов от БПЛА
            </p>
            <p className="mt-1" style={{ fontSize: 11, color: "#6b7280" }}>
              Пассивная защита. Производство. Монтаж.
            </p>
          </div>

          {/* Contacts — before nav on mobile */}
          <div className="order-2 md:order-3">
            <h4
              className="mb-4 uppercase"
              style={{ fontSize: 10, letterSpacing: "0.12em", color: "#6b7280" }}
            >
              Контакты
            </h4>
            <ul className="space-y-2">
              {contacts.map((c) => {
                const inner = (
                  <span className="flex items-center gap-2">
                    <c.icon size={13} className="flex-shrink-0" style={{ color: c.highlight ? "#4a7fa5" : "#4a5568" }} />
                    <span style={{ fontSize: 13, color: c.highlight ? "#4a7fa5" : "#4a5568" }}>
                      {c.text}
                    </span>
                  </span>
                );
                return (
                  <li key={c.text}>
                    {c.href ? (
                      <a
                        href={c.href}
                        target={c.href.startsWith("http") ? "_blank" : undefined}
                        rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        aria-label={c.text}
                        className="transition-colors duration-200 hover:[&_span]:text-[#c0cdd8]"
                      >
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Navigation */}
          <div className="order-3 md:order-2">
            <h4
              className="mb-4 uppercase"
              style={{ fontSize: 10, letterSpacing: "0.12em", color: "#6b7280" }}
            >
              Навигация
            </h4>
            <ul className="space-y-2">
              {navLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="transition-colors duration-200"
                    style={{ fontSize: 13, color: "#8a95a3" }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#c0cdd8"; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#4a5568"; }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-5 flex flex-col items-center gap-3 md:flex-row md:justify-between md:items-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span style={{ fontSize: 11, color: "#6b7280" }}>
            {settings?.companyName || "[ПОЛНОЕ ЮРИДИЧЕСКОЕ НАЗВАНИЕ]"}{settings?.inn ? ` · ИНН: ${settings.inn}` : ""}
          </span>
          <span style={{ fontSize: 11, color: "#6b7280" }}>
            © 2026 АВИС. Все права защищены.
          </span>
          <Link
            to="/privacy"
            className="transition-colors duration-200"
            style={{ fontSize: 11, color: "#6b7280" }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#6b7280"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#374151"; }}
          >
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
