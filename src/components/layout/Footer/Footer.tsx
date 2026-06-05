import Link from "next/link";
import type { Dictionary, Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/config";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import styles from "./Footer.module.scss";

export function Footer({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  return (
    <footer className={styles.footer}>
      <Reveal className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.brand}><span aria-hidden="true">|||</span> PROINVESTMENT</p>
          <p className={styles.note}>{dictionary.footer.description}</p>
        </div>
        <div className={styles.links}>
          <h4>{dictionary.footer.company}</h4>
          <Link href={localizedPath(locale, "/investment")}>{dictionary.navigation.investment}</Link>
          <Link href={localizedPath(locale, "/financing")}>{dictionary.navigation.financing}</Link>
          <Link href={localizedPath(locale, "/real-estate")}>{dictionary.navigation.realEstate}</Link>
        </div>
        <div className={styles.links}>
          <h4>{dictionary.footer.contact}</h4>
          <span>ProInvestment VermögenstreuhandgesmbH</span>
          <span>Ruckburg – Allgäustraße 5<br />6912 Hörbranz<br />Austria</span>
          <a href="tel:+435573847770">+43 (0)5573/84777-0</a>
          <span>Fax: +43 (0)5573/84777-77</span>
          <a href="mailto:office@proinvestment.at">office@proinvestment.at</a>
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} PROINVESTMENT. {dictionary.footer.rights}</p>
        <div className={styles.legal}>
          <Link href={localizedPath(locale, "/legal/privacy")}>{dictionary.footer.privacy}</Link>
          <Link href={localizedPath(locale, "/legal/terms")}>{dictionary.footer.terms}</Link>
          <Link href={localizedPath(locale, "/legal/legal-foundations")}>{dictionary.footer.foundations}</Link>
          <Link href={localizedPath(locale, "/legal/imprint")}>{dictionary.footer.legal}</Link>
        </div>
      </Reveal>
    </footer>
  );
}
