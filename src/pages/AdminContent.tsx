import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getContent, saveContent, SiteContent } from "@/lib/content-store";
import { Check } from "lucide-react";

const AdminContent = () => {
  const [content, setContent] = useState<SiteContent>(getContent);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveContent(content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateHero = (field: keyof SiteContent["hero"], value: string) => {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  const updateStat = (index: number, field: "value" | "label", value: string) => {
    setContent((prev) => {
      const stats = [...prev.stats];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, stats };
    });
  };

  const updateProduct = (index: number, field: "name" | "description", value: string) => {
    setContent((prev) => {
      const products = [...prev.products];
      products[index] = { ...products[index], [field]: value };
      return { ...prev, products };
    });
  };

  const updateContacts = (field: keyof SiteContent["contacts"], value: string) => {
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

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-light">Контент сайта</h1>
        <Button onClick={handleSave} className="min-w-[140px]">
          {saved ? (
            <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Сохранено</span>
          ) : (
            "Сохранить"
          )}
        </Button>
      </div>

      {/* Hero */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Hero — главный экран</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Строка 1 (белая)</label>
            <Input
              value={content.hero.line1}
              onChange={(e) => updateHero("line1", e.target.value)}
              className="text-base"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Строка 2 (синяя)</label>
            <Input
              value={content.hero.line2}
              onChange={(e) => updateHero("line2", e.target.value)}
              className="text-base"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Подзаголовок</label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) => updateHero("subtitle", e.target.value)}
              className="text-base"
            />
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
                <Input
                  value={stat.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-1 block">Подпись</label>
                <Input
                  value={stat.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                />
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
            <div key={i} className="space-y-2 pb-3 border-b border-border/50 last:border-0 last:pb-0">
              <label className="text-sm text-muted-foreground block">Карточка {i + 1}</label>
              <Input
                placeholder="Название"
                value={product.name}
                onChange={(e) => updateProduct(i, "name", e.target.value)}
              />
              <Input
                placeholder="Описание"
                value={product.description}
                onChange={(e) => updateProduct(i, "description", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Загрузка фото будет доступна после подключения хранилища</p>
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
            <Textarea
              value={content.about.description}
              onChange={(e) => updateAbout("description", e.target.value)}
              rows={3}
              className="text-base"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Преимущества (4 пункта)</label>
            {content.about.advantages.map((adv, i) => (
              <Input
                key={i}
                value={adv}
                onChange={(e) => updateAdvantage(i, e.target.value)}
                className="mb-2"
              />
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
            <Input
              value={content.contacts.phone}
              onChange={(e) => updateContacts("phone", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Email</label>
            <Input
              value={content.contacts.email}
              onChange={(e) => updateContacts("email", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Telegram</label>
            <Input
              value={content.contacts.telegram}
              onChange={(e) => updateContacts("telegram", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Адрес</label>
            <Input
              value={content.contacts.address}
              onChange={(e) => updateContacts("address", e.target.value)}
            />
          </div>
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

export default AdminContent;
