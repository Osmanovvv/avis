import { useEffect, useCallback, useState, useRef } from "react";
import { X, Phone, Send, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CatalogService } from "@/data/servicesCatalog";

interface ServiceModalProps {
  service: CatalogService | null;
  open: boolean;
  onClose: () => void;
  detailSlug?: string;
}

const ImageWithFallback = ({
  src,
  alt,
  className,
  style,
  loading,
}: {
  src?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
}) => {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div
        className={className}
        style={{
          ...style,
          background: "#141720",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 12, color: "#4a5568" }}>{alt}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={() => setError(true)}
    />
  );
};

const Lightbox = ({
  images,
  index,
  onClose,
}: {
  images: string[];
  index: number;
  onClose: () => void;
}) => {
  const [current, setCurrent] = useState(index);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % images.length);
      if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.95)" }}
      onClick={onClose}
    >
      <button className="absolute top-4 right-4 z-10" onClick={onClose} style={{ color: "#7a8394" }}>
        <X size={28} />
      </button>
      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 z-10 p-2"
            onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + images.length) % images.length); }}
            style={{ color: "#c0cdd8" }}
          >
            <ChevronLeft size={32} />
          </button>
          <button
            className="absolute right-4 z-10 p-2"
            onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % images.length); }}
            style={{ color: "#c0cdd8" }}
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}
      <img
        src={images[current]}
        alt=""
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

