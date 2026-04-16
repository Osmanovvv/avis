import { useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import { ArrowRight, Shield, Wrench, Clock, Award, MapPin, CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import SEO from "@/components/SEO";
import logoAvis from "@/assets/logo-avis.webp";
import { useContent } from "@/hooks/use-content";

const whyUs = [
  { icon: Wrench, text: "Собственное производство металлоконструкций" },
  { icon: Shield, text: "Проектирование по СП 542.1325800.2024" },
  { icon: Clock, text: "Монтаж от 5 дней" },
  { icon: Award, text: "Гарантия 3 года" },
];

const steps = [
  { num: "01", title: "Заявка", desc: "Вы оставляете заявку. Мы связываемся в течение 2 часов." },
  { num: "02", title: "Аудит объекта", desc: "Инженер выезжает на объект. Оценивает риски и зоны защиты." },
  { num: "03", title: "Проектирование", desc: "Разрабатываем архитектуру защиты под ваш объект." },
  { num: "04", title: "Изготовление и монтаж", desc: "Производим и устанавливаем. Сдаём с гарантией 3 года." },
];

const stats = [
  { value: "200+", label: "защищённых объектов" },
  { value: "12 лет", label: "на рынке инженерной защиты" },
  { value: "30+", label: "регионов присутствия" },
];

const regions = [
  "Москва и МО", "Санкт-Петербург", "Краснодарский край", "Ростовская область",
  "Республика Крым", "Белгородская область", "Воронежская область", "Калужская область",
  "Нижегородская область", "Самарская область", "Свердловская область", "Новосибирская область",
  "Татарстан", "Башкортостан", "Дальний Восток",
];

const defaultAdvantages = [
  "Полный цикл: аудит → проектирование → производство → монтаж → гарантия",
  "Собственное производство металлоконструкций и ЖБИ",
  "Работа по СП 542.1325800.2024 и нормам ГО",
  "Расширенная гарантия 3 года на все системы защиты",
  "Изготовление от 5 рабочих дней",
  "Бесплатный выезд инженера на объект",
];

const clientsList = [
  "ИНТЕР РАО - Электрогенерация", "Галерея Краснодар",
  "Межрайонная ИФНС №7 по Краснодарскому краю", "МУП Водоканал города Сочи",
  "ФГБУ Объединённый санаторий Сочи", "ФГУП Росморпорт",
  "ГБУ КК Дворец спорта Большой", "ПАО Калужский турбинный завод",
  "КВАРЦ Групп", "АО Силовые машины",
  "МОРЕМОЛЛ", "Группа Компаний Rusagro",
  "НАО Центр Омега", "Объединённый санаторий Русь",
  "Отель Звёздный", "ПАО ОГК-2",
];

const About = () => {
  const isMobile = useIsMobile();
  const { content } = useContent();
  const [showAllClients, setShowAllClients] = useState(false);

  const aboutDescription = content?.about?.description?.trim() || "";
  const aboutAdvantages = (content?.about?.advantages || []).map((a) => a?.trim()).filter(Boolean);
  const advantages = aboutAdvantages.length > 0 ? aboutAdvantages : defaultAdvantages;

  const visibleClients = isMobile && !showAllClients ? clientsList.slice(0, 6) : clientsList;

  return (
    <div>
      <SEO
        title="О компании АВИС: производство систем защиты от БПЛА"
        description="АВИС: российский производитель средств защиты объектов от БПЛА. 12 лет опыта, 200+ реализованных объектов, присутствие в 30+ регионах РФ."
        keywords="защита от бпла производитель, системы защиты от бпла, АВИС"
        path="/about"
      />

      {/* HERO */}
      <section style={{ background: "#090b0e" }}>
        <div className="container" style={{ padding: isMobile ? "60px 20px 40px" : "120px 40px 80px" }}>
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <img src={logoAvis} alt="АВИС" className="mx-auto mb-8" style={{ height: 50, width: "auto", objectFit: "contain" }} />
              <span className="text-[11px] uppercase tracking-[0.15em] block mb-6" style={{ color: "#4a7fa5" }}>
                О компании
              </span>
              <h1 style={{ fontSize: isMobile ? "clamp(2rem, 8vw, 3.5rem)" : "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "#e8eaf0", letterSpacing: "-0.02em", margin: 0 }}>
                Инженерная защита.
                <br />
                Это не продукт. Это решение.
              </h1>
              <p className="mt-4" style={{ fontSize: "1rem", color: "#4a7fa5", margin: 0, marginTop: 16 }}>
                Инженерная защита объектов{"\u00a0"}от{"\u00a0"}БПЛА
              </p>
              <p className="mt-4 mx-auto max-w-[600px]" style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {aboutDescription || "Компания АВИС специализируется на комплексной пассивной защите промышленных и гражданских объектов от беспилотных летательных аппаратов. Мы проектируем, производим и устанавливаем антидроновые сетки, защитные ограждения, укрытия и системы защиты зданий по всей России."}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHY AVIS */}
      <section>
        <div className="container" style={{ padding: isMobile ? "48px 20px" : "100px 40px" }}>
          <FadeIn>
            <h2 className="text-center mb-8 md:mb-12" style={{ fontSize: isMobile ? "1.25rem" : undefined, fontWeight: 700, letterSpacing: "0.08em" }}>
              Почему АВИС
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {whyUs.map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="rounded-xl text-center" style={{ padding: isMobile ? "20px 12px" : "28px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <item.icon size={20} style={{ color: "#4a7fa5", margin: "0 auto 12px" }} strokeWidth={1.5} />
                  <p style={{ fontSize: isMobile ? "0.8125rem" : "0.875rem", color: "#b0bec5", lineHeight: 1.5 }}>{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#090b0e" }}>
        <div className="container" style={{ padding: isMobile ? "48px 20px" : "100px 40px" }}>
          <FadeIn>
            <h3 className="text-[11px] uppercase tracking-[0.12em] text-center mb-12" style={{ color: "#4a5568" }}>
              Цифры и факты
            </h3>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 text-center">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.08}>
                <div>
                  <span className="font-extralight block leading-none" style={{ fontSize: isMobile ? 40 : 48, color: "#c0cdd8" }}>{s.value}</span>
                  <span className="text-[12px] uppercase tracking-[0.1em] mt-3 block" style={{ color: "#4a5568" }}>{s.label}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* GEOGRAPHY */}
      <section>
        <div className="container" style={{ padding: isMobile ? "48px 20px" : "100px 40px" }}>
          <FadeIn>
            <div className="flex items-center gap-3 mb-8">
              <MapPin size={20} style={{ color: "#4a7fa5" }} />
              <h2 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: "#e8eaf0", margin: 0 }}>
                Присутствие по всей России
              </h2>
            </div>
            <p style={{ fontSize: 14, color: "#7a8394", lineHeight: 1.7, maxWidth: 600, marginBottom: 24 }}>
              Выполняем проекты в 30+ регионах Российской Федерации — от Калининграда до Дальнего Востока. Собственные бригады монтажников, логистика по всей стране. Выезд инженера на объект бесплатно.
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="flex flex-wrap gap-2">
              {regions.map((r) => (
                <span key={r} style={{ background: "rgba(74,127,165,0.1)", border: "1px solid rgba(74,127,165,0.25)", padding: "6px 14px", borderRadius: 20, fontSize: 13, color: "#c0cdd8" }}>
                  {r}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Process steps */}
      <section style={{ background: "#090b0e" }}>
        <div className="container" style={{ padding: isMobile ? "48px 20px" : "100px 40px" }}>
          <FadeIn>
            <span className="block text-[11px] uppercase tracking-[0.15em] mb-10" style={{ color: "#4a7fa5" }}>
              Как мы работаем
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="hidden md:flex items-start justify-between gap-4">
              {steps.map((s, i) => (
                <div key={s.num} className="flex items-start gap-4">
                  <div className="flex flex-col gap-2 max-w-[220px]">
                    <span className="text-[11px] tracking-[0.12em]" style={{ color: "#4a7fa5" }}>{s.num}</span>
                    <span className="text-[15px] font-medium" style={{ color: "#c0cdd8" }}>{s.title}</span>
                    <span className="text-[13px] leading-[1.6]" style={{ color: "#6b7280" }}>{s.desc}</span>
                  </div>
                  {i < steps.length - 1 && <span className="text-[16px] self-center mt-4 flex-shrink-0" style={{ color: "#2a3040" }}>→</span>}
                </div>
              ))}
            </div>
            <div className="flex flex-col md:hidden">
              {steps.map((s, i) => (
                <div key={s.num} style={{ padding: "12px 0", borderBottom: i < steps.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <span className="text-[11px] tracking-[0.12em] block" style={{ color: "#4a7fa5" }}>{s.num}</span>
                  <span className="text-[15px] font-medium block mt-1" style={{ color: "#c0cdd8" }}>{s.title}</span>
                  <span className="text-[13px] leading-[1.6] block mt-1" style={{ color: "#6b7280" }}>{s.desc}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Clients */}
      <section>
        <div className="container" style={{ padding: isMobile ? "48px 20px" : "100px 40px" }}>
          <FadeIn>
            <h3 style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "#4a7fa5", fontWeight: 600, margin: 0, marginBottom: isMobile ? 24 : 32 }}>
              Партнёры и заказчики
            </h3>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-0`}>
              {visibleClients.map((name) => (
                <div key={name} className="flex items-center gap-3" style={{ padding: isMobile ? "12px 0" : "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: isMobile ? 13 : 14, color: "#b0bac8" }}>
                  <span style={{ color: "#4a7fa5", fontSize: 8, flexShrink: 0 }}>●</span>
                  {name}
                </div>
              ))}
            </div>
            {isMobile && !showAllClients && clientsList.length > 6 && (
              <button onClick={() => setShowAllClients(true)} style={{ marginTop: 16, background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#4a7fa5", letterSpacing: "0.1em" }}>
                Показать все ↓
              </button>
            )}
          </FadeIn>
        </div>
      </section>

      {/* Advantages list */}
      <section style={{ background: "#090b0e" }}>
        <div className="container" style={{ padding: isMobile ? "48px 20px" : "80px 40px" }}>
          <FadeIn>
            <h3 style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "#4a7fa5", fontWeight: 600, margin: 0, marginBottom: 24 }}>
              Наши преимущества
            </h3>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advantages.map((text, i) => (
              <FadeIn key={i} delay={i * 0.04}>
                <div className="flex items-start gap-3" style={{ padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
                  <CheckCircle size={16} style={{ color: "#4a7fa5", marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "#b0bac8", lineHeight: 1.5 }}>{text}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="container text-center" style={{ padding: isMobile ? "56px 20px" : "80px 40px" }}>
          <FadeIn>
            <h2 style={{ fontSize: isMobile ? "1.5rem" : "1.75rem", fontWeight: 700, color: "#e8eaf0", marginBottom: 12 }}>
              Запросить бесплатный аудит
            </h2>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 28 }}>
              Оценим угрозы и предложим оптимальное решение
            </p>
            <Link
              to="/contacts"
              className="btn-gold inline-flex items-center justify-center gap-2 rounded-md font-semibold"
              style={{ width: isMobile ? "100%" : 260, height: 56, fontSize: "0.875rem", letterSpacing: "0.04em" }}
            >
              Связаться с нами <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default About;
