"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createHash } from "crypto";
import { createPropertyId, getProperties, saveProperties, savePropertyImages, type PropertyButton, type PropertyEntry } from "@/lib/properties";

const cookieName = "proinvestment_admin";

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "proinvestment";
}

function authToken() {
  return createHash("sha256").update(adminPassword()).digest("hex");
}

export async function isAdminAuthenticated() {
  return (await cookies()).get(cookieName)?.value === authToken();
}

function value(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function collectButtons(formData: FormData): PropertyButton[] {
  const labelsDe = formData.getAll("buttonLabelDe").map(String);
  const labelsEn = formData.getAll("buttonLabelEn").map(String);
  const hrefs = formData.getAll("buttonHref").map(String);
  return hrefs.map((href, index) => ({
    label: { de: labelsDe[index]?.trim() || "", en: labelsEn[index]?.trim() || "" },
    href: href.trim(),
  })).filter((button) => button.href && (button.label.de || button.label.en));
}

function collectFeatures(formData: FormData, locale: "de" | "en") {
  return formData.getAll(`features${locale === "de" ? "De" : "En"}`).map((item) => String(item).trim()).filter(Boolean);
}

function propertyFields(formData: FormData) {
  return {
    price: value(formData, "price"),
    livingArea: value(formData, "livingArea"),
    rooms: value(formData, "rooms"),
    zip: value(formData, "zip"),
    city: value(formData, "city"),
    country: value(formData, "country"),
  };
}

function contentFields(formData: FormData) {
  return {
    de: {
      title: value(formData, "titleDe"),
      eyebrow: value(formData, "eyebrowDe"),
      location: value(formData, "locationDe"),
      description: value(formData, "descriptionDe"),
      objectDescription: value(formData, "objectDescriptionDe"),
      features: collectFeatures(formData, "de"),
    },
    en: {
      title: value(formData, "titleEn"),
      eyebrow: value(formData, "eyebrowEn"),
      location: value(formData, "locationEn"),
      description: value(formData, "descriptionEn"),
      objectDescription: value(formData, "objectDescriptionEn"),
      features: collectFeatures(formData, "en"),
    },
  };
}

function revalidatePropertyPages() {
  revalidatePath("/de");
  revalidatePath("/en");
  revalidatePath("/de/real-estate");
  revalidatePath("/en/real-estate");
  revalidatePath("/de/real-estate/[id]", "page");
  revalidatePath("/en/real-estate/[id]", "page");
}

export async function loginAction(formData: FormData) {
  if (value(formData, "password") !== adminPassword()) {
    redirect("/admin?error=1");
  }

  (await cookies()).set(cookieName, authToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function logoutAction() {
  (await cookies()).delete(cookieName);
  redirect("/admin");
}

export async function createPropertyAction(formData: FormData) {
  if (!await isAdminAuthenticated()) redirect("/admin");

  const imageFiles = formData.getAll("images").filter((file): file is File => file instanceof File);
  const images = await savePropertyImages(imageFiles);
  const property: PropertyEntry = {
    id: createPropertyId(),
    images,
    enabled: true,
    showOnHome: formData.get("showOnHome") === "on",
    createdAt: new Date().toISOString(),
    ...propertyFields(formData),
    content: contentFields(formData),
    buttons: collectButtons(formData),
  };

  const properties = await getProperties();
  await saveProperties([property, ...properties]);
  revalidatePropertyPages();
  redirect("/admin?created=1");
}

export async function deletePropertyAction(formData: FormData) {
  if (!await isAdminAuthenticated()) redirect("/admin");
  const id = value(formData, "id");
  const properties = await getProperties();
  await saveProperties(properties.filter((property) => property.id !== id));
  revalidatePropertyPages();
  redirect("/admin?deleted=1");
}

export async function updatePropertyAction(formData: FormData) {
  if (!await isAdminAuthenticated()) redirect("/admin");
  const id = value(formData, "id");
  const properties = await getProperties();
  const imageFiles = formData.getAll("images").filter((file): file is File => file instanceof File);
  const addedImages = await savePropertyImages(imageFiles);
  const existingImages = formData.getAll("existingImages").map(String).filter(Boolean);

  await saveProperties(properties.map((property) => {
    if (property.id !== id) return property;
    return {
      ...property,
      images: [...existingImages, ...addedImages],
      enabled: formData.get("enabled") === "on",
      showOnHome: formData.get("showOnHome") === "on",
      ...propertyFields(formData),
      content: contentFields(formData),
      buttons: collectButtons(formData),
    };
  }));
  revalidatePropertyPages();
  redirect(`/admin?updated=${id}`);
}

export async function togglePropertyEnabledAction(formData: FormData) {
  if (!await isAdminAuthenticated()) redirect("/admin");
  const id = value(formData, "id");
  const properties = await getProperties();
  await saveProperties(properties.map((property) => property.id === id ? { ...property, enabled: !property.enabled } : property));
  revalidatePropertyPages();
}

export async function reorderPropertiesAction(ids: string[]) {
  if (!await isAdminAuthenticated()) return;
  const properties = await getProperties();
  const byId = new Map(properties.map((property) => [property.id, property]));
  const ordered = ids.map((id) => byId.get(id)).filter((property): property is PropertyEntry => Boolean(property));
  const remaining = properties.filter((property) => !ids.includes(property.id));
  await saveProperties([...ordered, ...remaining]);
  revalidatePropertyPages();
}
