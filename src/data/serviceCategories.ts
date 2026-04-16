export interface ServiceCategory {
  id: string;
  slug: string;
  label: string;
  image?: string;
  description?: string;
  shortDesc?: string;
  order?: number;
  featured?: boolean;
  // Detail page
  areas?: string[];
  gallery?: string[];
}

export const defaultServiceCategories: ServiceCategory[] = [
  { id: "nets",        slug: "nets",        label: "Антидроновые сетки",   order: 1, featured: true },
  { id: "polyamide",   slug: "polyamide",   label: "Полиамидные сетки",    order: 2, featured: true },
  { id: "engineering", slug: "engineering", label: "Комплексная защита",   order: 3, featured: true },
  { id: "buildings",   slug: "buildings",   label: "Защита зданий",        order: 4, featured: true },
  { id: "fencing",     slug: "fencing",     label: "Ограждения и периметр", order: 5, featured: true },
  { id: "shelters",    slug: "shelters",    label: "Убежища и укрытия",    order: 6, featured: true },
  { id: "production",  slug: "production",  label: "Монтаж и сервис",      order: 7, featured: true },
];

// Backward-compat re-export so old imports still resolve.
export const serviceCategories = defaultServiceCategories;

export const categoryById = (list: ServiceCategory[], id?: string) =>
  list.find((c) => c.id === id);
