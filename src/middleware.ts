/**
 * Middleware — Multi-tenant domain routing.
 *
 * Routes requests based on the hostname:
 * - Root domains (chameleon.services, localhost) → pass through to (marketing)
 * - Tenant subdomains (atlas-demo.chameleon.services) → rewrite to (tenant)/[tenant]
 * - Custom domains (freshroast.co.za) → rewrite using full domain (Phase 3+)
 *
 * DEV_MODE controls local routing:
 * - DEV_MODE=marketing → localhost renders the company site
 * - DEV_MODE=tenant → localhost renders as DEV_TENANT_DOMAIN
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Domains that should NOT be treated as tenant subdomains. */
const ROOT_DOMAINS = ['chameleon.services', 'localhost'];

/** The platform subdomain suffix (everything after the tenant slug). */
const PLATFORM_SUFFIX = '.chameleon.services';

export function middleware(request: NextRequest) {
  let hostname = request.headers.get('host') ?? 'localhost:3000';

  // Strip port number
  hostname = hostname.replace(/:\d+$/, '');

  // Strip www prefix (so www.freshroast.co.za → freshroast.co.za)
  hostname = hostname.replace(/^www\./, '');

  // ── Dev mode override ──────────────────────────────────────────────────
  // When developing locally, DEV_MODE controls which site you see:
  // - DEV_MODE=tenant → pretend we're on DEV_TENANT_DOMAIN
  // - DEV_MODE=marketing (or unset) → show the company site
  if (hostname === 'localhost') {
    const devMode = process.env.DEV_MODE;
    if (devMode === 'tenant' && process.env.DEV_TENANT_DOMAIN) {
      hostname = process.env.DEV_TENANT_DOMAIN;
    } else {
      // Marketing mode — let the request pass through to (marketing) routes
      return NextResponse.next();
    }
  }

  // ── Root domain detection ──────────────────────────────────────────────
  if (ROOT_DOMAINS.includes(hostname)) {
    return NextResponse.next();
  }

  // ── Tenant slug extraction ─────────────────────────────────────────────
  let tenantSlug: string;

  if (hostname.endsWith(PLATFORM_SUFFIX)) {
    // Platform subdomain: atlas-demo.chameleon.services → atlas-demo
    tenantSlug = hostname.slice(0, -PLATFORM_SUFFIX.length);
  } else {
    // Custom domain: freshroast.co.za → use full domain as slug
    // The tenant-config API will need to resolve this via shellDomain lookup
    // For now, use the first segment as a best-effort slug
    tenantSlug = hostname.split('.')[0];
  }

  if (!tenantSlug) {
    return NextResponse.next();
  }

  // ── Rewrite to tenant catch-all ────────────────────────────────────────
  const url = request.nextUrl.clone();
  url.pathname = `/${tenantSlug}${url.pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, logo.png, and other static assets
     */
    '/((?!_next|favicon\\.ico|logo\\.png|.*\\.(?:css|js|png|jpg|jpeg|svg|ico|webp|woff|woff2|ttf|eot)).*)',
  ],
};
