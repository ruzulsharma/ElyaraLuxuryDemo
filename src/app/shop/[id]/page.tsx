import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/data";
import ProductDetail from "@/components/shop/ProductDetail";
import FeaturedProducts from "@/components/home/FeaturedProducts";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} — ${product.collection}`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Elyara by Sweety`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) notFound();

  return (
    <div className="bg-[#faf8f4] min-h-screen">
      <ProductDetail product={product} />

      {/* Related Products */}
      <div className="border-t border-[#e8e0d0]">
        <FeaturedProducts />
      </div>
    </div>
  );
}
