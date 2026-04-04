import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLeads, saveLeads, exportLeadsCSV, Lead } from "@/lib/leads-store";
import { Download, Check, Phone, Calendar } from "lucide-react";

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>(getLeads);
  const [dateFilter, setDateFilter] = useState("");

  const filtered = useMemo(() => {
    if (!dateFilter) return leads;
    return leads.filter((l) => l.date.startsWith(dateFilter));
  }, [leads, dateFilter]);

  const toggleProcessed = (id: string) => {
    const updated = leads.map((l) =>
      l.id === id ? { ...l, processed: !l.processed } : l
    );
    setLeads(updated);
    saveLeads(updated);
  };

  const handleExport = () => {
    const csv = exportLeadsCSV(filtered);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `заявки_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
                      {new Date(lead.date).toLocaleString("ru-RU")}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">{lead.source}</Badge>
                  </div>
                </div>
                <Button
                  variant={lead.processed ? "default" : "outline"}
                  size="sm"
                  className="shrink-0"
                  onClick={() => toggleProcessed(lead.id)}
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
