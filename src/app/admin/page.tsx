import { AdminClient } from "./AdminClient";
import { isAdminAuthenticated, loginAction, logoutAction } from "./actions";
import { getProperties } from "@/lib/properties";
import styles from "./Admin.module.scss";

type AdminPageProps = {
  searchParams: Promise<{ error?: string; created?: string; deleted?: string; updated?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const authenticated = await isAdminAuthenticated();
  const params = await searchParams;

  if (!authenticated) {
    return (
      <main className={styles.page}>
        <form action={loginAction} className={styles.login}>
          <h1>Admin</h1>
          <p>Immobilien verwalten. Passwort über <code>ADMIN_PASSWORD</code> setzen. Lokaler Fallback: <code>proinvestment</code>.</p>
          {params.error && <div className={styles.error}>Falsches Passwort.</div>}
          <label className={styles.field}><span>Passwort</span><input name="password" type="password" required /></label>
          <button className={styles.button} type="submit">Einloggen</button>
        </form>
      </main>
    );
  }

  const properties = await getProperties();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.top}>
          <div><p>Real Estate CMS</p><h1>Immobilien verwalten.</h1></div>
          <form action={logoutAction}><button className={styles.logout} type="submit">Logout</button></form>
        </div>

        {params.created && <div className={styles.success}>Immobilie wurde angelegt.</div>}
        {params.updated && <div className={styles.success}>Immobilie wurde gespeichert.</div>}
        {params.deleted && <div className={styles.success}>Immobilie wurde entfernt.</div>}

        <AdminClient properties={properties} />
      </div>
    </main>
  );
}
