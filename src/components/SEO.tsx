import { Helmet } from "react-helmet-async";
import { useSettings } from "@/hooks/use-settings";
import { useContent } from "@/hooks/use-content";
import { useCategories } from "@/hooks/use-categories";

const DOMAIN = import.meta.env.VITE_SITE_URL || "http://159.194.201.36";
const OG_IMAGE = `${DOMAIN}/hero-poster.jpg`;

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
  const { content } = useContent();
  const categories = useCategories();

  const seo = settings?.seo?.[path];
  const finalTitle = seo?.title || title;
  const finalDescription = seo?.description || description;
  const canonical = `${DOMAIN}${path}`;
  const isHome = path === "/";

  const companyName = (settings as any)?.companyName || "АВИС";
  const phone = content?.contacts?.phone || (settings as any)?.phone || "";
  const email = content?.contacts?.email || (settings as any)?.email || "";
  const address = content?.contacts?.address || (settings as any)?.address || "";
  const inn = (settings as any)?.inn || "";
  const ogrn = (settings as any)?.ogrn || "";

  const organizationJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyName,
    url: DOMAIN,
    logo: `${DOMAIN}/favicon.svg`,
    description: finalDescription,
    areaServed: "RU",
  };
  if (phone || email) {
    organizationJsonLd.contactPoint = {
      "@type": "ContactPoint",
      contactType: "sales",
      ...(phone ? { telephone: phone } : {}),
      ...(email ? { email } : {}),
      availableLanguage: ["Russian"],
    };
  }
  if (address) {
    organizationJsonLd.address = { "@type": "PostalAddress", streetAddress: address, addressCountry: "RU" };
  }
  if (inn || ogrn) {
    organizationJsonLd.identifier = [
      ...(inn ? [{ "@type": "PropertyValue", propertyID: "ИНН", value: inn }] : []),
      ...(ogrn ? [{ "@type": "PropertyValue", propertyID: "ОГРН", value: ogrn }] : []),
    ];
  }
  if (categories.length > 0) {
    organizationJsonLd.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: "Средства защиты от БПЛА",
      itemListElement: categories.map((c) => ({ "@type": "Offer", name: c.label })),
    };
  }

  const buildBreadcrumb = () => {
    const items: Array<{ name: string; url: string }> = [{ name: "Главная", url: DOMAIN }];
    const segments = path.split("/").filter(Boolean);
    if (segments[0] === "solutions") {
      items.push({ name: "Каталог", url: `${DOMAIN}/solutions` });
      if (segments[1] === "category" && segments[2]) {
        const cat = categories.find((c) => c.slug === segments[2]);
        if (cat) items.push({ name: cat.label, url: `${DOMAIN}/solutions/category/${cat.slug}` });
      } else if (segments[1]) {
        const product = (content?.products || []).find((p: any) => (p.slug || "") === segments[1]);
        if (product) items.push({ name: (product as any).name || finalTitle, url: canonical });
        else items.push({ name: finalTitle, url: canonical });
      }
    } else if (segments.length > 0) {
      items.push({ name: finalTitle, url: canonical });
    }
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: it.url,
      })),
    };
  };

  const jsonLd = isHome ? organizationJsonLd : buildBreadcrumb();

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
      <meta property="og:site_name" content={companyName} />
      <meta property="og:locale" content="ru_RU" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || finalTitle} />
      <meta name="twitter:description" content={ogDescription || finalDescription} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default SEO;
