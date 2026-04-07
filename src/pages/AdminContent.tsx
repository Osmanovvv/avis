import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Check, Loader2, Upload, X } from "lucide-react";
import { invalidateContentCache } from "@/hooks/use-content";

interface ContentData {
  hero: { line1: string; line2: string; subtitle: string };
  stats: Array<{ value: string; label: string }>;
  products: Array<{ name: string; description: string; image: string }>;
  about: { description: string; advantages: string[] };
  contacts: { phone: string; email: string; telegram: string; address: string };
}

const defaultContent: ContentData = {
  hero: { line1: "", line2: "", subtitle: "" },
  stats: [{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }],
  products: Array.from({ length: 6 }, () => ({ name: "", description: "", image: "" })),
  about: { description: "", advantages: ["", "", "", ""] },
  contacts: { phone: "", email: "", telegram: "", address: "" },
};

const AdminContent = () => {
  const [content, setContent] = useState<ContentData>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getContent().then((data: any) => {
      setContent({
        hero: data.hero || defaultContent.hero,
        stats: data.stats || defaultContent.stats,
        products: data.products || defaultContent.products,
        about: data.about || defaultContent.about,
        contacts: data.contacts || defaultContent.contacts,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        api.updateContent("hero", content.hero),
        api.updateContent("stats", content.stats),
        api.updateContent("products", content.products),
        api.updateContent("about", content.about),
        api.updateContent("contacts", content.contacts),
      ]);
      invalidateContentCache();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      alert("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (field: keyof ContentData["hero"], value: string) => {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  const updateStat = (index: number, field: "value" | "label", value: string) => {
    setContent((prev) => {
      const stats = [...prev.stats];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, stats };
    });
  };

  const updateProduct = (index: number, field: "name" | "description" | "image", value: string) => {
    setContent((prev) => {
      const products = [...prev.products];
      products[index] = { ...products[index], [field]: value };
      return { ...prev, products };
    });
  };

  const handleProductImage = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("Максимум 5MB"); return; }
    try {
      const { url } = await api.uploadMedia(file);
      updateProduct(index, "image", url);
    } catch {
      alert("Ошибка загрузки");
    }
  };

  const updateContacts = (field: keyof ContentData["contacts"], value: string) => {
    setContent((prev) => ({ ...prev, contacts: { ...prev.contacts, [field]: value } }));
  };

  const updateAbout = (field: "description", value: string) => {
    setContent((prev) => ({ ...prev, about: { ...prev.about, [field]: value } }));
  };

  const updateAdvantage = (index: number, value: string) => {
    setContent((prev) => {
      const advantages = [...prev.about.advantages];
      advantages[index] = value;
      return { ...prev, about: { ...prev.about, advantages } };
    });
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
        <h1 className="text-xl font-light">Контент сайта</h1>
        <SaveButton />
      </div>

      {/* Hero */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Hero — главный экран</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Строка 1 (белая)</label>
            <Input value={content.hero.line1} onChange={(e) => updateHero("line1", e.target.value)} className="text-base" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Строка 2 (синяя)</label>
            <Input value={content.hero.line2} onChange={(e) => updateHero("line2", e.target.value)} className="text-base" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Подзаголовок</label>
            <Input value={content.hero.subtitle} onChange={(e) => updateHero("subtitle", e.target.value)} className="text-base" />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Статистика — 4 числа</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {content.stats.map((stat, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-1/3">
                <label className="text-sm text-muted-foreground mb-1 block">Число</label>
                <Input value={stat.value} onChange={(e) => updateStat(i, "value", e.target.value)} />
              </div>
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">Подпись</label>
                <Input value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Продукты на главной — 6 карточек</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.products.map((product, i) => (
            <div key={i} className="space-y-2 pb-4 border-b border-border/50 last:border-0 last:pb-0">
              <label className="text-sm text-muted-foreground block">Карточка {i + 1}</label>
              <div className="flex items-start gap-3">
                {product.image ? (
                  <div className="relative w-24 h-[72px] rounded border border-border overflow-hidden shrink-0">
                    <img src={product.image} alt="" className="w-full h-full object-cover" width={96} height={72} />
                    <button
                      type="button"
                      onClick={() => updateProduct(i, "image", "")}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="w-24 h-[72px] rounded border-2 border-dashed border-border hover:border-muted-foreground flex flex-col items-center justify-center cursor-pointer shrink-0">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground mt-0.5">Фото</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleProductImage(i, f); e.target.value = ""; }} />
                  </label>
                )}
                <div className="flex-1 space-y-2">
                  <Input placeholder="Название" value={product.name} onChange={(e) => updateProduct(i, "name", e.target.value)} />
                  <Input placeholder="Описание" value={product.description} onChange={(e) => updateProduct(i, "description", e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">О компании</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Описание</label>
            <Textarea value={content.about.description} onChange={(e) => updateAbout("description", e.target.value)} rows={3} className="text-base" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Преимущества (4 пункта)</label>
            {content.about.advantages.map((adv, i) => (
              <Input key={i} value={adv} onChange={(e) => updateAdvantage(i, e.target.value)} className="mb-2" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Контакты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Телефон</label>
            <Input value={content.contacts.phone} onChange={(e) => updateContacts("phone", e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Email</label>
            <Input value={content.contacts.email} onChange={(e) => updateContacts("email", e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Telegram</label>
            <Input value={content.contacts.telegram} onChange={(e) => updateContacts("telegram", e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Адрес</label>
            <Input value={content.contacts.address} onChange={(e) => updateContacts("address", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-8">
        <SaveButton />
      </div>
    </div>
  );
};

export default AdminContent;
