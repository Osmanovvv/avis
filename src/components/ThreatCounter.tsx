import { useState, useEffect, useRef } from "react";

const TARGET = 18247;
const DURATION = 2000;

const ThreatCounter = () => {
  const [count, setCount] = useState(0);
  const animatedRef = useRef(false);

  // Initial animation to TARGET
  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * TARGET));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        animatedRef.current = true;
      }
    };
    requestAnimationFrame(step);
  }, []);

  // Live increment after initial animation
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 7000;
      return setTimeout(() => {
        if (animatedRef.current) {
          setCount((c) => c + Math.floor(1 + Math.random() * 3));
        }
        timerRef.current = scheduleNext();
      }, delay);
    };
    const timerRef = { current: scheduleNext() };
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div
      className="w-full flex items-center justify-between h-7 sm:h-8"
      style={{ padding: "0 6vw", background: "linear-gradient(135deg, hsl(var(--gold)), hsl(var(--gold-light)))" }}
    >
      <span className="text-[11px] font-normal tracking-[0.04em]" style={{ color: "rgba(0,0,0,0.7)" }}>
        <span className="hidden sm:inline">Зафиксировано нарушений воздушного пространства в 2026 году:</span>
        <span className="sm:hidden">Угроз БПЛА в 2026:</span>
      </span>
      <span
        className="text-[11px] sm:text-[14px]"
        style={{
          color: "#0a0c0f",
          fontWeight: 700,
          letterSpacing: "0.05em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {count.toLocaleString("ru-RU")}
      </span>
    </div>
  );
};

export default ThreatCounter;
