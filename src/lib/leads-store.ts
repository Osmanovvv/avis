const LEADS_KEY = "avis_leads";

export interface Lead {
  id: string;
  date: string;
  phone: string;
  name: string;
  source: string;
  processed: boolean;
}

export function getLeads(): Lead[] {
  const stored = localStorage.getItem(LEADS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function saveLeads(leads: Lead[]): void {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

export function addLead(lead: Omit<Lead, "id" | "date" | "processed">): void {
  const leads = getLeads();
  leads.unshift({
    ...lead,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    processed: false,
  });
  saveLeads(leads);
}

export function exportLeadsCSV(leads: Lead[]): string {
  const header = "Дата,Телефон,Имя/Компания,Источник,Обработана";
  const rows = leads.map((l) =>
    [
      new Date(l.date).toLocaleString("ru-RU"),
      l.phone,
      l.name,
      l.source,
      l.processed ? "Да" : "Нет",
    ].join(",")
  );
  return [header, ...rows].join("\n");
}
