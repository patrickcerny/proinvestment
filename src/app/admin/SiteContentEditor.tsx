"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Dictionary, Locale } from "@/i18n/config";
import { saveSiteContentAction } from "./actions";
import styles from "./SiteContentEditor.module.scss";

type CmsContent = {
  de: Dictionary;
  en: Dictionary;
};

const sections = [
  { id: "global", label: "Global" },
  { id: "home", label: "Homepage" },
  { id: "financing", label: "Finanzierung" },
  { id: "investment", label: "Veranlagung" },
  { id: "pages", label: "Seiten" },
  { id: "legal", label: "Rechtliches" },
] as const;

const legalSlugs = ["imprint", "privacy", "terms", "legal-foundations"] as const;
type LegalSlug = (typeof legalSlugs)[number];

export function SiteContentEditor({ initialContent }: { initialContent: CmsContent }) {
  const [content, setContent] = useState<CmsContent>(initialContent);
  const [section, setSection] = useState<(typeof sections)[number]["id"]>("global");
  const [legalSlug, setLegalSlug] = useState<LegalSlug>("imprint");
  const serialized = useMemo(() => JSON.stringify(content), [content]);

  function updateLocale(locale: Locale, updater: (current: Dictionary) => Dictionary) {
    setContent((current) => ({ ...current, [locale]: updater(current[locale]) }));
  }

  function setValue(locale: Locale, path: (string | number)[], value: string) {
    updateLocale(locale, (current) => setDeepValue(current, path, value));
  }

  return (
    <form action={saveSiteContentAction} className={styles.layout}>
      <aside className={styles.sidebar}>
        {sections.map((item) => (
          <button
            className={styles.sidebarButton}
            data-active={section === item.id}
            key={item.id}
            type="button"
            onClick={() => setSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </aside>

      <section className={styles.content}>
        <p className={styles.note}>Animated structures stay in code. Edit the visible copy here.</p>
        {section === "global" && (
          <SectionFrame title="Navigation und Footer">
            <LocalePanel title="Deutsch" locale="de">
              <Field label="Meta Titel" value={content.de.meta.title} onChange={(value) => setValue("de", ["meta", "title"], value)} />
              <Field label="Meta Beschreibung" textarea value={content.de.meta.description} onChange={(value) => setValue("de", ["meta", "description"], value)} />
              <Field label="Home" value={content.de.navigation.home} onChange={(value) => setValue("de", ["navigation", "home"], value)} />
              <Field label="Investment" value={content.de.navigation.investment} onChange={(value) => setValue("de", ["navigation", "investment"], value)} />
              <Field label="Finanzierung" value={content.de.navigation.financing} onChange={(value) => setValue("de", ["navigation", "financing"], value)} />
              <Field label="Immobilien" value={content.de.navigation.realEstate} onChange={(value) => setValue("de", ["navigation", "realEstate"], value)} />
              <Field label="Kontakt" value={content.de.navigation.getInTouch} onChange={(value) => setValue("de", ["navigation", "getInTouch"], value)} />
              <Field label="Sprache" value={content.de.navigation.language} onChange={(value) => setValue("de", ["navigation", "language"], value)} />
              <Field label="Menü öffnen" value={content.de.navigation.openMenu} onChange={(value) => setValue("de", ["navigation", "openMenu"], value)} />
              <Field label="Menü schließen" value={content.de.navigation.closeMenu} onChange={(value) => setValue("de", ["navigation", "closeMenu"], value)} />
              <Field label="Footer-Text" textarea value={content.de.footer.description} onChange={(value) => setValue("de", ["footer", "description"], value)} />
              <Field label="Footer - Firma" value={content.de.footer.company} onChange={(value) => setValue("de", ["footer", "company"], value)} />
              <Field label="Footer - Kontakt" value={content.de.footer.contact} onChange={(value) => setValue("de", ["footer", "contact"], value)} />
              <Field label="Footer - Rechte" value={content.de.footer.rights} onChange={(value) => setValue("de", ["footer", "rights"], value)} />
              <Field label="Footer - Datenschutz" value={content.de.footer.privacy} onChange={(value) => setValue("de", ["footer", "privacy"], value)} />
              <Field label="Footer - AGB" value={content.de.footer.terms} onChange={(value) => setValue("de", ["footer", "terms"], value)} />
              <Field label="Footer - Rechtliches" value={content.de.footer.legal} onChange={(value) => setValue("de", ["footer", "legal"], value)} />
              <Field label="Footer - Grundlagen" value={content.de.footer.foundations} onChange={(value) => setValue("de", ["footer", "foundations"], value)} />
            </LocalePanel>
            <LocalePanel title="English" locale="en">
              <Field label="Meta title" value={content.en.meta.title} onChange={(value) => setValue("en", ["meta", "title"], value)} />
              <Field label="Meta description" textarea value={content.en.meta.description} onChange={(value) => setValue("en", ["meta", "description"], value)} />
              <Field label="Home" value={content.en.navigation.home} onChange={(value) => setValue("en", ["navigation", "home"], value)} />
              <Field label="Investment" value={content.en.navigation.investment} onChange={(value) => setValue("en", ["navigation", "investment"], value)} />
              <Field label="Financing" value={content.en.navigation.financing} onChange={(value) => setValue("en", ["navigation", "financing"], value)} />
              <Field label="Real estate" value={content.en.navigation.realEstate} onChange={(value) => setValue("en", ["navigation", "realEstate"], value)} />
              <Field label="Contact" value={content.en.navigation.getInTouch} onChange={(value) => setValue("en", ["navigation", "getInTouch"], value)} />
              <Field label="Language" value={content.en.navigation.language} onChange={(value) => setValue("en", ["navigation", "language"], value)} />
              <Field label="Open menu" value={content.en.navigation.openMenu} onChange={(value) => setValue("en", ["navigation", "openMenu"], value)} />
              <Field label="Close menu" value={content.en.navigation.closeMenu} onChange={(value) => setValue("en", ["navigation", "closeMenu"], value)} />
              <Field label="Footer description" textarea value={content.en.footer.description} onChange={(value) => setValue("en", ["footer", "description"], value)} />
              <Field label="Footer - Company" value={content.en.footer.company} onChange={(value) => setValue("en", ["footer", "company"], value)} />
              <Field label="Footer - Contact" value={content.en.footer.contact} onChange={(value) => setValue("en", ["footer", "contact"], value)} />
              <Field label="Footer - Rights" value={content.en.footer.rights} onChange={(value) => setValue("en", ["footer", "rights"], value)} />
              <Field label="Footer - Privacy" value={content.en.footer.privacy} onChange={(value) => setValue("en", ["footer", "privacy"], value)} />
              <Field label="Footer - Terms" value={content.en.footer.terms} onChange={(value) => setValue("en", ["footer", "terms"], value)} />
              <Field label="Footer - Legal" value={content.en.footer.legal} onChange={(value) => setValue("en", ["footer", "legal"], value)} />
              <Field label="Footer - Foundations" value={content.en.footer.foundations} onChange={(value) => setValue("en", ["footer", "foundations"], value)} />
            </LocalePanel>
          </SectionFrame>
        )}

        {section === "home" && (
          <SectionFrame title="Homepage">
            <LocalePanel title="Deutsch" locale="de">
              <Field label="Titelzeile 1" value={content.de.home.hero.titleLine1} onChange={(value) => setValue("de", ["home", "hero", "titleLine1"], value)} />
              <Field label="Titelzeile 2" value={content.de.home.hero.titleLine2} onChange={(value) => setValue("de", ["home", "hero", "titleLine2"], value)} />
              <Field label="Beschreibung" textarea value={content.de.home.hero.description} onChange={(value) => setValue("de", ["home", "hero", "description"], value)} />
              <Field label="Primäre Aktion" value={content.de.home.hero.primaryAction} onChange={(value) => setValue("de", ["home", "hero", "primaryAction"], value)} />
              <Field label="Sekundäre Aktion" value={content.de.home.hero.secondaryAction} onChange={(value) => setValue("de", ["home", "hero", "secondaryAction"], value)} />
              <Field label="Focus Titel" value={content.de.home.focus.title} onChange={(value) => setValue("de", ["home", "focus", "title"], value)} />
              <Field label="Focus Beschreibung" textarea value={content.de.home.focus.description} onChange={(value) => setValue("de", ["home", "focus", "description"], value)} />
              <Field label="Philosophie Zitat" textarea value={content.de.home.philosophy.quote} onChange={(value) => setValue("de", ["home", "philosophy", "quote"], value)} />
              <Field label="Philosophie Label" value={content.de.home.philosophy.label} onChange={(value) => setValue("de", ["home", "philosophy", "label"], value)} />
              <Field label="CTA Titel" value={content.de.home.cta.title} onChange={(value) => setValue("de", ["home", "cta", "title"], value)} />
              <Field label="CTA Beschreibung" textarea value={content.de.home.cta.description} onChange={(value) => setValue("de", ["home", "cta", "description"], value)} />
              <Field label="CTA Aktion" value={content.de.home.cta.action} onChange={(value) => setValue("de", ["home", "cta", "action"], value)} />
            </LocalePanel>
            <LocalePanel title="English" locale="en">
              <Field label="Title line 1" value={content.en.home.hero.titleLine1} onChange={(value) => setValue("en", ["home", "hero", "titleLine1"], value)} />
              <Field label="Title line 2" value={content.en.home.hero.titleLine2} onChange={(value) => setValue("en", ["home", "hero", "titleLine2"], value)} />
              <Field label="Description" textarea value={content.en.home.hero.description} onChange={(value) => setValue("en", ["home", "hero", "description"], value)} />
              <Field label="Primary action" value={content.en.home.hero.primaryAction} onChange={(value) => setValue("en", ["home", "hero", "primaryAction"], value)} />
              <Field label="Secondary action" value={content.en.home.hero.secondaryAction} onChange={(value) => setValue("en", ["home", "hero", "secondaryAction"], value)} />
              <Field label="Focus title" value={content.en.home.focus.title} onChange={(value) => setValue("en", ["home", "focus", "title"], value)} />
              <Field label="Focus description" textarea value={content.en.home.focus.description} onChange={(value) => setValue("en", ["home", "focus", "description"], value)} />
              <Field label="Philosophy quote" textarea value={content.en.home.philosophy.quote} onChange={(value) => setValue("en", ["home", "philosophy", "quote"], value)} />
              <Field label="Philosophy label" value={content.en.home.philosophy.label} onChange={(value) => setValue("en", ["home", "philosophy", "label"], value)} />
              <Field label="CTA title" value={content.en.home.cta.title} onChange={(value) => setValue("en", ["home", "cta", "title"], value)} />
              <Field label="CTA description" textarea value={content.en.home.cta.description} onChange={(value) => setValue("en", ["home", "cta", "description"], value)} />
              <Field label="CTA action" value={content.en.home.cta.action} onChange={(value) => setValue("en", ["home", "cta", "action"], value)} />
            </LocalePanel>
          </SectionFrame>
        )}

        {section === "financing" && (
          <SectionFrame title="Finanzierung">
            <LocalePanel title="Deutsch" locale="de">
              <Field label="Eyebrow" value={content.de.financingStory.eyebrow} onChange={(value) => setValue("de", ["financingStory", "eyebrow"], value)} />
              <Field label="Titel" value={content.de.financingStory.title} onChange={(value) => setValue("de", ["financingStory", "title"], value)} />
              <Field label="Intro" textarea value={content.de.financingStory.intro} onChange={(value) => setValue("de", ["financingStory", "intro"], value)} />
              <Field label="Scroll hint" value={content.de.financingStory.scrollHint} onChange={(value) => setValue("de", ["financingStory", "scrollHint"], value)} />
              <Field label="Flow Titel" value={content.de.financingStory.flowTitle} onChange={(value) => setValue("de", ["financingStory", "flowTitle"], value)} />
              <Field label="Flow Beschreibung" textarea value={content.de.financingStory.flowDescription} onChange={(value) => setValue("de", ["financingStory", "flowDescription"], value)} />
              <Field label="Options Titel" value={content.de.financingStory.optionsTitle} onChange={(value) => setValue("de", ["financingStory", "optionsTitle"], value)} />
              <Field label="Closing Titel" value={content.de.financingStory.closingTitle} onChange={(value) => setValue("de", ["financingStory", "closingTitle"], value)} />
              <Field label="Closing Aktion" value={content.de.financingStory.closingAction} onChange={(value) => setValue("de", ["financingStory", "closingAction"], value)} />
            </LocalePanel>
            <LocalePanel title="English" locale="en">
              <Field label="Eyebrow" value={content.en.financingStory.eyebrow} onChange={(value) => setValue("en", ["financingStory", "eyebrow"], value)} />
              <Field label="Title" value={content.en.financingStory.title} onChange={(value) => setValue("en", ["financingStory", "title"], value)} />
              <Field label="Intro" textarea value={content.en.financingStory.intro} onChange={(value) => setValue("en", ["financingStory", "intro"], value)} />
              <Field label="Scroll hint" value={content.en.financingStory.scrollHint} onChange={(value) => setValue("en", ["financingStory", "scrollHint"], value)} />
              <Field label="Flow title" value={content.en.financingStory.flowTitle} onChange={(value) => setValue("en", ["financingStory", "flowTitle"], value)} />
              <Field label="Flow description" textarea value={content.en.financingStory.flowDescription} onChange={(value) => setValue("en", ["financingStory", "flowDescription"], value)} />
              <Field label="Options title" value={content.en.financingStory.optionsTitle} onChange={(value) => setValue("en", ["financingStory", "optionsTitle"], value)} />
              <Field label="Closing title" value={content.en.financingStory.closingTitle} onChange={(value) => setValue("en", ["financingStory", "closingTitle"], value)} />
              <Field label="Closing action" value={content.en.financingStory.closingAction} onChange={(value) => setValue("en", ["financingStory", "closingAction"], value)} />
            </LocalePanel>
          </SectionFrame>
        )}

        {section === "investment" && (
          <SectionFrame title="Veranlagung">
            <LocalePanel title="Deutsch" locale="de">
              <Field label="Eyebrow" value={content.de.investmentStory.eyebrow} onChange={(value) => setValue("de", ["investmentStory", "eyebrow"], value)} />
              <Field label="Titel" value={content.de.investmentStory.title} onChange={(value) => setValue("de", ["investmentStory", "title"], value)} />
              <Field label="Intro" textarea value={content.de.investmentStory.intro} onChange={(value) => setValue("de", ["investmentStory", "intro"], value)} />
              <Field label="Scroll hint" value={content.de.investmentStory.scrollHint} onChange={(value) => setValue("de", ["investmentStory", "scrollHint"], value)} />
              <Field label="Closing Titel" value={content.de.investmentStory.closingTitle} onChange={(value) => setValue("de", ["investmentStory", "closingTitle"], value)} />
              <Field label="Closing Aktion" value={content.de.investmentStory.closingAction} onChange={(value) => setValue("de", ["investmentStory", "closingAction"], value)} />
            </LocalePanel>
            <LocalePanel title="English" locale="en">
              <Field label="Eyebrow" value={content.en.investmentStory.eyebrow} onChange={(value) => setValue("en", ["investmentStory", "eyebrow"], value)} />
              <Field label="Title" value={content.en.investmentStory.title} onChange={(value) => setValue("en", ["investmentStory", "title"], value)} />
              <Field label="Intro" textarea value={content.en.investmentStory.intro} onChange={(value) => setValue("en", ["investmentStory", "intro"], value)} />
              <Field label="Scroll hint" value={content.en.investmentStory.scrollHint} onChange={(value) => setValue("en", ["investmentStory", "scrollHint"], value)} />
              <Field label="Closing title" value={content.en.investmentStory.closingTitle} onChange={(value) => setValue("en", ["investmentStory", "closingTitle"], value)} />
              <Field label="Closing action" value={content.en.investmentStory.closingAction} onChange={(value) => setValue("en", ["investmentStory", "closingAction"], value)} />
            </LocalePanel>
          </SectionFrame>
        )}

        {section === "pages" && (
          <SectionFrame title="Seiten">
            <LocalePanel title="Deutsch" locale="de">
              <Field label="Kontakt Eyebrow" value={content.de.pages.getInTouch.eyebrow} onChange={(value) => setValue("de", ["pages", "getInTouch", "eyebrow"], value)} />
              <Field label="Kontakt Titel" value={content.de.pages.getInTouch.title} onChange={(value) => setValue("de", ["pages", "getInTouch", "title"], value)} />
              <Field label="Kontakt Beschreibung" textarea value={content.de.pages.getInTouch.description} onChange={(value) => setValue("de", ["pages", "getInTouch", "description"], value)} />
              <Field label="Immobilien Eyebrow" value={content.de.pages.realEstate.eyebrow} onChange={(value) => setValue("de", ["pages", "realEstate", "eyebrow"], value)} />
              <Field label="Immobilien Titel" value={content.de.pages.realEstate.title} onChange={(value) => setValue("de", ["pages", "realEstate", "title"], value)} />
              <Field label="Immobilien Beschreibung" textarea value={content.de.pages.realEstate.description} onChange={(value) => setValue("de", ["pages", "realEstate", "description"], value)} />
            </LocalePanel>
            <LocalePanel title="English" locale="en">
              <Field label="Contact eyebrow" value={content.en.pages.getInTouch.eyebrow} onChange={(value) => setValue("en", ["pages", "getInTouch", "eyebrow"], value)} />
              <Field label="Contact title" value={content.en.pages.getInTouch.title} onChange={(value) => setValue("en", ["pages", "getInTouch", "title"], value)} />
              <Field label="Contact description" textarea value={content.en.pages.getInTouch.description} onChange={(value) => setValue("en", ["pages", "getInTouch", "description"], value)} />
              <Field label="Real estate eyebrow" value={content.en.pages.realEstate.eyebrow} onChange={(value) => setValue("en", ["pages", "realEstate", "eyebrow"], value)} />
              <Field label="Real estate title" value={content.en.pages.realEstate.title} onChange={(value) => setValue("en", ["pages", "realEstate", "title"], value)} />
              <Field label="Real estate description" textarea value={content.en.pages.realEstate.description} onChange={(value) => setValue("en", ["pages", "realEstate", "description"], value)} />
            </LocalePanel>
          </SectionFrame>
        )}

        {section === "legal" && (
          <SectionFrame title="Rechtliches">
            <div className={styles.legalPicker}>
              {legalSlugs.map((slug) => <button className={styles.legalButton} data-active={legalSlug === slug} key={slug} type="button" onClick={() => setLegalSlug(slug)}>{slug}</button>)}
            </div>
            <LocalePanel title="Deutsch" locale="de">
              <Field label="Eyebrow" value={content.de.legalPages[legalSlug].eyebrow} onChange={(value) => setValue("de", ["legalPages", legalSlug, "eyebrow"], value)} />
              <Field label="Titel" value={content.de.legalPages[legalSlug].title} onChange={(value) => setValue("de", ["legalPages", legalSlug, "title"], value)} />
              <Field label="Intro" textarea value={content.de.legalPages[legalSlug].intro} onChange={(value) => setValue("de", ["legalPages", legalSlug, "intro"], value)} />
              <Field label="Hinweis" textarea value={content.de.legalPages[legalSlug].notice} onChange={(value) => setValue("de", ["legalPages", legalSlug, "notice"], value)} />
            </LocalePanel>
            <LocalePanel title="English" locale="en">
              <Field label="Eyebrow" value={content.en.legalPages[legalSlug].eyebrow} onChange={(value) => setValue("en", ["legalPages", legalSlug, "eyebrow"], value)} />
              <Field label="Title" value={content.en.legalPages[legalSlug].title} onChange={(value) => setValue("en", ["legalPages", legalSlug, "title"], value)} />
              <Field label="Intro" textarea value={content.en.legalPages[legalSlug].intro} onChange={(value) => setValue("en", ["legalPages", legalSlug, "intro"], value)} />
              <Field label="Notice" textarea value={content.en.legalPages[legalSlug].notice} onChange={(value) => setValue("en", ["legalPages", legalSlug, "notice"], value)} />
            </LocalePanel>
          </SectionFrame>
        )}

        <input name="contentJson" type="hidden" value={serialized} />
        <button className={styles.saveButton} type="submit">Website speichern</button>
      </section>
    </form>
  );
}

function SectionFrame({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function LocalePanel({ children, locale, title }: { children: ReactNode; locale: Locale; title: string }) {
  return (
    <section className={styles.localePanel} data-locale={locale}>
      <h3>{title}</h3>
      <div className={styles.localeFields}>{children}</div>
    </section>
  );
}

function Field({ label, onChange, textarea = false, value }: { label: string; onChange: (value: string) => void; textarea?: boolean; value: string }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {textarea ? <textarea value={value} onChange={(event) => onChange(event.target.value)} /> : <input value={value} onChange={(event) => onChange(event.target.value)} />}
    </label>
  );
}

function setDeepValue<T>(value: T, path: (string | number)[], nextValue: string): T {
  if (!path.length) return nextValue as T;
  const [head, ...rest] = path;
  if (Array.isArray(value)) {
    const next = [...value];
    next[Number(head)] = setDeepValue(next[Number(head)], rest, nextValue);
    return next as T;
  }
  if (value && typeof value === "object") {
    const key = String(head);
    const current = value as Record<string, unknown>;
    return {
      ...current,
      [key]: setDeepValue(current[key] as T, rest, nextValue),
    } as T;
  }
  return value;
}
