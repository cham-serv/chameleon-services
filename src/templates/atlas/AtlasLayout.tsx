/**
 * Atlas Template Layout  Server/Client Hybrid
 *
 * Server Component shell that imports atlas.css and renders the
 * interactive chrome components (header, mobile nav, cart drawer, footer).
 *
 * The interactive parts are wrapped in a client boundary component
 * (AtlasLayoutShell) so we can share state between header/nav/cart.
 *
 * When the tenant is a demo tenant, also renders the DemoExplorer
 * drawer for variant browsing.
 */

import './atlas.css';
import './demo-explorer.css';
import type { LayoutProps } from '@/lib/types';
import AtlasFooter from './AtlasFooter';
import AtlasLayoutShell from './AtlasLayoutShell';
import { DemoExplorer } from './DemoExplorer';
import { definition } from './definition';
import { buildExplorerRoutes } from './demo-explorer-utils';

export default function AtlasLayout({ config, children }: LayoutProps) {
  // Build explorer routes only for demo tenants
  const explorerRoutes = config.tenant.isDemoTenant
    ? buildExplorerRoutes(definition, config.tenant.featureConfig)
    : null;

  return (
    <>
      <AtlasLayoutShell config={config}>
        <main style={{ minHeight: '60vh' }}>
          {children}
        </main>
      </AtlasLayoutShell>
      <AtlasFooter config={config} />
      {explorerRoutes && <DemoExplorer routes={explorerRoutes} basePath="" />}
    </>
  );
}
