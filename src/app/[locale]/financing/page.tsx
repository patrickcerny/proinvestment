import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FinancingBlueprint } from "@/components/ui/FinancingBlueprint/FinancingBlueprint";
import { getDictionary, isLocale, localizedPath } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const story = getDictionary(locale).financingStory;
  return { title: story.eyebrow, description: story.intro };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return <FinancingBlueprint {...getDictionary(locale).financingStory} closingHref={localizedPath(locale, "/get-in-touch")} />;
}
