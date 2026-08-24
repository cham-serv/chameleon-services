'use client';

/**
 * AtlasImageGallery  Client Component
 *
 * Product image gallery with main image display and thumbnail strip.
 * Click a thumbnail to swap the main image. Only this component is
 * a client boundary  the rest of ProductPage remains a server component.
 */

import { useState } from 'react';
import Image from 'next/image';
import type { GalleryImage } from './resolveImages';

type AtlasImageGalleryProps = {
  images: GalleryImage[];
  productName: string;
};

export function AtlasImageGallery({ images, productName }: AtlasImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="atlas-pdp-image-empty" aria-label="No product images available">
        <span aria-hidden="true" style={{ fontSize: '3rem' }}></span>
        <p>No images available</p>
      </div>
    );
  }

  const active = images[activeIndex] ?? images[0];

  return (
    <div className="atlas-pdp-gallery">
      {/* Main image */}
      <div className="atlas-pdp-main-image">
        <Image
          src={active.url}
          alt={active.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      {/* Thumbnail strip  only show if more than one image */}
      {images.length > 1 && (
        <div className="atlas-pdp-thumbnail-strip" role="list" aria-label={`${productName} images`}>
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              role="listitem"
              onClick={() => setActiveIndex(i)}
              className={`atlas-pdp-thumbnail${i === activeIndex ? ' atlas-pdp-thumbnail-active' : ''}`}
              aria-label={`View image ${i + 1} of ${images.length}`}
              aria-current={i === activeIndex ? 'true' : undefined}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="80px"
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
