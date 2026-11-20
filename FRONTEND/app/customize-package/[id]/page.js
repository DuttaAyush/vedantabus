import CustomizePackageClient from './CustomizePackageClient';
import { allPackagesData } from '@/lib/data/packagesData';

export function generateStaticParams() {
  const ids = Object.keys(allPackagesData);
  const staticParams = ids.map(id => ({ id }));
  if (!ids.includes('default')) {
    staticParams.push({ id: 'default' });
  }
  return staticParams;
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <CustomizePackageClient params={resolvedParams} />;
}
