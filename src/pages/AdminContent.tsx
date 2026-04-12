import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Check, Loader2, Upload, X, Plus, Trash2, ChevronDown, ChevronUp, Download } from "lucide-react";
import { invalidateContentCache } from "@/hooks/use-content";
import { services as defaultServicesData } from "@/data/services";

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

interface ServiceMaterial {
  name: string;
  photo?: string;
  specs: string;
  badge?: string;
}

interface ServiceItem {
  slug: string;
  h1: string;
  heroImage: string;
  description: string;
  materials: ServiceMaterial[];
}

interface ContentData {
  hero: { line1: string; line2: string; subtitle: string };
  stats: Array<{ value: string; label: string }>;
  products: Array<{ name: string; description: string; image: string }>;
  about: { description: string; advantages: string[] };
  contacts: { phone: string; email: string; telegram: string; address: string };
  catalog: CatalogCategory[];
  services: ServiceItem[];
}

const defaultContent: ContentData = {
  hero: { line1: "", line2: "", subtitle: "" },
  stats: [{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }],
  products: Array.from({ length: 6 }, () => ({ name: "", description: "", image: "" })),
  about: { description: "", advantages: ["", "", "", ""] },
  contacts: { phone: "", email: "", telegram: "", address: "" },
  catalog: [],
  services: [],
};

