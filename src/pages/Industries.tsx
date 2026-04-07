import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

import caseSubstation from "@/assets/case-energy-substation.webp";
import caseSubstation1x from "@/assets/case-energy-substation@1x.webp";
import caseWarehouse from "@/assets/case-transport-warehouse.webp";
import caseWarehouse1x from "@/assets/case-transport-warehouse@1x.webp";
import caseFactory from "@/assets/case-industry-factory.webp";
import caseFactory1x from "@/assets/case-industry-factory@1x.webp";
import caseGov from "@/assets/case-gov-admin.webp";
import caseGov1x from "@/assets/case-gov-admin@1x.webp";
import caseDatacenter from "@/assets/case-kii-datacenter.webp";
import caseDatacenter1x from "@/assets/case-kii-datacenter@1x.webp";
import caseOil from "@/assets/case-energy-oil.webp";
import caseOil1x from "@/assets/case-energy-oil@1x.webp";

interface Industry {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  image1x: string;
  risks: string[];
  solutions: string[];
}

const industries: Industry[] = [
  {
    id: "energy",
    title: "Энергетика и ТЭК",
    subtitle: "Защита подстанций, нефтехранилищ и генерирующих объектов",
    image: caseSubstation, image1x: caseSubstation1x,
    risks: ["Атаки БПЛА на трансформаторные подстанции", "Разведка периметра объектов ТЭК", "Угроза воспламенения резервуаров", "Саботаж линий электропередач"],
    solutions: ["Антидроновые сетки для периметра", "Сетки на резервуары", "Комплексная защита объекта"],
  },
  {
    id: "transport",
    title: "Транспорт",
    subtitle: "Защита мостов, тоннелей и транспортных узлов",
    image: caseWarehouse, image1x: caseWarehouse1x,
    risks: ["БПЛА-разведка транспортных маршрутов", "Угроза инфраструктурным объектам", "Саботаж логистических узлов", "Мониторинг воздушного пространства"],
    solutions: ["Сетки для транспортных объектов", "Бетонные ограждения", "Мониторинг и обнаружение БПЛА"],
  },
  {
    id: "industry",
    title: "Промышленность",
    subtitle: "Защита заводов, складов и производственных площадок",
    image: caseFactory, image1x: caseFactory1x,
    risks: ["Промышленный шпионаж с помощью дронов", "Угроза опасным производственным объектам", "Несанкционированная аэросъёмка", "Риск падения БПЛА на территорию"],
    solutions: ["Периметровые сетки", "Защитные шторы", "Роллетные системы"],
  },
  {
    id: "government",
    title: "Государственные объекты",
    subtitle: "Защита административных зданий и режимных объектов",
    image: caseGov, image1x: caseGov1x,
    risks: ["Несанкционированный пролёт над территорией", "Дроны-разведчики", "Угроза первым лицам", "Доставка запрещённых предметов"],
    solutions: ["Комплексная защита объекта", "Убежища и укрытия", "Бетонные ограждения"],
  },
  {
    id: "kii",
    title: "Критическая информационная инфраструктура",
    subtitle: "Защита дата-центров, узлов связи и серверных площадок",
    image: caseDatacenter, image1x: caseDatacenter1x,
    risks: ["Физическое воздействие на оборудование", "Нарушение работы антенн и связи", "Электромагнитные атаки с БПЛА", "Визуальная разведка объектов"],
    solutions: ["Антидроновые сетки", "Защита антенн и мачт", "Роллетные системы"],
  },
  {
    id: "opk",
    title: "ОПК",
    subtitle: "Защита объектов оборонно-промышленного комплекса",
    image: caseOil, image1x: caseOil1x,
    risks: ["Целенаправленные атаки БПЛА", "Разведка режимных территорий", "Угроза хранилищам и арсеналам", "Диверсионные дроны"],
    solutions: ["Комплексная защита периметра", "Убежища и укрытия", "Мониторинг воздушного пространства"],
  },
];

const Industries = () => (
  <div>
    <SEO
      title="Защита предприятий от БПЛА — энергетика, транспорт, КИИ | АВИС"
      description="Защита объектов энергетики, транспортной инфраструктуры и КИИ от угроз БПЛА. Аудит и монтаж."
      path="/industries"
    />

    <section className="bg-grid">
      <div className="container py-16 lg:py-32">
        <FadeIn>
          <h1 className="font-extralight">Отрасли применения</h1>
          <p className="mt-3 max-w-[520px] text-[14px]" style={{ color: "#6b7280" }}>
            Каждая отрасль, свои угрозы. Мы проектируем решения под конкретные риски объекта.
          </p>
        </FadeIn>
      </div>
    </section>

    <section>
      <div className="container py-16 lg:py-24">
        {industries.map((ind, i) => (
          <div key={ind.id}>
            {i > 0 && (
              <div className="my-20" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
            )}
            <FadeIn>
              <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                {/* Left 60% */}
                <div className="lg:w-[60%]">
                  <h2 className="text-[24px] md:text-[28px] font-extralight text-foreground mb-2">
                    {ind.title}
                  </h2>
                  <p className="text-[14px] mb-8" style={{ color: "#6b7280" }}>
                    {ind.subtitle}
                  </p>

                  <div className="mb-8">
                    <span className="text-[11px] uppercase tracking-[0.12em] block mb-4" style={{ color: "#4a5568" }}>
                      ОСНОВНЫЕ УГРОЗЫ
                    </span>
                    <ul className="space-y-2.5">
                      {ind.risks.map((r) => (
                        <li key={r} className="flex items-start gap-3 text-[13px]" style={{ color: "#9ca3af" }}>
                          <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#4a7fa5" }} />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-[0.12em] block mb-4" style={{ color: "#4a5568" }}>
                      РЕКОМЕНДУЕМЫЕ РЕШЕНИЯ
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {ind.solutions.map((s) => (
                        <Link
                          key={s}
                          to="/solutions"
                          className="rounded-[20px] px-4 py-1.5 text-[12px] transition-colors duration-200 hover:border-highlight hover:text-foreground"
                          style={{
                            border: "1px solid rgba(74,127,165,0.25)",
                            color: "#7a8394",
                          }}
                        >
                          {s}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 40% */}
                <div className="lg:w-[40%]">
                  <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <img
                      src={ind.image}
                      srcSet={`${ind.image1x} 1x, ${ind.image} 2x`}
                      alt={ind.title}
                      width={640}
                      height={480}
                      className="w-full h-full object-cover"
                      style={{ filter: "brightness(0.7) saturate(0.5)" }}
                      loading="lazy"
                      decoding="async"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(8,10,14,0.6) 100%)" }}
                    />
                  </div>
                  <div className="mt-5">
                    <Link to="/solutions">
                      <Button variant="hero" size="lg" className="w-full md:w-auto">
                        Обсудить проект <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Industries;
