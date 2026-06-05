import deData from "./de.json";
import en from "./en.json";

export const locales = ["de", "en"] as const;
export type Locale = (typeof locales)[number];
export type Dictionary = typeof en;

const de: Dictionary = deData;
const dictionaries: Record<Locale, Dictionary> = { de, en };

function assertMatchingShape(reference: unknown, candidate: unknown, path = "root"): void {
  if (Array.isArray(reference)) {
    if (!Array.isArray(candidate) || reference.length !== candidate.length) {
      throw new Error(`Locale shape mismatch at ${path}`);
    }
    reference.forEach((item, index) => assertMatchingShape(item, candidate[index], `${path}[${index}]`));
    return;
  }

  if (reference && typeof reference === "object") {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      throw new Error(`Locale shape mismatch at ${path}`);
    }
    const referenceKeys = Object.keys(reference).sort();
    const candidateKeys = Object.keys(candidate).sort();
    if (referenceKeys.join("|") !== candidateKeys.join("|")) {
      throw new Error(`Locale keys mismatch at ${path}`);
    }
    referenceKeys.forEach((key) => assertMatchingShape(
      (reference as Record<string, unknown>)[key],
      (candidate as Record<string, unknown>)[key],
      `${path}.${key}`,
    ));
    return;
  }

  if (typeof reference !== typeof candidate) {
    throw new Error(`Locale value type mismatch at ${path}`);
  }
}

assertMatchingShape(en, de);

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function localizedPath(locale: Locale, path = "") {
  return `/${locale}${path}`;
}
