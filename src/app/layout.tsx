import React from 'react';
import './globals.css';

/**
 * Root layout  thin pass-through.
 *
 * No <html> or <body> tags here. Each route group provides its own:
 *   - (marketing)/layout.tsx  Chameleon company site shell
 *   - (tenant)/[tenant]/layout.tsx  Multi-tenant site shell with brand tokens
 *
 * globals.css is imported here so both route groups inherit the
 * platform-level reset and utility classes.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
