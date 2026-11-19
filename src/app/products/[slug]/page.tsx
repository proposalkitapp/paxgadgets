import { Suspense } from "react";
import { products } from "@/data/products";
import ProductDetailView from "@/components/product/ProductDetailView";

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={<div className="pt-32 text-center text-xs font-mono text-neutral-500">Loading Product Specifications...</div>}>
      <ProductDetailView slug={slug} />
    </Suspense>
  );
}
