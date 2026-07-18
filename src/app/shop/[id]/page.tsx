import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, getProducts, getFeaturedProducts } from "@/lib/products";
import ProductDetail from "@/components/shop/ProductDetail";
import FeaturedProducts from "@/components/home/FeaturedProducts";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
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
  const product = await getProductById(id);

  if (!product) notFound();

  const featured = await getFeaturedProducts();

  return (
    <div className="bg-[#faf8f4] min-h-screen">
      <ProductDetail product={product} />
      <div className="border-t border-[#e8e0d0]">
        <FeaturedProducts products={featured} />
      </div>
    </div>
  );
}
