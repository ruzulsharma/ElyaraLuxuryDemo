import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Elyara account password.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#faf8f4] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Image src="/assets/Logo.jpg" alt="Elyara by Sweety" fill className="object-contain rounded-full" priority />
          </div>
          <h1 className="font-serif text-2xl font-light text-[#1a2744] tracking-[0.1em] uppercase">
            Reset Password
          </h1>
          <p className="text-xs text-[#1a2744]/50 mt-2 leading-relaxed max-w-xs mx-auto">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <div className="bg-white border border-[#e8e0d0] p-8 shadow-sm">
          <ForgotPasswordForm />
        </div>

        <p className="text-center text-xs text-[#1a2744]/40 mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-[#c9a96e] hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
