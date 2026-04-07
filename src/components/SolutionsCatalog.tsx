import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { useContent } from "@/hooks/use-content";
import netsPerimeter from "@/assets/catalog/nets-perimeter.webp";
import netsPerimeter1x from "@/assets/catalog/nets-perimeter@1x.webp";
import netsTanks from "@/assets/catalog/nets-tanks.webp";
import netsTanks1x from "@/assets/catalog/nets-tanks@1x.webp";
import complexPerimeter from "@/assets/catalog/complex-perimeter.webp";
import complexPerimeter1x from "@/assets/catalog/complex-perimeter@1x.webp";
import windowProtection from "@/assets/catalog/window-protection.webp";
import windowProtection1x from "@/assets/catalog/window-protection@1x.webp";
import armoredDoors from "@/assets/catalog/armored-doors.webp";
import armoredDoors1x from "@/assets/catalog/armored-doors@1x.webp";
import modularShelter from "@/assets/catalog/modular-shelter.webp";
import modularShelter1x from "@/assets/catalog/modular-shelter@1x.webp";

const defaultProducts = [
  { id: "nets-1", title: "Сетка для периметра", badge: "АНТИДРОНОВЫЕ СЕТКИ", image: netsPerimeter, image1x: netsPerimeter1x },
  { id: "nets-2", title: "Сетка на резервуары", badge: "АНТИДРОНОВЫЕ СЕТКИ", image: netsTanks, image1x: netsTanks1x },
  { id: "barriers-1", title: "Бетонные ограждения", badge: "БЕТОННЫЕ ОГРАЖДЕНИЯ", image: complexPerimeter, image1x: complexPerimeter1x },
  { id: "curtains-1", title: "Защитные шторы", badge: "ЗАЩИТА ЗДАНИЙ", image: windowProtection, image1x: windowProtection1x },
  { id: "rollers-1", title: "Роллетные системы", badge: "ЗАЩИТА ЗДАНИЙ", image: armoredDoors, image1x: armoredDoors1x },
  { id: "shelters-1", title: "Убежища и укрытия", badge: "УБЕЖИЩА", image: modularShelter, image1x: modularShelter1x },
];

const SolutionsCatalog = () => {
  const { content } = useContent();

  // Merge API products with defaults: use API name/description/image when available
  const products = defaultProducts.map((def, i) => {
    const apiProduct = content?.products?.[i];
    if (!apiProduct?.name) return def;
    return {
      ...def,
      title: apiProduct.name || def.title,
      badge: apiProduct.description || def.badge,
      image: apiProduct.image || def.image,
      image1x: apiProduct.image || def.image1x,
    };
  });

  return (
  <section>
    <div className="container pt-[72px] pb-[72px] lg:pt-[120px] lg:pb-[120px]">
      <FadeIn>
        <div className="mb-10 lg:mb-16">
          <h2>Наши решения</h2>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p, i) => (
          <FadeIn key={p.id} delay={i * 0.06}>
            <Link
              to="/solutions"
              className="group relative block overflow-hidden rounded-lg h-[220px] md:h-[320px]"
            >
              <img
                src={p.image}
                srcSet={`${p.image1x} 1x, ${p.image} 2x`}
                alt={p.title}
                width={400}
                height={300}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:brightness-[0.9] group-hover:saturate-[0.7] group-hover:scale-105"
                style={{ filter: "brightness(0.6) saturate(0.5)" }}
                loading="lazy"
                decoding="async"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, transparent 0%, rgba(8,10,14,0.85) 100%)",
                }}
              />
              {/* Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className="px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.08em]"
                  style={{ background: "rgba(20,23,32,0.8)", color: "hsl(var(--muted-foreground))" }}
                >
                  {p.badge}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <span className="text-[16px] md:text-[18px] font-light text-foreground">
                  {p.title}
                </span>
                <ArrowRight
                  className="h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: "hsl(var(--highlight))" }}
                />
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.4}>
        <div className="mt-8 text-center">
          <Link
            to="/solutions"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-highlight hover:text-foreground transition-colors"
          >
            Весь каталог решений <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </FadeIn>
    </div>
  </section>
  );
};

export default SolutionsCatalog;
