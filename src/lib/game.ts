import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  name: string;
  level: number;
  xp: number;
  gold: number;
  lives: number;
  streak: number;
}

/** XP necessário para o próximo nível (regra: 100 XP por nível). */
export const XP_PER_LEVEL = 100;

export function xpIntoLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

/** Busca o perfil do usuário logado (ou null se não houver). */
export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .maybeSingle();
  if (error) {
    console.error("getProfile", error.message);
    return null;
  }
  return (data as Profile) ?? null;
}

/** IDs das lições já concluídas pelo usuário. */
export async function getCompletedLessons(): Promise<string[]> {
  const { data, error } = await supabase
    .from("user_lessons")
    .select("lesson_id")
    .eq("status", "completed");
  if (error) {
    console.error("getCompletedLessons", error.message);
    return [];
  }
  return (data ?? []).map((r) => (r as { lesson_id: string }).lesson_id);
}

/**
 * Conclui uma lição: registra no banco, dá XP (só na 1ª vez) e recalcula o
 * nível — tudo na função RPC `complete_lesson` (regra de negócio no backend).
 * Retorna o perfil atualizado.
 */
export async function completeLesson(
  lessonId: string,
  xp: number
): Promise<Profile> {
  const { data, error } = await supabase.rpc("complete_lesson", {
    p_lesson_id: lessonId,
    p_xp: xp,
  });
  if (error) throw new Error(error.message);
  return data as Profile;
}
