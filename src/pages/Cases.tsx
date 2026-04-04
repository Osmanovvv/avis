import { useState } from "react";
import FadeIn from "@/components/FadeIn";
import SectionModal from "@/components/SectionModal";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingUp, MapPin, Calendar } from "lucide-react";
import SEO from "@/components/SEO";

import caseSubstation from "@/assets/case-energy-substation.webp";
import caseOil from "@/assets/case-energy-oil.webp";
import caseWarehouse from "@/assets/case-transport-warehouse.webp";
import caseDatacenter from "@/assets/case-kii-datacenter.webp";
import caseFactory from "@/assets/case-industry-factory.webp";
import caseGov from "@/assets/case-gov-admin.webp";

type Sector = "all" | "energy" | "transport" | "industry" | "government" | "kii";

interface CaseItem {
  id: string;
  sector: Sector;
  sectorLabel: string;
  title: string;
  city: string;
  year: string;
  img: string;
  /** masonry height variant */
  tall?: boolean;
  context: string;
  challenge: string;
  architecture: string;
  result: string;
  economicEffect: string;
  details: string;
}

const cases: CaseItem[] = [
  {
    id: "1", sector: "energy", sectorLabel: "Энергетика",
    title: "Подстанция 220 кВ", city: "Екатеринбург", year: "2024",
    img: caseSubstation, tall: true,
    context: "Подстанция 220 кВ в промышленном районе. Открытое распределительное устройство и трансформаторное оборудование без физической защиты сверху.",
    challenge: "Обеспечить непрерывность работы и исключить риск повреждения трансформаторов и ОРУ.",
    architecture: "Периметровые барьеры ОРУ + купольная защита трансформаторов + радар + интеграция с диспетчерским центром.",
    result: "0 инцидентов за 18 месяцев",
    economicEffect: "Предотвращённый ущерб: 120 млн ₽. Время реагирования: 30 сек. Страховая премия: −35%.",
    details: "EPC под ключ за 10 недель. Аудит, проектирование, производство, монтаж, пуско-наладка, обучение."
  },
  {
    id: "2", sector: "energy", sectorLabel: "Энергетика",
    title: "Нефтебаза, 12 резервуаров", city: "Самара", year: "2024",
    img: caseOil,
    context: "Нефтебаза с 12 резервуарами. Взрывоопасная среда, жёсткие требования промышленной безопасности.",
    challenge: "Защитить резервуарный парк и арматуру без нарушения технологических регламентов.",
    architecture: "Усиленные сетки над резервуарами + купольная защита насосных + оптико-электронный мониторинг.",
    result: "Снижение страховой премии на 40%",
    economicEffect: "Согласовано с Ростехнадзором. Искробезопасные материалы. Окупаемость: 16 месяцев.",
    details: "Реализация в рамках норм промбезопасности. Каждый этап согласован с надзорными органами."
  },
  {
    id: "3", sector: "transport", sectorLabel: "Транспорт",
    title: "РЦ e-commerce 80 000 м²", city: "Москва", year: "2025",
    img: caseWarehouse, tall: true,
    context: "РЦ e-commerce 80 000 м² с непрерывным грузооборотом и товарными запасами свыше 2 млрд ₽.",
    challenge: "Защитить складские площади без нарушения логистических процессов.",
    architecture: "Стандартные сетки над складами + оптико-электронное наблюдение + автоматическое оповещение.",
    result: "Непрерывность при 3 инцидентах",
    economicEffect: "Товарные потери: 0. SLA перед маркетплейсами: 100%.",
    details: "Сетки смонтированы с учётом движения техники. Интеграция с видеонаблюдением. Срок: 5 недель."
  },
  {
    id: "4", sector: "kii", sectorLabel: "КИИ",
    title: "ЦОД Tier III", city: "Санкт-Петербург", year: "2024",
    img: caseDatacenter,
    context: "ЦОД Tier III с SLA 99.99%. Чиллеры, ДГУ и кабельные вводы на открытой территории.",
    challenge: "Физическая защита открытых инженерных систем и гарантия SLA.",
    architecture: "Периметр + купольная защита ДГУ/чиллеров + радар + оптика + PSIM-интеграция.",
    result: "SLA 99.99% подтверждён",
    economicEffect: "Час простоя: от 5 млн ₽. Предотвращено 2 инцидента. ROI за год: 300%+.",
    details: "Интеграция с DCIM-платформой. Единый центр мониторинга всех подсистем."
  },
  {
    id: "5", sector: "industry", sectorLabel: "Промышленность",
    title: "Металлургический завод", city: "Челябинск", year: "2025",
    img: caseFactory, tall: true,
    context: "Металлургический завод с открытыми площадками. Реконструкция цеха.",
    challenge: "Защита на период реконструкции без остановки смежных процессов.",
    architecture: "Мобильный комплекс (6 мес.) → стационарная система: барьеры + сетки + радар.",
    result: "Без остановки производства",
    economicEffect: "План выполнен на 100%. Предотвращён срыв контрактов на 500+ млн ₽.",
    details: "Мобильный комплекс за 6 часов. Стационарная система за 8 недель."
  },
  {
    id: "6", sector: "government", sectorLabel: "Госсектор",
    title: "Административный комплекс", city: "Москва", year: "2024",
    img: caseGov,
    context: "Административный комплекс федерального значения.",
    challenge: "Соответствие нормативам с минимальным визуальным воздействием на архитектуру.",
    architecture: "Периметр + оптика фасадов + RF-мониторинг + мобильный комплекс для мероприятий.",
    result: "Полное соответствие нормативам",
    economicEffect: "Все проверки без замечаний. Интеграция без замены действующего оборудования.",
    details: "Визуально нейтральные конструкции. Мобильный комплекс для массовых мероприятий."
  },
];

