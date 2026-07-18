"use client";

import { useActionState } from "react";
import { signInAction } from "@/lib/actions/auth.actions";

const initialState = { error: "" };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );

  return (
    <form action={formAction} noValidate className="space-y-5">
      {/* Error banner */}
      {state?.error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm"
        >
          {state.error}
        </div>
      )}

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2"
        >
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

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="password"
            className="text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium"
          >
            Password
          </label>
          <a
            href="/forgot-password"
            className="text-[10px] tracking-[0.1em] text-[#c9a96e] hover:underline font-medium"
          >
            Forgot Password?
          </a>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full border border-[#e8e0d0] bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors"
          placeholder="••••••••"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="w-full bg-[#1a2744] text-white py-4 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
