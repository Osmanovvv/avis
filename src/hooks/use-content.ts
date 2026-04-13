import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface AdminServiceMaterial { name: string; photo?: string; specs: string; badge?: string }
interface ProductDetail {
  h1?: string;
  heroImage?: string;
  description?: string;
  materials?: AdminServiceMaterial[];
  gallery?: string[];
  subcategories?: string[];
  whereUsed?: string;
}
export interface ProductCard {
  name: string;
  description: string;
  image: string;
  slug?: string;
  detail?: ProductDetail;
}

interface ContentData {
  hero: { line1: string; line2: string; subtitle: string };
  stats: Array<{ value: string; label: string }>;
  products: ProductCard[];
  about: { description: string; advantages: string[] };
  contacts: { phone: string; email: string; telegram: string; address: string };
  videoSlots?: { video01_poster: string; video01_mp4: string; video02_poster: string; video02_mp4: string };
  catalog?: Array<{ id: string; title: string; products: Array<{ id: string; name: string; description: string; image: string }> }>;
}

// Shared cache so multiple components don't re-fetch
let cache: ContentData | null = null;
let fetchPromise: Promise<ContentData> | null = null;

function fetchContent(): Promise<ContentData> {
  if (cache) return Promise.resolve(cache);
  if (fetchPromise) return fetchPromise;

  fetchPromise = api.getContent().then((data: any) => {
    cache = {
      hero: data.hero || { line1: "", line2: "", subtitle: "" },
      stats: data.stats || [],
      products: data.products || [],
      about: data.about || { description: "", advantages: [] },
      contacts: data.contacts || { phone: "", email: "", telegram: "", address: "" },
      videoSlots: data.videoSlots || undefined,
      catalog: data.catalog || undefined,
      services: data.services || undefined,
    };
    return cache;
  }).catch(() => {
    // Fallback — return empty structure
    cache = {
      hero: { line1: "", line2: "", subtitle: "" },
      stats: [],
      products: [],
      about: { description: "", advantages: [] },
      contacts: { phone: "", email: "", telegram: "", address: "" },
    };
    return cache;
  });

  return fetchPromise;
}

export function useContent() {
  const [content, setContent] = useState<ContentData | null>(cache);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) {
      setContent(cache);
      setLoading(false);
      return;
    }
    fetchContent().then((data) => {
      setContent(data);
      setLoading(false);
    });
  }, []);

  return { content, loading };
}

/** Call after admin saves content to force re-fetch on next useContent() */
export function invalidateContentCache() {
  cache = null;
  fetchPromise = null;
}

export type { ContentData, AdminServiceItem, AdminServiceMaterial };
