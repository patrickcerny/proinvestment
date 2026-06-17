import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/config";
import type { PropertyEntry } from "@/lib/properties";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { PropertyCard } from "./PropertyCard";
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
        {properties.map((property, index) => (
          <Reveal className={styles.card} delay={index * 100} key={property.id}>
            <PropertyCard locale={locale} mode={mode} property={property} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
