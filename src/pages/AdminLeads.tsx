import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Download, Check, Phone, Calendar, Loader2 } from "lucide-react";

interface Lead {
  id: number;
  phone: string;
  name: string;
  source: string;
  processed: boolean;
  created_at: string;
}

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");

  const fetchLeads = (date?: string) => {
    setLoading(true);
    api.getLeads(date)
      .then((data) => setLeads(data as Lead[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filtered = useMemo(() => {
    if (!dateFilter) return leads;
    return leads.filter((l) => l.created_at.startsWith(dateFilter));
  }, [leads, dateFilter]);

  const toggleProcessed = async (id: number, current: boolean) => {
    try {
      await api.updateLead(id, !current);
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, processed: !current } : l))
      );
    } catch {
      alert("Ошибка обновления");
    }
  };

  const handleExport = () => {
    const header = "Телефон;Имя;Источник;Дата;Обработана";
    const rows = filtered.map(
      (l) =>
        `${l.phone};${l.name};${l.source};${new Date(l.created_at).toLocaleString("ru-RU")};${l.processed ? "Да" : "Нет"}`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `заявки_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Загрузка...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-light">Заявки</h1>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-[160px] h-9"
          />
          {dateFilter && (
            <Button variant="ghost" size="sm" onClick={() => setDateFilter("")}>
              Сбросить
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExport} disabled={!filtered.length}>
            <Download className="w-4 h-4 mr-1" />
            CSV
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {leads.length === 0
              ? "Заявок пока нет. Они появятся после отправки формы на сайте."
              : "Нет заявок за выбранную дату"}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((lead) => (
            <Card key={lead.id}>
              <CardContent className="flex items-center justify-between py-3 px-4 gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-sm font-medium">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      {lead.phone}
                    </span>
                    {lead.name && (
                      <span className="text-sm text-muted-foreground">— {lead.name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(lead.created_at).toLocaleString("ru-RU")}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">{lead.source}</Badge>
                  </div>
                </div>
                <Button
                  variant={lead.processed ? "default" : "outline"}
                  size="sm"
                  className="shrink-0"
                  onClick={() => toggleProcessed(lead.id, lead.processed)}
                >
                  {lead.processed ? (
                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Обработана</span>
                  ) : (
                    "Обработать"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLeads;
