import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const isBrowser = typeof window !== 'undefined';

// This creates our single connection point to our live cloud database.
// Use @supabase/ssr browser client so PKCE code verifier is stored in cookies
// and available to the server callback route.
export const supabase = isBrowser
  ? createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        detectSessionInUrl: false,
      },
    })
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: false,
      },
    });

export function createServiceRoleClient() {
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in environment.');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: false,
    },
  });
}
