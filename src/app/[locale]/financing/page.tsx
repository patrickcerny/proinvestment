import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FinancingBlueprint } from "@/components/ui/FinancingBlueprint/FinancingBlueprint";
import { getCmsDictionary } from "@/lib/cms-dictionary";
import { isLocale, localizedPath } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const story = getCmsDictionary(locale).financingStory;
  return buildMetadata({
    title: story.eyebrow,
    description: story.intro,
    locale,
    path: "/financing",
    keywords: ["Immobilienfinanzierung", "Projektfinanzierung", "Refinanzierung", "Bankpartner"],
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return <FinancingBlueprint {...getCmsDictionary(locale).financingStory} closingHref={localizedPath(locale, "/get-in-touch")} />;
}
