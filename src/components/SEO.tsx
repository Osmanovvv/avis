import { Helmet } from "react-helmet-async";
import { useSettings } from "@/hooks/use-settings";

const DOMAIN = import.meta.env.VITE_SITE_URL || "http://159.194.201.36";
const OG_IMAGE = `${DOMAIN}/hero-poster.jpg`;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "АВИС",
  "url": DOMAIN,
  "logo": `${DOMAIN}/favicon.svg`,
  "description": "Производитель систем пассивной защиты объектов от БПЛА",
  "areaServed": "RU",
  "serviceType": "Защита от БПЛА",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Средства защиты от БПЛА",
    "itemListElement": [
      { "@type": "Offer", "name": "Антидроновые сетки" },
      { "@type": "Offer", "name": "Бетонные ограждения" },
      { "@type": "Offer", "name": "Защитные шторы" },
      { "@type": "Offer", "name": "Убежища и укрытия" },
    ],
  },
};

const buildBreadcrumbJsonLd = (path: string, title: string) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Главная", "item": DOMAIN },
    { "@type": "ListItem", "position": 2, "name": title, "item": `${DOMAIN}${path}` },
  ],
});

interface SEOProps {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
}

const SEO = ({ title, description, path, keywords, ogTitle, ogDescription, ogType = "website" }: SEOProps) => {
  const { settings } = useSettings();
  const seo = settings?.seo?.[path];
  const finalTitle = seo?.title || title;
  const finalDescription = seo?.description || description;
  const canonical = `${DOMAIN}${path}`;
  const isHome = path === "/";
  const jsonLd = isHome ? organizationJsonLd : buildBreadcrumbJsonLd(path, finalTitle);

  return (
    <Helmet>
      <html lang="ru" />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="robots" content="index, follow" />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={ogTitle || finalTitle} />
      <meta property="og:description" content={ogDescription || finalDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || finalTitle} />
      <meta name="twitter:description" content={ogDescription || finalDescription} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default SEO;
