import { notFound } from 'next/navigation';
import { fetchTenantConfig } from '@/lib/tenant';
import OrderConfirmationPage from '@/templates/atlas/OrderConfirmationPage';

interface Props {
  params: Promise<{ tenant: string; token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: Props) {
  const { token } = await params;
  return {
    title: `Order Confirmation — ${token}`,
    robots: { index: false, follow: false }, // Never index order pages
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { tenant, token } = await params;
  const resolvedSearchParams = await searchParams;

  const config = await fetchTenantConfig(tenant);
  if (!config) notFound();

  // Pass path segments matching the URL shape: /order/confirmation/[token]
  // OrderConfirmationPage reads path[path.length - 1] as the tracking token.
  return (
    <OrderConfirmationPage
      config={config}
      path={['order', 'confirmation', token]}
      variant="default"
      searchParams={resolvedSearchParams}
      noCache={true}
    />
  );
}
