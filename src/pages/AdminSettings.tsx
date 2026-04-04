import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const SETTINGS_KEY = "avis_settings";

interface SeoFields {
  title: string;
  description: string;
}

interface SiteSettings {
  phone: string;
  email: string;
  telegram: string;
  address: string;
  companyName: string;
  inn: string;
  ogrn: string;
  seo: Record<string, SeoFields>;
}

const pages = [
  { key: "/", label: "Главная" },
  { key: "/solutions", label: "Решения" },
  { key: "/industries", label: "Отрасли" },
  { key: "/cases", label: "Проекты" },
  { key: "/about", label: "О компании" },
  { key: "/contacts", label: "Контакты" },
];

const defaultSettings: SiteSettings = {
  phone: "+7 (XXX) XXX-XX-XX",
  email: "info@avis.ru",
  telegram: "@avis",
  address: "",
  companyName: "ООО АВИС",
  inn: "",
  ogrn: "",
  seo: {
    "/": { title: "Защита от БПЛА — сетки, ограждения, укрытия | АВИС", description: "Пассивная защита объектов от БПЛА: антидроновые сетки, бетонные ограждения, защитные шторы, убежища. Монтаж под ключ. 200+ объектов. Бесплатный аудит." },
    "/solutions": { title: "Каталог средств защиты от БПЛА — антидроновые сетки, ограждения | АВИС", description: "Антидроновые сетки, бетонные ограждения, защитные шторы, роллеты, убежища. Изготовление от 5 дней, гарантия 3 года." },
    "/industries": { title: "Защита предприятий от БПЛА — энергетика, транспорт, КИИ | АВИС", description: "Защита объектов энергетики, транспортной инфраструктуры и КИИ от угроз БПЛА. Аудит и монтаж." },
    "/cases": { title: "Реализованные проекты защиты от БПЛА | АВИС", description: "Выполненные объекты: энергетика, транспорт, промышленность. 200+ защищённых объектов по России." },
    "/about": { title: "О компании АВИС — производство защиты от БПЛА", description: "АВИС — производитель систем защиты объектов от БПЛА. 12 лет, 200+ объектов, собственное производство, гарантия 3 года." },
    "/contacts": { title: "Контакты — запросить аудит защиты объекта | АВИС", description: "Позвоните или напишите в Telegram. Ответим в течение 2 часов. Бесплатный аудит объекта." },
  },
};

function getSettings(): SiteSettings {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) {
    try {
      return { ...defaultSettings, ...JSON.parse(stored) };
    } catch {
      return defaultSettings;
    }
  }
  return defaultSettings;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(getSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (field: keyof Omit<SiteSettings, "seo">, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const updateSeo = (page: string, field: keyof SeoFields, value: string) => {
    setSettings((prev) => ({
      ...prev,
      seo: { ...prev.seo, [page]: { ...prev.seo[page], [field]: value } },
    }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-light">Настройки</h1>
        <Button onClick={handleSave} className="min-w-[140px]">
          {saved ? (
            <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Сохранено</span>
          ) : (
            "Сохранить"
          )}
        </Button>
      </div>

      {/* Company info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Данные компании</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Название компании</label>
            <Input value={settings.companyName} onChange={(e) => update("companyName", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">ИНН</label>
              <Input value={settings.inn} onChange={(e) => update("inn", e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">ОГРН</label>
              <Input value={settings.ogrn} onChange={(e) => update("ogrn", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Контактные данные</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Телефон</label>
            <Input value={settings.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Email</label>
            <Input value={settings.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Telegram (@username)</label>
            <Input value={settings.telegram} onChange={(e) => update("telegram", e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Адрес</label>
            <Input value={settings.address} onChange={(e) => update("address", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* SEO per page */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">SEO — мета-теги страниц</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pages.map((page) => (
            <div key={page.key} className="space-y-2 pb-3 border-b border-border/50 last:border-0 last:pb-0">
              <label className="text-sm font-medium block">{page.label} ({page.key})</label>
              <Input
                placeholder="title"
                value={settings.seo[page.key]?.title || ""}
                onChange={(e) => updateSeo(page.key, "title", e.target.value)}
              />
              <Input
                placeholder="description"
                value={settings.seo[page.key]?.description || ""}
                onChange={(e) => updateSeo(page.key, "description", e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Bottom save */}
      <div className="flex justify-end pb-8">
        <Button onClick={handleSave} className="min-w-[140px]">
          {saved ? (
            <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Сохранено</span>
          ) : (
            "Сохранить"
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
