import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StickyStory } from "@/components/ui/StickyStory/StickyStory";
import { getCmsDictionary } from "@/lib/cms-dictionary";
import { isLocale, localizedPath } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const story = getCmsDictionary(locale).investmentStory;
  return { title: story.eyebrow, description: story.intro };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const story = getCmsDictionary(locale).investmentStory;
  return <StickyStory {...story} closingHref={localizedPath(locale, "/get-in-touch")} />;
}
