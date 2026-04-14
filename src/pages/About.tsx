import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import { ArrowRight, CheckCircle2, Phone, Shield, Wrench, Clock, Award } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import SEO from "@/components/SEO";
import logoAvis from "@/assets/logo-avis.webp";
import { useContent } from "@/hooks/use-content";
import { useSettings } from "@/hooks/use-settings";
import { api } from "@/lib/api";
import { toast } from "sonner";

function formatPhone(digits: string): string {
  const d = digits.slice(0, 10);
  let result = "+7";
  if (d.length === 0) return result;
  result += " (" + d.slice(0, 3);
  if (d.length >= 3) result += ") "; else return result;
  result += d.slice(3, 6);
  if (d.length >= 6) result += "-"; else return result;
  result += d.slice(6, 8);
  if (d.length >= 8) result += "-"; else return result;
  result += d.slice(8, 10);
  return result;
}

function extractDigits(value: string): string {
  let raw = value.replace(/\D/g, "");
  if (raw.startsWith("7") || raw.startsWith("8")) raw = raw.slice(1);
  return raw.slice(0, 10);
}

const steps = [
  { num: "01", title: "Заявка", desc: "Вы оставляете заявку. Мы связываемся в течение 2 часов." },
  { num: "02", title: "Аудит объекта", desc: "Инженер выезжает на объект. Оценивает риски и зоны защиты." },
  { num: "03", title: "Проектирование", desc: "Разрабатываем архитектуру защиты под ваш объект." },
  { num: "04", title: "Изготовление и монтаж", desc: "Производим и устанавливаем. Сдаём с гарантией 3 года." },
];

const bullets = [
  "Собственное производство конструкций",
  "Полный цикл: аудит → проект → монтаж → гарантия",
  "Расширенная гарантия 3 года на все системы",
  "Изготовление от 5 рабочих дней",
];

const stats = [
  { value: "200+", label: "защищённых объектов" },
  { value: "12 лет", label: "на рынке инженерной защиты" },
  { value: "[регионов]", label: "присутствие по РФ" },
];

const whyUs = [
  { icon: Wrench, text: "Собственное производство металлоконструкций" },
  { icon: Shield, text: "Проектирование по СП 542.1325800.2024" },
  { icon: Clock, text: "Монтаж от 5 дней" },
  { icon: Award, text: "Гарантия 3 года" },
];

