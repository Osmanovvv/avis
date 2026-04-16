import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

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
  kpp: string;
  bankAccount: string;
  bankName: string;
  bik: string;
  productionAddress: string;
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
  phone: "",
  email: "",
  telegram: "",
  address: "",
  companyName: "",
  inn: "",
  ogrn: "",
  kpp: "",
  bankAccount: "",
  bankName: "",
  bik: "",
  productionAddress: "",
  seo: {},
};

const AdminSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getSettings()
      .then((data: any) => {
        setSettings({ ...defaultSettings, ...data });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Загрузка...</div>;
  }

  const SaveButton = () => (
    <Button onClick={handleSave} className="min-w-[140px]" disabled={saving}>
      {saving ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : saved ? (
        <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Сохранено</span>
      ) : (
        "Сохранить"
      )}
    </Button>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-light">Настройки</h1>
        <SaveButton />
      </div>

      {/* Company info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Данные компании</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Полное юридическое название</label>
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
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">КПП</label>
              <Input value={settings.kpp} onChange={(e) => update("kpp", e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">БИК</label>
              <Input value={settings.bik} onChange={(e) => update("bik", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Расчётный счёт</label>
            <Input value={settings.bankAccount} onChange={(e) => update("bankAccount", e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Банк</label>
            <Input value={settings.bankName} onChange={(e) => update("bankName", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Адреса</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Юридический адрес</label>
            <Input
              value={settings.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="г.Сочи ул.Пригородная 6, офис 5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Дублирует поле «Адрес» из раздела «Контент → Контакты». При изменении тут — обновите и там.
            </p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Адрес производства</label>
            <Input
              value={settings.productionAddress}
              onChange={(e) => update("productionAddress", e.target.value)}
              placeholder="г.Сочи ул.Пригородная 6"
            />
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

      <div className="flex justify-end pb-8">
        <SaveButton />
      </div>
    </div>
  );
};

export default AdminSettings;
