/**
 * Root layout — minimal shell.
 *
 * Each route group ((marketing) and (tenant)) defines its own <html> and
 * <body> tags with independent metadata, fonts, and styling. This root
 * layout simply passes children through so Next.js has a valid layout
 * hierarchy for unmatched routes and error pages.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