const About = () => {
  const [digits, setDigits] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const { content } = useContent();
  const { settings } = useSettings();
  const companyName = settings?.companyName || "ООО «АВИС»";
  const inn = settings?.inn || "";
  const ogrn = settings?.ogrn || "";
  const legalAddress = content?.contacts?.address || settings?.address || "";
  const aboutDescription = content?.about?.description?.trim() || "";
  const aboutAdvantages = (content?.about?.advantages || []).map((a) => a?.trim()).filter(Boolean);
  const displayBullets = aboutAdvantages.length > 0 ? aboutAdvantages : bullets;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const d = extractDigits(e.target.value);
    setDigits(d);
    if (error) setError("");
  }, [error]);

  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.length !== 10) {
      setError("Введите 10 цифр номера");
      inputRef.current?.focus();
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await api.createLead(`+7${digits}`, "", "/about");
      setSubmitted(true);
      toast.success("Заявка отправлена! Перезвоним в течение 2 часов.");
    } catch {
      setError("Ошибка отправки. Попробуйте ещё раз или позвоните.");
      toast.error("Ошибка отправки заявки");
    } finally {
      setSubmitting(false);
    }
  }, [digits]);

  const displayValue = digits.length > 0 ? formatPhone(digits) : "";
  const isComplete = digits.length === 10;

  return (
    <div>
      <SEO
        title="О компании АВИС: производство систем защиты от БПЛА"
        description="АВИС: российский производитель средств защиты объектов от БПЛА. 12 лет опыта, 200+ реализованных объектов, собственное производство."
        keywords="защита от бпла производитель, системы защиты от бпла, АВИС"
        path="/about"
      />

      {/* HERO */}
      <section style={{ background: "#090b0e" }}>
        <div
          className="container"
          style={{ padding: isMobile ? "60px 20px 40px" : undefined }}
          {...(!isMobile ? { className: "container pt-[72px] pb-[72px] lg:pt-[120px] lg:pb-[120px]" } : {})}
        >
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <img
                src={logoAvis}
                alt="АВИС"
                className="mx-auto mb-8"
                style={{ height: 50, width: "auto", objectFit: "contain" }}
              />
              <span className="text-[11px] uppercase tracking-[0.15em] block mb-6" style={{ color: "#4a7fa5" }}>
                О компании
              </span>
              <h1
                style={{
                  fontSize: isMobile ? "clamp(2rem, 8vw, 3.5rem)" : "clamp(32px, 5vw, 52px)",
                  fontWeight: 800,
                  color: "#e8eaf0",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Инженерная защита.
                <br />
                Это не продукт. Это решение.
              </h1>
              <p
                className="mt-4"
                style={{ fontSize: "1rem", color: "#4a7fa5", margin: 0, marginTop: 16 }}
              >
                Инженерная защита объектов{"\u00a0"}от{"\u00a0"}БПЛА
              </p>
              {aboutDescription && (
                <p
                  className="mt-4 mx-auto max-w-[600px]"
                  style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.7, whiteSpace: "pre-line" }}
                >
                  {aboutDescription}
                </p>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHY AVIS — new section */}
      <section>
        <div
          className="container"
          style={{ padding: isMobile ? "48px 20px" : undefined }}
          {...(!isMobile ? { className: "container pt-[72px] pb-[72px] lg:pt-[100px] lg:pb-[100px]" } : {})}
        >
          <FadeIn>
            <h2
              className="text-center mb-8 md:mb-12"
              style={{
                fontSize: isMobile ? "1.25rem" : undefined,
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              Почему АВИС
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {whyUs.map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div
                  className="rounded-xl text-center"
                  style={{
                    padding: isMobile ? "20px 12px" : "28px 20px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <item.icon size={20} style={{ color: "#4a7fa5", margin: "0 auto 12px" }} strokeWidth={1.5} />
                  <p style={{ fontSize: isMobile ? "0.8125rem" : "0.875rem", color: "#b0bec5", lineHeight: 1.5 }}>
                    {item.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Experience + bullets */}
      <section>
        <div
          className="container"
          style={{ padding: isMobile ? "48px 20px" : undefined }}
          {...(!isMobile ? { className: "container pt-[72px] pb-[72px] lg:pt-[120px] lg:pb-[120px]" } : {})}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn>
              <div className={isMobile ? "text-center" : ""}>
                <span
                  className="font-thin leading-none select-none block"
                  style={{
                    fontSize: isMobile ? 80 : 120,
                    color: "rgba(192,205,216,0.22)",
                    textShadow: "0 0 60px rgba(74,127,165,0.15)",
                  }}
                >
                  12
                </span>
                <p className="mt-3 font-light" style={{ fontSize: isMobile ? 16 : 18, color: "#c0cdd8" }}>
                  лет на рынке<br />инженерной защиты
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <ul className="space-y-2">
                {displayBullets.map((b) => (
                  <li
                    key={b}
                    className="text-[15px] leading-[1.9]"
                    style={{
                      color: "#9ca3af",
                      ...(isMobile ? { borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 12 } : {}),
                    }}
                  >
                    <span style={{ color: "#4a7fa5" }}>·</span> {b}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#090b0e" }}>
        <div
          className="container"
          style={{ padding: isMobile ? "48px 20px" : undefined }}
          {...(!isMobile ? { className: "container pt-[72px] pb-[72px] lg:pt-[100px] lg:pb-[100px]" } : {})}
        >
          <FadeIn>
            <h3 className="text-[11px] uppercase tracking-[0.12em] text-center mb-12" style={{ color: "#4a5568" }}>
              Реализованные объекты
            </h3>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 text-center">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.08}>
                <div>
                  <span className="font-extralight block leading-none" style={{ fontSize: isMobile ? 40 : 48, color: "#c0cdd8" }}>
                    {s.value}
                  </span>
                  <span className="text-[12px] uppercase tracking-[0.1em] mt-3 block" style={{ color: "#4a5568" }}>
                    {s.label}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section>
        <div
          className="container"
          style={{ padding: isMobile ? "48px 20px" : undefined }}
          {...(!isMobile ? { className: "container pt-[72px] pb-[72px] lg:pt-[120px] lg:pb-[120px]" } : {})}
        >
          <FadeIn>
            <span className="block text-[11px] uppercase tracking-[0.15em] mb-10" style={{ color: "#4a7fa5" }}>
              Как мы работаем
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            {/* Desktop */}
            <div className="hidden md:flex items-start justify-between gap-4">
              {steps.map((s, i) => (
                <div key={s.num} className="flex items-start gap-4">
                  <div className="flex flex-col gap-2 max-w-[220px]">
                    <span className="text-[11px] tracking-[0.12em]" style={{ color: "#4a7fa5" }}>{s.num}</span>
                    <span className="text-[15px] font-medium" style={{ color: "#c0cdd8" }}>{s.title}</span>
                    <span className="text-[13px] leading-[1.6]" style={{ color: "#6b7280" }}>{s.desc}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <span className="text-[16px] self-center mt-4 flex-shrink-0" style={{ color: "#2a3040" }}>→</span>
                  )}
                </div>
              ))}
            </div>
            {/* Mobile */}
            <div className="flex flex-col md:hidden">
              {steps.map((s, i) => (
                <div key={s.num}>
                  <div className="flex flex-col gap-2" style={{ padding: "12px 0", borderBottom: i < steps.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <span className="text-[11px] tracking-[0.12em]" style={{ color: "#4a7fa5" }}>{s.num}</span>
                    <span className="text-[15px] font-medium" style={{ color: "#c0cdd8" }}>{s.title}</span>
                    <span className="text-[13px] leading-[1.6]" style={{ color: "#6b7280" }}>{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Partners */}
      <section style={{ background: "#090b0e" }}>
        <div
          className="container"
          style={{ padding: isMobile ? "48px 20px" : undefined }}
          {...(!isMobile ? { className: "container pt-[72px] pb-[72px] lg:pt-[100px] lg:pb-[100px]" } : {})}
        >
          <FadeIn>
            <h3 className="text-[20px] font-extralight text-center mb-12" style={{ color: "#c0cdd8" }}>
              ПАРТНЁРЫ И КЛИЕНТЫ
            </h3>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 max-w-[900px] mx-auto">
              {[
                'ОАО «ИНТЕР РАО – Электрогенерация»',
                'Межрайонная ИФНС №\u00a07 по Краснодарскому краю',
                'ФГБУ «Объединённый санаторий «Сочи»',
                'ГБУ КК «Дворец спорта Большой»',
                'ООО «КВАРЦ Групп»',
                'АО «МОРЕМОЛЛ»',
                'НАО «Центр Омега»',
                'ОАО «Отель «Звёздный»',
                'ПАО «ОГК-2»',
                'АО «Галерея Краснодар»',
                'МУП «Водоканал» города Сочи',
                'ФГУП «Росморпорт»',
                'ПАО «Калужский турбинный завод»',
                'АО «Силовые машины»',
                'ООО «Группа Компаний „Rusagro"»',
                'УПРО «Объединённый санаторий „Русь"»',
              ].map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-3 transition-colors duration-200 hover:bg-[rgba(74,127,165,0.05)]"
                  style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span className="flex-shrink-0 rounded-full" style={{ width: 4, height: 4, background: "#4a7fa5" }} />
                  <span style={{ fontSize: 13, color: "#c0cdd8", lineHeight: 1.4 }}>{name}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0a0c10" }}>
        <div
          className="container"
          style={{ padding: isMobile ? "48px 20px" : undefined }}
          {...(!isMobile ? { className: "container pt-[72px] pb-[72px] lg:pt-[120px] lg:pb-[120px]" } : {})}
        >
          <div className="mx-auto max-w-[560px]">
            <FadeIn>
              <div className="text-center mb-10">
                <h2 style={{ fontSize: isMobile ? "1.5rem" : undefined }}>
                  Запросить аудит объекта
                </h2>
              </div>
            </FadeIn>

            {submitted ? (
              <FadeIn>
                <div className="text-center py-8">
                  <p className="text-[15px]" style={{ color: "#4a7fa5" }}>
                    ✓ Заявка принята. Инженер свяжется с вами в течение 2 часов
                  </p>
                </div>
              </FadeIn>
            ) : (
              <FadeIn delay={0.08}>
                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      ref={inputRef}
                      type="tel"
                      inputMode="numeric"
                      placeholder="+7 (900) 123-45-67"
                      aria-label="Телефон"
                      value={displayValue}
                      onChange={handleChange}
                      autoComplete="tel"
                      className={`w-full rounded-md pl-11 pr-4 text-[16px] font-light tracking-wide text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all ${error ? "border-red-500/60" : ""}`}
                      style={{
                        height: 52,
                        background: "#141720",
                        border: "1px solid rgba(255,255,255,0.1)",
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
                    {isComplete && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="h-5 w-5 text-highlight" />
                      </div>
                    )}
                  </div>

                  {error && <p className="text-[13px] text-red-400 pl-1">{error}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold w-full rounded-md font-semibold text-[14px] uppercase tracking-[0.08em] flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{
                      height: 56,
                    }}
                  >
                    {submitting ? "Отправка..." : "Получить бесплатный аудит"}
                    {!submitting && <ArrowRight className="h-5 w-5" />}
                  </button>

                  <p className="text-center text-[12px] pt-1" style={{ color: "#4a5568" }}>
                    Ответим в течение 2 часов · Без спама
                  </p>
                  <p className="text-center text-[11px]" style={{ color: "#4a5568" }}>
                    Нажимая кнопку, вы соглашаетесь с{" "}
                    <a href="/privacy" style={{ color: "#4a7fa5", textDecoration: "underline" }}>
                      политикой конфиденциальности
                    </a>
                  </p>
                </form>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {/* Mobile CTA button */}
      {isMobile && (
        <div style={{ padding: "0 20px 24px" }}>
          <Link
            to="/contacts"
            className="btn-gold flex items-center justify-center rounded-lg font-bold"
            style={{
              height: 56,
              fontSize: "1rem",
              letterSpacing: "0.04em",
            }}
          >
            Запросить аудит объекта
          </Link>
        </div>
      )}

      {/* Legal */}
      <section style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="container py-6">
          <div className="text-center text-[12px] leading-[1.8]" style={{ color: "#374151" }}>
            <p>
              {companyName}
              {inn && <> · ИНН: {inn}</>}
              {ogrn && <> · ОГРН: {ogrn}</>}
            </p>
            {legalAddress && <p>{legalAddress}</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
