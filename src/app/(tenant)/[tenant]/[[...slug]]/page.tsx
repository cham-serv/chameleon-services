/**
 * Catch-All Page — Template Resolution + Rendering
 *
 * This is the heart of the multi-tenant rendering pipeline:
 * 1. Reads tenant slug from the [tenant] param (set by middleware rewrite)
 * 2. Fetches tenant config from the engine API
 * 3. Loads the template definition (route map)
 * 4. Resolves the URL path to a page component + variant
 * 5. Dynamically imports and renders the matched component
 *
 * Dev variant override (_dv query param):
 * - Demo tenants: works in ALL environments (including production)
 * - Non-demo tenants: works ONLY in development
 */

import { notFound } from 'next/navigation';
import { fetchTenantConfig, getTemplateDefinition, resolvePage } from '@/lib/tenant';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ tenant: string; slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant } = await params;
  const config = await fetchTenantConfig(tenant);

  const siteName = config?.settings?.siteName ?? config?.tenant?.name ?? 'Site';

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: config?.settings?.tagline ?? `Welcome to ${siteName}`,
  };
}

export default async function TenantPage({ params, searchParams }: Props) {
  const { tenant, slug = [] } = await params;
  const search = await searchParams;

  // 1. Fetch tenant config
  const config = await fetchTenantConfig(tenant);
  if (!config) notFound();

  // 2. Check template assignment
  const template = config.tenant.template;
  if (!template) {
    return <TemplateNotConfigured tenantName={config.tenant.name} />;
  }

  // 3. Load template definition (route map)
  const templateDef = await getTemplateDefinition(template.slug);
  if (!templateDef) {
    console.warn(`[catch-all] Template "${template.slug}" not found in registry`);
    notFound();
  }

  // 4. Resolve dev variant override
  const dvParam = typeof search._dv === 'string' ? search._dv : null;
  const allowOverride = config.tenant.isDemoTenant || process.env.NODE_ENV !== 'production';
  const devOverride = allowOverride ? dvParam : null;

  // 5. Resolve page + variant
  const resolved = await resolvePage(
    slug,
    templateDef,
    config.tenant.featureConfig,
    devOverride,
  );

  if (!resolved) notFound();

  // 6. Load template layout
  const LayoutMod = await templateDef.layout();
  const TemplateLayout = LayoutMod.default;

  // 7. Render
  const { Component, variant } = resolved;

  return (
    <TemplateLayout config={config}>
      <Component
        config={config}
        path={slug}
        variant={variant}
        searchParams={search}
      />
    </TemplateLayout>
  );
}

/**
 * Shown when a tenant exists but hasn't been assigned a template yet.
 * This is NOT a 404 — the tenant is valid, they just need to be configured.
 */
function TemplateNotConfigured({ tenantName }: { tenantName: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem',
        }}>
          🦎
        </div>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
          color: '#0B132B',
        }}>
          {tenantName}
        </h1>
        <p style={{
          color: '#8D99AE',
          maxWidth: 360,
          lineHeight: 1.6,
        }}>
          This site is being set up. A template hasn&apos;t been assigned yet.
          Check back soon.
        </p>
      </div>
    </div>
  );
}
