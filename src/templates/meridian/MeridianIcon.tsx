/**
 * MeridianIcon — Server Component
 *
 * Resolves a Lucide icon name (stored as a string in the CMS) to the actual
 * Lucide SVG component and renders it server-side.
 *
 * WHY SERVER COMPONENT:
 *   `import * as Icons` would include all ~1,400 Lucide icons in a client
 *   bundle. As a server component this runs at render time on the server —
 *   the visitor only receives the rendered SVG markup (~200 bytes per icon),
 *   not the icon library JavaScript.
 *
 * USAGE:
 *   <MeridianIcon name="Scale"    size={24} />
 *   <MeridianIcon name="Briefcase" size={20} className="mer-icon" />
 *
 * NAME FORMAT:
 *   PascalCase Lucide icon names — see lucide.dev for the full list.
 *   e.g. "Scale", "Users", "Globe", "Lightbulb", "Briefcase", "MapPin"
 *
 * FALLBACK:
 *   If the name is blank or doesn't match any Lucide icon, renders nothing.
 *   No error is thrown — missing icons degrade gracefully.
 */

import * as Icons from 'lucide-react';

type Props = {
  name?: string | null;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  'aria-hidden'?: boolean | 'true' | 'false';
};

export function MeridianIcon({
  name,
  size = 20,
  strokeWidth = 1.75,
  className,
  style,
  'aria-hidden': ariaHidden = true,
}: Props) {
  if (!name) return null;

  // Lucide exports are named in PascalCase. Look up the icon dynamically.
  // Cast through unknown: lucide-react v1.x uses IconComponentProps internally
  // which requires `iconNode` — our minimal render props are a safe subset.
  type IconComponent = React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
    style?: React.CSSProperties;
    'aria-hidden'?: boolean | 'true' | 'false';
  }>;
  const IconMap = Icons as unknown as Record<string, IconComponent | undefined>;
  const Icon = IconMap[name];

  if (!Icon) {
    // Graceful degradation — unknown icon name, render nothing.
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[MeridianIcon] Unknown Lucide icon: "${name}". Check lucide.dev for valid names.`);
    }
    return null;
  }

  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      style={style}
      aria-hidden={ariaHidden}
    />
  );
}
