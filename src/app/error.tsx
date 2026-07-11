"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error monitoring service here
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md space-y-5">
        <p className="text-5xl font-serif font-light text-[#c9a96e]">Oops</p>
        <h1 className="text-xl font-serif font-light text-[#1a2744]">
          Something went wrong
        </h1>
        <p className="text-sm text-[#1a2744]/50 leading-relaxed">
          An unexpected error occurred. Our team has been notified.
          {error.digest && (
            <span className="block mt-1 font-mono text-xs text-[#1a2744]/30">
              Ref: {error.digest}
            </span>
          )}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-[#1a2744] text-white text-xs tracking-[0.2em] uppercase font-bold px-6 py-3 hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-[#1a2744] text-[#1a2744] text-xs tracking-[0.2em] uppercase font-bold px-6 py-3 hover:bg-[#1a2744] hover:text-white transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
