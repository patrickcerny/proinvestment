"use client";

import Image from "next/image";
import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPropertyAction, deletePropertyAction, reorderPropertiesAction, togglePropertyEnabledAction, updatePropertyAction } from "./actions";
import type { PropertyEntry } from "@/lib/properties";
import styles from "./Admin.module.scss";

type AdminClientProps = {
  properties: PropertyEntry[];
};

function imagesOf(property: PropertyEntry) {
  return property.images?.length ? property.images : property.image ? [property.image] : [];
}

function Icon({ name }: { name: "up" | "down" | "trash" }) {
  if (name === "up") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <path d="M12 5l-7 7h4v7h6v-7h4l-7-7z" fill="currentColor" />
      </svg>
    );
  }

  if (name === "down") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <path d="M12 19l7-7h-4V5H9v7H5l7 7z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9z" fill="currentColor" />
    </svg>
  );
}

export function AdminClient({ properties }: AdminClientProps) {
  const [items, setItems] = useState(properties);
  const [selectedId, setSelectedId] = useState(properties[0]?.id || "new");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const selected = useMemo(() => items.find((item) => item.id === selectedId), [items, selectedId]);

  function moveItem(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    const next = [...items];
    const from = next.findIndex((item) => item.id === draggedId);
    const to = next.findIndex((item) => item.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    startTransition(() => reorderPropertiesAction(next.map((item) => item.id)));
  }

  function toggleEnabled(id: string) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, enabled: !item.enabled } : item));
    startTransition(() => {
      const formData = new FormData();
      formData.set("id", id);
      togglePropertyEnabledAction(formData);
    });
  }

  return (
    <div className={styles.adminGrid}>
      <aside className={styles.sidebar}>
        <button className={styles.newButton} data-active={selectedId === "new"} type="button" onClick={() => setSelectedId("new")}>+ Neue Immobilie</button>
        <div className={styles.sidebarList}>
          {items.map((property) => {
            const image = imagesOf(property)[0];
            return (
              <div
                className={styles.sidebarRow}
                data-active={selectedId === property.id}
                draggable
                key={property.id}
                onClick={() => setSelectedId(property.id)}
                onDragEnd={() => setDraggedId(null)}
                onDragOver={(event) => event.preventDefault()}
                onDragStart={() => setDraggedId(property.id)}
                onDrop={() => moveItem(property.id)}
              >
                <span className={styles.dragHandle}>::</span>
                {image ? <Image src={image} alt="" width={56} height={42} unoptimized /> : <i />}
                <div><b>{property.content.de.title || "Ohne Titel"}</b><small>{property.enabled ? "Aktiv" : "Deaktiviert"} {property.showOnHome ? " · Home" : ""}</small></div>
                <button className={styles.switch} data-on={property.enabled !== false} type="button" onClick={(event) => { event.stopPropagation(); toggleEnabled(property.id); }}><span /></button>
              </div>
            );
          })}
        </div>
      </aside>

      <section className={styles.editor}>
        {selected ? <EditForm key={selected.id} property={selected} /> : <CreateForm />}
      </section>
    </div>
  );
}

function CreateForm() {
  return (
    <form action={createPropertyAction} className={styles.form}>
      <FormFields />
      <button className={styles.button} type="submit">Immobilie hinzufügen</button>
    </form>
  );
}

function EditForm({ property }: { property: PropertyEntry }) {
  const [state, formAction, pending] = useActionState(updatePropertyAction, null);

  return (
    <form action={formAction} className={styles.form}>
      <input name="id" type="hidden" value={property.id} />
      <FormFields property={property} />
      <ImageManager images={imagesOf(property)} />
      {state?.ok && <p className={styles.success}>Gespeichert ✓</p>}
      <div className={styles.editorActions}>
        <button className={styles.button} type="submit" disabled={pending}>
          {pending ? "Speichern…" : "Speichern"}
        </button>
        <button className={styles.delete} formAction={deletePropertyAction} type="submit" name="id" value={property.id}>Entfernen</button>
      </div>
    </form>
  );
}

