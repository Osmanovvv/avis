import { Helmet } from "react-helmet-async";

const DOMAIN = "https://drone-shield-system.lovable.app";
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
  const canonical = `${DOMAIN}${path}`;
  const isHome = path === "/";
  const jsonLd = isHome ? organizationJsonLd : buildBreadcrumbJsonLd(path, title);

  return (
    <Helmet>
      <html lang="ru" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default SEO;
