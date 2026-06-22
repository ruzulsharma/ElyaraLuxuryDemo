import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-[#faf8f4] min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md">
        <p className="text-7xl font-serif font-light text-[#c9a96e]">404</p>
        <h1 className="text-2xl font-serif font-light text-[#1a2744]">Page Not Found</h1>
        <p className="text-sm text-[#1a2744]/50 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="inline-block bg-[#1a2744] text-white text-xs tracking-[0.25em] uppercase font-bold px-8 py-4 hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="inline-block border-2 border-[#1a2744] text-[#1a2744] text-xs tracking-[0.25em] uppercase font-bold px-6 py-4 hover:bg-[#1a2744] hover:text-white transition-colors"
          >
            Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