function FormFields({ property }: { property?: PropertyEntry }) {
  return (
    <>
      <div className={styles.grid}>
        <section className={styles.panel}>
          <h2>Deutsch</h2>
          <label className={styles.field}><span>Titel</span><input name="titleDe" required defaultValue={property?.content.de.title} /></label>
          <label className={styles.field}><span>Kategorie / Eyebrow</span><input name="eyebrowDe" defaultValue={property?.content.de.eyebrow} /></label>
          <label className={styles.field}><span>Ort</span><input name="locationDe" defaultValue={property?.content.de.location} /></label>
          <label className={styles.field}><span>Beschreibung</span><textarea name="descriptionDe" required defaultValue={property?.content.de.description} /></label>
          <label className={styles.field}><span>Objektbeschreibung</span><textarea name="objectDescriptionDe" defaultValue={property?.content.de.objectDescription} /></label>
          <DynamicTextList label="Besondere Features DE" name="featuresDe" initial={property?.content.de.features || []} />
        </section>
        <section className={styles.panel}>
          <h2>English</h2>
          <label className={styles.field}><span>Title</span><input name="titleEn" required defaultValue={property?.content.en.title} /></label>
          <label className={styles.field}><span>Category / eyebrow</span><input name="eyebrowEn" defaultValue={property?.content.en.eyebrow} /></label>
          <label className={styles.field}><span>Location</span><input name="locationEn" defaultValue={property?.content.en.location} /></label>
          <label className={styles.field}><span>Description</span><textarea name="descriptionEn" required defaultValue={property?.content.en.description} /></label>
          <label className={styles.field}><span>Object description</span><textarea name="objectDescriptionEn" defaultValue={property?.content.en.objectDescription} /></label>
          <DynamicTextList label="Special features EN" name="featuresEn" initial={property?.content.en.features || []} />
        </section>
      </div>

      <section className={styles.panel}>
        <h2>Stammdaten</h2>
        <div className={styles.grid}>
          <label className={styles.field}><span>Preis</span><input name="price" defaultValue={property?.price} placeholder="€ 890.000" /></label>
          <label className={styles.field}><span>Wohnfläche</span><input name="livingArea" defaultValue={property?.livingArea} placeholder="128 m²" /></label>
          <label className={styles.field}><span>Zimmer</span><input name="rooms" defaultValue={property?.rooms} placeholder="4" /></label>
          <label className={styles.field}><span>PLZ</span><input name="zip" defaultValue={property?.zip} /></label>
          <label className={styles.field}><span>Ort</span><input name="city" defaultValue={property?.city} /></label>
          <label className={styles.field}><span>Land</span><input name="country" defaultValue={property?.country} /></label>
        </div>
      </section>

      <section className={styles.panel}>
        <h2>Sichtbarkeit</h2>
        <label className={styles.checkbox}><input name="enabled" type="checkbox" defaultChecked={property?.enabled ?? true} /> Immobilie anzeigen</label>
        <label className={styles.checkbox}><input name="showOnHome" type="checkbox" defaultChecked={property?.showOnHome} /> Auf der Startseite anzeigen, maximal 3 insgesamt</label>
      </section>

      <section className={styles.panel}>
        <h2>Buttons</h2>
        <DynamicButtons initial={property?.buttons || []} />
      </section>
    </>
  );
}

