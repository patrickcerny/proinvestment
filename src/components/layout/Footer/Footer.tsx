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
          <Link href={localizedPath(locale, "/get-in-touch")}>{dictionary.navigation.getInTouch}</Link>
        </div>
        <div className={styles.links}>
          <h4>{dictionary.footer.contact}</h4>
          <span>Vienna, Austria</span><span>office@proinvestment.at</span><span>+43 1 234 5678</span>
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} PROINVESTMENT. {dictionary.footer.rights}</p>
        <div className={styles.legal}><span>{dictionary.footer.privacy}</span><span>{dictionary.footer.terms}</span><span>{dictionary.footer.legal}</span></div>
      </Reveal>
    </footer>
  );
}
