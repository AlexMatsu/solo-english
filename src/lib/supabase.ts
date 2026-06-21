import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase (browser). Usa a autenticação nativa do Supabase
 * (Supabase Auth) para cadastro, login e sessão — contas reais no servidor.
 *
 * As duas variáveis abaixo são PÚBLICAS por design (a anon key é protegida
 * por Row Level Security no Supabase). Defina-as em .env.local e nas
 * Environment Variables da Vercel.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True quando as variáveis de ambiente do Supabase estão configuradas. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Fallback com placeholder válido para o build não quebrar antes de configurar
// as chaves. Em runtime, sem as variáveis reais, as chamadas de auth falham
// (e mostramos uma mensagem clara nas telas).
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
