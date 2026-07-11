import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 * Use this inside Client Components ("use client").
 * Replace 'any' generic with the generated Database type once you run:
 *   npx supabase gen types typescript --project-id <your-project-id>
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient(): ReturnType<typeof createBrowserClient<any>> {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
