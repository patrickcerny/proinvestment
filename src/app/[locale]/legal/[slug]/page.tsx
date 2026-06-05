import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/pages/LegalPage/LegalPage";
import { getDictionary, isLocale } from "@/i18n/config";

const slugs = ["imprint", "privacy", "terms", "legal-foundations"] as const;

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !slugs.includes(slug as typeof slugs[number])) return {};
  const page = getDictionary(locale).legalPages[slug as typeof slugs[number]];
  return { title: page.title, description: page.intro };
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !slugs.includes(slug as typeof slugs[number])) notFound();
  return <LegalPage {...getDictionary(locale).legalPages[slug as typeof slugs[number]]} />;
}
