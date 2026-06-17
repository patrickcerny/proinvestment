"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./PropertyShowcase.module.scss";

type PropertyCarouselProps = {
  images: string[];
  sizes: string;
};

export function PropertyCarousel({ images, sizes }: PropertyCarouselProps) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  const current = images[active];

  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);
  const next = () => setActive((a) => (a + 1) % images.length);

  const onPointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
    setDragging(false);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    if (Math.abs(e.clientX - pointerStartX.current) > 6) setDragging(true);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const delta = e.clientX - pointerStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) next(); else prev();
    }
    pointerStartX.current = null;
  };

  return (
    <>
      <div
        className={styles.media}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => { pointerStartX.current = null; }}
        style={{ touchAction: "pan-y" }}
      >
        {images.length > 0 ? (
          <button
            className={styles.imageButton}
            type="button"
            onClick={() => { if (!dragging) setFullscreen(true); }}
            aria-label="Open image fullscreen"
            style={{ pointerEvents: dragging ? "none" : undefined }}
          >
            <div
              className={styles.imageStrip}
              style={{ transform: `translateX(${-active * 100}%)` }}
            >
              {images.map((src, i) => (
                <div key={src} className={styles.imageSlide}>
                  <Image src={src} alt="" fill sizes={sizes} unoptimized priority={i === 0} />
                </div>
              ))}
            </div>
          </button>
        ) : (
          <div className={styles.placeholder} />
        )}

        {images.length > 1 && (
          <>
            <button
              className={`${styles.carouselArrow} ${styles.carouselArrowPrev}`}
              type="button"
              aria-label="Previous image"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              className={`${styles.carouselArrow} ${styles.carouselArrowNext}`}
              type="button"
              aria-label="Next image"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <div className={styles.carouselDots} aria-label="Image carousel controls">
              {images.map((image, index) => (
                <button
                  aria-label={`Show image ${index + 1}`}
                  data-active={index === active}
                  key={`${image}-${index}`}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActive(index); }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {fullscreen && current && createPortal(
        <div className={styles.lightbox} role="dialog" aria-modal="true" onClick={() => setFullscreen(false)}>
          <button type="button" onClick={(event) => { event.stopPropagation(); setFullscreen(false); }}>Close</button>
          <div onClick={(event) => event.stopPropagation()}>
            <Image src={current} alt="" width={1800} height={1200} unoptimized />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
