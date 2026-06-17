import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyDetail } from "@/components/pages/PropertyDetail/PropertyDetail";
import { SchemaOrg } from "@/components/SchemaOrg";
import { isLocale } from "@/i18n/config";
import { getProperties } from "@/lib/properties";
import { buildMetadata, canonicalUrl, realEstateListingSchema } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) return {};
  const property = (await getProperties()).find((item) => item.id === id && item.enabled !== false);
  if (!property) return {};
  const content = property.content[locale];
  const ogImage = property.images?.[0] ?? property.image;
  return buildMetadata({
    title: content.title,
    description: content.description,
    locale,
    path: `/real-estate/${id}`,
    keywords: [content.title, property.city, property.country].filter(Boolean) as string[],
    ogImage: ogImage ? (ogImage.startsWith("http") ? ogImage : `https://www.proinvestment.at${ogImage}`) : undefined,
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const property = (await getProperties()).find((item) => item.id === id && item.enabled !== false);
  if (!property) notFound();
  const content = property.content[locale];
  const image = property.images?.[0] ?? property.image;
  const schema = realEstateListingSchema({
    name: content.title,
    description: content.description,
    url: canonicalUrl(locale, `/real-estate/${id}`),
    image: image ? (image.startsWith("http") ? image : `https://www.proinvestment.at${image}`) : undefined,
    price: property.price,
    city: property.city,
    country: property.country,
  });
  return (
    <>
      <SchemaOrg schema={schema} />
      <PropertyDetail locale={locale} property={property} />
    </>
  );
}
