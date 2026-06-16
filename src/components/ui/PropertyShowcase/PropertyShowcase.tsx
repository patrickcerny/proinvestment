import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/config";
import type { PropertyEntry } from "@/lib/properties";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import styles from "./PropertyShowcase.module.scss";

type PropertyShowcaseProps = {
  locale: Locale;
  properties: PropertyEntry[];
  mode?: "full" | "featured";
};

export function PropertyShowcase({ locale, mode = "full", properties }: PropertyShowcaseProps) {
  if (!properties.length) {
    if (mode === "featured") return null;
    return (
      <section className={styles.empty}>
        <p>{locale === "de" ? "Immobilien werden in Kürze ergänzt." : "Properties will be added soon."}</p>
      </section>
    );
  }

  return (
    <section className={`${styles.showcase} ${styles[mode]}`}>
      {mode === "featured" && (
        <Reveal className={styles.heading}>
          <p>{locale === "de" ? "Ausgewählte Immobilien" : "Featured Real Estate"}</p>
          <h2>{locale === "de" ? "Aktuelle Möglichkeiten." : "Current opportunities."}</h2>
          <Link href={localizedPath(locale, "/real-estate")}>{locale === "de" ? "Alle Immobilien ansehen" : "View all properties"}</Link>
        </Reveal>
      )}
      <div className={styles.grid}>
        {properties.map((property, index) => {
          const content = property.content[locale];
          return (
            <Reveal className={styles.card} delay={index * 100} key={property.id}>
              <article>
                <div className={styles.media}>
                  {property.image ? <Image src={property.image} alt="" fill sizes={mode === "featured" ? "(max-width: 900px) 100vw, 33vw" : "(max-width: 900px) 100vw, 55vw"} unoptimized /> : <div className={styles.placeholder} />}
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className={styles.body}>
                  <small>{content.eyebrow}</small>
                  <h3>{content.title}</h3>
                  <p>{content.description}</p>
                  {content.location && <b>{content.location}</b>}
                  {!!property.buttons.length && (
                    <div className={styles.buttons}>
                      {property.buttons.map((button) => <a href={button.href} key={`${property.id}-${button.href}-${button.label[locale]}`}>{button.label[locale] || button.label.de || button.label.en}</a>)}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
