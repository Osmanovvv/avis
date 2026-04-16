import { useMemo } from "react";
import { useContent } from "@/hooks/use-content";
import { defaultServiceCategories, type ServiceCategory } from "@/data/serviceCategories";

export function useCategories(): ServiceCategory[] {
  const { content } = useContent();
  return useMemo(() => {
    const adminCats = (content as any)?.categories as ServiceCategory[] | undefined;
    if (Array.isArray(adminCats) && adminCats.length > 0) {
      return [...adminCats].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    }
    return defaultServiceCategories;
  }, [content]);
}

export function useFeaturedCategories(): ServiceCategory[] {
  const all = useCategories();
  return useMemo(() => {
    const featured = all.filter((c) => c.featured);
    return featured.length > 0 ? featured : all;
  }, [all]);
}
