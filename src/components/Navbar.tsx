"use client";

import Link from "next/link";
import { useState } from "react";
import LangSwitcher from "@/components/LangSwitcher";
import { useT } from "@/i18n/LangContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const t = useT();

  const LINKS = [
    { href: "#inicio", label: t.nav.inicio, active: true },
    { href: "#como", label: t.nav.como },
    { href: "#recursos", label: t.nav.recursos },
    { href: "#depoimentos", label: t.nav.depoimentos },
    { href: "#planos", label: t.nav.planos },
    { href: "#faq", label: t.nav.faq },
  ];

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="logo">
          <span className="logo-full">
            SOLO<br />
            <span className="r">ENGLISH</span>
          </span>
          <span className="logo-mini" aria-hidden="true">
            S<span className="r">E</span>
          </span>
        </Link>

        <nav className={`nav-links${open ? " open" : ""}`}>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={l.active ? "active" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          <LangSwitcher />
          <Link href="/login" className="btn ghost">
            {t.nav.entrar}
          </Link>
          <Link href="/cadastro" className="btn primary btn-bolt">
            <span className="btn-bolt-label">{t.nav.comecar}</span>
          </Link>
        </div>

        <button
          className="nav-burger"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}
