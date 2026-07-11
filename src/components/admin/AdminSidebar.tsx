"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/lib/actions/auth.actions";

const NAV = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/admin/dashboard?tab=orders",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: "Catalog",
    href: "/admin/dashboard?tab=catalog",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-[#1a2744] text-white min-h-screen">
      {/* Brand */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#faf8f4]">
          <Image src="/assets/Logo.jpg" alt="Elyara" fill className="object-contain" />
        </div>
        <div className="leading-none">
          <p className="font-serif text-sm font-bold tracking-[0.15em] uppercase">Elyara</p>
          <p className="text-[9px] tracking-[0.2em] text-[#c9a96e] uppercase">Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1" aria-label="Admin navigation">
        {NAV.map((item) => {
          const isActive = pathname.includes(item.href.split("?")[0]);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.15em] uppercase font-medium rounded-sm transition-colors ${
                isActive
                  ? "bg-[#c9a96e]/20 text-[#c9a96e]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <p className="text-[10px] text-white/40 truncate px-3">{userEmail}</p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.15em] uppercase font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
