"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Dictionary } from "@/i18n/config";
import { saveSiteContentAction } from "./actions";
import styles from "./SiteContentEditor.module.scss";

type CmsContent = {
  de: Dictionary;
  en: Dictionary;
};

type FocusIcon = "growth" | "finance" | "property";

const sections = [
  { id: "home", label: "Homepage" },
  { id: "financing", label: "Finanzierung" },
  { id: "investment", label: "Veranlagung" },
  { id: "pages", label: "Seiten" },
  { id: "legal", label: "Rechtliches" },
] as const;

const legalSlugs = ["imprint", "privacy", "terms", "legal-foundations"] as const;
const iconOptions: { label: string; value: FocusIcon }[] = [
  { label: "Growth", value: "growth" },
  { label: "Finance", value: "finance" },
  { label: "Property", value: "property" },
];

const caps = {
  focus: 3,
  metrics: 6,
  principles: 6,
  flowSteps: 6,
  options: 6,
  chapters: 8,
  legalSections: 12,
  legalParagraphs: 8,
} as const;

export function SiteContentEditor({ initialContent }: { initialContent: CmsContent }) {
  const [content, setContent] = useState<CmsContent>(() => normalizeContent(initialContent));
  const [section, setSection] = useState<(typeof sections)[number]["id"]>("home");
  const [legalSlug, setLegalSlug] = useState<(typeof legalSlugs)[number]>("imprint");
  const serialized = useMemo(() => JSON.stringify(content), [content]);

  function setLocaleValue(locale: "de" | "en", path: (string | number)[], value: string) {
    setContent((current) => ({ ...current, [locale]: setDeepValue(current[locale], path, value) }));
  }

  function setSharedValue(path: (string | number)[], value: string) {
    setContent((current) => ({
      de: setDeepValue(current.de, path, value),
      en: setDeepValue(current.en, path, value),
    }));
  }

  function updatePairedArray(path: (string | number)[], updater: (items: unknown[]) => unknown[]) {
    setContent((current) => ({
      de: setDeepValue(current.de, path, updater(getDeepValue(current.de, path) as unknown[])),
      en: setDeepValue(current.en, path, updater(getDeepValue(current.en, path) as unknown[])),
    }));
  }

  function addPairedItem(path: (string | number)[], createDe: () => unknown, createEn: () => unknown, max: number) {
    const items = getDeepValue(content.de, path) as unknown[];
    if (items.length >= max) return;
    setContent((current) => ({
      de: setDeepValue(current.de, path, [...(getDeepValue(current.de, path) as unknown[]), createDe()]),
      en: setDeepValue(current.en, path, [...(getDeepValue(current.en, path) as unknown[]), createEn()]),
    }));
  }

  function removePairedItem(path: (string | number)[], index: number, min = 1) {
    const items = getDeepValue(content.de, path) as unknown[];
    if (items.length <= min) return;
    updatePairedArray(path, (current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function addLegalParagraph(slug: (typeof legalSlugs)[number], sectionIndex: number) {
    const path = ["legalPages", slug, "sections", sectionIndex, "paragraphs"] as (string | number)[];
    const paragraphs = getDeepValue(content.de, path) as string[];
    if (paragraphs.length >= caps.legalParagraphs) return;
    updatePairedArray(path, (items) => [...items, ""]);
  }

  function removeLegalParagraph(slug: (typeof legalSlugs)[number], sectionIndex: number, paragraphIndex: number) {
    const path = ["legalPages", slug, "sections", sectionIndex, "paragraphs"] as (string | number)[];
    const paragraphs = getDeepValue(content.de, path) as string[];
    if (paragraphs.length <= 1) return;
    updatePairedArray(path, (items) => items.filter((_, itemIndex) => itemIndex !== paragraphIndex));
  }

  const deFocusItems = content.de.home.focus.items;
  const deMetrics = content.de.home.metrics;
  const dePrinciples = content.de.financingStory.principles;
  const deFlowSteps = content.de.financingStory.flowSteps;
  const deOptions = content.de.financingStory.options;
  const deChapters = content.de.investmentStory.chapters;
  const deLegalSections = content.de.legalPages[legalSlug].sections;

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
        {section === "home" && (
          <SectionFrame title="Homepage">
            <Panel title="Allgemein">
              <DualField label="Hero Titel Zeile 1" deValue={content.de.home.hero.titleLine1} enValue={content.en.home.hero.titleLine1} onDeChange={(value) => setLocaleValue("de", ["home", "hero", "titleLine1"], value)} onEnChange={(value) => setLocaleValue("en", ["home", "hero", "titleLine1"], value)} />
              <DualField label="Hero Titel Zeile 2" deValue={content.de.home.hero.titleLine2} enValue={content.en.home.hero.titleLine2} onDeChange={(value) => setLocaleValue("de", ["home", "hero", "titleLine2"], value)} onEnChange={(value) => setLocaleValue("en", ["home", "hero", "titleLine2"], value)} />
              <DualField label="Hero Beschreibung" textarea deValue={content.de.home.hero.description} enValue={content.en.home.hero.description} onDeChange={(value) => setLocaleValue("de", ["home", "hero", "description"], value)} onEnChange={(value) => setLocaleValue("en", ["home", "hero", "description"], value)} />
              <DualField label="Focus Titel" deValue={content.de.home.focus.title} enValue={content.en.home.focus.title} onDeChange={(value) => setLocaleValue("de", ["home", "focus", "title"], value)} onEnChange={(value) => setLocaleValue("en", ["home", "focus", "title"], value)} />
              <DualField label="Focus Beschreibung" textarea deValue={content.de.home.focus.description} enValue={content.en.home.focus.description} onDeChange={(value) => setLocaleValue("de", ["home", "focus", "description"], value)} onEnChange={(value) => setLocaleValue("en", ["home", "focus", "description"], value)} />
              <DualField label="Zitat" textarea deValue={content.de.home.philosophy.quote} enValue={content.en.home.philosophy.quote} onDeChange={(value) => setLocaleValue("de", ["home", "philosophy", "quote"], value)} onEnChange={(value) => setLocaleValue("en", ["home", "philosophy", "quote"], value)} />
              <DualField label="CTA Titel" deValue={content.de.home.cta.title} enValue={content.en.home.cta.title} onDeChange={(value) => setLocaleValue("de", ["home", "cta", "title"], value)} onEnChange={(value) => setLocaleValue("en", ["home", "cta", "title"], value)} />
              <DualField label="CTA Beschreibung" textarea deValue={content.de.home.cta.description} enValue={content.en.home.cta.description} onDeChange={(value) => setLocaleValue("de", ["home", "cta", "description"], value)} onEnChange={(value) => setLocaleValue("en", ["home", "cta", "description"], value)} />
            </Panel>

            <ArrayPanel
              count={deMetrics.length}
              max={caps.metrics}
              title="KPIs"
              onAdd={() => addPairedItem(["home", "metrics"], () => ({ value: "", label: "" }), () => ({ value: "", label: "" }), caps.metrics)}
            >
              {deMetrics.map((metric, index) => (
                <AccordionItem key={`metric-${index}`} open={index === 0} title={`KPI ${index + 1}`} onRemove={() => removePairedItem(["home", "metrics"], index)} canRemove={deMetrics.length > 1}>
                  <DualField label="Wert" deValue={metric.value} enValue={content.en.home.metrics[index]?.value || ""} onDeChange={(value) => setLocaleValue("de", ["home", "metrics", index, "value"], value)} onEnChange={(value) => setLocaleValue("en", ["home", "metrics", index, "value"], value)} />
                  <DualField label="Label" deValue={metric.label} enValue={content.en.home.metrics[index]?.label || ""} onDeChange={(value) => setLocaleValue("de", ["home", "metrics", index, "label"], value)} onEnChange={(value) => setLocaleValue("en", ["home", "metrics", index, "label"], value)} />
                </AccordionItem>
              ))}
            </ArrayPanel>

            <ArrayPanel
              count={deFocusItems.length}
              max={caps.focus}
              title="Focus Karten"
              onAdd={() => addPairedItem(["home", "focus", "items"], () => ({ icon: "growth", title: "", description: "" }), () => ({ icon: "growth", title: "", description: "" }), caps.focus)}
            >
              {deFocusItems.map((item, index) => {
                const iconValue = (item.icon as FocusIcon | undefined) ?? "growth";

                return (
                  <AccordionItem key={`focus-${index}`} open={index === 0} title={`Karte ${index + 1}`} onRemove={() => removePairedItem(["home", "focus", "items"], index)} canRemove={deFocusItems.length > 1}>
                    <SelectField label="Icon" options={iconOptions} value={iconValue} onChange={(value) => setSharedValue(["home", "focus", "items", index, "icon"], value)} />
                  <DualField label="Titel" deValue={item.title} enValue={content.en.home.focus.items[index]?.title || ""} onDeChange={(value) => setLocaleValue("de", ["home", "focus", "items", index, "title"], value)} onEnChange={(value) => setLocaleValue("en", ["home", "focus", "items", index, "title"], value)} />
                  <DualField label="Beschreibung" textarea deValue={item.description} enValue={content.en.home.focus.items[index]?.description || ""} onDeChange={(value) => setLocaleValue("de", ["home", "focus", "items", index, "description"], value)} onEnChange={(value) => setLocaleValue("en", ["home", "focus", "items", index, "description"], value)} />
                  </AccordionItem>
                );
              })}
            </ArrayPanel>
          </SectionFrame>
        )}

        {section === "financing" && (
          <SectionFrame title="Finanzierung">
            <Panel title="Allgemein">
              <DualField label="Eyebrow" deValue={content.de.financingStory.eyebrow} enValue={content.en.financingStory.eyebrow} onDeChange={(value) => setLocaleValue("de", ["financingStory", "eyebrow"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "eyebrow"], value)} />
              <DualField label="Titel" deValue={content.de.financingStory.title} enValue={content.en.financingStory.title} onDeChange={(value) => setLocaleValue("de", ["financingStory", "title"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "title"], value)} />
              <DualField label="Intro" textarea deValue={content.de.financingStory.intro} enValue={content.en.financingStory.intro} onDeChange={(value) => setLocaleValue("de", ["financingStory", "intro"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "intro"], value)} />
              <DualField label="Scroll Hinweis" deValue={content.de.financingStory.scrollHint} enValue={content.en.financingStory.scrollHint} onDeChange={(value) => setLocaleValue("de", ["financingStory", "scrollHint"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "scrollHint"], value)} />
              <DualField label="Principles Eyebrow" deValue={content.de.financingStory.principlesEyebrow} enValue={content.en.financingStory.principlesEyebrow} onDeChange={(value) => setLocaleValue("de", ["financingStory", "principlesEyebrow"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "principlesEyebrow"], value)} />
              <DualField label="Principles Titel" deValue={content.de.financingStory.principlesTitle} enValue={content.en.financingStory.principlesTitle} onDeChange={(value) => setLocaleValue("de", ["financingStory", "principlesTitle"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "principlesTitle"], value)} />
              <DualField label="Flow Eyebrow" deValue={content.de.financingStory.flowEyebrow} enValue={content.en.financingStory.flowEyebrow} onDeChange={(value) => setLocaleValue("de", ["financingStory", "flowEyebrow"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "flowEyebrow"], value)} />
              <DualField label="Flow Titel" deValue={content.de.financingStory.flowTitle} enValue={content.en.financingStory.flowTitle} onDeChange={(value) => setLocaleValue("de", ["financingStory", "flowTitle"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "flowTitle"], value)} />
              <DualField label="Flow Beschreibung" textarea deValue={content.de.financingStory.flowDescription} enValue={content.en.financingStory.flowDescription} onDeChange={(value) => setLocaleValue("de", ["financingStory", "flowDescription"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "flowDescription"], value)} />
              <DualField label="Options Eyebrow" deValue={content.de.financingStory.optionsEyebrow} enValue={content.en.financingStory.optionsEyebrow} onDeChange={(value) => setLocaleValue("de", ["financingStory", "optionsEyebrow"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "optionsEyebrow"], value)} />
              <DualField label="Options Titel" deValue={content.de.financingStory.optionsTitle} enValue={content.en.financingStory.optionsTitle} onDeChange={(value) => setLocaleValue("de", ["financingStory", "optionsTitle"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "optionsTitle"], value)} />
              <DualField label="Closing Titel" deValue={content.de.financingStory.closingTitle} enValue={content.en.financingStory.closingTitle} onDeChange={(value) => setLocaleValue("de", ["financingStory", "closingTitle"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "closingTitle"], value)} />
            </Panel>

            <Panel title="Blueprint">
              {Object.entries(content.de.financingStory.blueprint).map(([key, value]) => (
                <DualField
                  key={`blueprint-${key}`}
                  label={key}
                  deValue={value}
                  enValue={String((content.en.financingStory.blueprint as Record<string, string>)[key] || "")}
                  onDeChange={(next) => setLocaleValue("de", ["financingStory", "blueprint", key], next)}
                  onEnChange={(next) => setLocaleValue("en", ["financingStory", "blueprint", key], next)}
                />
              ))}
            </Panel>

            <ArrayPanel count={dePrinciples.length} max={caps.principles} title="Principles" onAdd={() => addPairedItem(["financingStory", "principles"], () => ({ number: nextNumber(dePrinciples.length), title: "", description: "" }), () => ({ number: nextNumber(dePrinciples.length), title: "", description: "" }), caps.principles)}>
              {dePrinciples.map((item, index) => (
                <AccordionItem key={`principle-${index}`} open={index === 0} title={`Principle ${index + 1}`} onRemove={() => removePairedItem(["financingStory", "principles"], index)} canRemove={dePrinciples.length > 1}>
                  <DualField label="Titel" deValue={item.title} enValue={content.en.financingStory.principles[index]?.title || ""} onDeChange={(value) => setLocaleValue("de", ["financingStory", "principles", index, "title"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "principles", index, "title"], value)} />
                  <DualField label="Beschreibung" textarea deValue={item.description} enValue={content.en.financingStory.principles[index]?.description || ""} onDeChange={(value) => setLocaleValue("de", ["financingStory", "principles", index, "description"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "principles", index, "description"], value)} />
                </AccordionItem>
              ))}
            </ArrayPanel>

            <ArrayPanel count={deFlowSteps.length} max={caps.flowSteps} title="Flow Steps" onAdd={() => addPairedItem(["financingStory", "flowSteps"], () => ({ label: "", value: "" }), () => ({ label: "", value: "" }), caps.flowSteps)}>
              {deFlowSteps.map((step, index) => (
                <AccordionItem key={`flow-${index}`} open={index === 0} title={`Step ${index + 1}`} onRemove={() => removePairedItem(["financingStory", "flowSteps"], index)} canRemove={deFlowSteps.length > 1}>
                  <DualField label="Label" deValue={step.label} enValue={content.en.financingStory.flowSteps[index]?.label || ""} onDeChange={(value) => setLocaleValue("de", ["financingStory", "flowSteps", index, "label"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "flowSteps", index, "label"], value)} />
                  <DualField label="Wert" deValue={step.value} enValue={content.en.financingStory.flowSteps[index]?.value || ""} onDeChange={(value) => setLocaleValue("de", ["financingStory", "flowSteps", index, "value"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "flowSteps", index, "value"], value)} />
                </AccordionItem>
              ))}
            </ArrayPanel>

            <ArrayPanel count={deOptions.length} max={caps.options} title="Optionen" onAdd={() => addPairedItem(["financingStory", "options"], () => ({ title: "", description: "" }), () => ({ title: "", description: "" }), caps.options)}>
              {deOptions.map((item, index) => (
                <AccordionItem key={`option-${index}`} open={index === 0} title={`Option ${index + 1}`} onRemove={() => removePairedItem(["financingStory", "options"], index)} canRemove={deOptions.length > 1}>
                  <DualField label="Titel" deValue={item.title} enValue={content.en.financingStory.options[index]?.title || ""} onDeChange={(value) => setLocaleValue("de", ["financingStory", "options", index, "title"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "options", index, "title"], value)} />
                  <DualField label="Beschreibung" textarea deValue={item.description} enValue={content.en.financingStory.options[index]?.description || ""} onDeChange={(value) => setLocaleValue("de", ["financingStory", "options", index, "description"], value)} onEnChange={(value) => setLocaleValue("en", ["financingStory", "options", index, "description"], value)} />
                </AccordionItem>
              ))}
            </ArrayPanel>
          </SectionFrame>
        )}

        {section === "investment" && (
          <SectionFrame title="Veranlagung">
            <Panel title="Allgemein">
              <DualField label="Eyebrow" deValue={content.de.investmentStory.eyebrow} enValue={content.en.investmentStory.eyebrow} onDeChange={(value) => setLocaleValue("de", ["investmentStory", "eyebrow"], value)} onEnChange={(value) => setLocaleValue("en", ["investmentStory", "eyebrow"], value)} />
              <DualField label="Titel" deValue={content.de.investmentStory.title} enValue={content.en.investmentStory.title} onDeChange={(value) => setLocaleValue("de", ["investmentStory", "title"], value)} onEnChange={(value) => setLocaleValue("en", ["investmentStory", "title"], value)} />
              <DualField label="Intro" textarea deValue={content.de.investmentStory.intro} enValue={content.en.investmentStory.intro} onDeChange={(value) => setLocaleValue("de", ["investmentStory", "intro"], value)} onEnChange={(value) => setLocaleValue("en", ["investmentStory", "intro"], value)} />
              <DualField label="Scroll Hinweis" deValue={content.de.investmentStory.scrollHint} enValue={content.en.investmentStory.scrollHint} onDeChange={(value) => setLocaleValue("de", ["investmentStory", "scrollHint"], value)} onEnChange={(value) => setLocaleValue("en", ["investmentStory", "scrollHint"], value)} />
              <DualField label="Closing Titel" deValue={content.de.investmentStory.closingTitle} enValue={content.en.investmentStory.closingTitle} onDeChange={(value) => setLocaleValue("de", ["investmentStory", "closingTitle"], value)} onEnChange={(value) => setLocaleValue("en", ["investmentStory", "closingTitle"], value)} />
            </Panel>

            <ArrayPanel count={deChapters.length} max={caps.chapters} title="Kapitel" onAdd={() => addPairedItem(["investmentStory", "chapters"], () => ({ number: nextNumber(deChapters.length), title: "", body: "", aside: "" }), () => ({ number: nextNumber(deChapters.length), title: "", body: "", aside: "" }), caps.chapters)}>
              {deChapters.map((chapter, index) => (
                <AccordionItem key={`chapter-${index}`} open={index === 0} title={`Kapitel ${index + 1}`} onRemove={() => removePairedItem(["investmentStory", "chapters"], index)} canRemove={deChapters.length > 1}>
                  <DualField label="Titel" deValue={chapter.title} enValue={content.en.investmentStory.chapters[index]?.title || ""} onDeChange={(value) => setLocaleValue("de", ["investmentStory", "chapters", index, "title"], value)} onEnChange={(value) => setLocaleValue("en", ["investmentStory", "chapters", index, "title"], value)} />
                  <DualField label="Body" textarea deValue={chapter.body} enValue={content.en.investmentStory.chapters[index]?.body || ""} onDeChange={(value) => setLocaleValue("de", ["investmentStory", "chapters", index, "body"], value)} onEnChange={(value) => setLocaleValue("en", ["investmentStory", "chapters", index, "body"], value)} />
                  <DualField label="Aside" textarea deValue={chapter.aside} enValue={content.en.investmentStory.chapters[index]?.aside || ""} onDeChange={(value) => setLocaleValue("de", ["investmentStory", "chapters", index, "aside"], value)} onEnChange={(value) => setLocaleValue("en", ["investmentStory", "chapters", index, "aside"], value)} />
                </AccordionItem>
              ))}
            </ArrayPanel>
          </SectionFrame>
        )}

        {section === "pages" && (
          <SectionFrame title="Seiten">
            <Panel title="Kontaktseite">
              <DualField label="Eyebrow" deValue={content.de.pages.getInTouch.eyebrow} enValue={content.en.pages.getInTouch.eyebrow} onDeChange={(value) => setLocaleValue("de", ["pages", "getInTouch", "eyebrow"], value)} onEnChange={(value) => setLocaleValue("en", ["pages", "getInTouch", "eyebrow"], value)} />
              <DualField label="Titel" deValue={content.de.pages.getInTouch.title} enValue={content.en.pages.getInTouch.title} onDeChange={(value) => setLocaleValue("de", ["pages", "getInTouch", "title"], value)} onEnChange={(value) => setLocaleValue("en", ["pages", "getInTouch", "title"], value)} />
              <DualField label="Beschreibung" textarea deValue={content.de.pages.getInTouch.description} enValue={content.en.pages.getInTouch.description} onDeChange={(value) => setLocaleValue("de", ["pages", "getInTouch", "description"], value)} onEnChange={(value) => setLocaleValue("en", ["pages", "getInTouch", "description"], value)} />
            </Panel>

            <Panel title="Immobilienseite">
              <DualField label="Eyebrow" deValue={content.de.pages.realEstate.eyebrow} enValue={content.en.pages.realEstate.eyebrow} onDeChange={(value) => setLocaleValue("de", ["pages", "realEstate", "eyebrow"], value)} onEnChange={(value) => setLocaleValue("en", ["pages", "realEstate", "eyebrow"], value)} />
              <DualField label="Titel" deValue={content.de.pages.realEstate.title} enValue={content.en.pages.realEstate.title} onDeChange={(value) => setLocaleValue("de", ["pages", "realEstate", "title"], value)} onEnChange={(value) => setLocaleValue("en", ["pages", "realEstate", "title"], value)} />
              <DualField label="Beschreibung" textarea deValue={content.de.pages.realEstate.description} enValue={content.en.pages.realEstate.description} onDeChange={(value) => setLocaleValue("de", ["pages", "realEstate", "description"], value)} onEnChange={(value) => setLocaleValue("en", ["pages", "realEstate", "description"], value)} />
            </Panel>
          </SectionFrame>
        )}

        {section === "legal" && (
          <SectionFrame title="Rechtliches">
            <div className={styles.tabRow}>
              {legalSlugs.map((slug) => (
                <button className={styles.tabButton} data-active={legalSlug === slug} key={slug} type="button" onClick={() => setLegalSlug(slug)}>
                  {slug}
                </button>
              ))}
            </div>

            <Panel title="Allgemein">
              <DualField label="Eyebrow" deValue={content.de.legalPages[legalSlug].eyebrow} enValue={content.en.legalPages[legalSlug].eyebrow} onDeChange={(value) => setLocaleValue("de", ["legalPages", legalSlug, "eyebrow"], value)} onEnChange={(value) => setLocaleValue("en", ["legalPages", legalSlug, "eyebrow"], value)} />
              <DualField label="Titel" deValue={content.de.legalPages[legalSlug].title} enValue={content.en.legalPages[legalSlug].title} onDeChange={(value) => setLocaleValue("de", ["legalPages", legalSlug, "title"], value)} onEnChange={(value) => setLocaleValue("en", ["legalPages", legalSlug, "title"], value)} />
              <DualField label="Intro" textarea deValue={content.de.legalPages[legalSlug].intro} enValue={content.en.legalPages[legalSlug].intro} onDeChange={(value) => setLocaleValue("de", ["legalPages", legalSlug, "intro"], value)} onEnChange={(value) => setLocaleValue("en", ["legalPages", legalSlug, "intro"], value)} />
              <DualField label="Hinweis" textarea deValue={content.de.legalPages[legalSlug].notice} enValue={content.en.legalPages[legalSlug].notice} onDeChange={(value) => setLocaleValue("de", ["legalPages", legalSlug, "notice"], value)} onEnChange={(value) => setLocaleValue("en", ["legalPages", legalSlug, "notice"], value)} />
            </Panel>

            <ArrayPanel count={deLegalSections.length} max={caps.legalSections} title="Abschnitte" onAdd={() => addPairedItem(["legalPages", legalSlug, "sections"], () => ({ title: "", paragraphs: [""] }), () => ({ title: "", paragraphs: [""] }), caps.legalSections)}>
              {deLegalSections.map((item, sectionIndex) => (
                <AccordionItem key={`legal-${sectionIndex}`} open={sectionIndex === 0} title={`Abschnitt ${sectionIndex + 1}`} onRemove={() => removePairedItem(["legalPages", legalSlug, "sections"], sectionIndex)} canRemove={deLegalSections.length > 1}>
                  <DualField label="Titel" deValue={item.title} enValue={content.en.legalPages[legalSlug].sections[sectionIndex]?.title || ""} onDeChange={(value) => setLocaleValue("de", ["legalPages", legalSlug, "sections", sectionIndex, "title"], value)} onEnChange={(value) => setLocaleValue("en", ["legalPages", legalSlug, "sections", sectionIndex, "title"], value)} />
                  <SubsectionHeader title="Absätze" onAdd={() => addLegalParagraph(legalSlug, sectionIndex)} addDisabled={item.paragraphs.length >= caps.legalParagraphs} />
                  {item.paragraphs.map((paragraph, paragraphIndex) => (
                    <div className={styles.paragraphItem} key={`paragraph-${sectionIndex}-${paragraphIndex}`}>
                      <div className={styles.inlineActions}>
                        <span>Absatz {paragraphIndex + 1}</span>
                        <button className={styles.removeButton} type="button" onClick={() => removeLegalParagraph(legalSlug, sectionIndex, paragraphIndex)} disabled={item.paragraphs.length <= 1}>Entfernen</button>
                      </div>
                      <DualField label="Text" textarea deValue={paragraph} enValue={content.en.legalPages[legalSlug].sections[sectionIndex]?.paragraphs[paragraphIndex] || ""} onDeChange={(value) => setLocaleValue("de", ["legalPages", legalSlug, "sections", sectionIndex, "paragraphs", paragraphIndex], value)} onEnChange={(value) => setLocaleValue("en", ["legalPages", legalSlug, "sections", sectionIndex, "paragraphs", paragraphIndex], value)} />
                    </div>
                  ))}
                </AccordionItem>
              ))}
            </ArrayPanel>
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

function Panel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className={styles.panel}>
      <h3>{title}</h3>
      <div className={styles.panelBody}>{children}</div>
    </section>
  );
}

function ArrayPanel({ children, count, max, onAdd, title }: { children: ReactNode; count: number; max: number; onAdd: () => void; title: string }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelTop}>
        <h3>{title}</h3>
        <div className={styles.inlineActions}>
          <span>{count} / {max}</span>
          <button className={styles.addButton} disabled={count >= max} type="button" onClick={onAdd}>Hinzufügen</button>
        </div>
      </div>
      <div className={styles.panelBody}>{children}</div>
    </section>
  );
}

function AccordionItem({ canRemove, children, onRemove, open, title }: { canRemove: boolean; children: ReactNode; onRemove: () => void; open?: boolean; title: string }) {
  return (
    <details className={styles.accordion} open={open}>
      <summary className={styles.accordionSummary}>{title}</summary>
      <div className={styles.accordionBody}>
        <div className={styles.inlineActions}>
          <span />
          <button className={styles.removeButton} disabled={!canRemove} type="button" onClick={onRemove}>Entfernen</button>
        </div>
        {children}
      </div>
    </details>
  );
}

function SubsectionHeader({ addDisabled, onAdd, title }: { addDisabled?: boolean; onAdd: () => void; title: string }) {
  return (
    <div className={styles.subsectionHeader}>
      <h4>{title}</h4>
      <button className={styles.addButton} disabled={addDisabled} type="button" onClick={onAdd}>Hinzufügen</button>
    </div>
  );
}

function DualField({
  deValue,
  enValue,
  label,
  onDeChange,
  onEnChange,
  textarea = false,
}: {
  deValue: string;
  enValue: string;
  label: string;
  onDeChange: (value: string) => void;
  onEnChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className={styles.dualField}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.localeGrid}>
        <Field locale="DE" onChange={onDeChange} textarea={textarea} value={deValue} />
        <Field locale="EN" onChange={onEnChange} textarea={textarea} value={enValue} />
      </div>
    </div>
  );
}

function SelectField({ label, onChange, options, value }: { label: string; onChange: (value: FocusIcon) => void; options: { label: string; value: FocusIcon }[]; value: FocusIcon }) {
  return (
    <label className={styles.selectField}>
      <span className={styles.fieldLabel}>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as FocusIcon)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function Field({ locale, onChange, textarea = false, value }: { locale: "DE" | "EN"; onChange: (value: string) => void; textarea?: boolean; value: string }) {
  return (
    <label className={styles.field}>
      <span>{locale}</span>
      {textarea ? <textarea value={value} onChange={(event) => onChange(event.target.value)} /> : <input value={value} onChange={(event) => onChange(event.target.value)} />}
    </label>
  );
}

function normalizeContent(content: CmsContent): CmsContent {
  const fallbackIcons: FocusIcon[] = ["growth", "finance", "property"];
  return {
    de: {
      ...content.de,
      home: {
        ...content.de.home,
        focus: {
          ...content.de.home.focus,
          items: content.de.home.focus.items.map((item, index) => ({
            icon: (item.icon as FocusIcon | undefined) || fallbackIcons[index % fallbackIcons.length],
            title: item.title,
            description: item.description,
          })),
        },
      },
    },
    en: {
      ...content.en,
      home: {
        ...content.en.home,
        focus: {
          ...content.en.home.focus,
          items: content.en.home.focus.items.map((item, index) => ({
            icon: (item.icon as FocusIcon | undefined) || fallbackIcons[index % fallbackIcons.length],
            title: item.title,
            description: item.description,
          })),
        },
      },
    },
  };
}

function getDeepValue(value: unknown, path: (string | number)[]): unknown {
  return path.reduce<unknown>((current, key) => {
    if (current && typeof current === "object") {
      return (current as Record<string, unknown>)[String(key)];
    }
    return undefined;
  }, value);
}

function setDeepValue<T>(value: T, path: (string | number)[], nextValue: unknown): T {
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
      [key]: setDeepValue(current[key], rest, nextValue),
    } as T;
  }
  return value;
}

function nextNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}
