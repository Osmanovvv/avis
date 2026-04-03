import { Helmet } from "react-helmet-async";

const DOMAIN = "https://drone-shield-system.lovable.app";

const defaultJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "АВИС",
  "description": "Пассивная защита объектов от БПЛА",
  "serviceType": "Защита от БПЛА",
  "areaServed": "RU",
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

interface SEOProps {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
}

const SEO = ({ title, description, path, keywords, ogTitle, ogDescription, ogType = "website", jsonLd }: SEOProps) => {
  const canonical = `${DOMAIN}${path}`;
  const structuredData = jsonLd || defaultJsonLd;
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
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
};

export default SEO;
