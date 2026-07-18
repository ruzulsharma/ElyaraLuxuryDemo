"use client";

import { useState, useActionState } from "react";
import { signUpAction } from "@/lib/actions/auth.actions";
import Link from "next/link";

const initialState = { error: "", field: "" };

/* Small reusable field wrapper */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2"
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full border border-[#e8e0d0] bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);

  // OTP state
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSendOtp = async () => {
    setOtpError("");
    setOtpSuccess("");

    if (!/^\d{10}$/.test(phone)) {
      setOtpError("Enter a valid 10-digit Indian mobile number");
      return;
    }

    setOtpSending(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error ?? "Failed to send OTP");
      } else {
        setOtpSent(true);
        setOtpSuccess("OTP sent! Check your SMS.");
      }
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  return (
    <form action={formAction} noValidate className="space-y-5">
      {/* Global error */}
      {state?.error && !state.field && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {state.error}
        </div>
      )}

      {/* Full Name */}
      <Field id="fullName" label="Full Name *" error={state?.field === "fullName" ? state.error : undefined}>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          maxLength={80}
          className={inputCls}
          placeholder="Priya Sharma"
        />
      </Field>

      {/* Email */}
      <Field id="email" label="Email Address *" error={state?.field === "email" ? state.error : undefined}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className={inputCls}
          placeholder="you@email.com"
        />
      </Field>

      {/* Mobile + Send OTP */}
      <Field id="phone" label="Mobile Number (India) *" error={otpError || (state?.field === "phone" ? state.error : undefined)}>
        <div className="flex gap-2">
          {/* +91 prefix */}
          <div className="flex border border-[#e8e0d0] flex-1">
            <span className="px-3 py-3 text-sm text-[#1a2744]/50 border-r border-[#e8e0d0] select-none bg-[#f5f0e8]">
              +91
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="flex-1 bg-transparent px-3 py-3 text-sm text-[#1a2744] focus:outline-none"
              placeholder="9876543210"
              aria-label="Mobile number"
            />
          </div>
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={otpSending || phone.length !== 10}
            className="flex-shrink-0 bg-[#1a2744] text-white text-xs tracking-[0.15em] uppercase font-medium px-4 py-3 hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {otpSending ? "Sending…" : otpSent ? "Resend" : "Send OTP"}
          </button>
        </div>
        {otpSuccess && (
          <p className="text-emerald-600 text-xs mt-1">{otpSuccess}</p>
        )}
      </Field>

      {/* OTP field — visible only after send */}
      {otpSent && (
        <Field id="otp" label="Enter OTP *" error={state?.field === "otp" ? state.error : undefined}>
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            required
            maxLength={6}
            pattern="\d{6}"
            className={inputCls}
            placeholder="6-digit code"
            aria-describedby="otp-hint"
          />
          <p id="otp-hint" className="text-xs text-[#1a2744]/40 mt-1">
            Enter the 6-digit OTP sent to +91 {phone}
          </p>
        </Field>
      )}

      {/* Hidden OTP field placeholder when not yet sent — ensures form submission doesn't fail */}
       {!otpSent && <input type="hidden" name="otp" value="000000" />} 
      {/* Password */}
      <Field id="password" label="Password *" error={state?.field === "password" ? state.error : undefined}>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={128}
            className={`${inputCls} pr-12`}
            placeholder="Min 8 chars, 1 uppercase, 1 number"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a2744]/40 hover:text-[#1a2744] transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </Field>

      {/* Confirm Password */}
      <Field id="confirmPassword" label="Confirm Password *" error={state?.field === "confirmPassword" ? state.error : undefined}>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            required
            maxLength={128}
            className={`${inputCls} pr-12`}
            placeholder="Repeat your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a2744]/40 hover:text-[#1a2744] transition-colors"
          >
            {showConfirm ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </Field>

      {/* Submit */}
      <button
        type="submit"
      //  disabled={isPending || !otpSent}
        disabled={isPending}
        aria-busy={isPending}
        className="w-full bg-[#1a2744] text-white py-4 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Creating account…" : "Create Account"}
      </button>

       {!otpSent && (
        <p className="text-xs text-center text-[#1a2744]/40">
          Please verify your mobile number with OTP before submitting.
        </p>
      )} 

      <p className="text-xs text-center text-[#1a2744]/40">
        Already have an account?{" "}
        <Link href="/login" className="text-[#c9a96e] hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}