function DynamicTextList({ initial, label, name }: { initial: string[]; label: string; name: string }) {
  const [items, setItems] = useState(initial.length ? initial : [""]);
  return (
    <div className={styles.dynamicList}>
      <span>{label}</span>
      {items.map((item, index) => (
        <div className={styles.dynamicRow} key={index}>
          <input name={name} defaultValue={item} />
          <button type="button" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => setItems((current) => [...current, ""])}>+ Add</button>
    </div>
  );
}

type ButtonItem = {
  kind: "link" | "document";
  labelDe: string;
  labelEn: string;
  href: string;
  document: string;
  documentName: string;
};

function DynamicButtons({ initial }: { initial: PropertyEntry["buttons"] }) {
  const [items, setItems] = useState<ButtonItem[]>(
    initial.map((button) => ({
      kind: button.kind === "document" || button.document ? "document" : "link",
      labelDe: button.label.de,
      labelEn: button.label.en,
      href: button.href || "",
      document: button.document || "",
      documentName: button.documentName || "",
    }))
  );

  function updateItem(index: number, patch: Partial<ButtonItem>) {
    setItems((current) => current.map((item, i) => i === index ? { ...item, ...patch } : item));
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.dynamicList}>
      {items.map((button, index) => (
        <div className={styles.buttonEditorRow} key={index}>
          <label className={styles.field}>
            <span>Typ</span>
            <select
              name="buttonKind"
              value={button.kind}
              onChange={(e) => updateItem(index, { kind: e.target.value as "link" | "document" })}
            >
              <option value="link">Link</option>
              <option value="document">Dokument</option>
            </select>
          </label>

          <label className={styles.field}><span>Label DE</span><input name="buttonLabelDe" defaultValue={button.labelDe} /></label>
          <label className={styles.field}><span>Label EN</span><input name="buttonLabelEn" defaultValue={button.labelEn} /></label>

          {button.kind === "link" ? (
            <>
              <label className={styles.field}><span>Link URL</span><input name="buttonHref" defaultValue={button.href} /></label>
              {/* Hidden doc fields to keep FormData index alignment */}
              <input name="buttonDocumentName" type="hidden" value="" />
              <input name="existingButtonDocument" type="hidden" value="" />
              <input name="buttonDocument" type="file" style={{ display: "none" }} tabIndex={-1} />
            </>
          ) : (
            <>
              {/* Hidden href to keep FormData index alignment */}
              <input name="buttonHref" type="hidden" value="" />
              <DocumentUpload
                existingDoc={button.document}
                existingDocumentName={button.documentName}
              />
            </>
          )}

          <button type="button" className={styles.removeButton} onClick={() => removeItem(index)} style={{ alignSelf: "end" }}>✕</button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems((current) => [...current, { kind: "link", labelDe: "", labelEn: "", href: "", document: "", documentName: "" }])}
      >
        + Button hinzufügen
      </button>
    </div>
  );
}

function DocumentUpload({ existingDoc, existingDocumentName }: { existingDoc: string; existingDocumentName: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFileName, setPendingFileName] = useState<string>("");
  const hasFile = !!existingDoc || !!pendingFileName;

  return (
    <div className={styles.documentUpload}>
      <input
        ref={inputRef}
        name="buttonDocument"
        type="file"
        accept=".pdf,.doc,.docx,application/pdf"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          setPendingFileName(file ? file.name : "");
        }}
      />
      <input name="existingButtonDocument" type="hidden" value={existingDoc} />

      <label className={styles.field}>
        <span>Dateiname (für Download)</span>
        <input
          name="buttonDocumentName"
          defaultValue={existingDocumentName}
          placeholder="z.B. Exposé_Villa_Vista.pdf"
        />
      </label>

      <label className={styles.field}>
        <span>Dokument</span>
        <button type="button" className={styles.documentPickButton} onClick={() => inputRef.current?.click()}>
          {hasFile ? "↑ Datei ersetzen" : "+ PDF hochladen"}
        </button>
      </label>

      {(pendingFileName || existingDoc) && (
        <div className={styles.documentName}>
          <span>📄</span>
          <span>{pendingFileName || existingDoc.split("/").pop()}</span>
        </div>
      )}
    </div>
  );
}

function ImageManager({ images }: { images: string[] }) {
  const [items, setItems] = useState(images);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => pendingPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [pendingPreviews]);

  function move(index: number, direction: -1 | 1) {
    setItems((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function onDrop(targetIndex: number) {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    setItems((current) => {
      const next = [...current];
      const [moved] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDraggedIndex(null);
  }

  function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files || [])];
    if (!files.length) return;
    pendingPreviews.forEach((url) => URL.revokeObjectURL(url));
    setPendingPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  return (
    <section className={styles.panel}>
      <h2>Aktuelle Bilder</h2>
      <div className={styles.imageManager}>
        {items.map((image, index) => (
          <div
            className={styles.imageManagerItem}
            draggable
            key={image}
            onDragEnd={() => setDraggedIndex(null)}
            onDragOver={(event) => event.preventDefault()}
            onDragStart={() => setDraggedIndex(index)}
            onDrop={() => onDrop(index)}
          >
            <input name="existingImages" type="hidden" value={image} />
            <div className={styles.imagePreview}>
              <Image src={image} alt="" width={160} height={110} unoptimized />
            </div>
            <div className={styles.imageActions}>
              <button aria-label="Move image up" type="button" onClick={() => move(index, -1)} disabled={index === 0}><Icon name="up" /></button>
              <button aria-label="Move image down" type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1}><Icon name="down" /></button>
              <button aria-label="Remove image" type="button" onClick={() => remove(index)}><Icon name="trash" /></button>
            </div>
          </div>
        ))}

        {pendingPreviews.map((src, i) => (
          <div className={`${styles.imageManagerItem} ${styles.imagePending}`} key={`pending-${i}`}>
            <div className={styles.imagePreview}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
            </div>
            <div className={styles.imagePendingLabel}>Neu</div>
          </div>
        ))}

        <label className={styles.imageUploadTile}>
          <input
            ref={fileInputRef}
            accept="image/*"
            multiple
            name="images"
            type="file"
            onChange={onFilesSelected}
          />
          <span>+ Bilder hinzufügen</span>
        </label>
      </div>
    </section>
  );
}
