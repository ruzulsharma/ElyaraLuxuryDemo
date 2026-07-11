import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({ request });

//   // Build a Supabase client that can read/write the session cookie
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
//           supabaseResponse = NextResponse.next({ request });
//           cookiesToSet.forEach(({ name, value, options }) =>
//             supabaseResponse.cookies.set(name, value, options)
//           );
//         },
//       },
//     }
//   );

//   // Refresh session — MUST be called before any conditional logic
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   const pathname = request.nextUrl.pathname;

//   // ── Protect /admin routes ────────────────────────────────────────────────
//   if (pathname.startsWith("/admin")) {
//     if (!user) {
//       const loginUrl = new URL("/login", request.url);
//       loginUrl.searchParams.set("redirect", pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//     // Only the admin email may access /admin
//     if (user.email !== process.env.ADMIN_EMAIL) {
//       return NextResponse.redirect(new URL("/shop", request.url));
//     }
//   }

//   // ── Redirect authenticated users away from /login ────────────────────────
//   if (pathname === "/login" && user) {
//     const dest =
//       user.email === process.env.ADMIN_EMAIL ? "/admin/dashboard" : "/shop";
//     return NextResponse.redirect(new URL(dest, request.url));
//   }

//   return supabaseResponse;
// }

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // ── 1. Protect /admin routes ──────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Fetch the profile to verify role from the database
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Deny access if not an admin
    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL("/shop", request.url));
    }
  }

  // ── 2. Prevent logged-in users from hitting /login ────────────────────────
  if (pathname === "/login" && user) {
    // Re-verify role to decide where to send them
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const dest = profile?.role === 'admin' ? "/admin/dashboard" : "/shop";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return supabaseResponse;
}

// export const config = {
//   matcher: [
//     /*
//      * Match all paths except Next.js internals and static files.
//      * Adjust this pattern if you add API routes that must be public.
//      */
//     "/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
