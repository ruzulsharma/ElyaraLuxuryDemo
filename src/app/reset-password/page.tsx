import type { Metadata } from "next";
import Image from "next/image";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set New Password",
  description: "Choose a new password for your Elyara account.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#faf8f4] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Image src="/assets/Logo.jpg" alt="Elyara by Sweety" fill className="object-contain rounded-full" priority />
          </div>
          <h1 className="font-serif text-2xl font-light text-[#1a2744] tracking-[0.1em] uppercase">
            New Password
          </h1>
          <p className="text-xs text-[#1a2744]/50 mt-2">
            Choose a strong password for your account.
          </p>
        </div>

        <div className="bg-white border border-[#e8e0d0] p-8 shadow-sm">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
