import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Service-role клиент. ОБХОДИТ RLS — используется ТОЛЬКО на сервере
 * (route handlers, server actions). Импорт `server-only` сорвёт сборку,
 * если этот модуль случайно попадёт в клиентский бандл.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
