"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/config";
import styles from "./Header.module.scss";

export function Header({ dictionary, locale }: { dictionary: Dictionary; locale: Locale }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const otherLocale = locale === "de" ? "en" : "de";
  const alternatePath = pathname.replace(/^\/(de|en)/, `/${otherLocale}`);
  const navigation = [
    { href: "/investment", label: dictionary.navigation.investment },
    { href: "/financing", label: dictionary.navigation.financing },
    { href: "/real-estate", label: dictionary.navigation.realEstate },
  ];
  const mobileNavigation = [
    { href: "", label: dictionary.navigation.home },
    ...navigation,
    { href: "/get-in-touch", label: dictionary.navigation.getInTouch },
  ];

  function closeMenu() {
    setIsMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href={localizedPath(locale)} aria-label="ProInvestment home" onClick={closeMenu}>
          <Image className={styles.logo} src="/images/proinvestment-logo.png" alt="" width={64} height={64} priority />
          <span>PROINVESTMENT</span>
        </Link>
        <nav aria-label="Primary navigation" className={styles.navigation}>
          {navigation.map((item) => <Link href={localizedPath(locale, item.href)} key={item.href}>{item.label}</Link>)}
        </nav>
        <div className={styles.actions}>
          <Link className={styles.language} href={alternatePath}>{dictionary.navigation.language}</Link>
          <Link className={styles.cta} href={localizedPath(locale, "/get-in-touch")}>{dictionary.navigation.getInTouch}</Link>
        </div>
        <button className={styles.menuButton} type="button" aria-expanded={isMenuOpen} aria-label={isMenuOpen ? dictionary.navigation.closeMenu : dictionary.navigation.openMenu} onClick={() => setIsMenuOpen((open) => !open)}>
          <span className={styles.menuIcon} data-open={isMenuOpen}><span /><span /><span /></span>
        </button>
      </div>

      <div className={styles.mobileMenu} data-open={isMenuOpen}>
        <div className={styles.mobileWatermark} aria-hidden="true">
          <Image src="/images/proinvestment-logo.png" alt="" width={480} height={480} />
        </div>
        <div className={styles.mobileMenuTop}>
          <Link className={styles.mobileLanguage} href={alternatePath} onClick={closeMenu}>{dictionary.navigation.language}</Link>
          <button className={styles.mobileCloseButton} type="button" aria-label={dictionary.navigation.closeMenu} onClick={closeMenu}>
            <span className={styles.closeIcon} aria-hidden="true"><span /><span /></span>
          </button>
        </div>
        <nav className={styles.mobileMenuNav} aria-label="Mobile primary navigation">
          <ul className={styles.mobileNavList}>
            {mobileNavigation.map((item) => {
              const href = localizedPath(locale, item.href);
              return <li className={styles.mobileNavItem} key={item.href || "home"}><Link className={styles.mobileNavLink} data-active={pathname === href} href={href} onClick={closeMenu}>{item.label}</Link></li>;
            })}
          </ul>
        </nav>
        <div className={styles.mobileMenuFooter}><span>{dictionary.footer.privacy}</span><span>{dictionary.footer.legal}</span></div>
      </div>
      <button className={styles.backdrop} type="button" aria-hidden={!isMenuOpen} data-open={isMenuOpen} tabIndex={isMenuOpen ? 0 : -1} onClick={closeMenu} />
    </header>
  );
}
