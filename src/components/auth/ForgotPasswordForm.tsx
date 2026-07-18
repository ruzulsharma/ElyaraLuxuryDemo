"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/lib/actions/auth.actions";
import Link from "next/link";

const initialState = { error: "", success: false };

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    initialState
  );

  if (state?.success) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-base font-medium text-[#1a2744]">Check your email</h2>
        <p className="text-sm text-[#1a2744]/60 leading-relaxed">
          If an account exists with that email, we&apos;ve sent a password reset link. Check your inbox (and spam folder).
        </p>
        <Link href="/login" className="inline-block mt-4 text-xs tracking-[0.2em] uppercase text-[#c9a96e] font-medium hover:underline">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state?.error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full border border-[#e8e0d0] bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors"
          placeholder="you@email.com"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="w-full bg-[#1a2744] text-white py-4 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Sending…" : "Send Reset Link"}
      </button>
    </form>
  );
}
