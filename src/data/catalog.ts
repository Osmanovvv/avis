import netsPerimeter from "@/assets/catalog/nets-perimeter.webp";
import netsPerimeter1x from "@/assets/catalog/nets-perimeter@1x.webp";
import netsTanks from "@/assets/catalog/nets-tanks.webp";
import netsTanks1x from "@/assets/catalog/nets-tanks@1x.webp";
import netsHorizontal from "@/assets/catalog/nets-horizontal.webp";
import netsHorizontal1x from "@/assets/catalog/nets-horizontal@1x.webp";
import netsCovering from "@/assets/catalog/nets-covering.webp";
import netsCovering1x from "@/assets/catalog/nets-covering@1x.webp";
import netsTransport from "@/assets/catalog/nets-transport.webp";
import netsTransport1x from "@/assets/catalog/nets-transport@1x.webp";
import metalSupports from "@/assets/catalog/metal-supports.webp";
import metalSupports1x from "@/assets/catalog/metal-supports@1x.webp";
import complexPerimeter from "@/assets/catalog/complex-perimeter.webp";
import complexPerimeter1x from "@/assets/catalog/complex-perimeter@1x.webp";
import netsReservoirGroup from "@/assets/catalog/nets-reservoir-group.webp";
import netsReservoirGroup1x from "@/assets/catalog/nets-reservoir-group@1x.webp";
import complexBuilding from "@/assets/catalog/complex-building.webp";
import complexBuilding1x from "@/assets/catalog/complex-building@1x.webp";
import windowProtection from "@/assets/catalog/window-protection.webp";
import windowProtection1x from "@/assets/catalog/window-protection@1x.webp";
import netsFramework from "@/assets/catalog/nets-framework.webp";
import netsFramework1x from "@/assets/catalog/nets-framework@1x.webp";
import armoredDoors from "@/assets/catalog/armored-doors.webp";
import armoredDoors1x from "@/assets/catalog/armored-doors@1x.webp";
import modularShelter from "@/assets/catalog/modular-shelter.webp";
import modularShelter1x from "@/assets/catalog/modular-shelter@1x.webp";
import shelterEntrance from "@/assets/catalog/shelter-entrance.webp";
import shelterEntrance1x from "@/assets/catalog/shelter-entrance@1x.webp";
import vaultDoor from "@/assets/catalog/vault-door.webp";
import vaultDoor1x from "@/assets/catalog/vault-door@1x.webp";
import concreteShelter from "@/assets/catalog/concrete-shelter.webp";
import concreteShelter1x from "@/assets/catalog/concrete-shelter@1x.webp";
import undergroundShelter from "@/assets/catalog/underground-shelter.webp";
import undergroundShelter1x from "@/assets/catalog/underground-shelter@1x.webp";
import antennaProtection from "@/assets/catalog/antenna-protection.webp";
import antennaProtection1x from "@/assets/catalog/antenna-protection@1x.webp";

