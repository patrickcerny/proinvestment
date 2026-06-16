"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createHash } from "crypto";
import { createPropertyId, getProperties, saveProperties, savePropertyImage, type PropertyButton, type PropertyEntry } from "@/lib/properties";

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
  return [0, 1, 2].map((index) => ({
    label: {
      de: value(formData, `buttonLabelDe${index}`),
      en: value(formData, `buttonLabelEn${index}`),
    },
    href: value(formData, `buttonHref${index}`),
  })).filter((button) => button.href && (button.label.de || button.label.en));
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

  const imageFile = formData.get("image");
  const image = imageFile instanceof File && imageFile.size > 0 ? await savePropertyImage(imageFile) : "";
  const property: PropertyEntry = {
    id: createPropertyId(),
    image,
    showOnHome: formData.get("showOnHome") === "on",
    createdAt: new Date().toISOString(),
    content: {
      de: {
        title: value(formData, "titleDe"),
        eyebrow: value(formData, "eyebrowDe"),
        location: value(formData, "locationDe"),
        description: value(formData, "descriptionDe"),
      },
      en: {
        title: value(formData, "titleEn"),
        eyebrow: value(formData, "eyebrowEn"),
        location: value(formData, "locationEn"),
        description: value(formData, "descriptionEn"),
      },
    },
    buttons: collectButtons(formData),
  };

  const properties = await getProperties();
  await saveProperties([property, ...properties]);
  revalidatePath("/de");
  revalidatePath("/en");
  revalidatePath("/de/real-estate");
  revalidatePath("/en/real-estate");
  redirect("/admin?created=1");
}

export async function deletePropertyAction(formData: FormData) {
  if (!await isAdminAuthenticated()) redirect("/admin");
  const id = value(formData, "id");
  const properties = await getProperties();
  await saveProperties(properties.filter((property) => property.id !== id));
  revalidatePath("/de");
  revalidatePath("/en");
  revalidatePath("/de/real-estate");
  revalidatePath("/en/real-estate");
  redirect("/admin?deleted=1");
}
