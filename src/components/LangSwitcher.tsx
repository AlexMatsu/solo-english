"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/LangContext";
import type { Lang } from "@/i18n/translations";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export default function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora ou apertar ESC.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];
  const others = LANGS.filter((l) => l.code !== lang);

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="lang-toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Idioma: ${current.label}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="lang-flag">{current.flag}</span>
        <span className="lang-code">{current.code.toUpperCase()}</span>
        <span className={`lang-caret${open ? " up" : ""}`} aria-hidden="true">▾</span>
      </button>

      {open ? (
        <ul className="lang-menu" role="listbox">
          {others.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected="false"
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
              >
                <span className="lang-flag">{l.flag}</span>
                <span>{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
