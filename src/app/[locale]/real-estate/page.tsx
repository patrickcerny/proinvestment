import { notFound } from "next/navigation";
import { LocalizedIntroPage } from "@/components/pages/LocalizedIntroPage";
import { getDictionary, isLocale } from "@/i18n/config";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return <LocalizedIntroPage {...getDictionary(locale).pages.realEstate} />;
}
