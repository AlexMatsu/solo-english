"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Dict, type Lang } from "@/i18n/translations";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };

const LangContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "solo-lang";
const VALID: Lang[] = ["pt", "en", "es"];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  // Restaura o idioma salvo no primeiro render no client.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && VALID.includes(saved)) setLangState(saved);
  }, []);

  // Persiste e reflete no atributo lang do <html>.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
  }, [lang]);

  const value: Ctx = { lang, setLang: setLangState, t: translations[lang] };
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang precisa estar dentro de <LanguageProvider>");
  return ctx;
}

/** Atalho para o dicionário do idioma atual. */
export function useT(): Dict {
  return useLang().t;
}
