import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FadeIn from "@/components/FadeIn";
import { Download, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

/* ── Full documentation content for Claude prompts ── */

const DOC_SECTIONS = [
  {
    id: "stack",
    title: "Технологический стек",
    content: `## Технологический стек

- **Framework**: React 18 + TypeScript
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS 3.4 + tailwindcss-animate
- **UI Kit**: shadcn/ui (default style, HSL CSS variables)
- **Animations**: framer-motion 12
- **Routing**: react-router-dom 6 (BrowserRouter)
- **Forms**: react-hook-form + zod + @hookform/resolvers
- **Icons**: lucide-react 0.462
- **Toasts**: sonner + radix toast
- **Carousel**: embla-carousel-react
- **Charts**: recharts 2`,
  },
  {
    id: "routing",
    title: "Маршрутизация",
    content: `## Маршрутизация

Все страницы обёрнуты в \`<Layout />\` (Header + Footer + FloatingActions).

| Путь | Компонент | Описание |
|------|-----------|----------|
| \`/\` | Index | Главная: hero-видео, каталог, отрасли |
| \`/industries\` | Industries | Отрасли применения |
| \`/solutions\` | Solutions | Каталог продукции (9 категорий) |
| \`/cases\` | Cases | Кейсы / проекты |
| \`/about\` | About | О компании |
| \`/contacts\` | Contacts | Контакты + форма |
| \`/admin/documentation\` | AdminDocumentation | Эта страница |
| \`*\` | NotFound | 404 |`,
  },
  {
    id: "design-system",
    title: "Дизайн-система (CSS Variables)",
    content: `## Дизайн-система — CSS-переменные (HSL)

Все цвета заданы в \`src/index.css\` как HSL-значения без \`hsl()\` обёртки.
В tailwind.config.ts обёрнуты в \`hsl(var(--name))\`.

### Основные цвета
| Токен | HSL | Описание |
|-------|-----|----------|
| \`--background\` | 220 18% 5% | #0d0f12 — тёмный фон |
| \`--foreground\` | 225 20% 93% | #e8eaf0 — основной текст |
| \`--card\` | 222 24% 10% | #141720 — фон карточек |
| \`--secondary\` | 222 20% 14% | фон вторичных элементов |
| \`--muted-foreground\` | 220 14% 53% | #7a8394 — приглушённый текст |
| \`--accent\` | 205 30% 72% | #c0cdd8 — brushed steel |
| \`--highlight\` | 207 36% 47% | #4a7fa5 — cold blue steel |
| \`--gold\` | 43 85% 40% | #b8860b — тёмное золото |
| \`--gold-light\` | 45 78% 46% | #d4a017 — светлое золото |
| \`--steel\` | 220 14% 53% | стальной серый |
| \`--steel-light\` | 205 30% 72% | светлый стальной |
| \`--navy\` | 220 18% 5% | тёмный navy |
| \`--navy-light\` | 222 24% 10% | светлый navy |
| \`--border\` | 0 0% 100% / 0.07 | полупрозрачная граница |
| \`--input\` | 0 0% 100% / 0.1 | фон инпутов |
| \`--ring\` | 207 36% 47% | фокус-кольцо |
| \`--destructive\` | 0 62.8% 30.6% | ошибки |

### Использование в компонентах
\`\`\`tsx
// ✅ Правильно — семантические токены
className="bg-background text-foreground"
className="bg-card border-border"
className="text-muted-foreground"
className="text-highlight"
className="bg-secondary"

// ❌ Неправильно — хардкод цветов
className="bg-[#0d0f12] text-white"
className="bg-gray-900"
\`\`\``,
  },
  {
    id: "typography",
    title: "Типографика",
    content: `## Типографика

Шрифт: **Inter** (загружен через index.html с preload + font-display: swap).
Базовый размер body: **14px**, line-height: **1.8**.
Цвет body: \`hsl(220 14% 53%)\` (muted-foreground).

### Заголовки
Все заголовки: \`font-light uppercase\`, font-family Inter.

| Тег | Mobile | Desktop | letter-spacing | color |
|-----|--------|---------|----------------|-------|
| h1 | 40px | 72px | 0.08em | foreground |
| h2 | 24px | 36px | 0.06em | accent (#c0cdd8) |
| h3 | 15px | 16px | 0.06em | accent (#c0cdd8) |
| h4 | xs | xs | 0.1em | muted-foreground |

### Паттерны текста
- Параграфы: \`text-muted-foreground font-light\`, 14-15px
- Подписи: \`text-[11px] tracking-[0.2em] uppercase text-muted-foreground\`
- Счётчики: \`text-[12px] tracking-[0.2em] uppercase font-light\``,
  },
  {
    id: "button-variants",
    title: "Варианты кнопок",
    content: `## Варианты кнопок (Button)

Все кнопки: \`uppercase tracking-[0.1em] font-light\`, min-h-[52px] на мобильных.

| Variant | Описание | Стили |
|---------|----------|-------|
| \`default\` | Основная | bg-secondary text-foreground |
| \`hero\` | Hero CTA | gradient gold → gold-light, text-background, font-semibold |
| \`hero-outline\` | Hero вторичная | border accent/30, text-accent |
| \`cta\` | Call-to-action | border highlight, text-highlight, hover: bg-highlight text-white |
| \`outline\` | Контурная | border highlight/40, text-highlight |
| \`ghost\` | Призрачная | hover: bg-secondary |
| \`link\` | Ссылка | text-accent, underline on hover |
| \`destructive\` | Деструктивная | bg-destructive |

### Размеры
| Size | Высота | Padding |
|------|--------|---------|
| \`sm\` | h-9 | px-3, text-[11px] |
| \`default\` | h-10 | px-5 |
| \`lg\` | h-12 (h-11 desktop) | px-7 |
| \`icon\` | h-10 w-10 | — |

### Примеры
\`\`\`tsx
<Button variant="cta" size="sm">Запросить аудит</Button>
<Button variant="hero" size="lg">Получить расчёт</Button>
<Button variant="outline">Подробнее</Button>
\`\`\``,
  },
  {
    id: "components",
    title: "Кастомные компоненты",
    content: `## Кастомные компоненты

### FadeIn
Обёртка для появления элементов при скролле.
\`\`\`tsx
import FadeIn from "@/components/FadeIn";

<FadeIn delay={0.1} direction="up">
  <Card>...</Card>
</FadeIn>
// direction: "up" | "down" | "left" | "right"
// delay: число (секунды)
\`\`\`

### OptimizedImage
Ленивая загрузка изображений с placeholder.
\`\`\`tsx
import OptimizedImage from "@/components/OptimizedImage";
<OptimizedImage src={image} alt="..." className="..." />
\`\`\`

### LeadCaptureForm
Форма захвата лидов (react-hook-form + zod).

### SectionModal
Модальное окно для секций.

### VideoShowcase
Витрина видео.

### SolutionsCatalog
Превью каталога продукции на главной (6 карточек).

### MegaMenu
Выпадающее меню навигации «Решения» с категориями из catalog.ts.

### FloatingActions
Плавающие кнопки (WhatsApp / телефон).`,
  },
  {
    id: "shadcn",
    title: "shadcn/ui компоненты",
    content: `## shadcn/ui компоненты (установлены)

Все компоненты в \`src/components/ui/\`:

accordion, alert, alert-dialog, aspect-ratio, avatar, badge,
breadcrumb, button, calendar, card, carousel, chart, checkbox,
collapsible, command, context-menu, dialog, drawer, dropdown-menu,
form, hover-card, input, input-otp, label, menubar, navigation-menu,
pagination, popover, progress, radio-group, resizable, scroll-area,
select, separator, sheet, sidebar, skeleton, slider, sonner, switch,
table, tabs, toast, toaster, toggle, toggle-group, tooltip, textarea

### Импорт
\`\`\`tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
\`\`\``,
  },
  {
    id: "spacing",
    title: "Отступы и сетка",
    content: `## Отступы и сетка

### Container
- Центрирован, max-width: 1280px
- Padding: 1.25rem (default) → 1.5rem (sm) → 2rem (md/lg)

### Секционные отступы
| Токен | Значение |
|-------|----------|
| \`section\` | 96px |
| \`section-tablet\` | 72px |
| \`section-mobile\` | 56px |

Использование: \`py-section-mobile md:py-section-tablet lg:py-section\`

### Тени
| Токен | Описание |
|-------|----------|
| \`shadow-card\` | 0 0 30px rgba(74,127,165,0.08) |
| \`shadow-card-hover\` | 0 0 30px rgba(74,127,165,0.15) |
| \`shadow-gold-glow\` | 0 0 20px rgba(184,134,11,0.25) |

### CSS-утилиты
- \`.bg-grid\` — инженерная сетка 80×80px
- \`.bg-grid-dense\` — плотная сетка 40×40px
- \`.section-divider\` — линия-разделитель
- \`.engineering-line\` — тонкая линия
- \`.noise-overlay\` — шум-текстура через ::before
- \`.card-img-industrial\` — фильтр для фото (brightness 0.7, saturate 0.4)`,
  },
  {
    id: "catalog",
    title: "Каталог продукции",
    content: `## Каталог продукции (src/data/catalog.ts)

9 категорий, ~30 продуктов.

| ID | Категория | Кол-во |
|----|-----------|--------|
| nets | Антидроновые сетки | 5 |
| barriers | Бетонные ограждения | 3 |
| metal | Металлические опоры | 3 |
| curtains | Защитные шторы и бронестекло | 3 |
| rollers | Роллетные системы | 3 |
| shelters | Убежища и укрытия | 4 |
| buildings | Здания и павильоны | 3 |
| monitoring | Мониторинг и обнаружение БПЛА | 3 |
| complex | Комплексная защита объектов | 3 |

### Интерфейсы
\`\`\`ts
interface Product {
  id: string;
  name: string;
  description: string;
  image?: string; // импорт из src/assets/catalog/
}

interface Category {
  id: string;
  title: string;
  products: Product[];
}
\`\`\`

### Превью на главной
\`homePreviewProducts\` — массив из 6 ID для отображения на Index.`,
  },
  {
    id: "assets",
    title: "Медиа-ассеты",
    content: `## Медиа-ассеты

### public/
- \`hero-video.mp4\` — фоновое видео hero-секции (autoplay, muted, loop)
- \`hero-poster.jpg\` — постер до загрузки видео
- \`favicon.ico\`, \`robots.txt\`, \`placeholder.svg\`

### src/assets/
Изображения отраслей:
- \`industry-datacenter.jpg\`, \`industry-energy.jpg\`, \`industry-government.jpg\`
- \`industry-manufacturing.jpg\`, \`industry-transport.jpg\`

Продуктовые:
- \`product-barriers.jpg\`, \`product-curtains.jpg\`, \`product-nets.jpg\`
- \`product-rollers.jpg\`, \`product-shelters.jpg\`

Решения:
- \`solution-complex.jpg\`, \`solution-mesh.jpg\`
- \`solution-monitoring.jpg\`, \`solution-perimeter.jpg\`

Hero: \`hero-perimeter.jpg\`

### src/assets/catalog/
Фото каталога продукции:
- \`nets-perimeter.jpeg\`, \`nets-tanks.png\`, \`nets-horizontal.jpeg\`
- \`nets-covering.jpeg\`, \`nets-transport.jpeg\`, \`nets-reservoir-group.jpeg\`
- \`metal-supports.png\`
- \`complex-perimeter.jpeg\`, \`complex-building.jpeg\``,
  },
  {
    id: "patterns",
    title: "Паттерны и правила промптов",
    content: `## Правила для промптов (Claude / Lovable)

### Обязательно
1. Используй **семантические CSS-токены** из index.css: \`bg-background\`, \`text-foreground\`, \`text-muted-foreground\`, \`bg-card\`, \`text-highlight\`, \`border-border\`, etc.
2. **Никогда** не используй хардкод цветов: \`text-white\`, \`bg-black\`, \`bg-gray-900\` — только токены.
3. Импортируй UI из \`@/components/ui/...\` (shadcn).
4. Используй \`FadeIn\` для анимации при скролле.
5. Отступы секций: \`py-section-mobile md:py-section-tablet lg:py-section\`.
6. Контейнер: \`<div className="container">\`.
7. Кнопки: используй variant \`cta\`, \`hero\`, \`outline\` — не создавай свои стили.
8. Типографика: \`font-light uppercase tracking-[0.06em]\` для заголовков.
9. Шрифт: только Inter.

### Паттерн секции
\`\`\`tsx
<section className="py-section-mobile md:py-section-tablet lg:py-section">
  <div className="container">
    <FadeIn>
      <h4>Подзаголовок</h4>
      <h2 className="mt-2 mb-8">Заголовок секции</h2>
    </FadeIn>
    <div className="grid md:grid-cols-3 gap-4">
      {items.map((item, i) => (
        <FadeIn key={item.id} delay={i * 0.05}>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              ...
            </CardContent>
          </Card>
        </FadeIn>
      ))}
    </div>
  </div>
</section>
\`\`\`

### Паттерн карточки
\`\`\`tsx
<Card className="bg-card border-border hover:shadow-card-hover transition-shadow group">
  <div className="relative overflow-hidden aspect-[4/3]">
    <img src={image} className="card-img-industrial w-full h-full object-cover" loading="lazy" />
  </div>
  <CardContent className="p-5">
    <h3 className="text-accent">{title}</h3>
    <p className="text-muted-foreground text-sm mt-2">{description}</p>
  </CardContent>
</Card>
\`\`\`

### Паттерн hero
\`\`\`tsx
<section className="relative min-h-[100svh] flex items-center">
  <video ... className="absolute inset-0 w-full h-full object-cover" />
  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
  <div className="container relative z-10">
    <h1>Заголовок</h1>
    <p className="text-muted-foreground max-w-xl mt-4">Описание</p>
    <div className="flex gap-3 mt-8">
      <Button variant="hero" size="lg">CTA</Button>
      <Button variant="hero-outline" size="lg">Secondary</Button>
    </div>
  </div>
</section>
\`\`\``,
  },
];

const generateFullMarkdown = (): string => {
  const header = `# АВИС — Документация проекта
## Актуальная версия: ${new Date().toLocaleDateString("ru-RU")}

Этот файл содержит полное описание проекта для использования в промптах Claude / Lovable.
Скопируйте содержимое и вставьте в начало промпта для контекста.

---

`;
  return header + DOC_SECTIONS.map((s) => s.content).join("\n\n---\n\n");
};

const AdminDocumentation = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(DOC_SECTIONS.map((s) => s.id))
  );

  const copySection = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(generateFullMarkdown());
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([generateFullMarkdown()], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avis-documentation-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className="py-section-mobile md:py-section-tablet lg:py-section">
      <div className="container max-w-4xl">
        <FadeIn>
          <h4>Admin</h4>
          <h2 className="mt-2">Документация проекта</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Полный справочник по стеку, дизайн-системе, компонентам и паттернам.
            Скачайте или скопируйте для использования в промптах Claude.
          </p>
        </FadeIn>

        {/* Action bar */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-3 mt-8 mb-8">
            <Button variant="hero" onClick={downloadMarkdown}>
              <Download className="h-4 w-4 mr-2" />
              Скачать .md
            </Button>
            <Button variant="cta" onClick={copyAll}>
              {copiedId === "all" ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copiedId === "all" ? "Скопировано!" : "Копировать всё"}
            </Button>
          </div>
        </FadeIn>

        {/* Sections */}
        <div className="space-y-4">
          {DOC_SECTIONS.map((section, i) => (
            <FadeIn key={section.id} delay={0.05 * i}>
              <Card className="bg-card border-border">
                <CardHeader
                  className="cursor-pointer select-none"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-accent text-sm tracking-wider">
                      {section.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copySection(section.content, section.id);
                        }}
                      >
                        {copiedId === section.id ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      {expandedSections.has(section.id) ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {expandedSections.has(section.id) && (
                  <CardContent>
                    <pre className="text-[13px] leading-relaxed text-muted-foreground whitespace-pre-wrap font-mono overflow-x-auto">
                      {section.content}
                    </pre>
                  </CardContent>
                )}
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDocumentation;