const ServiceModal = ({ service, open, onClose, detailSlug }: ServiceModalProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const touchStartY = useRef<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxIndex === null) onClose();
    },
    [onClose, lightboxIndex]
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, handleEsc]);

  // Swipe-to-close for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!modalRef.current) return;
    // Only track if scrolled to top
    if (modalRef.current.scrollTop <= 0) {
      touchStartY.current = e.touches[0].clientY;
    } else {
      touchStartY.current = null;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY > 80) onClose();
    touchStartY.current = null;
  };

  if (!service) return null;

  // Use cardImage as fallback for heroImage
  const heroSrc = service.heroImage || service.cardImage;

  const modalVariants = isMobile
    ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
    : {
        initial: { opacity: 0, scale: 0.95, y: 10 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 10 },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[150] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={isMobile
              ? { type: "spring", damping: 30, stiffness: 300 }
              : { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }
            }
            className="relative w-full overflow-y-auto"
            style={isMobile ? {
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: "90vh",
              background: "#111318",
              borderRadius: "20px 20px 0 0",
              border: "1px solid rgba(255,255,255,0.1)",
              borderBottom: "none",
            } : {
              maxWidth: 860,
              maxHeight: "90vh",
              background: "#111318",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              margin: "0 auto",
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Mobile drag handle */}
            {isMobile && (
              <div style={{ display: "flex", justifyContent: "center", paddingTop: 12 }}>
                <div style={{
                  width: 40,
                  height: 4,
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 2,
                }} />
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute z-20 transition-colors"
              style={{ top: 16, right: 16, color: "#7a8394" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7a8394")}
            >
              <X size={24} />
            </button>

            {/* Hero image */}
            <div className="relative w-full overflow-hidden" style={{ height: isMobile ? 220 : 260, borderRadius: isMobile ? "20px 20px 0 0" : "16px 16px 0 0" }}>
              <ImageWithFallback
                src={heroSrc}
                alt={service.title}
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.5) saturate(0.5)", display: "block" }}
              />
              {/* Gradient overlay */}
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: 80,
                  background: "linear-gradient(to bottom, transparent 0%, #111318 100%)",
                  zIndex: 1,
                }}
              />
              {/* Badge */}
              <span
                className="absolute top-4 right-14 px-2.5 py-1 rounded text-[11px]"
                style={{ border: "1px solid #4a7fa5", color: "#4a7fa5", zIndex: 2 }}
              >
                {service.number}
              </span>
              {/* Title overlay */}
              <h2
                className="absolute left-6 right-6 md:left-8 md:right-8"
                style={{
                  bottom: 20,
                  fontSize: isMobile ? "1.25rem" : "1.5rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  margin: 0,
                  textTransform: "none",
                  letterSpacing: "0.01em",
                  zIndex: 2,
                }}
              >
                {service.title}
              </h2>
            </div>

            <div className="px-5 pb-8 md:px-8">
              {/* Description */}
              <div className="mt-6">
                <h3
                  style={{
                    fontSize: "0.6875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "#4a7fa5",
                    marginBottom: 12,
                    fontWeight: 600,
                  }}
                >
                  О направлении
                </h3>
                {service.description.map((p, i) => (
                  <p
                    key={i}
                    className="mb-3 last:mb-0"
                    style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "#b0bec5" }}
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* Subcategories */}
              {service.subcategories && service.subcategories.length > 0 && (
                <div className="mt-6">
                  <h3
                    style={{
                      fontSize: "0.6875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "#4a7fa5",
                      marginBottom: 12,
                      fontWeight: 600,
                    }}
                  >
                    Подкатегории
                  </h3>
                  <div className="flex flex-wrap gap-2" style={{ marginBottom: 24 }}>
                    {service.subcategories.map((sub, i) => (
                      <span
                        key={i}
                        className="inline-block rounded-full"
                        style={{
                          padding: "6px 14px",
                          fontSize: 12,
                          fontWeight: 500,
                          background: "rgba(74,127,165,0.1)",
                          border: "1px solid rgba(74,127,165,0.25)",
                          color: "#7ab3d4",
                        }}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              <div className="mt-8">
                <h3
                  style={{
                    fontSize: "0.6875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "#4a7fa5",
                    marginBottom: 16,
                    fontWeight: 600,
                  }}
                >
                  Применяемые материалы
                </h3>
                <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  {service.materials.map((mat, i) => (
                    <div
                      key={i}
                      className="rounded-[10px] overflow-hidden"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        padding: 16,
                      }}
                    >
                      {mat.image && (
                        <ImageWithFallback
                          src={mat.image}
                          alt={mat.name}
                          className="w-full object-cover rounded-md mb-3"
                          style={{ height: isMobile ? 100 : 120, filter: "brightness(0.7) saturate(0.5)" }}
                          loading="lazy"
                        />
                      )}
                      <div
                        style={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: "#ffffff",
                          letterSpacing: "0.01em",
                          marginBottom: 6,
                        }}
                      >
                        {mat.name}
                      </div>
                      <ul className="space-y-0.5">
                        {mat.specs.map((spec, j) => (
                          <li key={j} style={{ fontSize: "0.8125rem", color: "#b0bec5", lineHeight: 1.5 }}>
                            • {spec}
                          </li>
                        ))}
                      </ul>
                      {mat.badge && (
                        <span
                          className="inline-block mt-2 px-2 py-0.5 rounded-full"
                          style={{ fontSize: 10, border: "1px solid #4a7fa5", color: "#4a7fa5" }}
                        >
                          {mat.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Where Used */}
              {service.whereUsed && (
                <div className="mt-8">
                  <h3
                    style={{
                      fontSize: "0.6875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "#4a7fa5",
                      marginBottom: 12,
                      fontWeight: 600,
                    }}
                  >
                    Где применяется
                  </h3>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      borderLeft: "3px solid #4a7fa5",
                      borderRadius: "0 8px 8px 0",
                      padding: "16px 20px",
                      fontSize: 14,
                      color: "#b0bec5",
                      lineHeight: 1.6,
                    }}
                  >
                    {service.whereUsed}
                  </div>
                </div>
              )}

              {/* Photo Gallery */}
              {service.gallery.length > 0 && (
                <div className="mt-8">
                  <h3
                    style={{
                      fontSize: "0.6875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "#4a7fa5",
                      marginBottom: 16,
                      fontWeight: 600,
                    }}
                  >
                    Примеры работ
                  </h3>
                  <div className={`grid gap-2 ${isMobile ? "grid-cols-2 gap-[6px]" : "grid-cols-3"}`}>
                    {service.gallery.map((img, i) => (
                      <button
                        key={i}
                        className="relative overflow-hidden rounded-md cursor-pointer group"
                        style={{ aspectRatio: "4/3" }}
                        onClick={() => setLightboxIndex(i)}
                      >
                        <ImageWithFallback
                          src={img}
                          alt={`${service.title} ${i + 1}`}
                          className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-[1.02]"
                          style={{ filter: "brightness(0.7) saturate(0.5)" }}
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Подробнее — переход на отдельную страницу */}
              {detailSlug && (
                <div className="mt-6 text-center">
                  <Link
                    to={`/solutions/${detailSlug}`}
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-2 rounded-md transition-all"
                    style={{
                      border: "1px solid rgba(74,127,165,0.5)",
                      color: "#c0cdd8",
                      padding: "0 28px",
                      height: isMobile ? 52 : 44,
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      background: "rgba(74,127,165,0.05)",
                      width: isMobile ? "100%" : undefined,
                    }}
                  >
                    Подробнее о решении <ArrowRight size={15} />
                  </Link>
                </div>
              )}

              {/* CTA */}
              <div
                className="mt-8 rounded-[10px] text-center"
                style={{
                  background: "rgba(212,160,23,0.08)",
                  border: "1px solid rgba(212,160,23,0.2)",
                  padding: isMobile ? "20px 16px" : 24,
                }}
              >
                <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: "#ffffff", marginBottom: 4 }}>
                  Нужна защита вашего объекта?
                </div>
                <div style={{ fontSize: 13, color: "#7a8394", marginBottom: 16 }}>
                  Рассчитаем стоимость за 24 часа
                </div>
                <div className={`flex gap-${isMobile ? "[10px]" : "3"} justify-center ${isMobile ? "flex-col" : "flex-row"}`}>
                  <a
                    href="tel:+70000000000"
                    className="btn-gold inline-flex items-center justify-center gap-2 rounded-md"
                    style={{
                      padding: "0 28px",
                      height: isMobile ? 52 : 44,
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      width: isMobile ? "100%" : undefined,
                    }}
                  >
                    <Phone size={15} /> Позвонить
                  </a>
                  <a
                    href="https://t.me/username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md transition-all"
                    style={{
                      border: "1px solid hsla(var(--gold-light), 0.4)",
                      color: "hsl(var(--gold-light))",
                      padding: "0 28px",
                      height: isMobile ? 52 : 44,
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      background: "transparent",
                      width: isMobile ? "100%" : undefined,
                    }}
                  >
                    <Send size={15} /> Написать в Telegram
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Lightbox */}
          <AnimatePresence>
            {lightboxIndex !== null && (
              <Lightbox
                images={service.gallery}
                index={lightboxIndex}
                onClose={() => setLightboxIndex(null)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceModal;
