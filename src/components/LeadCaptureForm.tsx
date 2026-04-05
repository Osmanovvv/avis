import FadeIn from "@/components/FadeIn";
import { Phone, Send } from "lucide-react";

const LeadCaptureForm = () => {
  return (
    <section style={{ background: "#090b0e" }} className="py-14 px-5 md:py-20 md:px-[6vw]">
      {/* CTA block */}
      <div className="text-center mt-16">
        <FadeIn>
          <h2
            style={{
              fontSize: "clamp(24px, 2.8vw, 40px)",
              fontWeight: 200,
              color: "#d4dae2",
              letterSpacing: "0.02em",
              margin: 0,
            }}
          >
            Готовы защитить ваш объект?
          </h2>
          <p className="mt-3" style={{ fontSize: 14, color: "#8a95a3", margin: 0, marginTop: 12 }}>
            Свяжитесь удобным способом. Ответим в течение 2 часов.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mt-8">
            {/* Primary — Call */}
            <a
              href="tel:+70000000000"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-md h-[52px] px-9 text-[13px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 hover:brightness-110 no-underline"
              style={{
                background: "linear-gradient(135deg, #b8860b, #d4a017)",
                color: "#0a0c0f",
                whiteSpace: "nowrap",
              }}
            >
              <Phone size={16} />
              Позвонить
            </a>

            {/* Secondary — Telegram */}
            <a
              href="https://t.me/username"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-md h-[52px] px-9 text-[13px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 no-underline"
              style={{
                background: "transparent",
                border: "1px solid rgba(74,127,165,0.4)",
                color: "#c0cdd8",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "#4a7fa5";
                el.style.background = "rgba(74,127,165,0.08)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(74,127,165,0.4)";
                el.style.background = "transparent";
              }}
            >
              <Send size={16} style={{ color: "#4a7fa5" }} />
              Написать в Telegram
            </a>
          </div>

          <p className="mt-5" style={{ fontSize: 12, color: "#8a95a3", margin: 0, marginTop: 20 }}>
            или напишите на{" "}
            <a
              href="mailto:info@example.com"
              className="no-underline transition-colors duration-200"
              style={{ color: "#4a7fa5" }}
            >
              [EMAIL]
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

export default LeadCaptureForm;