export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  image1x?: string;
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
      { id: "nets-1", name: "Сетка для периметра", description: "Периметровое перекрытие зон подлёта к объекту", image: netsPerimeter, image1x: netsPerimeter1x },
      { id: "nets-2", name: "Сетка на резервуары", description: "Защита резервуаров и ёмкостей от воздушных угроз", image: netsTanks, image1x: netsTanks1x },
      { id: "nets-3", name: "Горизонтальная сетка 50×50", description: "Перекрытие открытых площадей сеткой с мелким шагом", image: netsHorizontal, image1x: netsHorizontal1x },
      { id: "nets-4", name: "Верхняя укрывающая сетка", description: "Купольное укрытие для критических зон объекта", image: netsCovering, image1x: netsCovering1x },
      { id: "nets-5", name: "Сетка для транспорта", description: "Защита мостов, тоннелей и транспортных узлов", image: netsTransport, image1x: netsTransport1x },
    ],
  },
  {
    id: "barriers",
    title: "Бетонные ограждения",
    products: [
      { id: "barriers-1", name: "Горизонтальные ЖБ-блоки", description: "Блоки для формирования защитного периметра", image: complexPerimeter, image1x: complexPerimeter1x },
      { id: "barriers-2", name: "Периметральные барьеры", description: "Стационарные бетонные ограждения по периметру", image: shelterEntrance, image1x: shelterEntrance1x },
      { id: "barriers-3", name: "Конструкции для КИИ", description: "Усиленные конструкции для критической инфраструктуры", image: netsFramework, image1x: netsFramework1x },
    ],
  },
  {
    id: "metal",
    title: "Металлические опоры и конструкции",
    products: [
      { id: "metal-1", name: "Металлические опоры", description: "Опорные конструкции для крепления сеток и тросов", image: metalSupports, image1x: metalSupports1x },
      { id: "metal-2", name: "Несущие конструкции", description: "Каркасные системы натяжения тросовых заграждений", image: antennaProtection, image1x: antennaProtection1x },
      { id: "metal-3", name: "Узлы крепления", description: "Комплектующие для монтажа тросовых систем", image: netsFramework, image1x: netsFramework1x },
    ],
  },
  {
    id: "curtains",
    title: "Защитные шторы и бронестекло",
    products: [
      { id: "curtains-1", name: "Защитные шторы", description: "Шторы для защиты от осколков и ударной волны", image: windowProtection, image1x: windowProtection1x },
      { id: "curtains-2", name: "Бронирующая плёнка", description: "Плёнка для укрепления существующего остекления", image: windowProtection, image1x: windowProtection1x },
      { id: "curtains-3", name: "Бронестекло", description: "Ударопрочное остекление для фасадов и проёмов", image: windowProtection, image1x: windowProtection1x },
    ],
  },
  {
    id: "rollers",
    title: "Роллетные системы",
    products: [
      { id: "rollers-1", name: "Роллеты от осколков", description: "Защитные роллеты для оконных и дверных проёмов", image: windowProtection, image1x: windowProtection1x },
      { id: "rollers-2", name: "Противовзрывные роллеты", description: "Усиленные роллеты для объектов высокого риска", image: armoredDoors, image1x: armoredDoors1x },
      { id: "rollers-3", name: "Фасадные ставни", description: "Наружные ставни для защиты фасадов зданий", image: windowProtection, image1x: windowProtection1x },
    ],
  },
  {
    id: "shelters",
    title: "Убежища и укрытия",
    products: [
      { id: "shelters-1", name: "Строительство убежища", description: "Возведение отдельностоящих защитных сооружений", image: concreteShelter, image1x: concreteShelter1x },
      { id: "shelters-2", name: "Реконструкция убежищ", description: "Модернизация и восстановление действующих укрытий", image: shelterEntrance, image1x: shelterEntrance1x },
      { id: "shelters-3", name: "Модульные укрытия", description: "Быстровозводимые модульные укрытия для персонала", image: modularShelter, image1x: modularShelter1x },
      { id: "shelters-4", name: "КХО", description: "Оборудование специализированных помещений хранения", image: vaultDoor, image1x: vaultDoor1x },
    ],
  },
  {
    id: "buildings",
    title: "Здания и павильоны",
    products: [
      { id: "buildings-1", name: "Модульные здания", description: "Быстровозводимые здания с повышенной защитой", image: modularShelter, image1x: modularShelter1x },
      { id: "buildings-2", name: "Павильоны и посты охраны", description: "Защитные сооружения для КПП и охранных постов", image: shelterEntrance, image1x: shelterEntrance1x },
      { id: "buildings-3", name: "Строительство под ключ", description: "Полный цикл строительства защитных объектов", image: concreteShelter, image1x: concreteShelter1x },
    ],
  },
  {
    id: "monitoring",
    title: "Мониторинг и обнаружение БПЛА",
    products: [
      { id: "monitoring-1", name: "Акустическое обнаружение", description: "Обнаружение дронов по звуковой сигнатуре", image: antennaProtection, image1x: antennaProtection1x },
      { id: "monitoring-2", name: "Радарные комплексы", description: "Всепогодное радиолокационное обнаружение БПЛА", image: antennaProtection, image1x: antennaProtection1x },
      { id: "monitoring-3", name: "RF-мониторинг", description: "Анализ радиочастотного спектра для обнаружения дронов", image: antennaProtection, image1x: antennaProtection1x },
    ],
  },
  {
    id: "complex",
    title: "Комплексная защита объектов",
    products: [
      { id: "complex-1", name: "Периметр под ключ", description: "Комплексное решение для полной защиты объекта", image: netsReservoirGroup, image1x: netsReservoirGroup1x },
      { id: "complex-2", name: "Защита зданий от БПЛА", description: "Многоуровневая система защиты здания", image: complexBuilding, image1x: complexBuilding1x },
      { id: "complex-3", name: "Защита транспорта", description: "Специализированная защита транспортных объектов", image: undergroundShelter, image1x: undergroundShelter1x },
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
