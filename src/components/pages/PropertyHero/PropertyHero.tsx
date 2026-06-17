import styles from "./PropertyHero.module.scss";

type PropertyHeroProps = {
  description: string;
  eyebrow: string;
  hint: string;
  title: string;
};

export function PropertyHero({ description, eyebrow, hint, title }: PropertyHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.background} aria-hidden="true">
        <span className={styles.ringOne} />
        <span className={styles.ringTwo} />
        <span className={styles.grid} />
      </div>

      <div className={styles.copy}>
        <div className={styles.headline}>
          <p>{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        <div className={styles.summary}>
          <span>{description}</span>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span />
        <small>{hint}</small>
      </div>
    </section>
  );
}
