import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

// Export metadata generation
export { generateMetadata } from './metadata';

// This is now a server component that wraps the client component
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
