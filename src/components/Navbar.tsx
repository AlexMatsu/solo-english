"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "#inicio", label: "Início", active: true },
  { href: "#como", label: "Como funciona" },
  { href: "#recursos", label: "Recursos" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#planos", label: "Planos" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="logo">
          SOLO<br />
          <span className="r">ENGLISH</span>
        </Link>

        <nav className="nav-links" style={open ? { display: "flex" } : undefined}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={l.active ? "active" : undefined}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          <Link href="/login" className="btn ghost">
            Entrar
          </Link>
          <Link href="/cadastro" className="btn primary">
            Começar agora
          </Link>
        </div>

        <button
          className="nav-burger"
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
