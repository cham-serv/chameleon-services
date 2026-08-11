/**
 * Tenant catch-all page.
 *
 * The middleware rewrites tenant domain requests so that:
 *   atlas-demo.chameleon.services/shop
 *   → internally routed to /atlas-demo.chameleon.services/shop
 *   → caught here with params: { domain: 'atlas-demo.chameleon.services', slug: ['shop'] }
 *
 * The URL shown in the browser remains: /shop
 *
 * STUB — In Batch 2 this will:
 * 1. Use `domain` to confirm which tenant is being served (cross-checks header)
 * 2. Read featureConfig to determine which template + variant to render
 * 3. Apply the `_dv` dev override for rapid variant testing locally
 * 4. Dynamically import the correct template component
 */
export default async function TenantCatchAllPage({
  params,
}: {
  params: Promise<{ domain: string; slug?: string[] }>;
}) {
  const { domain, slug } = await params;
  const path = slug ? `/${slug.join('/')}` : '/';

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: '1rem' }}>🦎 Chameleon Tenant Shell</h1>
      <dl style={{ lineHeight: 2 }}>
        <dt style={{ fontWeight: 600 }}>Tenant domain</dt>
        <dd><code>{domain}</code></dd>
        <dt style={{ fontWeight: 600 }}>Path</dt>
        <dd><code>{path}</code></dd>
      </dl>
      <p style={{ marginTop: '1.5rem', color: '#666' }}>
        Template resolution will be wired up in Batch 2.
      </p>
    </main>
  );
}
