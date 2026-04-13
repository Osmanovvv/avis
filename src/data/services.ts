import concreteShelter from "@/assets/catalog/concrete-shelter.webp";
import netsPerimeter from "@/assets/catalog/nets-perimeter.webp";
import complexPerimeter from "@/assets/catalog/complex-perimeter.webp";
import armoredDoors from "@/assets/catalog/armored-doors.webp";
import windowProtection from "@/assets/catalog/window-protection.webp";
import netsReservoirGroup from "@/assets/catalog/nets-reservoir-group.webp";
import vaultDoor from "@/assets/catalog/vault-door.webp";
import metalSupports from "@/assets/catalog/metal-supports.webp";
import shelterEntrance from "@/assets/catalog/shelter-entrance.webp";
import netsHorizontal from "@/assets/catalog/nets-horizontal.webp";
import netsTanks from "@/assets/catalog/nets-tanks.webp";
import netsFramework from "@/assets/catalog/nets-framework.webp";
import complexBuilding from "@/assets/catalog/complex-building.webp";
import netsCovering from "@/assets/catalog/nets-covering.webp";
import modularShelter from "@/assets/catalog/modular-shelter.webp";

export interface Material {
  name: string;
  photo?: string;
  specs: string;
  badge?: string;
}

export interface ServiceData {
  slug: string;
  h1: string;
  heroImage: string;
  description: string;
  materials: Material[];
  steps: { num: string; title: string; desc: string }[];
}

const defaultSteps = [
  { num: "01", title: "Аудит", desc: "Инженер выезжает на объект, оценивает риски и зоны защиты." },
  { num: "02", title: "Изготовление", desc: "Производим конструкции на собственном производстве." },
  { num: "03", title: "Монтаж", desc: "Доставляем и устанавливаем. Сдаём с гарантией." },
];

