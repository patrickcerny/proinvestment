import type { Locale } from "@/i18n/config";
import type { PropertyEntry } from "@/lib/properties";
import { getPropertyButtonTarget, getPropertyImages } from "@/lib/properties";
import { PropertyCarousel } from "@/components/ui/PropertyShowcase/PropertyCarousel";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import styles from "./PropertyDetail.module.scss";

export function PropertyDetail({ locale, property }: { locale: Locale; property: PropertyEntry }) {
  const content = property.content[locale];
  const images = getPropertyImages(property);
  const features = content.features || [];
  const address = [property.zip, property.city, property.country].filter(Boolean).join(" ");
  const inquirySubject = encodeURIComponent(`${locale === "de" ? "Anfrage zur Immobilie" : "Inquiry about property"}: ${content.title}`);
  const inquiryBody = encodeURIComponent([
    `${locale === "de" ? "Ich interessiere mich für folgende Immobilie:" : "I am interested in the following property:"}`,
    "",
    content.title,
    address || content.location,
  ].join("\n"));
  const inquiryHref = `mailto:office@proinvestment.at?subject=${inquirySubject}&body=${inquiryBody}`;
  const facts = [
    { label: locale === "de" ? "Preis" : "Price", value: property.price },
    { label: locale === "de" ? "Wohnfläche" : "Living area", value: property.livingArea },
    { label: locale === "de" ? "Zimmer" : "Rooms", value: property.rooms },
    { label: locale === "de" ? "Adresse" : "Address", value: address || content.location },
  ].filter((fact) => fact.value);

  return (
    <article className={styles.page}>
      <section className={styles.hero}>
        <Reveal className={styles.copy}>
          <p>{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <span>{content.description}</span>
        </Reveal>
        <Reveal className={styles.gallery}>
          <PropertyCarousel images={images} sizes="(max-width: 900px) 100vw, 58vw" />
        </Reveal>
      </section>

      <section className={styles.details}>
        <Reveal className={styles.facts}>
          {facts.map((fact) => <div key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong></div>)}
        </Reveal>

        <Reveal className={styles.description}>
          <p>{locale === "de" ? "Objektbeschreibung" : "Object Description"}</p>
          <h2>{locale === "de" ? "Details zur Immobilie." : "Property details."}</h2>
          <div>{content.objectDescription || content.description}</div>
        </Reveal>

        {!!features.length && (
          <Reveal className={styles.features}>
            <p>{locale === "de" ? "Besondere Features" : "Special Features"}</p>
            <ul>{features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          </Reveal>
        )}

        <Reveal className={styles.actions}>
          <a className={styles.contactButton} href={inquiryHref}>{locale === "de" ? "Anfrage senden" : "Send enquiry"}</a>
          {property.buttons.map((button) => {
            const target = getPropertyButtonTarget(button);
            if (!target) return null;
            return (
              <a download={button.kind === "document" ? button.label[locale] || button.label.de || button.label.en : undefined} href={target} key={`${target}-${button.label[locale]}`}>
                {button.label[locale] || button.label.de || button.label.en}
              </a>
            );
          })}
        </Reveal>
      </section>
    </article>
  );
}
