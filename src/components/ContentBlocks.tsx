/**
 * ContentBlocks Component
 *
 * Renders Articles' block-based content structure.
 * Articles use a `blocks` field (not a single richText field) with these
 * block types: richText, imageGallery, quote, video, cta.
 *
 * Server Component.
 */

import Image from 'next/image';
import { RichTextRenderer } from './RichTextRenderer';
import type { MediaItem } from '@/lib/api';

// ── Block Types ─────────────────────────────────────────────────────────────

type RichTextBlock = {
  blockType: 'richText';
  content: unknown; // Lexical JSON
};

type ImageGalleryBlock = {
  blockType: 'imageGallery';
  images?: Array<{ image: MediaItem | number }>;
};

type QuoteBlock = {
  blockType: 'quote';
  quoteText: string;
  attribution?: string;
};

type VideoBlock = {
  blockType: 'video';
  url: string;
  caption?: string;
};

type CTABlock = {
  blockType: 'cta';
  heading?: string;
  body?: string;
  label: string;
  href: string;
  style?: 'primary' | 'secondary';
};

type ContentBlock =
  | RichTextBlock
  | ImageGalleryBlock
  | QuoteBlock
  | VideoBlock
  | CTABlock;

type ContentBlocksProps = {
  /** The blocks array from the article content field */
  blocks: unknown[];
  className?: string;
};

// ── Component ───────────────────────────────────────────────────────────────

export function ContentBlocks({ blocks, className }: ContentBlocksProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className={className}>
      {(blocks as ContentBlock[]).map((block, index) => (
        <RenderBlock key={index} block={block} />
      ))}
    </div>
  );
}

// ── Block Renderer ──────────────────────────────────────────────────────────

function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.blockType) {
    case 'richText':
      return <RichTextRenderer content={block.content} />;

    case 'imageGallery':
      return <ImageGallery images={block.images} />;

    case 'quote':
      return <Quote text={block.quoteText} attribution={block.attribution} />;

    case 'video':
      return <VideoEmbed url={block.url} caption={block.caption} />;

    case 'cta':
      return (
        <CallToAction
          heading={block.heading}
          body={block.body}
          label={block.label}
          href={block.href}
          style={block.style}
        />
      );

    default: {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[ContentBlocks] Unknown block type: "${(block as Record<string, unknown>).blockType}"`,
        );
      }
      return null;
    }
  }
}

// ── Image Gallery ───────────────────────────────────────────────────────────

function ImageGallery({
  images,
}: {
  images?: Array<{ image: MediaItem | number }>;
}) {
  if (!images?.length) return null;

  const resolvedImages = images
    .map((item) => (typeof item.image === 'number' ? null : item.image))
    .filter(Boolean) as MediaItem[];

  if (resolvedImages.length === 0) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          resolvedImages.length === 1
            ? '1fr'
            : 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '12px',
        margin: '24px 0',
      }}
    >
      {resolvedImages.map((img, index) => (
        <div
          key={img.id ?? index}
          style={{
            position: 'relative',
            aspectRatio: '16 / 9',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <Image
            src={img.url}
            alt={img.alt ?? ''}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Quote ───────────────────────────────────────────────────────────────────

function Quote({
  text,
  attribution,
}: {
  text: string;
  attribution?: string;
}) {
  return (
    <figure style={{ margin: '32px 0', padding: '0 24px' }}>
      <blockquote
        style={{
          margin: 0,
          padding: '16px 24px',
          borderLeft: '4px solid #e2e2e2',
          fontSize: '1.1rem',
          fontStyle: 'italic',
          lineHeight: 1.6,
          color: '#555',
        }}
      >
        {text}
      </blockquote>
      {attribution && (
        <figcaption
          style={{
            marginTop: '8px',
            paddingLeft: '24px',
            fontSize: '0.85rem',
            color: '#999',
          }}
        >
          — {attribution}
        </figcaption>
      )}
    </figure>
  );
}

// ── Video Embed ─────────────────────────────────────────────────────────────

function VideoEmbed({ url, caption }: { url: string; caption?: string }) {
  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[ContentBlocks] Unsupported video URL: "${url}"`);
    }
    return null;
  }

  return (
    <figure style={{ margin: '24px 0' }}>
      <div
        style={{
          position: 'relative',
          paddingBottom: '56.25%', // 16:9
          height: 0,
          overflow: 'hidden',
          borderRadius: '8px',
        }}
      >
        <iframe
          src={embedUrl}
          title={caption ?? 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>
      {caption && (
        <figcaption
          style={{
            marginTop: '8px',
            fontSize: '0.85rem',
            color: '#999',
            textAlign: 'center',
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Extract embed URL from YouTube or Vimeo links */
function getEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}

// ── Call to Action ──────────────────────────────────────────────────────────

function CallToAction({
  heading,
  body,
  label,
  href,
  style = 'primary',
}: {
  heading?: string;
  body?: string;
  label: string;
  href: string;
  style?: 'primary' | 'secondary';
}) {
  return (
    <div
      style={{
        margin: '32px 0',
        padding: '32px',
        borderRadius: '12px',
        backgroundColor: style === 'primary' ? '#1a1a2e' : '#f8f8f8',
        color: style === 'primary' ? '#fff' : '#333',
        textAlign: 'center',
      }}
    >
      {heading && (
        <h3
          style={{
            margin: '0 0 8px',
            fontSize: '1.25rem',
            fontWeight: 600,
          }}
        >
          {heading}
        </h3>
      )}
      {body && (
        <p
          style={{
            margin: '0 0 16px',
            fontSize: '0.95rem',
            opacity: 0.85,
            lineHeight: 1.5,
          }}
        >
          {body}
        </p>
      )}
      <a
        href={href}
        style={{
          display: 'inline-block',
          padding: '10px 24px',
          borderRadius: '6px',
          fontSize: '0.9rem',
          fontWeight: 600,
          textDecoration: 'none',
          backgroundColor: style === 'primary' ? '#fff' : '#1a1a2e',
          color: style === 'primary' ? '#1a1a2e' : '#fff',
          transition: 'opacity 0.2s',
        }}
      >
        {label}
      </a>
    </div>
  );
}
