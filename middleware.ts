import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    // Match all paths except: /api routes, /_next internals, static files, favicon
    '/((?!api/|_next/|_static/|favicon.ico).*)',
  ],
};

const ROOT_DOMAINS = ['chameleon.services', 'www.chameleon.services'];
const VERCEL_SUFFIXES = ['.vercel.app', '.vercel.pub'];

function isVercelPreviewDomain(hostname: string) {
  return VERCEL_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
}

export function middleware(req: NextRequest) {
  let hostname = req.headers.get('host') ?? '';

  // Strip port for non-localhost hosts
  if (hostname.includes(':') && !hostname.startsWith('localhost:')) {
    hostname = hostname.split(':')[0];
  }

  // ── Dev mode (localhost) ────────────────────────────────────────────────────
  if (hostname.startsWith('localhost')) {
    const devMode = process.env.DEV_MODE ?? 'tenant';

    if (devMode === 'marketing') {
      return addSecurityHeaders(NextResponse.next());
    }

    // Spoof the hostname so the tenant layout resolves correctly locally
    hostname = process.env.DEV_TENANT_DOMAIN ?? 'atlas-demo.chameleon.services';
  }

  // ── Root domain → marketing site ───────────────────────────────────────────
  if (ROOT_DOMAINS.includes(hostname)) {
    return addSecurityHeaders(NextResponse.next());
  }

  // ── Vercel preview URLs (no DEV_TENANT_DOMAIN set) → marketing site ────────
  if (isVercelPreviewDomain(hostname)) {
    return addSecurityHeaders(NextResponse.next());
  }

  // ── Tenant domain → rewrite to internal path ────────────────────────────────
  // We prefix the URL path with the tenant hostname so Next.js can route to
  // src/app/(tenant)/[domain]/[[...slug]]/page.tsx without conflicting with
  // the marketing pages at the root.
  //
  // Example:
  //   atlas-demo.chameleon.services/shop
  //   → internally served from /atlas-demo.chameleon.services/shop
  //   → URL in browser still shows: /shop
  const url = req.nextUrl.clone();
  const originalPath = url.pathname; // e.g. '/shop' or '/'
  url.pathname = `/${hostname}${originalPath === '/' ? '' : originalPath}`;

  // Pass the resolved hostname as a REQUEST header so Server Components
  // read it via headers(). Using request.headers (not response.headers)
  // ensures the middleware's resolved value overrides any spoofed
  // x-tenant-domain header sent by the client.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-tenant-domain', hostname);

  const res = addSecurityHeaders(
    NextResponse.rewrite(url, { request: { headers: requestHeaders } }),
  );
  return res;
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}
