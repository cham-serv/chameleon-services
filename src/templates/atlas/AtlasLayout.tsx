/**
 * Atlas Template Layout — Server/Client Hybrid
 *
 * Server Component shell that imports atlas.css and renders the
 * interactive chrome components (header, mobile nav, cart drawer, footer).
 *
 * The interactive parts are wrapped in a client boundary component
 * (AtlasLayoutShell) so we can share state between header/nav/cart.
 */

import './atlas.css';
import type { LayoutProps } from '@/lib/types';
import AtlasFooter from './AtlasFooter';
import AtlasLayoutShell from './AtlasLayoutShell';

export default function AtlasLayout({ config, children }: LayoutProps) {
  return (
    <>
      <AtlasLayoutShell config={config}>
        <main style={{ minHeight: '60vh' }}>
          {children}
        </main>
      </AtlasLayoutShell>
      <AtlasFooter config={config} />
    </>
  );
}
