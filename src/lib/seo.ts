import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";

export const SITE_URL = "https://www.proinvestment.at";
export const SITE_NAME = "ProInvestment";
export const PUBLISHER = "ProInvestment VermögenstreuhandgesmbH";
export const OG_IMAGE = `${SITE_URL}/images/proinvestment-og.jpg`;
export const LOGO_URL = `${SITE_URL}/images/proinvestment-logo.png`;

const BASE_KEYWORDS = [
  "ProInvestment",
  "Immobilien Österreich",
  "real estate Austria",
  "Immobilieninvestment",
  "Vermögenstreuhand",
  "Finanzierung",
  "Immobilienfinanzierung",
  "investment advisory",
  "Hörbranz",
  "Vorarlberg",
];

export function canonicalUrl(locale: Locale, path = "") {
  return `${SITE_URL}/${locale}${path}`;
}

export function buildMetadata({
  title,
  description,
  locale,
  path,
  keywords = [],
  ogImage = OG_IMAGE,
  noIndex = false,
}: {
  title: string;
  description: string;
  locale: Locale;
  path?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const url = canonicalUrl(locale, path);
  const allKeywords = [...BASE_KEYWORDS, ...keywords];

  return {
    title,
    description,
    keywords: allKeywords,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: {
      canonical: url,
      languages: {
        de: canonicalUrl("de", path),
        en: canonicalUrl("en", path),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "de" ? "de_AT" : "en_US",
      alternateLocale: locale === "de" ? "en_US" : "de_AT",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    other: {
      publisher: PUBLISHER,
    },
  };
}

// JSON-LD helpers

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: PUBLISHER,
    url: SITE_URL,
    logo: LOGO_URL,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+43-5573-84777-0",
      contactType: "customer service",
      availableLanguage: ["German", "English"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ruckburg – Allgäustraße 5",
      addressLocality: "Hörbranz",
      postalCode: "6912",
      addressCountry: "AT",
    },
    sameAs: [],
  };
}

export function realEstateListingSchema({
  name,
  description,
  url,
  image,
  price,
  city,
  country,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  price?: string;
  city?: string;
  country?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name,
    description,
    url,
    image: image ? [image] : undefined,
    offers: price
      ? {
          "@type": "Offer",
          price,
          priceCurrency: "EUR",
          seller: { "@type": "Organization", name: SITE_NAME },
        }
      : undefined,
    locationCreated: city
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: city,
            addressCountry: country ?? "AT",
          },
        }
      : undefined,
  };
}
