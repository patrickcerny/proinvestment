"use client";

import { ArrowLink } from "@/components/ui/ArrowLink/ArrowLink";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import styles from "./FinancingBlueprint.module.scss";

type FinancingBlueprintProps = {
  blueprint: Record<"project" | "bank" | "capital" | "security" | "liquidity" | "return", string>;
  closingAction: string;
  closingHref: string;
  closingTitle: string;
  eyebrow: string;
  flowDescription: string;
  flowEyebrow: string;
  flowSteps: { label: string; value: string }[];
  flowTitle: string;
  intro: string;
  options: { title: string; description: string }[];
  optionsEyebrow: string;
  optionsTitle: string;
  principles: { number: string; title: string; description: string }[];
  principlesEyebrow: string;
  principlesTitle: string;
  scrollHint: string;
  title: string;
};

const nodePositions = [
  ["bank", "topLeft"],
  ["capital", "topRight"],
  ["security", "bottomLeft"],
  ["liquidity", "bottomRight"],
  ["return", "farRight"],
] as const;

export function FinancingBlueprint(props: FinancingBlueprintProps) {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p>{props.eyebrow}</p>
          <h1>{props.title}</h1>
          <span>{props.intro}</span>
          <small>{props.scrollHint} ↓</small>
        </div>

        <div className={styles.network} aria-hidden="true">
          <svg viewBox="0 0 1000 760" preserveAspectRatio="none">
            <defs>
              <marker id="capital-arrow" markerHeight="7" markerWidth="7" orient="auto" refX="6" refY="3.5">
                <path className={styles.arrowHead} d="M0,0 L7,3.5 L0,7 Z" />
              </marker>
            </defs>
            <path d="M190 160 C330 160 330 350 500 350" markerEnd="url(#capital-arrow)" />
            <path d="M790 150 C650 150 680 350 500 350" markerEnd="url(#capital-arrow)" />
            <path d="M170 590 C330 590 340 350 500 350" markerEnd="url(#capital-arrow)" />
            <path d="M770 580 C650 580 660 350 500 350" markerEnd="url(#capital-arrow)" />
            <path className={styles.returnPathDesktop} d="M930 350 C750 350 720 350 500 350" markerEnd="url(#capital-arrow)" />
            <path className={styles.returnPathMobile} d="M500 65 C500 150 500 235 500 350" markerEnd="url(#capital-arrow)" />
          </svg>
          <div className={`${styles.node} ${styles.projectNode}`}>{props.blueprint.project}</div>
          {nodePositions.map(([key, position]) => <div className={`${styles.node} ${styles[position]}`} key={key}>{props.blueprint[key]}</div>)}
          <div className={styles.pulse} />
        </div>
      </section>

      <section className={styles.principles}>
        <Reveal className={styles.sectionHeading}>
          <p>{props.principlesEyebrow}</p>
          <h2>{props.principlesTitle}</h2>
        </Reveal>
        <div className={styles.principleGrid}>
          {props.principles.map((item, index) => (
            <Reveal className={styles.principle} delay={index * 120} key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={styles.flow}>
        <div className={styles.flowSticky}>
          <Reveal className={styles.flowCopy}>
            <p>{props.flowEyebrow}</p>
            <h2>{props.flowTitle}</h2>
            <span>{props.flowDescription}</span>
          </Reveal>
          <div className={styles.flowVisual} aria-hidden="true">
            <div className={styles.capitalLine}><i /></div>
            <div className={styles.building}>
              {[5, 4, 3, 2, 1].map((level) => <i key={level} style={{ "--level": level } as React.CSSProperties} />)}
            </div>
          </div>
          <div className={styles.flowSteps}>
            {props.flowSteps.map((step, index) => (
              <Reveal className={styles.flowStep} delay={index * 100} key={step.label}>
                <b>{String(index + 1).padStart(2, "0")}</b><span>{step.label}</span><small>{step.value}</small>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.options}>
        <Reveal className={styles.sectionHeading}>
          <p>{props.optionsEyebrow}</p>
          <h2>{props.optionsTitle}</h2>
        </Reveal>
        <div className={styles.optionGrid}>
          {props.options.map((option, index) => (
            <Reveal className={styles.option} delay={index * 80} key={option.title}>
              <span>0{index + 1}</span><h3>{option.title}</h3><p>{option.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={styles.closing}>
        <Reveal><h2>{props.closingTitle}</h2><ArrowLink href={props.closingHref}>{props.closingAction}</ArrowLink></Reveal>
      </section>
    </div>
  );
}
