/**
 * resolveImages — Pure utility (no client/server boundary)
 *
 * Extracted from AtlasImageGallery so it can be called from both
 * server components (ProductPage) and client components (AtlasImageGallery).
 */

import type { MediaItem } from '@/lib/api';

export type GalleryImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export function resolveImages(
  raw?: Array<{ image: MediaItem }>,
  productName?: string,
): GalleryImage[] {
  if (!raw?.length) return [];
  return raw
    .filter((entry) => entry.image?.url)
    .map((entry) => ({
      url: entry.image.url,
      alt: entry.image.alt ?? productName ?? 'Product image',
      width: entry.image.width,
      height: entry.image.height,
    }));
}
