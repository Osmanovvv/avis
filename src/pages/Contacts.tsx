import { useState, useRef, useCallback, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import { Phone, Send, Mail, MapPin, Clock } from "lucide-react";
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

const cardStyle = {
  padding: 20,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  height: "100%",
} as const;

const panelStyle = {
  padding: 20,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  marginBottom: 16,
} as const;

const Contacts = () => {
  const isMobile = useIsMobile();
  const { content } = useContent();
  const { settings } = useSettings();

  const cPhone = content?.contacts?.phone || settings?.phone || "";
  const cEmail = content?.contacts?.email || settings?.email || "";
  const cAddress = content?.contacts?.address || settings?.address || "";
  const cTgUsernameRaw = content?.contacts?.telegram || settings?.telegram || "";
  const cTgUsername = cTgUsernameRaw.replace(/^@/, "");
  const cTelHref = cPhone ? `tel:${cPhone.replace(/[^+\d]/g, "")}` : "#";
  const cTgHref = cTgUsername ? `https://t.me/${cTgUsername}` : "#";
  const cMailHref = cEmail ? `mailto:${cEmail}` : "#";

  const companyName = settings?.companyName || "";
  const inn = settings?.inn || "";
  const ogrn = settings?.ogrn || "";
  const kpp = (settings as any)?.kpp || "";
  const bankAccount = (settings as any)?.bankAccount || "";
  const bankName = (settings as any)?.bankName || "";
  const bik = (settings as any)?.bik || "";
  const productionAddress = (settings as any)?.productionAddress || "";

  const hasRequisites = companyName || inn || ogrn || kpp || bankAccount || bankName || bik;

  const [name, setName] = useState("");
  const [digits, setDigits] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
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
      const extra = [email && `Email: ${email}`, message && `Сообщение: ${message}`].filter(Boolean).join(" · ");
      const fullName = [name.trim(), extra].filter(Boolean).join(" · ");
      await api.createLead(`+7${digits}`, fullName, "/contacts");
      setSubmitted(true);
      toast.success("Заявка отправлена! Перезвоним в течение 2 часов.");
    } catch {
      setSubmitError("Ошибка отправки. Попробуйте ещё раз или позвоните.");
      toast.error("Ошибка отправки заявки");
    } finally {
      setSubmitting(false);
    }
  }, [digits, name, email, message]);

  const inputStyle = {
    height: 48,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#e8eaf0",
    fontSize: 14,
    outline: "none",
  } as const;

  return (
    <div style={{ background: "#0d0f12", minHeight: "100vh" }}>
      <SEO
        title="Контакты АВИС: телефон, адрес, реквизиты | Защита от БПЛА"
        description="Контакты компании АВИС: телефон, email, Telegram, адрес офиса, реквизиты. Запросите бесплатный аудит защиты объекта от БПЛА. Ответим за 2 часа."
        keywords="АВИС контакты, защита от бпла аудит, заказать защиту от дронов, телефон АВИС"
        path="/contacts"
      />

      <div style={{ padding: isMobile ? "60px 20px 24px" : "80px 40px 40px" }} className="container">
        {/* Header */}
        <FadeIn>
          <span className="block uppercase" style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.15em" }}>
            Контакты
          </span>
          <h1 className="mt-2" style={{ fontSize: isMobile ? "clamp(1.8rem, 8vw, 3rem)" : "clamp(28px, 3vw, 44px)", fontWeight: 800, color: "#e8eaf0", margin: 0, marginTop: 8, lineHeight: 1.1 }}>
            Свяжитесь с нами
          </h1>
          <p className="mt-2" style={{ fontSize: 14, color: "#6b7280", margin: 0, marginTop: 8 }}>
            Ответим в течение 2 часов. Бесплатный выезд инженера на объект.
          </p>
        </FadeIn>

        {/* Contact cards */}
        <div className={`mt-8 grid ${isMobile ? "grid-cols-1 gap-3" : "grid-cols-2 lg:grid-cols-4 gap-4"}`}>
          <FadeIn delay={0.05}>
            <a href={cTelHref} className="flex flex-col rounded-xl no-underline transition-all duration-200 hover:border-[rgba(74,127,165,0.4)]" style={cardStyle}>
              <Phone size={20} style={{ color: "#4a7fa5", marginBottom: 12 }} strokeWidth={1.5} />
              <span className="block" style={{ fontSize: 18, color: "#ffffff", fontWeight: 600 }}>{cPhone || "—"}</span>
              <span className="block mt-1" style={{ fontSize: 12, color: "#7a8394" }}>Пн-Пт, 9:00-18:00</span>
              <span className="block mt-1" style={{ fontSize: 12, color: "#7a8394" }}>Сб-Вс — аварийная линия</span>
            </a>
          </FadeIn>

          <FadeIn delay={0.1}>
            <a href={cTgHref} target="_blank" rel="noopener noreferrer" className="flex flex-col rounded-xl no-underline transition-all duration-200 hover:border-[rgba(74,127,165,0.4)]" style={cardStyle}>
              <Send size={20} style={{ color: "#4a7fa5", marginBottom: 12 }} strokeWidth={1.5} />
              <span className="block" style={{ fontSize: 16, color: "#ffffff", fontWeight: 600 }}>Telegram</span>
              <span className="block mt-1" style={{ fontSize: 13, color: "#4a7fa5" }}>@{cTgUsername || "—"}</span>
              <span className="block mt-1" style={{ fontSize: 12, color: "#7a8394" }}>Отвечаем за 30 минут</span>
            </a>
          </FadeIn>

          <FadeIn delay={0.15}>
            <a href={cMailHref} className="flex flex-col rounded-xl no-underline transition-all duration-200 hover:border-[rgba(74,127,165,0.4)]" style={cardStyle}>
              <Mail size={20} style={{ color: "#4a7fa5", marginBottom: 12 }} strokeWidth={1.5} />
              <span className="block" style={{ fontSize: 14, color: "#c0cdd8", fontWeight: 500, wordBreak: "break-all" }}>{cEmail || "—"}</span>
              <span className="block mt-1" style={{ fontSize: 12, color: "#7a8394" }}>Для документов и расчётов</span>
            </a>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col rounded-xl" style={cardStyle}>
              <Clock size={20} style={{ color: "#4a7fa5", marginBottom: 12 }} strokeWidth={1.5} />
              <span className="block" style={{ fontSize: 16, color: "#ffffff", fontWeight: 600 }}>Режим работы</span>
              <span className="block mt-1" style={{ fontSize: 13, color: "#c0cdd8" }}>Пн-Пт: 9:00 — 18:00</span>
              <span className="block" style={{ fontSize: 13, color: "#c0cdd8" }}>Сб-Вс: аварийная линия 24/7</span>
            </div>
          </FadeIn>
        </div>

        {/* Address block */}
        {(cAddress || productionAddress) && (
          <FadeIn delay={0.25}>
            <div className="mt-6 rounded-xl" style={{ padding: isMobile ? 20 : 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-start gap-3">
                <MapPin size={20} style={{ color: "#4a7fa5", marginTop: 2, flexShrink: 0 }} />
                <div>
                  {cAddress && (
                    <>
                      <span className="block" style={{ fontSize: 15, color: "#e8eaf0", fontWeight: 600 }}>Юридический адрес</span>
                      <span className="block mt-1" style={{ fontSize: 14, color: "#9ca3af" }}>{cAddress}</span>
                    </>
                  )}
                  {productionAddress && (
                    <>
                      <span className="block mt-2" style={{ fontSize: 15, color: "#e8eaf0", fontWeight: 600 }}>Производство</span>
                      <span className="block mt-1" style={{ fontSize: 14, color: "#9ca3af" }}>{productionAddress}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Two-column: form + sidebar */}
        <div className={`mt-10 ${isMobile ? "" : "grid grid-cols-[1fr_380px] gap-10"}`}>
          {/* Form */}
          <FadeIn delay={0.1}>
            {submitted ? (
              <div className="rounded-xl text-center" style={{ background: "rgba(74,127,165,0.08)", border: "1px solid rgba(74,127,165,0.3)", padding: isMobile ? "32px 20px" : "40px" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", margin: 0 }}>Заявка отправлена</h3>
                <p style={{ fontSize: 14, color: "#c0cdd8", marginTop: 12 }}>Перезвоним вам в течение 2 часов.</p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: isMobile ? "24px 20px" : "32px" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", margin: 0 }}>Оставить заявку</h3>
                <p style={{ fontSize: 12, color: "#7a8394", marginTop: 4, marginBottom: 20 }}>
                  Перезвоним в течение 2 часов. Бесплатный аудит объекта.
                </p>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md px-4"
                    style={inputStyle}
                  />
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    inputMode="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={displayPhone}
                    onChange={() => {}}
                    onKeyDown={handlePhoneKeyDown}
                    onPaste={handlePhonePaste}
                    autoComplete="tel"
                    className="w-full rounded-md px-4"
                    style={inputStyle}
                  />
                  <input
                    type="email"
                    placeholder="Email (необязательно)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md px-4"
                    style={inputStyle}
                  />
                  <textarea
                    placeholder="Опишите объект или задачу"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-md px-4 py-3 resize-none"
                    style={{ ...inputStyle, height: 100 }}
                  />
                </div>

                {submitError && (
                  <p className="mt-3" style={{ fontSize: 13, color: "#e87171" }}>{submitError}</p>
                )}

                <button type="submit" disabled={submitting} className="btn-gold w-full rounded-md font-bold disabled:opacity-60 mt-4" style={{ height: 52, fontSize: 14 }}>
                  {submitting ? "Отправляем..." : "Отправить заявку"}
                </button>

                <p className="text-center mt-3" style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                  Нажимая кнопку, вы соглашаетесь с{" "}
                  <Link to="/privacy" style={{ color: "#4a7fa5", textDecoration: "underline" }}>политикой конфиденциальности</Link>
                </p>
              </form>
            )}
          </FadeIn>

          {/* Sidebar */}
          <div className={isMobile ? "mt-8" : ""}>
            <FadeIn delay={0.15}>
              <div className="rounded-xl" style={panelStyle}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#e8eaf0", marginBottom: 12 }}>Быстрая связь</h4>
                <div className="space-y-3">
                  {cPhone && (
                    <a href={cTelHref} className="flex items-center gap-3 no-underline" style={{ color: "#c0cdd8", fontSize: 14 }}>
                      <Phone size={16} style={{ color: "#4a7fa5" }} /> {cPhone}
                    </a>
                  )}
                  {cTgUsername && (
                    <a href={cTgHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 no-underline" style={{ color: "#4a7fa5", fontSize: 14 }}>
                      <Send size={16} /> @{cTgUsername}
                    </a>
                  )}
                  {cEmail && (
                    <a href={cMailHref} className="flex items-center gap-3 no-underline" style={{ color: "#c0cdd8", fontSize: 14, wordBreak: "break-all" }}>
                      <Mail size={16} style={{ color: "#4a7fa5" }} /> {cEmail}
                    </a>
                  )}
                </div>
              </div>
            </FadeIn>

            {hasRequisites && (
              <FadeIn delay={0.2}>
                <div className="rounded-xl" style={panelStyle}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#e8eaf0", marginBottom: 12 }}>Реквизиты</h4>
                  <div style={{ fontSize: 13, color: "#7a8394", lineHeight: 1.8 }}>
                    {companyName && <p style={{ margin: 0 }}>{companyName}</p>}
                    {inn && <p style={{ margin: 0 }}>ИНН: {inn}</p>}
                    {ogrn && <p style={{ margin: 0 }}>ОГРН: {ogrn}</p>}
                    {kpp && <p style={{ margin: 0 }}>КПП: {kpp}</p>}
                    {bankAccount && <p style={{ margin: 0 }}>Р/с: {bankAccount}</p>}
                    {bankName && <p style={{ margin: 0 }}>Банк: {bankName}</p>}
                    {bik && <p style={{ margin: 0 }}>БИК: {bik}</p>}
                  </div>
                </div>
              </FadeIn>
            )}

            <FadeIn delay={0.25}>
              <div className="rounded-xl" style={{ ...panelStyle, marginBottom: 0 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#e8eaf0", marginBottom: 8 }}>Что будет после заявки?</h4>
                <div style={{ fontSize: 13, color: "#7a8394", lineHeight: 1.7 }}>
                  <p style={{ margin: "0 0 6px" }}>1. Свяжемся в течение 2 часов</p>
                  <p style={{ margin: "0 0 6px" }}>2. Бесплатный выезд инженера</p>
                  <p style={{ margin: "0 0 6px" }}>3. Коммерческое предложение за 24 часа</p>
                  <p style={{ margin: 0 }}>4. Старт работ от 5 дней</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Map placeholder */}
        <FadeIn delay={0.3}>
          <div className="mt-8 rounded-xl flex items-center justify-center" style={{ height: isMobile ? 240 : 320, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="text-center">
              <MapPin size={24} style={{ color: "#4a5568", margin: "0 auto 8px" }} />
              <span style={{ fontSize: 13, color: "#4a5568" }}>{cAddress || "[Яндекс.Карта будет добавлена]"}</span>
            </div>
          </div>
        </FadeIn>

        {/* SEO text */}
        <FadeIn delay={0.35}>
          <div className="mt-10" style={{ maxWidth: 700 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#e8eaf0", marginBottom: 12 }}>Как с нами связаться</h2>
            <p style={{ fontSize: 14, color: "#7a8394", lineHeight: 1.7, margin: "0 0 12px" }}>
              Компания АВИС оказывает услуги инженерной защиты объектов от БПЛА по всей территории Российской Федерации.
              Для получения бесплатного аудита вашего объекта заполните форму на сайте, позвоните по телефону или напишите в Telegram.
            </p>
            <p style={{ fontSize: 14, color: "#7a8394", lineHeight: 1.7, margin: 0 }}>
              Мы проектируем, производим и монтируем антидроновые сетки, защитные ограждения, бронирование зданий, укрытия и убежища.
              Работаем с промышленными предприятиями, энергетическими объектами, государственными учреждениями и частными заказчиками.
              Выезд инженера — бесплатно, коммерческое предложение — за 24 часа.
            </p>
          </div>
        </FadeIn>
      </div>

    </div>
  );
};

export default Contacts;
