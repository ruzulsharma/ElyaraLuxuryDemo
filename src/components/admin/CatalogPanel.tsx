import { PRODUCTS } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";

/**
 * CatalogPanel — displays the live product catalog from data.ts
 * with a link to manage products in Contentful (when configured).
 */
export default function CatalogPanel() {
  const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID;
  const contentfulUrl = contentfulSpaceId
    ? `https://app.contentful.com/spaces/${contentfulSpaceId}/entries`
    : null;

  return (
    <div className="space-y-6">
      {/* Contentful integration banner */}
      <div className="bg-[#1a2744]/5 border border-[#e8e0d0] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#1a2744]">
            Contentful CMS Integration
          </p>
          <p className="text-xs text-[#1a2744]/60 mt-1 leading-relaxed">
            {contentfulUrl
              ? "Your Contentful space is configured. Click below to manage products in the CMS."
              : "Add CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN to .env.local to enable live CMS syncing."}
          </p>
        </div>
        {contentfulUrl ? (
          <a
            href={contentfulUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-[#1a2744] text-white text-xs tracking-[0.2em] uppercase font-bold px-6 py-3 hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
          >
            Open Contentful →
          </a>
        ) : (
          <Link
            href="/admin/dashboard"
            className="flex-shrink-0 border border-[#e8e0d0] text-[#1a2744]/60 text-xs tracking-[0.2em] uppercase font-medium px-6 py-3 cursor-not-allowed"
            aria-disabled
          >
            Not Configured
          </Link>
        )}
      </div>

      {/* Local catalog */}
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-[#1a2744]/50 font-medium mb-4">
          Current Catalog ({PRODUCTS.length} pieces)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-[#e8e0d0] p-4 flex gap-4"
            >
              <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden bg-[#e8e0d0]">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-[10px] text-[#c9a96e] tracking-[0.2em] uppercase font-medium">
                  Style {product.styleNo}
                </p>
                <p className="text-sm font-medium text-[#1a2744] truncate">
                  {product.name}
                </p>
                <p className="text-xs font-semibold text-[#1a2744]">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
                <div className="flex gap-1 flex-wrap">
                  {product.isBestseller && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#c9a96e]/10 text-[#c9a96e] uppercase tracking-wide font-medium">
                      Bestseller
                    </span>
                  )}
                  {product.isNew && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#1a2744]/10 text-[#1a2744] uppercase tracking-wide font-medium">
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
