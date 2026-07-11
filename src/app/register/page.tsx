import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join Elyara to track your bespoke orders and get early access to new collections.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
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
            Create Account
          </h1>
          <p className="text-xs text-[#1a2744]/50 tracking-[0.15em] uppercase mt-1">
            Elyara by Sweety
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e8e0d0] p-8 shadow-sm">
          <RegisterForm />
        </div>

        <p className="text-center text-xs text-[#1a2744]/40 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#c9a96e] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
