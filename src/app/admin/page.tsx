import Image from "next/image";
import { createPropertyAction, deletePropertyAction, isAdminAuthenticated, loginAction, logoutAction } from "./actions";
import { getProperties } from "@/lib/properties";
import styles from "./Admin.module.scss";

type AdminPageProps = {
  searchParams: Promise<{ error?: string; created?: string; deleted?: string }>;
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
        {params.deleted && <div className={styles.success}>Immobilie wurde entfernt.</div>}

        <form action={createPropertyAction} className={styles.form}>
          <div className={styles.grid}>
            <section className={styles.panel}>
              <h2>Deutsch</h2>
              <label className={styles.field}><span>Titel</span><input name="titleDe" required /></label>
              <label className={styles.field}><span>Kategorie / Eyebrow</span><input name="eyebrowDe" placeholder="Wohnbau, Gewerbe, Projekt" /></label>
              <label className={styles.field}><span>Ort</span><input name="locationDe" /></label>
              <label className={styles.field}><span>Beschreibung</span><textarea name="descriptionDe" required /></label>
            </section>
            <section className={styles.panel}>
              <h2>English</h2>
              <label className={styles.field}><span>Title</span><input name="titleEn" required /></label>
              <label className={styles.field}><span>Category / eyebrow</span><input name="eyebrowEn" placeholder="Residential, Commercial, Project" /></label>
              <label className={styles.field}><span>Location</span><input name="locationEn" /></label>
              <label className={styles.field}><span>Description</span><textarea name="descriptionEn" required /></label>
            </section>
          </div>

          <section className={styles.panel}>
            <h2>Bild und Sichtbarkeit</h2>
            <label className={styles.field}><span>Bild</span><input accept="image/*" name="image" type="file" /></label>
            <label className={styles.checkbox}><input name="showOnHome" type="checkbox" /> Auf der Startseite anzeigen, maximal 3 insgesamt</label>
          </section>

          <section className={styles.panel}>
            <h2>Buttons</h2>
            {[0, 1, 2].map((index) => (
              <div className={styles.grid} key={index}>
                <label className={styles.field}><span>Button DE {index + 1}</span><input name={`buttonLabelDe${index}`} placeholder="Mehr erfahren" /></label>
                <label className={styles.field}><span>Button EN {index + 1}</span><input name={`buttonLabelEn${index}`} placeholder="Learn more" /></label>
                <label className={styles.field}><span>Link {index + 1}</span><input name={`buttonHref${index}`} placeholder="https://..." /></label>
              </div>
            ))}
          </section>

          <button className={styles.button} type="submit">Immobilie hinzufügen</button>
        </form>

        <section className={styles.list}>
          {properties.map((property) => (
            <article className={styles.property} key={property.id}>
              {property.image ? <Image src={property.image} alt="" width={320} height={240} unoptimized /> : <div />}
              <div>
                <h3>{property.content.de.title}</h3>
                <p>{property.content.de.location} {property.showOnHome ? "· Startseite aktiv" : ""}</p>
              </div>
              <form action={deletePropertyAction}>
                <input name="id" type="hidden" value={property.id} />
                <button className={styles.delete} type="submit">Entfernen</button>
              </form>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
