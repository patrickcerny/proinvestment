import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyDetail } from "@/components/pages/PropertyDetail/PropertyDetail";
import { isLocale } from "@/i18n/config";
import { getProperties } from "@/lib/properties";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) return {};
  const property = (await getProperties()).find((item) => item.id === id && item.enabled !== false);
  if (!property) return {};
  const content = property.content[locale];
  return { title: content.title, description: content.description };
}

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const property = (await getProperties()).find((item) => item.id === id && item.enabled !== false);
  if (!property) notFound();
  return <PropertyDetail locale={locale} property={property} />;
}
