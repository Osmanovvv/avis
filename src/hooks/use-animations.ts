import { useRef, useEffect, useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface UseCountUpOptions {
  end: number;
  duration?: number;
  enabled?: boolean;
}

export const useCountUp = ({ end, duration = 1500, enabled = true }: UseCountUpOptions) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!enabled || animated.current || !ref.current) return;
    if (isMobile) {
      setCount(end);
      animated.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, enabled, isMobile]);

  return { count, ref };
};

interface UseStaggerOptions {
  threshold?: number;
}

export const useStaggerReveal = (options?: UseStaggerOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: options?.threshold ?? 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold]);

  return { containerRef, revealed };
};
