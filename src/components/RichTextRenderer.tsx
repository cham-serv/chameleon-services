/**
 * RichTextRenderer Component
 *
 * Converts Payload CMS Lexical JSON into React elements.
 * Server Component. Used for product longDescription, legal docs, etc.
 *
 * Lexical JSON structure:
 *   { root: { children: [{ type, children, format, ... }] } }
 *
 * Supported node types:
 *   - paragraph, heading (h1-h6), list (bullet/number), listitem
 *   - link (internal + external), linebreak
 *   - text (with format bitmask: bold=1, italic=2, strikethrough=4,
 *           underline=8, code=16, subscript=32, superscript=64)
 *   - quote (blockquote)
 */

import React from 'react';

// - Types -

type LexicalNode = {
  type: string;
  children?: LexicalNode[];
  text?: string;
  format?: number | string;
  tag?: string;
  listType?: string;
  direction?: string;
  indent?: number;
  version?: number;
  // Link fields
  url?: string;
  rel?: string;
  target?: string;
  // Root wrapper
  root?: LexicalNode;
};

type RichTextRendererProps = {
  /** The Lexical JSON content from Payload CMS */
  content: unknown;
  className?: string;
};

// - Format Bitmask Constants -

const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_STRIKETHROUGH = 4;
const IS_UNDERLINE = 8;
const IS_CODE = 16;
const IS_SUBSCRIPT = 32;
const IS_SUPERSCRIPT = 64;

// - Component -

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content) return null;

  const root = (content as LexicalNode)?.root ?? content;
  const children = (root as LexicalNode)?.children;

  if (!children || !Array.isArray(children)) return null;

  return (
    <div className={className}>
      {children.map((node, index) => (
        <RenderNode key={index} node={node} />
      ))}
    </div>
  );
}

// - Node Renderer -

function RenderNode({ node }: { node: LexicalNode }): React.ReactElement | null {
  switch (node.type) {
    case 'paragraph':
      return (
        <p>
          <RenderChildren nodes={node.children} />
        </p>
      );

    case 'heading': {
      const level = (node.tag ?? 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      const HeadingTag = level;
      return (
        <HeadingTag>
          <RenderChildren nodes={node.children} />
        </HeadingTag>
      );
    }

    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul';
      return (
        <Tag>
          <RenderChildren nodes={node.children} />
        </Tag>
      );
    }

    case 'listitem':
      return (
        <li>
          <RenderChildren nodes={node.children} />
        </li>
      );

    case 'quote':
      return (
        <blockquote>
          <RenderChildren nodes={node.children} />
        </blockquote>
      );

    case 'link':
      return (
        <a
          href={node.url ?? '#'}
          target={node.target ?? undefined}
          rel={
            node.target === '_blank'
              ? 'noopener noreferrer'
              : node.rel ?? undefined
          }
        >
          <RenderChildren nodes={node.children} />
        </a>
      );

    case 'linebreak':
      return <br />;

    case 'text':
      return <RenderText node={node} />;

    default: {
      // Graceful degradation - render children if present, warn in dev
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[RichTextRenderer] Unknown node type: "${node.type}"`);
      }
      if (node.children) {
        return <RenderChildren nodes={node.children} />;
      }
      return null;
    }
  }
}

// - Text Renderer (with format bitmask) -

function RenderText({ node }: { node: LexicalNode }): React.ReactElement | null {
  if (node.text == null) return null;

  const format = typeof node.format === 'number' ? node.format : 0;
  let element: React.ReactElement = <>{node.text}</>;

  if (format & IS_BOLD) {
    element = <strong>{element}</strong>;
  }
  if (format & IS_ITALIC) {
    element = <em>{element}</em>;
  }
  if (format & IS_STRIKETHROUGH) {
    element = <s>{element}</s>;
  }
  if (format & IS_UNDERLINE) {
    element = <u>{element}</u>;
  }
  if (format & IS_CODE) {
    element = <code>{element}</code>;
  }
  if (format & IS_SUBSCRIPT) {
    element = <sub>{element}</sub>;
  }
  if (format & IS_SUPERSCRIPT) {
    element = <sup>{element}</sup>;
  }

  return element;
}

// - Children Renderer -

function RenderChildren({
  nodes,
}: {
  nodes?: LexicalNode[];
}): React.ReactElement | null {
  if (!nodes || nodes.length === 0) return null;

  return (
    <>
      {nodes.map((child, index) => (
        <RenderNode key={index} node={child} />
      ))}
    </>
  );
}
