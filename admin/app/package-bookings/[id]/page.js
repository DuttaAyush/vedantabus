import ClientPage from './ClientPage';

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ id: 'default' }];
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <ClientPage params={resolvedParams} />;
}
