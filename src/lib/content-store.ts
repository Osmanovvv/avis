const CONTENT_KEY = "avis_content";

export interface SiteContent {
  hero: {
    line1: string;
    line2: string;
    subtitle: string;
  };
  stats: Array<{
    value: string;
    label: string;
  }>;
  contacts: {
    phone: string;
    email: string;
    telegram: string;
    address: string;
  };
  about: {
    description: string;
    advantages: string[];
  };
  products: Array<{
    name: string;
    description: string;
  }>;
}

const defaultContent: SiteContent = {
  hero: {
    line1: "ЗАЩИТА ОБЪЕКТОВ ОТ БПЛА",
    line2: "СЕТКИ, ОГРАЖДЕНИЯ, УКРЫТИЯ",
    subtitle: "Пассивная инженерная защита. От аудита до монтажа под ключ",
  },
  stats: [
    { value: "200+", label: "объектов" },
    { value: "12", label: "лет опыта" },
    { value: "5", label: "изготовление" },
    { value: "100%", label: "производство" },
  ],
  contacts: {
    phone: "+7 (XXX) XXX-XX-XX",
    email: "info@avis.ru",
    telegram: "@avis",
    address: "Москва, ул. Примерная, д. 1",
  },
  about: {
    description: "АВИС — производитель систем пассивной защиты объектов от БПЛА. Собственное производство, гарантия 3 года.",
    advantages: [
      "Собственное производство",
      "Гарантия 3 года",
      "200+ объектов",
      "Монтаж под ключ",
    ],
  },
  products: [
    { name: "Сетки периметровые", description: "Защита периметра объекта от БПЛА" },
    { name: "Сетки фасадные", description: "Защита фасадов зданий и сооружений" },
    { name: "Ограждения бетонные", description: "Бетонные ограждения для критической инфраструктуры" },
    { name: "Шторы защитные", description: "Быстроразвёртываемые защитные шторы" },
    { name: "Роллеты защитные", description: "Автоматические защитные роллеты" },
    { name: "Убежища и укрытия", description: "Модульные укрытия для персонала" },
  ],
};

export function getContent(): SiteContent {
  const stored = localStorage.getItem(CONTENT_KEY);
  if (stored) {
    try {
      return { ...defaultContent, ...JSON.parse(stored) };
    } catch {
      return defaultContent;
    }
  }
  return defaultContent;
}

export function saveContent(content: SiteContent): void {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
}

export function getDefaultContent(): SiteContent {
  return defaultContent;
}
