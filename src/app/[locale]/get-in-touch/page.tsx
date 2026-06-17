import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedIntroPage } from "@/components/pages/LocalizedIntroPage";
import { getCmsDictionary } from "@/lib/cms-dictionary";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const page = getCmsDictionary(locale).pages.getInTouch;
  return { title: page.eyebrow, description: page.description };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return <LocalizedIntroPage {...getCmsDictionary(locale).pages.getInTouch} />;
}
