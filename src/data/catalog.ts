import netsPerimeter from "@/assets/catalog/nets-perimeter.webp";
import netsTanks from "@/assets/catalog/nets-tanks.webp";
import netsHorizontal from "@/assets/catalog/nets-horizontal.webp";
import netsCovering from "@/assets/catalog/nets-covering.webp";
import netsTransport from "@/assets/catalog/nets-transport.webp";
import metalSupports from "@/assets/catalog/metal-supports.webp";
import complexPerimeter from "@/assets/catalog/complex-perimeter.webp";
import netsReservoirGroup from "@/assets/catalog/nets-reservoir-group.webp";
import complexBuilding from "@/assets/catalog/complex-building.webp";
import windowProtection from "@/assets/catalog/window-protection.webp";
import netsFramework from "@/assets/catalog/nets-framework.webp";
import armoredDoors from "@/assets/catalog/armored-doors.webp";
import modularShelter from "@/assets/catalog/modular-shelter.webp";
import shelterEntrance from "@/assets/catalog/shelter-entrance.webp";
import vaultDoor from "@/assets/catalog/vault-door.webp";
import concreteShelter from "@/assets/catalog/concrete-shelter.webp";
import undergroundShelter from "@/assets/catalog/underground-shelter.webp";
import antennaProtection from "@/assets/catalog/antenna-protection.webp";

export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export interface Category {
  id: string;
  title: string;
  products: Product[];
}

export const catalog: Category[] = [
  {
    id: "nets",
    title: "Антидроновые сетки",
    products: [
      { id: "nets-1", name: "Сетка для периметра", description: "Периметровое перекрытие зон подлёта к объекту", image: netsPerimeter },
      { id: "nets-2", name: "Сетка на резервуары", description: "Защита резервуаров и ёмкостей от воздушных угроз", image: netsTanks },
      { id: "nets-3", name: "Горизонтальная сетка 50×50", description: "Перекрытие открытых площадей сеткой с мелким шагом", image: netsHorizontal },
      { id: "nets-4", name: "Верхняя укрывающая сетка", description: "Купольное укрытие для критических зон объекта", image: netsCovering },
      { id: "nets-5", name: "Сетка для транспорта", description: "Защита мостов, тоннелей и транспортных узлов", image: netsTransport },
    ],
  },
  {
    id: "barriers",
    title: "Бетонные ограждения",
    products: [
      { id: "barriers-1", name: "Горизонтальные ЖБ-блоки", description: "Блоки для формирования защитного периметра", image: complexPerimeter },
      { id: "barriers-2", name: "Периметральные барьеры", description: "Стационарные бетонные ограждения по периметру", image: shelterEntrance },
      { id: "barriers-3", name: "Конструкции для КИИ", description: "Усиленные конструкции для критической инфраструктуры", image: netsFramework },
    ],
  },
  {
    id: "metal",
    title: "Металлические опоры и конструкции",
    products: [
      { id: "metal-1", name: "Металлические опоры", description: "Опорные конструкции для крепления сеток и тросов", image: metalSupports },
      { id: "metal-2", name: "Несущие конструкции", description: "Каркасные системы натяжения тросовых заграждений", image: antennaProtection },
      { id: "metal-3", name: "Узлы крепления", description: "Комплектующие для монтажа тросовых систем", image: netsFramework },
    ],
  },
  {
    id: "curtains",
    title: "Защитные шторы и бронестекло",
    products: [
      { id: "curtains-1", name: "Защитные шторы", description: "Шторы для защиты от осколков и ударной волны", image: windowProtection },
      { id: "curtains-2", name: "Бронирующая плёнка", description: "Плёнка для укрепления существующего остекления", image: windowProtection },
      { id: "curtains-3", name: "Бронестекло", description: "Ударопрочное остекление для фасадов и проёмов", image: windowProtection },
    ],
  },
  {
    id: "rollers",
    title: "Роллетные системы",
    products: [
      { id: "rollers-1", name: "Роллеты от осколков", description: "Защитные роллеты для оконных и дверных проёмов", image: windowProtection },
      { id: "rollers-2", name: "Противовзрывные роллеты", description: "Усиленные роллеты для объектов высокого риска", image: armoredDoors },
      { id: "rollers-3", name: "Фасадные ставни", description: "Наружные ставни для защиты фасадов зданий", image: windowProtection },
    ],
  },
  {
    id: "shelters",
    title: "Убежища и укрытия",
    products: [
      { id: "shelters-1", name: "Строительство убежища", description: "Возведение отдельностоящих защитных сооружений", image: concreteShelter },
      { id: "shelters-2", name: "Реконструкция убежищ", description: "Модернизация и восстановление действующих укрытий", image: shelterEntrance },
      { id: "shelters-3", name: "Модульные укрытия", description: "Быстровозводимые модульные укрытия для персонала", image: modularShelter },
      { id: "shelters-4", name: "КХО", description: "Оборудование специализированных помещений хранения", image: vaultDoor },
    ],
  },
  {
    id: "buildings",
    title: "Здания и павильоны",
    products: [
      { id: "buildings-1", name: "Модульные здания", description: "Быстровозводимые здания с повышенной защитой", image: modularShelter },
      { id: "buildings-2", name: "Павильоны и посты охраны", description: "Защитные сооружения для КПП и охранных постов", image: shelterEntrance },
      { id: "buildings-3", name: "Строительство под ключ", description: "Полный цикл строительства защитных объектов", image: concreteShelter },
    ],
  },
  {
    id: "monitoring",
    title: "Мониторинг и обнаружение БПЛА",
    products: [
      { id: "monitoring-1", name: "Акустическое обнаружение", description: "Обнаружение дронов по звуковой сигнатуре", image: antennaProtection },
      { id: "monitoring-2", name: "Радарные комплексы", description: "Всепогодное радиолокационное обнаружение БПЛА", image: antennaProtection },
      { id: "monitoring-3", name: "RF-мониторинг", description: "Анализ радиочастотного спектра для обнаружения дронов", image: antennaProtection },
    ],
  },
  {
    id: "complex",
    title: "Комплексная защита объектов",
    products: [
      { id: "complex-1", name: "Периметр под ключ", description: "Комплексное решение для полной защиты объекта", image: netsReservoirGroup },
      { id: "complex-2", name: "Защита зданий от БПЛА", description: "Многоуровневая система защиты здания", image: complexBuilding },
      { id: "complex-3", name: "Защита транспорта", description: "Специализированная защита транспортных объектов", image: undergroundShelter },
    ],
  },
];

/** Top 6 products for home page preview */
export const homePreviewProducts: string[] = [
  "nets-1",
  "barriers-1",
  "curtains-1",
  "rollers-1",
  "shelters-1",
  "complex-1",
];
