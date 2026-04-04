const API_BASE = import.meta.env.VITE_API_URL || "/api";
const IS_MOCK = !import.meta.env.VITE_API_URL;

// Mock storage for local dev without backend
const mockStore: Record<string, unknown> = {
  content: {
    hero: { line1: "ЗАЩИТА ОБЪЕКТОВ", line2: "ОТ БПЛА", subtitle: "Пассивные системы защиты от дронов" },
    stats: [
      { value: "200+", label: "объектов" },
      { value: "12", label: "лет опыта" },
      { value: "50+", label: "регионов" },
      { value: "3", label: "года гарантии" },
    ],
    products: Array.from({ length: 6 }, (_, i) => ({ name: `Продукт ${i + 1}`, description: "" })),
    about: { description: "", advantages: ["", "", "", ""] },
    contacts: { phone: "", email: "", telegram: "", address: "" },
  },
  settings: { phone: "", email: "", telegram: "", address: "", companyName: "", inn: "", ogrn: "", seo: {} },
  leads: [] as Array<Record<string, unknown>>,
  media: [] as Array<Record<string, unknown>>,
};

let mockMediaId = 1;

function getToken(): string | null {
  return localStorage.getItem("avis_admin_token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}/${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem("avis_admin_token");
    localStorage.removeItem("avis_admin_token_expiry");
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    IS_MOCK
      ? Promise.resolve({ token: "mock_token" })
      : request<{ token: string }>("auth.php", {
          method: "POST",
          body: JSON.stringify({ username, password }),
        }),

  // Content
  getContent: () =>
    IS_MOCK
      ? Promise.resolve(mockStore.content as Record<string, unknown>)
      : request<Record<string, unknown>>("content.php"),
  getContentByKey: (key: string) =>
    IS_MOCK
      ? Promise.resolve((mockStore.content as Record<string, unknown>)[key])
      : request<unknown>(`content.php?key=${key}`),
  updateContent: (key: string, data: unknown) => {
    if (IS_MOCK) {
      (mockStore.content as Record<string, unknown>)[key] = data;
      return Promise.resolve({ success: true });
    }
    return request("content.php", {
      method: "PUT",
      body: JSON.stringify({ key, data }),
    });
  },

  // Leads
  getLeads: (date?: string) => {
    if (IS_MOCK) {
      let leads = mockStore.leads as Array<Record<string, unknown>>;
      if (date) leads = leads.filter((l) => (l.created_at as string).startsWith(date));
      return Promise.resolve(leads);
    }
    return request<Array<Record<string, unknown>>>(
      `leads.php${date ? `?date=${date}` : ""}`
    );
  },
  createLead: (phone: string, name: string, source: string) => {
    if (IS_MOCK) {
      const lead = { id: Date.now(), phone, name, source, processed: false, created_at: new Date().toISOString() };
      (mockStore.leads as Array<Record<string, unknown>>).unshift(lead);
      return Promise.resolve(lead);
    }
    return request("leads.php", {
      method: "POST",
      body: JSON.stringify({ phone, name, source }),
    });
  },
  updateLead: (id: number, processed: boolean) => {
    if (IS_MOCK) {
      const leads = mockStore.leads as Array<Record<string, unknown>>;
      const lead = leads.find((l) => l.id === id);
      if (lead) lead.processed = processed;
      return Promise.resolve({ success: true });
    }
    return request("leads.php", {
      method: "PUT",
      body: JSON.stringify({ id, processed }),
    });
  },

  // Settings
  getSettings: () =>
    IS_MOCK
      ? Promise.resolve(mockStore.settings as Record<string, unknown>)
      : request<Record<string, unknown>>("settings.php"),
  updateSettings: (data: Record<string, unknown>) => {
    if (IS_MOCK) {
      mockStore.settings = data;
      return Promise.resolve({ success: true });
    }
    return request("settings.php", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Media
  getMedia: () =>
    IS_MOCK
      ? Promise.resolve(mockStore.media as Array<Record<string, unknown>>)
      : request<Array<Record<string, unknown>>>("media.php"),
  uploadMedia: (file: File) => {
    if (IS_MOCK) {
      const id = mockMediaId++;
      const url = URL.createObjectURL(file);
      const entry = { id, filename: file.name, original_name: file.name, file_type: file.type.startsWith("image/") ? "image" : "video", file_size: file.size, url };
      (mockStore.media as Array<Record<string, unknown>>).unshift(entry);
      return Promise.resolve({ id, url });
    }
    const formData = new FormData();
    formData.append("file", file);
    return request<{ id: number; url: string }>("media.php", {
      method: "POST",
      body: formData,
    });
  },
  deleteMedia: (id: number) => {
    if (IS_MOCK) {
      mockStore.media = (mockStore.media as Array<Record<string, unknown>>).filter((m) => m.id !== id);
      return Promise.resolve({ success: true });
    }
    return request(`media.php?id=${id}`, { method: "DELETE" });
  },
};
