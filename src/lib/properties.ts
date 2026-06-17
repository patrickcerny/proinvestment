import { randomUUID } from "crypto";
import { chmod, mkdir, readFile, rm, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import type { Locale } from "@/i18n/config";

export type PropertyButton = {
  label: Record<Locale, string>;
  kind?: "link" | "document";
  href?: string;
  document?: string;
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
const imageUploadsDir = path.join(process.cwd(), "uploads", "real-estate");
const legacyPublicUploadsDir = path.join(process.cwd(), "public", "uploads", "real-estate");
const documentsDir = path.join(legacyPublicUploadsDir, "documents");
const propertiesFile = path.join(dataDir, "properties.json");
const directoryMode = 0o755;
const fileMode = 0o644;

function basenameOf(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return path.basename(trimmed);
}

function imageUrlFromFilename(filename: string) {
  return `/media/real-estate/${filename}`;
}

export function normalizePropertyImageUrl(value: string) {
  const filename = basenameOf(value);
  if (!filename) return value;
  return imageUrlFromFilename(filename);
}

function normalizePropertyEntry(property: PropertyEntry): PropertyEntry {
  return {
    ...property,
    image: property.image ? normalizePropertyImageUrl(property.image) : property.image,
    images: property.images?.map((image) => normalizePropertyImageUrl(image)),
    enabled: property.enabled ?? true,
  };
}

function resolveManagedImagePath(value: string) {
  const filename = basenameOf(value);
  if (!filename) return null;

  const newPath = path.join(imageUploadsDir, filename);
  if (existsSync(newPath)) return newPath;

  const legacyPath = path.join(legacyPublicUploadsDir, filename);
  if (existsSync(legacyPath)) return legacyPath;

  return newPath;
}

export async function getProperties(): Promise<PropertyEntry[]> {
  try {
    const data = await readFile(propertiesFile, "utf8");
    return (JSON.parse(data) as PropertyEntry[]).map((property) => normalizePropertyEntry(property));
  } catch {
    return [];
  }
}

export function getPropertyImages(property: PropertyEntry) {
  return property.images?.length ? property.images : property.image ? [property.image] : [];
}

export function getPropertyButtonTarget(button: PropertyButton) {
  return button.kind === "document" ? button.document || button.href || "" : button.href || button.document || "";
}

export async function saveProperties(properties: PropertyEntry[]) {
  await mkdir(dataDir, { recursive: true, mode: directoryMode });
  await writeFile(propertiesFile, `${JSON.stringify(properties, null, 2)}\n`, "utf8");
  await chmod(propertiesFile, fileMode);
}

export async function savePropertyImage(file: File) {
  await mkdir(imageUploadsDir, { recursive: true, mode: directoryMode });
  const extension = path.extname(file.name).toLowerCase() || ".jpg";
  const filename = `${randomUUID()}${extension}`;
  const destination = path.join(imageUploadsDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(destination, bytes);
  await chmod(destination, fileMode);
  return imageUrlFromFilename(filename);
}

export async function savePropertyImages(files: File[]) {
  const validFiles = files.filter((file) => file.size > 0);
  return Promise.all(validFiles.map((file) => savePropertyImage(file)));
}

export async function savePropertyDocument(file: File) {
  await mkdir(documentsDir, { recursive: true, mode: directoryMode });
  const extension = path.extname(file.name).toLowerCase() || ".pdf";
  const filename = `${randomUUID()}${extension}`;
  const destination = path.join(documentsDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(destination, bytes);
  await chmod(destination, fileMode);
  return `/uploads/real-estate/documents/${filename}`;
}

export async function savePropertyDocuments(files: File[]) {
  const validFiles = files.filter((file) => file.size > 0);
  return Promise.all(validFiles.map((file) => savePropertyDocument(file)));
}

export function createPropertyId() {
  return randomUUID();
}

export async function deleteManagedPropertyImages(values: string[]) {
  const filenames = new Set(values.map((value) => basenameOf(value)).filter(Boolean));

  await Promise.all([...filenames].map(async (filename) => {
    const managedPath = resolveManagedImagePath(filename);
    if (!managedPath) return;
    await rm(managedPath, { force: true });
  }));
}
