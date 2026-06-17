import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLink } from "@/components/ui/ArrowLink/ArrowLink";
import { PropertyShowcase } from "@/components/ui/PropertyShowcase/PropertyShowcase";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { getCmsDictionary } from "@/lib/cms-dictionary";
import { isLocale, localizedPath } from "@/i18n/config";
import { getProperties } from "@/lib/properties";
import { buildMetadata } from "@/lib/seo";
import styles from "../Home.module.scss";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dictionary = getCmsDictionary(locale);
  return buildMetadata({
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    locale,
    keywords: ["Immobilieninvestment Österreich", "Vermögensverwaltung", "Kapitalanlage"],
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getCmsDictionary(locale).home;
  const featuredProperties = (await getProperties()).filter((property) => property.enabled !== false && property.showOnHome).slice(0, 3);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBars} aria-hidden="true">
          {[7, 10, 8, 12].map((height) => <span key={height} style={{ height: `${height}rem` }} />)}
        </div>
        <Reveal className={styles.heroContent}>
          <h1>{t.hero.titleLine1}<br />{t.hero.titleLine2}</h1>
          <p>{t.hero.description}</p>
          <div className={styles.actions}>
            <ArrowLink href={localizedPath(locale, "/investment")}>{t.hero.primaryAction}</ArrowLink>
            <ArrowLink href={localizedPath(locale, "/get-in-touch")} variant="outline">{t.hero.secondaryAction}</ArrowLink>
          </div>
        </Reveal>
      </section>

      <section className={styles.metrics}>
        <div className={styles.metricsInner}>
          {t.metrics.map((metric, index) => (
            <Reveal delay={index * 90} key={metric.label}>
              <div className={styles.metric}><strong>{metric.value}</strong><span>{metric.label}</span></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <Reveal className={styles.sectionHeader}><h2>{t.focus.title}</h2><p>{t.focus.description}</p></Reveal>
          <div className={styles.focusGrid}>
            {t.focus.items.map((item, index) => (
              <Reveal delay={index * 110} key={item.title}>
                <article className={styles.focusCard}><FocusIcon name={item.icon} fallbackIndex={index} /><h3>{item.title}</h3><p>{item.description}</p></article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PropertyShowcase locale={locale} mode="featured" properties={featuredProperties} />

      <section className={styles.philosophy}>
        <Reveal className={styles.container}><blockquote>{t.philosophy.quote}</blockquote><p>- {t.philosophy.label}</p></Reveal>
      </section>

      <section className={styles.cta}>
        <Reveal className={styles.container}><h2>{t.cta.title}</h2><p>{t.cta.description}</p><ArrowLink href={localizedPath(locale, "/get-in-touch")}>{t.cta.action}</ArrowLink></Reveal>
      </section>
    </>
  );
}

function FocusIcon({ fallbackIndex, name }: { fallbackIndex: number; name?: string }) {
  const resolved = name || ["growth", "finance", "property"][fallbackIndex % 3];

  if (resolved === "growth") {
    return <svg aria-hidden="true" fill="none" viewBox="0 0 48 48"><path d="M8 36l9-9 7 7 16-16M31 18h9v9M8 42h32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
  }

  if (resolved === "finance") {
    return <svg aria-hidden="true" fill="none" viewBox="0 0 48 48"><path d="M10 38V22M24 38V10M38 38V18M6 42h36" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
  }

  return <svg aria-hidden="true" fill="none" viewBox="0 0 48 48"><path d="M9 42V20h12v22M21 42V8h18v34M5 42h38M14 26h3m-3 7h3M27 15h6m-6 7h6m-6 7h6m-6 7h6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}

