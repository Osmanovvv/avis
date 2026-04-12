import { useState } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroLeadForm = () => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Укажите номер телефона");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Заявка отправлена! Перезвоним в течение 2 часов.");
      setPhone("");
      setMessage("");
      setSubmitting(false);
    }, 800);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: isMobile ? 16 : 12,
        padding: isMobile ? "24px 20px" : "clamp(20px, 4vw, 32px)",
      }}
    >
      <h3
        style={{
          fontSize: "clamp(15px, 4vw, 18px)",
          fontWeight: 700,
          color: "#ffffff",
          margin: 0,
          textTransform: "none",
          letterSpacing: "0.01em",
        }}
      >
        Рассчитать стоимость
      </h3>
      <p style={{ fontSize: 12, color: "#7a8394", margin: "4px 0 14px" }}>
        Специалист перезвонит в течение 2 часов
      </p>

      <input
        type="tel"
        placeholder="+7 (___) ___-__-__"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-md px-4 mb-3"
        style={{
          height: isMobile ? 52 : 44,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#e8eaf0",
          fontSize: isMobile ? 16 : 14,
          outline: "none",
        }}
      />

      <textarea
        placeholder="Опишите объект (необязательно)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={isMobile ? 2 : 3}
        className="w-full rounded-md px-4 py-3 mb-4 resize-none"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#e8eaf0",
          fontSize: isMobile ? 16 : 14,
          outline: "none",
        }}
      />

      <button
        type="submit"
        disabled={submitting}
        className="btn-gold w-full rounded-md font-bold disabled:opacity-60"
        style={{
          height: isMobile ? 52 : 48,
          fontSize: isMobile ? "1rem" : 14,
          letterSpacing: "0.04em",
        }}
      >
        {submitting ? "Отправляем..." : "Отправить заявку"}
      </button>

      <p style={{ fontSize: 11, color: "#4a5568", marginTop: 12, lineHeight: 1.5 }}>
        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
      </p>
    </form>
  );
};

export default HeroLeadForm;
