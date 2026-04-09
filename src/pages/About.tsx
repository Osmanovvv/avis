import { useState, useRef, useCallback, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import SEO from "@/components/SEO";
import { useContent } from "@/hooks/use-content";
import { useSettings } from "@/hooks/use-settings";
import { api } from "@/lib/api";

/* Inline lead form (same as home) */
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

const defaultSteps = [
  { num: "01", title: "Заявка", desc: "Вы оставляете заявку. Мы связываемся в течение 2 часов." },
  { num: "02", title: "Аудит объекта", desc: "Инженер выезжает на объект. Оценивает риски и зоны защиты." },
  { num: "03", title: "Проектирование", desc: "Разрабатываем архитектуру защиты под ваш объект." },
  { num: "04", title: "Изготовление и монтаж", desc: "Производим и устанавливаем. Сдаём с гарантией 3 года." },
];

const defaultBullets = [
  "Собственное производство конструкций",
  "Полный цикл: аудит → проект → монтаж → гарантия",
  "Расширенная гарантия 3 года на все системы",
  "Изготовление от 5 рабочих дней",
];

const defaultStats = [
  { value: "200+", label: "защищённых объектов" },
  { value: "12 лет", label: "на рынке инженерной защиты" },
  { value: "[регионов]", label: "присутствие по РФ" },
];

const About = () => {
  const { content } = useContent();
  const { settings } = useSettings();
  const about = content?.about;
  const contacts = content?.contacts;
  const bullets = about?.advantages?.length && about.advantages.some(Boolean) ? about.advantages : defaultBullets;
  const stats = content?.stats?.length && content.stats.some((s) => s.value) ? content.stats : defaultStats;
  const steps = defaultSteps;

  const [digits, setDigits] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = formatPhone(digits);
  const isComplete = digits.length === 10;

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
    if (digits.length !== 10) {
      setError("Введите 10 цифр номера");
      inputRef.current?.focus();
      return;
    }
    const phoneVal = formatPhone(digits);
    setSubmitting(true);
    try {
      await api.createLead(phoneVal, "", "/about");
      setSubmitted(true);
    } catch {
      setError("Ошибка отправки. Попробуйте позвонить или написать в Telegram.");
    } finally {
      setSubmitting(false);
    }
  }, [digits]);

  return (
    <div>
      <SEO
        title="О компании АВИС — производство защиты от БПЛА"
        description="АВИС — производитель систем защиты объектов от БПЛА. 12 лет, 200+ объектов, собственное производство, гарантия 3 года."
        path="/about"
      />

      {/* SECTION 1 — Hero statement */}
      <section style={{ background: "#090b0e" }}>
        <div className="container pt-[72px] pb-[72px] lg:pt-[120px] lg:pb-[120px]">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <img
                src="/logo-avis-about.webp"
                alt="Логотип АВИС — строительная компания"
                width={160}
                height={160}
                className="mx-auto mb-10 rounded-lg"
              />

              <span className="text-[11px] uppercase tracking-[0.15em] text-highlight font-light block mb-6">
                О компании
              </span>
              <h1
                className="font-extralight leading-[1.15]"
                style={{ fontSize: "clamp(32px, 5vw, 52px)", color: "#e8eaf0", letterSpacing: "0.02em" }}
              >
                Инженерная защита.<br />
                это не продукт. Это решение.
              </h1>
              <p
                className="mt-8 text-[16px] leading-[1.8] mx-auto max-w-[600px] italic"
                style={{ color: "#6b7280" }}
              >
                {about?.description || "[Краткое описание компании, предоставит клиент]"}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SECTION 2 — Experience + bullets */}
      <section>
        <div className="container pt-[72px] pb-[72px] lg:pt-[120px] lg:pb-[120px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn>
              <div>
                <span
                  className="text-[120px] font-thin leading-none select-none block"
                  style={{ color: "rgba(192,205,216,0.22)", textShadow: "0 0 60px rgba(74,127,165,0.15)" }}
                >
                  12
                </span>
                <p
                  className="mt-3 text-[18px] font-light"
                  style={{ color: "#c0cdd8" }}
                >
                  лет на рынке<br />инженерной защиты
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <ul className="space-y-[8px]">
                {bullets.map((b) => (
                  <li key={b} className="text-[15px] leading-[1.9]" style={{ color: "#9ca3af" }}>
                    <span style={{ color: "#4a7fa5" }}>·</span> {b}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SECTION — Realized objects stats */}
      <section style={{ background: "#090b0e" }}>
        <div className="container pt-[72px] pb-[72px] lg:pt-[100px] lg:pb-[100px]">
          <FadeIn>
            <h2
              className="text-[11px] uppercase tracking-[0.12em] text-center mb-12"
              style={{ color: "#4a5568" }}
            >
              Реализованные объекты
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 text-center">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.08}>
                <div>
                  <span
                    className="text-[48px] font-extralight block leading-none"
                    style={{ color: "#c0cdd8" }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="text-[12px] uppercase tracking-[0.1em] mt-3 block"
                    style={{ color: "#4a5568" }}
                  >
                    {s.label}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION — Process steps */}
      <section>
        <div className="container pt-[72px] pb-[72px] lg:pt-[120px] lg:pb-[120px]">
          <FadeIn>
            <span
              className="block text-[11px] uppercase tracking-[0.15em] mb-10"
              style={{ color: "#4a7fa5" }}
            >
              Как мы работаем
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            {/* Desktop: horizontal row with arrows */}
            <div className="hidden md:flex items-start justify-between gap-4">
              {steps.map((s, i) => (
                <div key={s.num} className="flex items-start gap-4">
                  <div className="flex flex-col gap-2 max-w-[220px]">
                    <span className="text-[11px] tracking-[0.12em]" style={{ color: "#4a7fa5" }}>
                      {s.num}
                    </span>
                    <span className="text-[15px] font-medium" style={{ color: "#c0cdd8" }}>
                      {s.title}
                    </span>
                    <span className="text-[13px] leading-[1.6]" style={{ color: "#6b7280" }}>
                      {s.desc}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <span
                      className="text-[16px] self-center mt-4 flex-shrink-0"
                      style={{ color: "#2a3040" }}
                    >
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
            {/* Mobile: vertical with line dividers */}
            <div className="flex flex-col md:hidden">
              {steps.map((s, i) => (
                <div key={s.num}>
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] tracking-[0.12em]" style={{ color: "#4a7fa5" }}>
                      {s.num}
                    </span>
                    <span className="text-[15px] font-medium" style={{ color: "#c0cdd8" }}>
                      {s.title}
                    </span>
                    <span className="text-[13px] leading-[1.6]" style={{ color: "#6b7280" }}>
                      {s.desc}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="my-2 ml-1"
                      style={{ width: 2, height: 16, background: "#2a3040" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SECTION — Partners & clients */}
      <section style={{ background: "#090b0e" }}>
        <div className="container pt-[72px] pb-[72px] lg:pt-[100px] lg:pb-[100px]">
          <FadeIn>
            <h2
              className="text-[11px] uppercase tracking-[0.12em] text-center mb-12"
              style={{ color: "#4a5568" }}
            >
              Наши заказчики
            </h2>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 max-w-[900px] mx-auto">
              {[
                'ОАО «ИНТЕР РАО – Электрогенерация»',
                'Межрайонная ИФНС России №7 по Краснодарскому краю',
                'ФГБУ «Объединенный санаторий «Сочи» УДП РФ',
                'ГБУ КК «Дворец спорта Большой»',
                'ООО «КВАРЦ Групп»',
                'АО «МОРЕМОЛЛ»',
                'НАО «Центр Омега»',
                'ОАО «Отель «Звездный»',
                'ПАО «ОГК-2»',
                'АО «Галерея Краснодар»',
                'МУП г. Сочи «Водоканал»',
                'ФГУП «Росморпорт»',
                'ПАО «Калужский турбинный завод»',
                'АО «Силовые машины»',
                'ООО «ГК „Русагро"»',
                'УДП РФ «Объединенный санаторий „Русь"»',
              ].map((name, i) => (
                <FadeIn key={name} delay={i * 0.03}>
                  <div
                    className="flex items-center gap-3 py-3 px-4 rounded-md"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#4a7fa5" }}
                    />
                    <span className="text-[13px]" style={{ color: "#8a95a3" }}>
                      {name}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SECTION — CTA with phone form */}
      <section style={{ background: "#0a0c10" }}>
        <div className="container pt-[72px] pb-[72px] lg:pt-[120px] lg:pb-[120px]">
          <div className="mx-auto max-w-[560px]">
            <FadeIn>
              <div className="text-center mb-10">
                <h2 className="text-[32px] lg:text-[48px] font-extralight tracking-[0.04em]">
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
                      onKeyDown={handleKeyDown}
                      onPaste={handlePaste}
                      onChange={() => {}}
                      autoComplete="tel"
                      className={`w-full rounded-md pl-11 pr-4 text-[16px] font-light tracking-wide text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all h-[52px] ${
                        error ? "border-red-500/60" : ""
                      }`}
                      style={{
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
                    className="w-full h-14 rounded-md font-semibold text-[14px] uppercase tracking-[0.08em] transition-all duration-200 hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #b8860b, #d4a017)",
                      color: "#0d0f12",
                      boxShadow: "none",
                    }}
                  >
                    {submitting ? (
                      <><span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Отправляем...</>
                    ) : (
                      <>Получить бесплатный аудит <ArrowRight className="h-5 w-5" /></>
                    )}
                  </button>

                  <p className="text-center text-[12px] pt-1" style={{ color: "#4a5568" }}>
                    Нажимая «Получить бесплатный аудит», вы соглашаетесь с{" "}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#4a7fa5", textDecoration: "underline" }}>
                      политикой конфиденциальности
                    </a>
                  </p>
                </form>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {/* TODO: Client provides legal info */}
      <section style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="container py-6">
          <div className="text-center text-[12px] leading-[1.8]" style={{ color: "#374151" }}>
            <p>{settings?.companyName || "[Полное юридическое название]"}{settings?.inn ? ` · ИНН: ${settings.inn}` : ""}{settings?.ogrn ? ` · ОГРН: ${settings.ogrn}` : ""}</p>
            <p>{contacts?.address || "[Юридический адрес]"}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
