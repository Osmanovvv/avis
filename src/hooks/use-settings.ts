import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface SiteSettings {
  companyName: string;
  inn: string;
  ogrn: string;
  phone: string;
  email: string;
  telegram: string;
  address: string;
  seo: Record<string, { title: string; description: string }>;
}

let cache: SiteSettings | null = null;
let fetchPromise: Promise<SiteSettings> | null = null;

const defaults: SiteSettings = {
  companyName: "", inn: "", ogrn: "",
  phone: "", email: "", telegram: "", address: "",
  seo: {},
};

function fetchSettings(): Promise<SiteSettings> {
  if (cache) return Promise.resolve(cache);
  if (fetchPromise) return fetchPromise;
  fetchPromise = api.getSettings()
    .then((data: any) => { cache = { ...defaults, ...data }; return cache!; })
    .catch(() => { cache = defaults; return cache; });
  return fetchPromise;
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(cache);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    fetchSettings().then((data) => { setSettings(data); setLoading(false); });
  }, []);

  return { settings, loading };
}
