import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { Check, Loader2, Upload, X, Plus, Trash2, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { invalidateContentCache } from "@/hooks/use-content";
import { defaultServiceCategories, type ServiceCategory } from "@/data/serviceCategories";

interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface CatalogCategory {
  id: string;
  title: string;
  products: CatalogProduct[];
}

interface ServiceMaterial { name: string; specs: string; photo?: string; badge?: string }
interface ProductDetail {
  h1?: string;
  heroImage?: string;
  description?: string;
  materials?: ServiceMaterial[];
  gallery?: string[];
  subcategories?: string[];
  whereUsed?: string;
}

interface ProductCard {
  name: string;
  description: string;
  image: string;
  slug?: string;
  category?: string;
  featured?: boolean;
  shortDesc?: string;
  detail?: ProductDetail;
}

interface ContentData {
  hero: { line1: string; subtitle: string; features: string[] };
  stats: Array<{ value: string; label: string }>;
  products: ProductCard[];
  about: { description: string; advantages: string[] };
  contacts: { phone: string; email: string; telegram: string; address: string };
  catalog: CatalogCategory[];
  categories: ServiceCategory[];
}

// Транслитерация русского → латиница, нижний регистр, дефисы
function slugify(input: string): string {
  const m: Record<string, string> = {
    а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",
    с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
  };
  return (input || "").toLowerCase().trim()
    .split("").map((c) => (/[a-z0-9\s-]/.test(c) ? c : (m[c] ?? ""))).join("")
    .replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "product";
}

const defaultContent: ContentData = {
  hero: { line1: "", subtitle: "", features: ["", "", ""] },
  stats: [{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }],
  products: Array.from({ length: 7 }, () => ({ name: "", description: "", image: "" })),
  about: { description: "", advantages: ["", "", "", ""] },
  contacts: { phone: "", email: "", telegram: "", address: "" },
  catalog: [],
  categories: defaultServiceCategories,
};

const AdminContent = () => {
  const [content, setContent] = useState<ContentData>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getContent().then((data: any) => {
      setContent({
        hero: {
          line1: data.hero?.line1 || "",
          subtitle: data.hero?.subtitle || "",
          features: Array.isArray(data.hero?.features) && data.hero.features.length === 3
            ? data.hero.features
            : ["", "", ""],
        },
        stats: data.stats || defaultContent.stats,
        products: Array.isArray(data.products) ? data.products : defaultContent.products,
        about: data.about || defaultContent.about,
        contacts: data.contacts || defaultContent.contacts,
        catalog: data.catalog || defaultContent.catalog,
        categories: Array.isArray(data.categories) && data.categories.length > 0 ? data.categories : defaultContent.categories,
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
        api.updateContent("catalog", content.catalog),
        api.updateContent("categories", content.categories),
      ]);
      invalidateContentCache();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  // Hero
  const updateHero = (field: "line1" | "subtitle", value: string) => {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  const updateHeroFeature = (idx: number, value: string) => {
    setContent((prev) => {
      const features = [...prev.hero.features];
      features[idx] = value;
      return { ...prev, hero: { ...prev.hero, features } };
    });
  };

  // Stats
  const updateStat = (index: number, field: "value" | "label", value: string) => {
    setContent((prev) => {
      const stats = [...prev.stats];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, stats };
    });
  };

  // Modal: index карточки, у которой редактируем детальную страницу
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Products (home page)
  const updateProduct = (index: number, field: keyof ProductCard, value: any) => {
    setContent((prev) => {
      const products = [...prev.products];
      products[index] = { ...products[index], [field]: value };
      // авто-slug из названия, если пользователь его не задавал вручную
      if (field === "name" && (!products[index].slug || products[index].slug === slugify(prev.products[index].name || ""))) {
        products[index].slug = slugify(value);
      }
      return { ...prev, products };
    });
  };
  const updateProductDetail = (index: number, field: keyof ProductDetail, value: any) => {
    setContent((prev) => {
      const products = [...prev.products];
      const detail = { ...(products[index].detail || {}), [field]: value };
      products[index] = { ...products[index], detail };
      return { ...prev, products };
    });
  };
  const handleDetailHeroImage = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("Максимум 5MB"); return; }
    try { const { url } = await api.uploadMedia(file); updateProductDetail(index, "heroImage", url); }
    catch { alert("Ошибка загрузки"); }
  };
  const addMaterial = (index: number) => {
    setContent((prev) => {
      const products = [...prev.products];
      const detail = { ...(products[index].detail || {}) };
      detail.materials = [...(detail.materials || []), { name: "", specs: "", photo: "", badge: "" }];
      products[index] = { ...products[index], detail };
      return { ...prev, products };
    });
  };
  const removeMaterial = (index: number, mIdx: number) => {
    if (!confirm("Удалить материал?")) return;
    setContent((prev) => {
      const products = [...prev.products];
      const detail = { ...(products[index].detail || {}) };
      detail.materials = (detail.materials || []).filter((_, i) => i !== mIdx);
      products[index] = { ...products[index], detail };
      return { ...prev, products };
    });
  };
  const updateMaterial = (index: number, mIdx: number, field: keyof ServiceMaterial, value: string) => {
    setContent((prev) => {
      const products = [...prev.products];
      const detail = { ...(products[index].detail || {}) };
      detail.materials = (detail.materials || []).map((m, i) => (i === mIdx ? { ...m, [field]: value } : m));
      products[index] = { ...products[index], detail };
      return { ...prev, products };
    });
  };
  const handleMaterialPhoto = async (index: number, mIdx: number, file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("Максимум 5MB"); return; }
    try { const { url } = await api.uploadMedia(file); updateMaterial(index, mIdx, "photo", url); }
    catch { alert("Ошибка загрузки"); }
  };
  const addGalleryImage = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("Максимум 5MB"); return; }
    try {
      const { url } = await api.uploadMedia(file);
      setContent((prev) => {
        const products = [...prev.products];
        const detail = { ...(products[index].detail || {}) };
        detail.gallery = [...(detail.gallery || []), url];
        products[index] = { ...products[index], detail };
        return { ...prev, products };
      });
    } catch { alert("Ошибка загрузки"); }
  };
  const removeGalleryImage = (index: number, gIdx: number) => {
    setContent((prev) => {
      const products = [...prev.products];
      const detail = { ...(products[index].detail || {}) };
      detail.gallery = (detail.gallery || []).filter((_, i) => i !== gIdx);
      products[index] = { ...products[index], detail };
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

  const addCardInCategory = (catId: string) => {
    let newIdx = -1;
    setContent((prev) => {
      newIdx = prev.products.length;
      return {
        ...prev,
        products: [...prev.products, { name: "", description: "", image: "", category: catId }],
      };
    });
    // открываем модалку на новой карточке
    setTimeout(() => setEditingIdx(newIdx), 0);
  };

  const removeCard = (index: number) => {
    if (!confirm("Удалить карточку?")) return;
    setContent((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  // Перемещение карточки вверх/вниз в пределах её категории (свапается с ближайшим
  // соседом того же category в заданном направлении).
  const moveProductInCategory = (index: number, dir: -1 | 1) => {
    setContent((prev) => {
      const products = [...prev.products];
      const cat = products[index]?.category;
      const siblings = products
        .map((p, i) => ({ p, i }))
        .filter((x) => x.p.category === cat);
      const localIdx = siblings.findIndex((x) => x.i === index);
      const targetLocal = localIdx + dir;
      if (targetLocal < 0 || targetLocal >= siblings.length) return prev;
      const targetGlobal = siblings[targetLocal].i;
      [products[index], products[targetGlobal]] = [products[targetGlobal], products[index]];
      return { ...prev, products };
    });
  };

  // Contacts
  const updateContacts = (field: keyof ContentData["contacts"], value: string) => {
    setContent((prev) => ({ ...prev, contacts: { ...prev.contacts, [field]: value } }));
  };

  // Categories
  const updateCategory = (index: number, field: keyof ServiceCategory, value: any) => {
    setContent((prev) => {
      const categories = [...prev.categories];
      categories[index] = { ...categories[index], [field]: value };
      if (field === "label") {
        categories[index].slug = slugify(value);
      }
      return { ...prev, categories };
    });
  };
  const handleCategoryImage = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("Максимум 5MB"); return; }
    try {
      const { url } = await api.uploadMedia(file);
      updateCategory(index, "image", url);
    } catch { alert("Ошибка загрузки"); }
  };
  const addCategory = () => {
    setContent((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          id: `cat-${Date.now()}`,
          slug: "",
          label: "",
          image: "",
          shortDesc: "",
          order: (prev.categories.length > 0 ? Math.max(...prev.categories.map((c) => c.order ?? 0)) : 0) + 1,
        },
      ],
    }));
  };
  const removeCategory = (index: number) => {
    if (!confirm("Удалить категорию? Услуги в ней не удалятся, но потеряют привязку.")) return;
    setContent((prev) => ({ ...prev, categories: prev.categories.filter((_, i) => i !== index) }));
  };
  const moveCategory = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    setContent((prev) => {
      if (target < 0 || target >= prev.categories.length) return prev;
      const categories = [...prev.categories];
      [categories[index], categories[target]] = [categories[target], categories[index]];
      // Sync order field
      categories.forEach((c, i) => { c.order = i + 1; });
      return { ...prev, categories };
    });
  };

  // Category detail page
  const [editingCatIdx, setEditingCatIdx] = useState<number | null>(null);
  const [catDragOver, setCatDragOver] = useState(false);
  const addCategoryGalleryImage = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("Максимум 5MB"); return; }
    try {
      const { url } = await api.uploadMedia(file);
      setContent((prev) => {
        const categories = [...prev.categories];
        const gallery = [...(categories[index].gallery || []), url];
        categories[index] = { ...categories[index], gallery };
        return { ...prev, categories };
      });
    } catch { alert("Ошибка загрузки"); }
  };
  const removeCategoryGalleryImage = (index: number, gIdx: number) => {
    setContent((prev) => {
      const categories = [...prev.categories];
      const gallery = (categories[index].gallery || []).filter((_, i) => i !== gIdx);
      categories[index] = { ...categories[index], gallery };
      return { ...prev, categories };
    });
  };

  // About
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
            <label className="text-sm text-muted-foreground mb-1 block">H1 заголовок (крупный, градиент)</label>
            <Input
              value={content.hero.line1}
              onChange={(e) => updateHero("line1", e.target.value)}
              placeholder="ЗАЩИТА ОБЪЕКТОВ ОТ БПЛА"
              className="text-base"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Подзаголовок (голубой, под H1)</label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) => updateHero("subtitle", e.target.value)}
              className="text-base"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Преимущества (3 пункта с галочками)</label>
            {content.hero.features.map((f, i) => (
              <Input
                key={i}
                value={f}
                onChange={(e) => updateHeroFeature(i, e.target.value)}
                placeholder={["Собственное производство", "Монтаж от 5 дней", "Проектирование по СП 542"][i]}
                className="mb-2 text-base"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Статистика — 4 карточки</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Блок «Наши заказчики» внизу главной. Поле «Значение» может быть числом с суффиксом («9+», «150+», «3 года») — тогда включается анимация счётчика — или коротким текстом («СП 542»).
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {content.stats.map((stat, i) => {
            const placeholders = [
              { v: "9+", l: "лет на рынке" },
              { v: "150+", l: "объектов" },
              { v: "СП 542", l: "проектирование" },
              { v: "3 года", l: "гарантия" },
            ];
            const ph = placeholders[i] || { v: "", l: "" };
            return (
              <div key={i} className="flex gap-3">
                <div className="w-1/3">
                  <label className="text-sm text-muted-foreground mb-1 block">Значение</label>
                  <Input value={stat.value} onChange={(e) => updateStat(i, "value", e.target.value)} placeholder={ph.v} />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground mb-1 block">Подпись</label>
                  <Input value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} placeholder={ph.l} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-base font-medium">Категории услуг</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Используются в меню, фильтре каталога и карточках на главной. Каждая услуга ниже привязывается к одной из этих категорий.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={addCategory} className="gap-1">
              <Plus className="w-4 h-4" /> Категория
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.categories.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Нет категорий. Нажмите «+ Категория».
            </p>
          )}
          {content.categories.map((cat, i) => (
            <div key={cat.id || i} className="space-y-2 pb-4 border-b border-border/50 last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground">Категория {i + 1}</label>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="w-7 h-7" disabled={i === 0} onClick={() => moveCategory(i, -1)} title="Вверх">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-7 h-7" disabled={i === content.categories.length - 1} onClick={() => moveCategory(i, 1)} title="Вниз">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => removeCategory(i)} title="Удалить">
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="flex items-start gap-3">
                {cat.image ? (
                  <div className="relative w-24 h-[72px] rounded border border-border overflow-hidden shrink-0">
                    <img src={cat.image} alt="" className="w-full h-full object-cover" width={96} height={72} />
                    <button
                      type="button"
                      onClick={() => updateCategory(i, "image", "")}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="w-24 h-[72px] rounded border-2 border-dashed border-border hover:border-muted-foreground flex flex-col items-center justify-center cursor-pointer shrink-0">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground mt-0.5">Фото</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCategoryImage(i, f); e.target.value = ""; }} />
                  </label>
                )}
                <div className="flex-1 space-y-2">
                  <Input placeholder="Название" value={cat.label} onChange={(e) => updateCategory(i, "label", e.target.value)} />
                  <Input placeholder="Короткое описание (плашка над карточкой)" value={cat.description || ""} onChange={(e) => updateCategory(i, "description", e.target.value)} />
                  <Input placeholder="Подзаголовок на странице категории" value={cat.shortDesc || ""} onChange={(e) => updateCategory(i, "shortDesc", e.target.value)} />
                  <div className="text-[11px] text-muted-foreground">
                    URL: <span className="font-mono">/solutions/category/{cat.slug || "—"}</span>
                  </div>
                  <div className="flex items-center justify-end pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCatIdx(i)}
                      className="gap-1 whitespace-nowrap"
                    >
                      <FileText className="w-3.5 h-3.5" /> Детальная страница
                    </Button>
                  </div>
                </div>
              </div>

              {/* Карточки услуг в этой категории */}
              {(() => {
                const siblings = content.products
                  .map((p, originalIdx) => ({ p, originalIdx }))
                  .filter(({ p }) => p.category === cat.id);
                return (
                  <div className="ml-[108px] mt-2 pl-3 border-l-2 border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        Карточки в категории ({siblings.length})
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addCardInCategory(cat.id)}
                        className="gap-1 h-7 text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" /> Добавить карточку
                      </Button>
                    </div>
                    {siblings.length === 0 ? (
                      <p className="text-[12px] text-muted-foreground py-1">
                        Пусто. Нажмите «Добавить карточку».
                      </p>
                    ) : (
                      siblings.map(({ p, originalIdx }, localIdx) => (
                        <div
                          key={originalIdx}
                          className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/40"
                        >
                          {p.image ? (
                            <img
                              src={p.image}
                              alt=""
                              className="w-10 h-10 rounded object-cover border shrink-0"
                              width={40}
                              height={40}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded border border-dashed border-border bg-muted/30 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm truncate">
                              {p.name || <span className="text-muted-foreground italic">без названия</span>}
                            </div>
                            {p.slug && (
                              <div className="text-[10px] text-muted-foreground font-mono truncate">
                                /solutions/{p.slug}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-0.5 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7"
                              disabled={localIdx === 0}
                              onClick={() => moveProductInCategory(originalIdx, -1)}
                              title="Вверх"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7"
                              disabled={localIdx === siblings.length - 1}
                              onClick={() => moveProductInCategory(originalIdx, 1)}
                              title="Вниз"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7"
                              onClick={() => setEditingIdx(originalIdx)}
                              title="Редактировать"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7"
                              onClick={() => removeCard(originalIdx)}
                              title="Удалить"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })()}
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

      {/* Service detail page — modal (per card) */}
      <Dialog open={editingIdx !== null} onOpenChange={(open) => !open && setEditingIdx(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {editingIdx !== null && content.products[editingIdx] && (() => {
            const idx = editingIdx;
            const product = content.products[idx];
            const detail: ProductDetail = product.detail || {};
            const effectiveSlug = product.slug || slugify(product.name);
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-base font-medium">
                    Карточка услуги: {product.name || "(без названия)"}
                    <div className="text-xs text-muted-foreground font-normal mt-1">
                      /solutions/<span className="font-mono">{effectiveSlug}</span>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    {product.image ? (
                      <div className="relative w-24 h-[72px] rounded border border-border overflow-hidden shrink-0">
                        <img src={product.image} alt="" className="w-full h-full object-cover" width={96} height={72} />
                        <button
                          type="button"
                          onClick={() => updateProduct(idx, "image", "")}
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-24 h-[72px] rounded border-2 border-dashed border-border hover:border-muted-foreground flex flex-col items-center justify-center cursor-pointer shrink-0">
                        <Upload className="w-4 h-4 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground mt-0.5">Фото</span>
                        <input type="file" accept="image/*" className="hidden"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleProductImage(idx, f); e.target.value = ""; }} />
                      </label>
                    )}
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Заголовок карточки"
                        value={product.name}
                        onChange={(e) => updateProduct(idx, "name", e.target.value)}
                      />
                      <select
                        value={product.category || ""}
                        onChange={(e) => updateProduct(idx, "category", e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                      >
                        <option value="">— Без категории —</option>
                        {content.categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Подзаголовок под H1 (описание)</label>
                    <Input
                      placeholder="Короткое описание услуги — выводится под заголовком на странице"
                      value={product.shortDesc || ""}
                      onChange={(e) => updateProduct(idx, "shortDesc", e.target.value)}
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">Также используется как описание в каталоге на /solutions.</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Области применения</label>
                    <Input
                      placeholder="Например: Резервуары, здания, подстанции, периметр объектов"
                      defaultValue={(detail.subcategories || []).join(", ")}
                      key={`areas-${idx}-${editingIdx}`}
                      onBlur={(e) => updateProductDetail(idx, "subcategories", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">Через запятую. Выводятся как теги в блоке «Области применения» на детальной странице.</p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Материалы</label>
                    <Textarea
                      placeholder={"Каждый пункт — с новой строки. Например:\nТрос оцинкованный Ø4–8 мм\nКанат 50×50 или 100×100 мм\nСтолбы: профтруба 60×60/80×80 мм"}
                      rows={5}
                      defaultValue={(detail.materials || []).map((m) => (m.specs ? `${m.name} (${m.specs})` : m.name)).join("\n")}
                      key={`materials-${idx}-${editingIdx}`}
                      onBlur={(e) => {
                        const items = e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((s) => ({ name: s, specs: "" }));
                        updateProductDetail(idx, "materials", items);
                      }}
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">Каждый пункт — с новой строки. Сохраняется при уходе из поля.</p>
                  </div>
                  {/* Галерея / примеры работ */}
                  <div
                    className={`space-y-2 rounded-lg border-2 border-dashed p-3 transition ${
                      dragOver ? "border-primary bg-primary/5" : "border-transparent"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setDragOver(false);
                      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
                      for (const file of files) await addGalleryImage(idx, file);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-muted-foreground">
                        Примеры работ ({(detail.gallery || []).length})
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer text-sm border rounded px-3 py-1.5 hover:bg-muted">
                        <Upload className="w-4 h-4" /> Добавить фото
                        <input type="file" accept="image/*" multiple className="hidden"
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            for (const file of files) await addGalleryImage(idx, file);
                            e.target.value = "";
                          }} />
                      </label>
                    </div>
                    {(detail.gallery || []).length > 0 ? (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {(detail.gallery || []).map((url, gIdx) => (
                          <div key={gIdx} className="relative group">
                            <img src={url} alt="" className="w-full aspect-square object-cover rounded border" />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx, gIdx)}
                              className="absolute top-1 right-1 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-[13px] text-muted-foreground">
                        Перетащите фото сюда или нажмите «Добавить фото»
                      </div>
                    )}
                    <p className="text-[11px] text-muted-foreground">Показываются в блоке «Примеры работ» на детальной странице услуги.</p>
                  </div>
                </div>
                <div className="flex justify-end pt-3 border-t">
                  <Button onClick={() => setEditingIdx(null)}>Готово</Button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Category detail dialog */}
      <Dialog open={editingCatIdx !== null} onOpenChange={(open) => !open && setEditingCatIdx(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {editingCatIdx !== null && content.categories[editingCatIdx] && (() => {
            const idx = editingCatIdx;
            const cat = content.categories[idx];
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-base font-medium">
                    Детальная страница категории: {cat.label || "(без названия)"}
                    <div className="text-xs text-muted-foreground font-normal mt-1">
                      /solutions/category/<span className="font-mono">{cat.slug || "—"}</span>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Области применения</label>
                    <Input
                      placeholder="Например: Промышленность, энергетика, КИИ, госучреждения"
                      defaultValue={(cat.areas || []).join(", ")}
                      key={`areas-${idx}-${editingCatIdx}`}
                      onBlur={(e) => {
                        const areas = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        setContent((prev) => {
                          const categories = [...prev.categories];
                          categories[idx] = { ...categories[idx], areas };
                          return { ...prev, categories };
                        });
                      }}
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">Через запятую. Сохраняется при уходе из поля.</p>
                  </div>

                  <div
                    className={`space-y-2 rounded-lg border-2 border-dashed p-3 transition ${
                      catDragOver ? "border-primary bg-primary/5" : "border-transparent"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setCatDragOver(true); }}
                    onDragLeave={() => setCatDragOver(false)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setCatDragOver(false);
                      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
                      for (const file of files) await addCategoryGalleryImage(idx, file);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-muted-foreground">
                        Примеры работ ({(cat.gallery || []).length})
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer text-sm border rounded px-3 py-1.5 hover:bg-muted">
                        <Upload className="w-4 h-4" /> Добавить фото
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            for (const file of files) await addCategoryGalleryImage(idx, file);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                    {(cat.gallery || []).length > 0 ? (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {(cat.gallery || []).map((url, gIdx) => (
                          <div key={gIdx} className="relative group">
                            <img src={url} alt="" className="w-full aspect-square object-cover rounded border" />
                            <button
                              type="button"
                              onClick={() => removeCategoryGalleryImage(idx, gIdx)}
                              className="absolute top-1 right-1 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-[13px] text-muted-foreground">
                        Перетащите фото сюда или нажмите «Добавить фото»
                      </div>
                    )}
                    <p className="text-[11px] text-muted-foreground">Отображаются в блоке «Примеры работ» на странице категории.</p>
                  </div>
                </div>
                <div className="flex justify-end pt-3 border-t">
                  <Button onClick={() => setEditingCatIdx(null)}>Готово</Button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      <div className="flex justify-end pb-8">
        <SaveButton />
      </div>
    </div>
  );
};

export default AdminContent;
