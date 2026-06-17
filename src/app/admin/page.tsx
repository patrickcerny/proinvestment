import Link from "next/link";
import { AdminClient } from "./AdminClient";
import { isAdminAuthenticated, loginAction, logoutAction } from "./actions";
import { SiteContentEditor } from "./SiteContentEditor";
import { getCmsDictionary } from "@/lib/cms-dictionary";
import { getProperties } from "@/lib/properties";
import styles from "./Admin.module.scss";

type AdminPageProps = {
  searchParams: Promise<{ error?: string; created?: string; deleted?: string; updated?: string; section?: string; saved?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const authenticated = await isAdminAuthenticated();
  const params = await searchParams;
  const section = params.section === "site" ? "site" : "properties";
  const pageTitle = section === "site" ? "Seite verwalten." : "Immobilien verwalten.";

  if (!authenticated) {
    return (
      <main className={styles.page}>
        <form action={loginAction} className={styles.login}>
          <h1>Admin</h1>
          {params.error && <div className={styles.error}>Falsches Passwort.</div>}
          <label className={styles.field}><span>Passwort</span><input name="password" type="password" required /></label>
          <button className={styles.button} type="submit">Einloggen</button>
        </form>
      </main>
    );
  }

  const properties = await getProperties();
  const initialContent = {
    de: getCmsDictionary("de"),
    en: getCmsDictionary("en"),
  } as const;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.top}>
          <div>
            <p>Real Estate CMS</p>
            <h1>{pageTitle}</h1>
            <nav className={styles.adminTabs} aria-label="CMS navigation">
              <Link data-active={section === "properties"} href="/admin?section=properties">Immobilien</Link>
              <Link data-active={section === "site"} href="/admin?section=site">Website</Link>
            </nav>
          </div>
          <form action={logoutAction}><button className={styles.logout} type="submit">Logout</button></form>
        </div>

        {params.created && <div className={styles.success}>Immobilie wurde angelegt.</div>}
        {params.updated && <div className={styles.success}>Immobilie wurde gespeichert.</div>}
        {params.deleted && <div className={styles.success}>Immobilie wurde entfernt.</div>}
        {params.saved && <div className={styles.success}>CMS-Inhalt wurde gespeichert.</div>}

        {section === "properties" ? <AdminClient properties={properties} /> : <SiteContentEditor initialContent={initialContent} />}
      </div>
    </main>
  );
}
