/**
 * Next.js route-level loading UI.
 * Shown by the App Router while a page segment is loading (Suspense boundary).
 * Keeps the brand name centred, consistent with the PageIntro splash.
 */
export default function GlobalLoading() {
  return (
    <div
      className="fixed inset-0 z-[9998] bg-[#faf8f4] flex flex-col items-center justify-center gap-6"
      role="status"
      aria-label="Loading"
    >
      {/* Thin gold rule — grows in */}
      <div className="w-20 h-px bg-[#c9a96e] animate-pulse" />

      {/* Brand */}
      <div className="text-center select-none">
        <p className="font-serif text-2xl font-light tracking-[0.35em] text-[#1a2744] uppercase">
          ELYARA
        </p>
        <p className="text-[10px] tracking-[0.4em] text-[#c9a96e] uppercase font-medium mt-1">
          By Sweety
        </p>
      </div>

      {/* Spinning ring */}
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border border-[#e8e0d0]" />
        <div className="absolute inset-0 rounded-full border border-t-[#c9a96e] animate-spin" />
      </div>

      {/* Screen-reader text */}
      <span className="sr-only">Loading, please wait…</span>
    </div>
  );
}
