import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLink } from "@/components/ui/ArrowLink/ArrowLink";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { getDictionary, isLocale, localizedPath } from "@/i18n/config";
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

  return <>
    <section className={styles.hero}>
      <div className={styles.heroBars} aria-hidden="true">{[7, 10, 8, 12].map((height) => <span key={height} style={{ height: `${height}rem` }} />)}</div>
      <Reveal className={styles.heroContent}><h1>{t.hero.titleLine1}<br />{t.hero.titleLine2}</h1><p>{t.hero.description}</p><div className={styles.actions}>
        <ArrowLink href={localizedPath(locale, "/investment")}>{t.hero.primaryAction}</ArrowLink>
        <ArrowLink href={localizedPath(locale, "/get-in-touch")} variant="outline">{t.hero.secondaryAction}</ArrowLink>
      </div></Reveal>
    </section>
    <section className={styles.metrics}><div className={styles.metricsInner}>{t.metrics.map((metric, index) =>
      <Reveal delay={index * 90} key={metric.label}><div className={styles.metric}><strong>{metric.value}</strong><span>{metric.label}</span></div></Reveal>
    )}</div></section>
    <section className={styles.section}><div className={styles.container}>
      <Reveal className={styles.sectionHeader}><h2>{t.focus.title}</h2><p>{t.focus.description}</p></Reveal>
      <div className={styles.focusGrid}>{t.focus.items.map((item, index) =>
        <Reveal delay={index * 110} key={item.title}><article className={styles.focusCard}><BuildingIcon /><h3>{item.title}</h3><p>{item.description}</p></article></Reveal>
      )}</div>
    </div></section>
    <section className={`${styles.section} ${styles.sectionAlt}`}><div className={styles.container}>
      <Reveal className={styles.sectionHeader}><h2>{t.projects.title}</h2></Reveal>
      <div className={styles.projectGrid}>{t.projects.items.map((project, index) =>
        <Reveal delay={index * 120} key={project.title}><article className={styles.projectCard}><div className={styles.projectVisual}><BuildingIcon /></div><div className={styles.projectBody}><small>{project.type}</small><h3>{project.title}</h3><p>{project.location}</p><div className={styles.projectMeta}><span>{project.value}</span><span>→</span></div></div></article></Reveal>
      )}</div>
    </div></section>
    <section className={styles.philosophy}><Reveal className={styles.container}><blockquote>{t.philosophy.quote}</blockquote><p>— {t.philosophy.label}</p></Reveal></section>
    <section className={styles.cta}><Reveal className={styles.container}><h2>{t.cta.title}</h2><p>{t.cta.description}</p><ArrowLink href={localizedPath(locale, "/get-in-touch")}>{t.cta.action}</ArrowLink></Reveal></section>
  </>;
}

function BuildingIcon() {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 48 48"><path d="M9 42V20h12v22M21 42V8h18v34M5 42h38M14 26h3m-3 7h3M27 15h6m-6 7h6m-6 7h6m-6 7h6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}
