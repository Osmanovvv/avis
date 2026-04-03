import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Send } from "lucide-react";

const navLinks = [
  { label: "Главная", path: "/" },
  { label: "Решения", path: "/solutions" },
  { label: "Проекты", path: "/cases" },
  { label: "О компании", path: "/about" },
  { label: "Контакты", path: "/contacts" },
];

const contacts = [
  { icon: Phone, text: "[ТЕЛЕФОН]", href: "tel:+70000000000", highlight: false },
  { icon: Mail, text: "[EMAIL]", href: "mailto:info@example.com", highlight: false },
  { icon: MapPin, text: "[АДРЕС]", href: undefined, highlight: false },
  { icon: Send, text: "@[TELEGRAM]", href: "https://t.me/username", highlight: true },
];

const Footer = () => {
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
            <p className="mt-2 max-w-[200px]" style={{ fontSize: 13, color: "#4a5568" }}>
              Инженерная защита объектов от БПЛА
            </p>
            <p className="mt-1" style={{ fontSize: 11, color: "#374151" }}>
              Пассивная защита. Производство. Монтаж.
            </p>
          </div>

          {/* Contacts — before nav on mobile */}
          <div className="order-2 md:order-3">
            <h4
              className="mb-4 uppercase"
              style={{ fontSize: 10, letterSpacing: "0.12em", color: "#374151" }}
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
              style={{ fontSize: 10, letterSpacing: "0.12em", color: "#374151" }}
            >
              Навигация
            </h4>
            <ul className="space-y-2">
              {navLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="transition-colors duration-200"
                    style={{ fontSize: 13, color: "#4a5568" }}
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
          <span style={{ fontSize: 11, color: "#374151" }}>
            [ПОЛНОЕ ЮРИДИЧЕСКОЕ НАЗВАНИЕ] · ИНН: [ИНН]
          </span>
          <span style={{ fontSize: 11, color: "#374151" }}>
            © 2026 АВИС. Все права защищены.
          </span>
          <Link
            to="/privacy"
            className="transition-colors duration-200"
            style={{ fontSize: 11, color: "#374151" }}
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
