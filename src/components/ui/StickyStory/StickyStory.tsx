"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink/ArrowLink";
import styles from "./StickyStory.module.scss";

type Chapter = {
  number: string;
  title: string;
  body: string;
  aside: string;
};

type StickyStoryProps = {
  chapters: Chapter[];
  closingAction: string;
  closingHref: string;
  closingTitle: string;
  eyebrow: string;
  intro: string;
  scrollHint: string;
  title: string;
};

export function StickyStory({ chapters, closingAction, closingHref, closingTitle, eyebrow, intro, scrollHint, title }: StickyStoryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const buildingImages = [
    "/images/investment/skyscraper-classic.png",
    "/images/investment/skyscraper-stepped.png",
    "/images/investment/skyscraper-vertical.png",
    "/images/investment/building-cutout.png",
  ];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      root.querySelectorAll<HTMLElement>("[data-story-chapter]").forEach((chapter) => {
        const rect = chapter.getBoundingClientRect();
        const distance = Math.max(rect.height - window.innerHeight, 1);
        const progress = Math.min(1, Math.max(0, -rect.top / distance));
        chapter.style.setProperty("--progress", progress.toFixed(3));
      });
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <div className={styles.story} ref={rootRef}>
      <section className={styles.hero}>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <div className={styles.heroBottom}><span>{intro}</span><small>{scrollHint} ↓</small></div>
      </section>

      {chapters.map((chapter, index) => (
        <section className={styles.chapter} data-story-chapter key={chapter.number} style={{ zIndex: index + 1 }}>
          <div className={styles.panel} data-tone={index % 2 === 0 ? "dark" : "light"}>
            <div className={styles.buildingLayer} data-variant={(index % 4) + 1} aria-hidden="true">
              <Image src={buildingImages[index % buildingImages.length]} alt="" width={1920} height={2160} sizes="(max-width: 900px) 100vw, 70vw" unoptimized />
            </div>
            <span className={styles.number}>{chapter.number}</span>
            <h2>{chapter.title}</h2>
            <div className={styles.copy}>
              <p>{chapter.body}</p>
              <aside>{chapter.aside}</aside>
            </div>
          </div>
        </section>
      ))}

      <section className={styles.closing}>
        <h2>{closingTitle}</h2>
        <ArrowLink href={closingHref}>{closingAction}</ArrowLink>
      </section>
    </div>
  );
}
