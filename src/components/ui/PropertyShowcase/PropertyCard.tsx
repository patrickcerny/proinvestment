"use client";

import { useEffect, useRef } from "react";
import { localizedPath, type Locale } from "@/i18n/config";
import type { PropertyEntry } from "@/lib/properties";
import { PropertyCarousel } from "./PropertyCarousel";
import styles from "./PropertyShowcase.module.scss";

type PropertyCardProps = {
  locale: Locale;
  mode: "full" | "featured";
  property: PropertyEntry;
};

export function PropertyCard({ locale, mode, property }: PropertyCardProps) {
  const ref = useRef<HTMLElement>(null);
  const content = property.content[locale];
  const images = property.images?.length ? property.images : property.image ? [property.image] : [];
  const facts = [
    property.price,
    property.livingArea,
    property.rooms ? `${property.rooms} ${locale === "de" ? "Zimmer" : "rooms"}` : "",
    [property.zip, property.city, property.country].filter(Boolean).join(" "),
  ].filter(Boolean);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = card.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, 1 - (rect.top / window.innerHeight)));
      card.style.setProperty("--scroll-progress", progress.toFixed(3));
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
    <article ref={ref} className={styles.cardArticle}>
      <PropertyCarousel images={images} sizes={mode === "featured" ? "(max-width: 900px) 100vw, 33vw" : "(max-width: 900px) 100vw, 55vw"} />
      <div className={styles.body}>
        <small>{content.eyebrow}</small>
        <h3>{content.title}</h3>
        {!!facts.length && <div className={styles.factRow}>{facts.map((fact) => <span key={fact}>{fact}</span>)}</div>}
        <p>{content.description}</p>
        {content.location && <b>{content.location}</b>}
        <div className={styles.buttons}>
          <a href={localizedPath(locale, `/real-estate/${property.id}`)}>{locale === "de" ? "Details ansehen" : "View details"}</a>
        </div>
      </div>
    </article>
  );
}
