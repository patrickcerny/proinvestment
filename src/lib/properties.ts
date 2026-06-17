import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Locale } from "@/i18n/config";

export type PropertyButton = {
  label: Record<Locale, string>;
  href: string;
};

export type PropertyEntry = {
  id: string;
  image?: string;
  images?: string[];
  enabled?: boolean;
  showOnHome: boolean;
  createdAt: string;
  price?: string;
  livingArea?: string;
  rooms?: string;
  zip?: string;
  city?: string;
  country?: string;
  content: Record<Locale, {
    title: string;
    eyebrow: string;
    location: string;
    description: string;
    objectDescription?: string;
    features?: string[];
  }>;
  buttons: PropertyButton[];
};

const dataDir = path.join(process.cwd(), "data");
const uploadsDir = path.join(process.cwd(), "public", "uploads", "real-estate");
const propertiesFile = path.join(dataDir, "properties.json");

export async function getProperties(): Promise<PropertyEntry[]> {
  try {
    const data = await readFile(propertiesFile, "utf8");
    return (JSON.parse(data) as PropertyEntry[]).map((property) => ({
      ...property,
      enabled: property.enabled ?? true,
    }));
  } catch {
    return [];
  }
}

export function getPropertyImages(property: PropertyEntry) {
  return property.images?.length ? property.images : property.image ? [property.image] : [];
}

export async function saveProperties(properties: PropertyEntry[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(propertiesFile, `${JSON.stringify(properties, null, 2)}\n`, "utf8");
}

export async function savePropertyImage(file: File) {
  await mkdir(uploadsDir, { recursive: true });
  const extension = path.extname(file.name).toLowerCase() || ".jpg";
  const filename = `${randomUUID()}${extension}`;
  const destination = path.join(uploadsDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(destination, bytes);
  return `/uploads/real-estate/${filename}`;
}

export async function savePropertyImages(files: File[]) {
  const validFiles = files.filter((file) => file.size > 0);
  return Promise.all(validFiles.map((file) => savePropertyImage(file)));
}

export function createPropertyId() {
  return randomUUID();
}
