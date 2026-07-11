import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client (anon key, respects RLS).
 * Use inside Server Components, Server Actions, and Route Handlers.
 *
 * The `any` generic is intentional until you run:
 *   npx supabase gen types typescript --project-id <your-project-id>
 * and replace it with the generated Database type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createServerSupabaseClient(): Promise<ReturnType<typeof createServerClient<any>>> {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore.
          }
        },
      },
    }
  );
}

/**
 * Service-role client — bypasses RLS.
 * Use ONLY in trusted server-side contexts (webhooks, admin actions).
 */
export function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
