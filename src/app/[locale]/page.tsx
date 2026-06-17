import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLink } from "@/components/ui/ArrowLink/ArrowLink";
import { PropertyShowcase } from "@/components/ui/PropertyShowcase/PropertyShowcase";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { getDictionary, isLocale, localizedPath } from "@/i18n/config";
import { getProperties } from "@/lib/properties";
import styles from "../Home.module.scss";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).home.hero;
  return { title: locale === "de" ? "Werte schaffen. Zukunft gestalten." : "Creating Value. Shaping the Future.", description: t.description };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale).home;
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
                <article className={styles.focusCard}><BuildingIcon /><h3>{item.title}</h3><p>{item.description}</p></article>
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

function BuildingIcon() {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 48 48"><path d="M9 42V20h12v22M21 42V8h18v34M5 42h38M14 26h3m-3 7h3M27 15h6m-6 7h6m-6 7h6m-6 7h6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}