const sectorFilters: { key: Sector; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "energy", label: "Энергетика" },
  { key: "transport", label: "Транспорт" },
  { key: "industry", label: "Промышленность" },
  { key: "government", label: "Госсектор" },
  { key: "kii", label: "КИИ" },
];

const Cases = () => {
  const [filter, setFilter] = useState<Sector>("all");
  const [selected, setSelected] = useState<CaseItem | null>(null);

  const filtered = filter === "all" ? cases : cases.filter((c) => c.sector === filter);

  return (
    <div>
      <SEO
        title="Реализованные проекты защиты от БПЛА | АВИС"
        description="Выполненные объекты: энергетика, транспорт, промышленность. 200+ защищённых объектов по России."
        path="/cases"
      />
      {/* Header */}
      <section className="bg-grid border-b border-border/60">
        <div className="container py-section-mobile md:py-section-tablet lg:py-20">
          <FadeIn>
            <h1>Реализованные проекты</h1>
            <p className="mt-3 max-w-xl text-muted-foreground leading-relaxed">
              Каждый проект подтверждает отраслевую экспертизу и способность решать задачи любого масштаба
            </p>
          </FadeIn>

          {/* Filter tabs */}
          <FadeIn delay={0.1}>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {sectorFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    filter === f.key
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/80 bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Masonry photo grid */}
      <section>
        <div className="container py-section-mobile md:py-section-tablet lg:py-section">
          <div className="grid grid-cols-1 md:masonry-3 md:columns-3 md:gap-4 space-y-4 md:space-y-0">
            {filtered.map((c, i) => (
              <FadeIn key={c.id} delay={i * 0.05}>
                <button
                  onClick={() => setSelected(c)}
                  className="group relative w-full overflow-hidden rounded-lg md:mb-4 md:break-inside-avoid block"
                >
                  <img
                    src={c.img}
                    alt={c.title}
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
                      c.tall ? "aspect-[3/4] md:aspect-[3/4]" : "aspect-[16/9] md:aspect-[4/3]"
                    }`}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent p-4 md:p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:opacity-0 max-md:opacity-100">
                    <Badge variant="secondary" className="w-fit text-[10px] mb-2">
                      {c.sectorLabel}
                    </Badge>
                    <h2 className="text-[15px] font-semibold text-primary-foreground leading-snug">
                      {c.title}
                    </h2>
                    <div className="flex items-center gap-3 mt-1.5 text-[12px] text-primary-foreground/80">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {c.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {c.year}
                      </span>
                    </div>
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>

          {filtered.length === 0 && (
            <FadeIn>
              <p className="text-center text-muted-foreground py-12">
                Проектов в данной категории пока нет
              </p>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Modal */}
      <SectionModal
        open={!!selected}
        onOpenChange={() => setSelected(null)}
        title={selected?.title || "Детали проекта"}
      >
        {selected && (
          <div className="space-y-5 pt-1">
            {/* Large photo */}
            <div className="aspect-[16/9] overflow-hidden rounded-md">
              <img src={selected.img} alt={selected.title} width={960} height={540} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-[11px]">
                {selected.sectorLabel}
              </Badge>
              <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                <MapPin className="h-3 w-3" /> {selected.city}
              </span>
              <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                <Calendar className="h-3 w-3" /> {selected.year}
              </span>
            </div>

            {/* Result metric highlight */}
            <div className="rounded-lg bg-primary/5 border border-primary/10 p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Результат</p>
                <p className="text-[15px] font-semibold text-foreground">{selected.result}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-[13px] font-medium text-foreground mb-1">Контекст объекта</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{selected.context}</p>
            </div>
            <div className="engineering-line" />
            <div>
              <h4 className="text-[13px] font-medium text-foreground mb-1">Вызов</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{selected.challenge}</p>
            </div>
            <div>
              <h4 className="text-[13px] font-medium text-foreground mb-1">Архитектура решения</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{selected.architecture}</p>
            </div>
            <div className="engineering-line" />
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                <h4 className="text-[13px] font-medium text-foreground">Экономический эффект</h4>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{selected.economicEffect}</p>
            </div>
            <div className="rounded-lg bg-secondary/80 p-3.5">
              <h4 className="text-[13px] font-medium text-foreground mb-0.5">Формат реализации</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{selected.details}</p>
            </div>
          </div>
        )}
      </SectionModal>
    </div>
  );
};

export default Cases;
