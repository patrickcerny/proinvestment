"use client";

import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./PropertyShowcase.module.scss";

type PropertyCarouselProps = {
  images: string[];
  sizes: string;
};

export function PropertyCarousel({ images, sizes }: PropertyCarouselProps) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const current = images[active];

  return (
    <>
      <div className={styles.media}>
        {current ? (
          <button className={styles.imageButton} type="button" onClick={() => setFullscreen(true)} aria-label="Open image fullscreen">
            <Image src={current} alt="" fill sizes={sizes} unoptimized />
          </button>
        ) : <div className={styles.placeholder} />}
        {images.length > 1 && (
          <div className={styles.carouselDots} aria-label="Image carousel controls">
            {images.map((image, index) => (
              <button aria-label={`Show image ${index + 1}`} data-active={index === active} key={`${image}-${index}`} type="button" onClick={() => setActive(index)} />
            ))}
          </div>
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
