import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";
import { useContent } from "@/hooks/use-content";
import { useSettings } from "@/hooks/use-settings";

const navLinks = [
  { label: "Главная", path: "/" },
  { label: "Услуги", path: "/solutions" },
  { label: "О компании", path: "/about" },
  { label: "Контакты", path: "/contacts" },
  { label: "Отрасли", path: "/industries" },
  { label: "Проекты", path: "/cases" },
];

const Footer = () => {
  const { content } = useContent();
  const { settings } = useSettings();

  const phone = content?.contacts?.phone || settings?.phone || "";
  const email = content?.contacts?.email || settings?.email || "";
  const address = content?.contacts?.address || settings?.address || "";
  const tgUsernameRaw = content?.contacts?.telegram || settings?.telegram || "";
  const tgUsername = tgUsernameRaw.replace(/^@/, "");
  const companyName = settings?.companyName || "";
  const inn = settings?.inn || "";

  const telHref = phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : "";
  const tgHref = tgUsername ? `https://t.me/${tgUsername}` : "";
  const waHref = "https://wa.me/79882330056";

  type ContactItem = { icon: any; text: string; href?: string; highlight?: boolean; isPhone?: boolean; target?: string };
  const contacts: ContactItem[] = [];
  if (phone) contacts.push({ icon: Phone, text: phone, href: telHref, isPhone: true });
  if (email) contacts.push({ icon: Mail, text: email, href: `mailto:${email}` });
  if (address) contacts.push({ icon: MapPin, text: address });
  if (tgUsername) contacts.push({ icon: Send, text: `@${tgUsername}`, href: tgHref, highlight: true, target: "_blank" });
  contacts.push({ icon: MessageCircle, text: "WhatsApp", href: waHref, highlight: true, target: "_blank" });

  return (
    <footer style={{ background: "#080a0d", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="px-5 pt-9 pb-6 md:px-[6vw] md:pt-12 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[30%_30%_40%] gap-10 md:gap-6">
          <div className="order-1">
            <img src="/logo-avis-header.webp" alt="АВИС" width={40} height={40} className="h-[40px] w-auto object-contain" />
            <p className="mt-2 max-w-[200px]" style={{ fontSize: 13, color: "#4a5568" }}>
              Инженерная защита объектов от БПЛА
            </p>
            <p className="mt-1" style={{ fontSize: 11, color: "#374151" }}>
              Пассивная защита. Производство. Монтаж.
            </p>
          </div>

          <div className="order-2 md:order-3">
            <h4 className="mb-4 uppercase" style={{ fontSize: 10, letterSpacing: "0.12em", color: "#374151" }}>Контакты</h4>
            <ul className="space-y-2">
              {contacts.map((c, idx) => {
                const inner = (
                  <span className="flex items-center gap-2">
                    <c.icon size={13} className="flex-shrink-0" style={{ color: c.highlight ? "#4a7fa5" : "#4a5568" }} />
                    <span style={{ fontSize: c.isPhone ? "1.1rem" : 13, color: c.highlight ? "#4a7fa5" : "#4a5568", fontWeight: c.isPhone ? 500 : 400 }}>
                      {c.text}
                    </span>
                  </span>
                );
                return (
                  <li key={idx}>
                    {c.href ? (
                      <a
                        href={c.href}
                        target={c.target}
                        rel={c.target === "_blank" ? "noopener noreferrer" : undefined}
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

          <div className="order-3 md:order-2">
            <h4 className="mb-4 uppercase" style={{ fontSize: 10, letterSpacing: "0.12em", color: "#374151" }}>Навигация</h4>
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

        <div
          className="mt-10 pt-5 flex flex-col items-center gap-3 md:flex-row md:justify-between md:items-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span style={{ fontSize: 11, color: "#374151" }}>
            {companyName && `${companyName}`}{companyName && inn && ` · `}{inn && `ИНН: ${inn}`}
          </span>
          <span style={{ fontSize: 11, color: "#374151" }}>© 2026 АВИС. Все права защищены.</span>
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
