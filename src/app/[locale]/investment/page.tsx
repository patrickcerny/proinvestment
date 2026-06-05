import { notFound } from "next/navigation";
import { StickyStory } from "@/components/ui/StickyStory/StickyStory";
import { getDictionary, isLocale, localizedPath } from "@/i18n/config";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const story = getDictionary(locale).investmentStory;
  return <StickyStory {...story} closingHref={localizedPath(locale, "/get-in-touch")} />;
}
