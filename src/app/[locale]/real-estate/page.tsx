import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyHero } from "@/components/pages/PropertyHero/PropertyHero";
import { PropertyShowcase } from "@/components/ui/PropertyShowcase/PropertyShowcase";
import { getCmsDictionary } from "@/lib/cms-dictionary";
import { isLocale } from "@/i18n/config";
import { getProperties } from "@/lib/properties";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const page = getCmsDictionary(locale).pages.realEstate;
  return { title: page.eyebrow, description: page.description };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const page = getCmsDictionary(locale).pages.realEstate;
  const properties = (await getProperties()).filter((property) => property.enabled !== false);
  return <><PropertyHero eyebrow={page.eyebrow} title={page.title} description={page.description} hint={locale === "de" ? "Scrollen zum Entdecken" : "Scroll to explore"} /><PropertyShowcase locale={locale} properties={properties} /></>;
}