const AdminContent = () => {
  const [content, setContent] = useState<ContentData>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [openServices, setOpenServices] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.getContent().then((data: any) => {
      setContent({
        hero: data.hero || defaultContent.hero,
        stats: data.stats || defaultContent.stats,
        products: data.products || defaultContent.products,
        about: data.about || defaultContent.about,
        contacts: data.contacts || defaultContent.contacts,
        catalog: data.catalog || defaultContent.catalog,
        services: data.services || defaultContent.services,
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
        api.updateContent("services", content.services),
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
  const updateHero = (field: keyof ContentData["hero"], value: string) => {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  // Stats
  const updateStat = (index: number, field: "value" | "label", value: string) => {
    setContent((prev) => {
      const stats = [...prev.stats];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, stats };
    });
  };

  // Products (home page)
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

  // Contacts
  const updateContacts = (field: keyof ContentData["contacts"], value: string) => {
    setContent((prev) => ({ ...prev, contacts: { ...prev.contacts, [field]: value } }));
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

  // ── Catalog ──
  const addCategory = () => {
    const id = "cat-" + Date.now();
    setContent((prev) => ({
      ...prev,
      catalog: [...prev.catalog, { id, title: "", products: [] }],
    }));
    setOpenCategories((prev) => ({ ...prev, [id]: true }));
  };

  const removeCategory = (catIndex: number) => {
    if (!confirm("Удалить категорию и все её карточки?")) return;
    setContent((prev) => ({
      ...prev,
      catalog: prev.catalog.filter((_, i) => i !== catIndex),
    }));
  };

  const updateCategoryTitle = (catIndex: number, title: string) => {
    setContent((prev) => {
      const catalog = [...prev.catalog];
      catalog[catIndex] = { ...catalog[catIndex], title };
      return { ...prev, catalog };
    });
  };

  const addProduct = (catIndex: number) => {
    setContent((prev) => {
      const catalog = [...prev.catalog];
      const cat = { ...catalog[catIndex] };
      cat.products = [...cat.products, { id: `p-${Date.now()}`, name: "", description: "", image: "" }];
      catalog[catIndex] = cat;
      return { ...prev, catalog };
    });
  };

  const removeProduct = (catIndex: number, prodIndex: number) => {
    setContent((prev) => {
      const catalog = [...prev.catalog];
      const cat = { ...catalog[catIndex] };
      cat.products = cat.products.filter((_, i) => i !== prodIndex);
      catalog[catIndex] = cat;
      return { ...prev, catalog };
    });
  };

  const updateCatalogProduct = (catIndex: number, prodIndex: number, field: "name" | "description" | "image", value: string) => {
    setContent((prev) => {
      const catalog = [...prev.catalog];
      const cat = { ...catalog[catIndex] };
      const products = [...cat.products];
      products[prodIndex] = { ...products[prodIndex], [field]: value };
      cat.products = products;
      catalog[catIndex] = cat;
      return { ...prev, catalog };
    });
  };

  const handleCatalogImage = async (catIndex: number, prodIndex: number, file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("Максимум 5MB"); return; }
    try {
      const { url } = await api.uploadMedia(file);
      updateCatalogProduct(catIndex, prodIndex, "image", url);
    } catch {
      alert("Ошибка загрузки");
    }
  };

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ── Services (страницы /solutions/:slug) ──
  const toggleService = (slug: string) =>
    setOpenServices((prev) => ({ ...prev, [slug]: !prev[slug] }));

  const importDefaultServices = () => {
    if (content.services.length > 0 && !confirm("Перезаписать текущие услуги дефолтными?")) return;
    const stripped: ServiceItem[] = defaultServicesData.map((s) => ({
      slug: s.slug,
      h1: s.h1,
      heroImage: "",
      description: s.description,
      materials: s.materials.map((m) => ({ name: m.name, photo: "", specs: m.specs, badge: m.badge })),
    }));
    setContent((prev) => ({ ...prev, services: stripped }));
  };

  const addService = () => {
    const slug = prompt("Slug услуги (латиница, без пробелов, например: shelters)")?.trim().toLowerCase();
    if (!slug) return;
    if (content.services.some((s) => s.slug === slug)) { alert("Такой slug уже есть"); return; }
    setContent((prev) => ({
      ...prev,
      services: [...prev.services, { slug, h1: "", heroImage: "", description: "", materials: [] }],
    }));
    setOpenServices((prev) => ({ ...prev, [slug]: true }));
  };

  const removeService = (idx: number) => {
    if (!confirm("Удалить услугу?")) return;
    setContent((prev) => ({ ...prev, services: prev.services.filter((_, i) => i !== idx) }));
  };

  const updateService = (idx: number, field: keyof ServiceItem, value: string) => {
    setContent((prev) => {
      const services = [...prev.services];
      services[idx] = { ...services[idx], [field]: value } as ServiceItem;
      return { ...prev, services };
    });
  };

  const handleServiceHero = async (idx: number, file: File) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { alert("Максимум 5MB"); return; }
    try {
      const { url } = await api.uploadMedia(file);
      updateService(idx, "heroImage", url);
    } catch { alert("Ошибка загрузки"); }
  };

  const addMaterial = (idx: number) => {
    setContent((prev) => {
      const services = [...prev.services];
      const svc = { ...services[idx] };
      svc.materials = [...svc.materials, { name: "", specs: "", photo: "", badge: "" }];
      services[idx] = svc;
      return { ...prev, services };
    });
  };

  const removeMaterial = (sIdx: number, mIdx: number) => {
    setContent((prev) => {
      const services = [...prev.services];
      const svc = { ...services[sIdx] };
      svc.materials = svc.materials.filter((_, i) => i !== mIdx);
      services[sIdx] = svc;
      return { ...prev, services };
    });
  };

  const updateMaterial = (sIdx: number, mIdx: number, field: keyof ServiceMaterial, value: string) => {
    setContent((prev) => {
      const services = [...prev.services];
      const svc = { ...services[sIdx] };
      const materials = [...svc.materials];
      materials[mIdx] = { ...materials[mIdx], [field]: value };
      svc.materials = materials;
      services[sIdx] = svc;
      return { ...prev, services };
    });
  };

  const handleMaterialPhoto = async (sIdx: number, mIdx: number, file: File) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { alert("Максимум 5MB"); return; }
    try {
      const { url } = await api.uploadMedia(file);
      updateMaterial(sIdx, mIdx, "photo", url);
    } catch { alert("Ошибка загрузки"); }
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

      {/* Products (home page) */}
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

      {/* ── Catalog (Solutions page) ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Каталог решений — страница /solutions</CardTitle>
            <Button variant="outline" size="sm" onClick={addCategory} className="gap-1">
              <Plus className="w-4 h-4" /> Категория
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {content.catalog.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Нет категорий. Нажмите «+ Категория» чтобы добавить.
            </p>
          )}
          {content.catalog.map((cat, catIdx) => (
            <div key={cat.id} className="border border-border rounded-lg overflow-hidden">
              {/* Category header */}
              <div
                className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleCategory(cat.id)}
              >
                {openCategories[cat.id] ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                <span className="text-sm font-medium flex-1">{cat.title || "Без названия"}</span>
                <span className="text-xs text-muted-foreground">{cat.products.length} карт.</span>
                <Button variant="ghost" size="icon" className="w-7 h-7 shrink-0" onClick={(e) => { e.stopPropagation(); removeCategory(catIdx); }}>
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>

              {/* Category body */}
              {openCategories[cat.id] && (
                <div className="px-3 pb-3 space-y-3 border-t border-border/50">
                  <div className="pt-3">
                    <label className="text-sm text-muted-foreground mb-1 block">Название категории</label>
                    <Input value={cat.title} onChange={(e) => updateCategoryTitle(catIdx, e.target.value)} placeholder="Например: Антидроновые сетки" />
                  </div>

                  {/* Products in category */}
                  {cat.products.map((prod, prodIdx) => (
                    <div key={prod.id} className="flex items-start gap-2 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                      {prod.image ? (
                        <div className="relative w-20 h-[60px] rounded border border-border overflow-hidden shrink-0">
                          <img src={prod.image} alt="" className="w-full h-full object-cover" width={80} height={60} />
                          <button
                            type="button"
                            onClick={() => updateCatalogProduct(catIdx, prodIdx, "image", "")}
                            className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80"
                          >
                            <X className="w-2.5 h-2.5 text-white" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-20 h-[60px] rounded border-2 border-dashed border-border hover:border-muted-foreground flex flex-col items-center justify-center cursor-pointer shrink-0">
                          <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-[9px] text-muted-foreground mt-0.5">Фото</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCatalogImage(catIdx, prodIdx, f); e.target.value = ""; }} />
                        </label>
                      )}
                      <div className="flex-1 space-y-1.5">
                        <Input placeholder="Название" value={prod.name} onChange={(e) => updateCatalogProduct(catIdx, prodIdx, "name", e.target.value)} className="h-8 text-sm" />
                        <Input placeholder="Описание" value={prod.description} onChange={(e) => updateCatalogProduct(catIdx, prodIdx, "description", e.target.value)} className="h-8 text-sm" />
                      </div>
                      <Button variant="ghost" size="icon" className="w-7 h-7 shrink-0 mt-1" onClick={() => removeProduct(catIdx, prodIdx)}>
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}

                  <Button variant="outline" size="sm" onClick={() => addProduct(catIdx)} className="w-full gap-1">
                    <Plus className="w-3.5 h-3.5" /> Добавить карточку
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Services (страницы /solutions/:slug) ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base font-medium">Услуги — детальные страницы /solutions/:slug</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={importDefaultServices} className="gap-1">
                <Download className="w-4 h-4" /> Импорт дефолтов
              </Button>
              <Button variant="outline" size="sm" onClick={addService} className="gap-1">
                <Plus className="w-4 h-4" /> Услуга
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {content.services.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Нет услуг. Нажмите «Импорт дефолтов» чтобы загрузить 6 базовых услуг, или «+ Услуга» для ручного добавления.
            </p>
          )}
          {content.services.map((svc, sIdx) => (
            <div key={svc.slug} className="border border-border rounded-lg overflow-hidden">
              <div
                className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleService(svc.slug)}
              >
                {openServices[svc.slug] ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                <span className="text-sm font-medium flex-1 truncate">{svc.h1 || svc.slug}</span>
                <span className="text-xs text-muted-foreground shrink-0">/{svc.slug}</span>
                <Button variant="ghost" size="icon" className="w-7 h-7 shrink-0" onClick={(e) => { e.stopPropagation(); removeService(sIdx); }}>
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>

              {openServices[svc.slug] && (
                <div className="px-3 pb-3 space-y-3 border-t border-border/50 pt-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Slug (URL)</label>
                    <Input value={svc.slug} disabled className="text-base bg-muted/40" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">H1 заголовок</label>
                    <Input value={svc.h1} onChange={(e) => updateService(sIdx, "h1", e.target.value)} className="text-base" />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Hero изображение</label>
                    <div className="flex items-start gap-3">
                      {svc.heroImage ? (
                        <div className="relative w-32 h-[90px] rounded border border-border overflow-hidden shrink-0">
                          <img src={svc.heroImage} alt="" className="w-full h-full object-cover" width={128} height={90} />
                          <button type="button" onClick={() => updateService(sIdx, "heroImage", "")} className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80">
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-32 h-[90px] rounded border-2 border-dashed border-border hover:border-muted-foreground flex flex-col items-center justify-center cursor-pointer shrink-0">
                          <Upload className="w-4 h-4 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground mt-0.5">Hero фото</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleServiceHero(sIdx, f); e.target.value = ""; }} />
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Описание (абзацы разделять пустой строкой)</label>
                    <Textarea value={svc.description} onChange={(e) => updateService(sIdx, "description", e.target.value)} rows={5} className="text-base" />
                  </div>

                  {/* Materials */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-muted-foreground">Материалы</label>
                      <Button variant="outline" size="sm" onClick={() => addMaterial(sIdx)} className="gap-1 h-7">
                        <Plus className="w-3.5 h-3.5" /> Материал
                      </Button>
                    </div>
                    {svc.materials.map((mat, mIdx) => (
                      <div key={mIdx} className="flex items-start gap-2 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                        {mat.photo ? (
                          <div className="relative w-20 h-[60px] rounded border border-border overflow-hidden shrink-0">
                            <img src={mat.photo} alt="" className="w-full h-full object-cover" width={80} height={60} />
                            <button type="button" onClick={() => updateMaterial(sIdx, mIdx, "photo", "")} className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80">
                              <X className="w-2.5 h-2.5 text-white" />
                            </button>
                          </div>
                        ) : (
                          <label className="w-20 h-[60px] rounded border-2 border-dashed border-border hover:border-muted-foreground flex flex-col items-center justify-center cursor-pointer shrink-0">
                            <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-[9px] text-muted-foreground mt-0.5">Фото</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMaterialPhoto(sIdx, mIdx, f); e.target.value = ""; }} />
                          </label>
                        )}
                        <div className="flex-1 space-y-1.5">
                          <Input placeholder="Название материала" value={mat.name} onChange={(e) => updateMaterial(sIdx, mIdx, "name", e.target.value)} className="h-8 text-sm" />
                          <Textarea placeholder="Характеристики" value={mat.specs} onChange={(e) => updateMaterial(sIdx, mIdx, "specs", e.target.value)} rows={2} className="text-sm" />
                          <Input placeholder="Бейджи (через ' · ')" value={mat.badge || ""} onChange={(e) => updateMaterial(sIdx, mIdx, "badge", e.target.value)} className="h-8 text-sm" />
                        </div>
                        <Button variant="ghost" size="icon" className="w-7 h-7 shrink-0 mt-1" onClick={() => removeMaterial(sIdx, mIdx)}>
                          <X className="w-3.5 h-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
