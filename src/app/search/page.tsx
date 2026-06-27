"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS } from "@/lib/data"; // Import your product catalog
import FeaturedProducts from "@/components/home/FeaturedProducts";

// function SearchContent() {
//   const searchParams = useSearchParams();
//   const query = searchParams.get("q") || "";
  
//   // Logic: Replace this with your actual data fetching/filtering
//   const results = []; 

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-16">
//       <h1 className="text-2xl font-serif text-[#1a2744] mb-8">Search results for: "{query}"</h1>

//       {results.length > 0 ? (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {/* Map your found products here */}
//         </div>
//       ) : (
//         <div className="flex flex-col items-center py-10 border border-[#e8e0d0] bg-[#faf8f4]">
//           <p className="text-[#3a3a3a]">We couldn't find any products matching "{query}".</p>
//           <div className="mt-12 w-full">
//             <h2 className="text-center text-lg uppercase tracking-widest text-[#1a2744] mb-8">
//               You might also like
//             </h2>
//             {/* Fallback to your existing FeaturedProducts component */}
//             <FeaturedProducts />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function SearchPage() {
//   return (
//     <Suspense fallback={<div className="py-20 text-center">Loading results...</div>}>
//       <SearchContent />
//     </Suspense>
//   );
// }


function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  
  // Filter products by name, category, or collection based on the search query
  const results = PRODUCTS.filter((product) => 
    product.name.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query) ||
    product.collection.toLowerCase().includes(query)
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-serif text-[#1a2744] mb-8 uppercase tracking-wide">
        {results.length > 0 
          ? `Results for: "${query}"` 
          : `No results for: "${query}"`}
      </h1>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {results.map((product) => (
            <Link 
              key={product.id} 
              href={`/shop/${product.id}`} // Update this path if your product pages live elsewhere
              className="group cursor-pointer block"
            >
              <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-[#e8e0d0]">
                {product.images[0] && (
                  <Image 
                    src={product.images[0]} 
                    alt={product.name} 
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}
              </div>
              <h3 className="font-medium text-[#1a2744]">{product.name}</h3>
              <p className="text-sm text-[#c9a96e]">₹{product.price.toLocaleString("en-IN")}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-10 border border-[#e8e0d0] bg-[#faf8f4]">
          <p className="text-[#3a3a3a] mb-8">We couldn't find any products matching "{query}".</p>
          <div className="w-full">
            <h2 className="text-center text-lg uppercase tracking-widest text-[#1a2744] mb-8">
              You might also like
            </h2>
            <FeaturedProducts />
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center font-serif text-[#1a2744]">Loading results...</div>}>
      <SearchContent />
    </Suspense>
  );
}