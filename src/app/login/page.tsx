import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Elyara account to track orders and manage your profile.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#faf8f4] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="text-center mb-10">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Image
              src="/assets/Logo.jpg"
              alt="Elyara by Sweety"
              fill
              className="object-contain rounded-full"
              priority
            />
          </div>
          <h1 className="font-serif text-2xl font-light text-[#1a2744] tracking-[0.1em] uppercase">
            Welcome Back
          </h1>
          <p className="text-xs text-[#1a2744]/50 tracking-[0.15em] uppercase mt-1">
            Elyara by Sweety
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e8e0d0] p-8 shadow-sm">
          <LoginForm />
        </div>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-xs text-[#1a2744]/40">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#c9a96e] hover:underline font-medium">
              Create Account
            </Link>
          </p>
          <p className="text-xs text-[#1a2744]/30">
            No account needed to{" "}
            <Link href="/shop" className="hover:underline">
              browse or place a custom order
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