export const services: ServiceData[] = [
  {
    slug: "shelters",
    h1: "Строительство и реконструкция убежищ",
    heroImage: concreteShelter,
    description:
      "Проектируем и возводим защитные укрытия рядом с существующим зданием или проводим реконструкцию имеющихся. Все работы — под ключ.\n\nУбежища рассчитаны на защиту персонала от ударной волны, осколков и обрушения. Применяем железобетонные конструкции с толщиной стен от 200 мм и герметичными дверями.\n\nВозможна реконструкция существующих подвальных помещений с усилением перекрытий и установкой систем вентиляции.",
    materials: [
      {
        name: "Железобетонные конструкции",
        photo: shelterEntrance,
        specs: "Марка бетона М400, толщина стен от 200 мм, армирование металлическим прутом",
      },
      {
        name: "Профильная труба несущего каркаса",
        photo: metalSupports,
        specs: "Профиль 60×60 / 80×80 мм, горячеоцинкованный, крепление на анкерные болты",
      },
      {
        name: "Герметичные двери",
        photo: vaultDoor,
        specs: "Железобетонные и металлические двери, уплотнители по контуру",
      },
    ],
    steps: defaultSteps,
  },
  {
    slug: "nets",
    h1: "Антидроновые сетки для защиты периметра",
    heroImage: netsPerimeter,
    description:
      "Устанавливаем полиамидные и металлические сетки для перекрытия воздушных зон над объектом. Сетки эффективно останавливают БПЛА на подлёте.\n\nМонтируем на собственные металлические опоры с бетонированием или анкерным креплением. Срок монтажа — от 5 рабочих дней.\n\nПодбираем тип сетки под задачу: лёгкая капроновая для больших площадей или стальная тросовая для критических зон.",
    materials: [
      {
        name: "Полиамидная (капроновая) сетка",
        photo: netsHorizontal,
        specs: "Ячейка 50×50 или 100×100 мм, нить 4-6 мм, цвет: хаки/чёрный",
        badge: "Лёгкая · Не проводит ток · Быстрый монтаж",
      },
      {
        name: "Металлическая сетка (стальной трос)",
        photo: netsTanks,
        specs: "Ячейка 50×50 мм, диаметр троса 4-8 мм, оцинкованная",
        badge: "Высокая прочность · Долговечность",
      },
      {
        name: "Металлические несущие опоры",
        photo: metalSupports,
        specs: "Профильная труба 60×60 мм, бетонирование или анкерное крепление",
      },
    ],
    steps: defaultSteps,
  },
  {
    slug: "barriers",
    h1: "Бетонные ограждения по периметру объекта",
    heroImage: complexPerimeter,
    description:
      "Устанавливаем сборно-разборные и монолитные бетонные ограждения для защиты периметра промышленных и инфраструктурных объектов.\n\nБарьеры защищают от прямого попадания, осколков и несанкционированного проезда. Монтаж возможен без спецтехники.\n\nОбшиваем защитным листом с одной или двух сторон для дополнительной устойчивости к поражающим факторам.",
    materials: [
      {
        name: "Сборно-разборные бетонные блоки",
        photo: complexPerimeter,
        specs: "Горизонтальное исполнение, укладываются на дорожные плиты, монтируются без спецтехники",
      },
      {
        name: "Монолитное бетонное ограждение",
        photo: shelterEntrance,
        specs: "Заливается на месте, усиленное армирование",
      },
      {
        name: "Обшивка защитным листом",
        photo: netsFramework,
        specs: "С одной или двух сторон, крепление на анкерные болты или специальные крепления",
      },
    ],
    steps: defaultSteps,
  },
  {
    slug: "rolletes",
    h1: "Роллетные системы защиты фасадов",
    heroImage: armoredDoors,
    description:
      "Устанавливаем противоосколочные роллеты и защитные ставни на оконные и дверные проёмы зданий. Роллеты защищают от ударной волны, осколков и вторичных поражающих факторов.\n\nСистемы выпускаются с ручным или электроприводом. Монтаж на существующие фасады без капитального ремонта.",
    materials: [
      {
        name: "Противоосколочные роллеты",
        photo: armoredDoors,
        specs: "Стальные профили, толщина 0.8-1.2 мм, ручной или электропривод",
      },
      {
        name: "Защитные ставни",
        photo: complexBuilding,
        specs: "Для оконных и дверных проёмов, быстрый монтаж",
      },
    ],
    steps: defaultSteps,
  },
  {
    slug: "curtains",
    h1: "Защитные шторы и бронирование",
    heroImage: windowProtection,
    description:
      "Устанавливаем внутренние защитные шторы, которые удерживают осколки стекла при взрыве. Быстрая установка без ремонта помещений.\n\nДополнительно применяем бронирующую плёнку на существующее остекление — она удерживает осколки стекла при разрушении и снижает риск травм персонала.",
    materials: [
      {
        name: "Внутренние плотные шторы",
        photo: windowProtection,
        specs: "Удерживают осколки и стекло при взрыве, устанавливаются без ремонта",
      },
      {
        name: "Бронирующая плёнка на стёкла",
        photo: netsCovering,
        specs: "Толщина 100-200 мкм, прозрачная, удерживает осколки стекла при разрушении",
      },
    ],
    steps: defaultSteps,
  },
  {
    slug: "complex",
    h1: "Комплексная защита объектов",
    heroImage: netsReservoirGroup,
    description:
      "Проектируем и реализуем комплексную защиту объекта: антидроновые сетки, бетонные ограждения, защита зданий, убежища для персонала — всё в одном проекте.\n\nНачинаем с аудита объекта и оценки угроз. Разрабатываем архитектуру защиты и выполняем все работы под ключ.\n\nКомплексный подход позволяет оптимизировать бюджет и обеспечить единый стандарт защиты по всему периметру.",
    materials: [
      {
        name: "Антидроновые сетки и опоры",
        photo: netsPerimeter,
        specs: "Полиамидные и металлические сетки на несущих опорах по периметру",
      },
      {
        name: "Бетонные ограждения",
        photo: complexPerimeter,
        specs: "Сборно-разборные и монолитные барьеры по периметру",
      },
      {
        name: "Убежища и укрытия",
        photo: modularShelter,
        specs: "Быстровозводимые модульные укрытия для персонала объекта",
      },
    ],
    steps: defaultSteps,
  },
];

export const getServiceBySlug = (
  slug: string,
  adminServices?: Array<Partial<ServiceData> & { slug: string }>,
): ServiceData | undefined => {
  const base = services.find((s) => s.slug === slug);
  const override = adminServices?.find((s) => s.slug === slug);
  if (!base && !override) return undefined;
  if (!override) return base;
  return {
    slug,
    h1: override.h1 || base?.h1 || "",
    heroImage: override.heroImage || base?.heroImage || "",
    description: override.description || base?.description || "",
    materials: override.materials?.length ? override.materials : (base?.materials || []),
    steps: base?.steps || defaultSteps,
  };
};

export { defaultSteps };
