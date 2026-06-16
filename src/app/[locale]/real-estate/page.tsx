import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui/PageIntro/PageIntro";
import { PropertyShowcase } from "@/components/ui/PropertyShowcase/PropertyShowcase";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { getDictionary, isLocale } from "@/i18n/config";
import { getProperties } from "@/lib/properties";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const page = getDictionary(locale).pages.realEstate;
  return { title: page.eyebrow, description: page.description };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const page = getDictionary(locale).pages.realEstate;
  const properties = await getProperties();
  return <><Reveal><PageIntro {...page} /></Reveal><PropertyShowcase locale={locale} properties={properties} /></>;
}
