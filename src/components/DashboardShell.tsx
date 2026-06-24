"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getProfile, type Profile } from "@/lib/game";

interface SessionUser {
  name: string;
  email: string;
}

const SIDE_LINKS = [
  { href: "/jornada", icon: "/icons/menu/inicio.svg", label: "Início" },
  { href: "/jornada/missoes", icon: "/icons/menu/missoes.svg", label: "Missões" },
  { href: "/jornada/ranking", icon: "/icons/menu/ranking.svg", label: "Ranking" },
  { href: "/jornada/guilda", icon: "/icons/menu/guilda.svg", label: "Guilda", requiresLevel: 10 },
  { href: "/jornada/loja", icon: "/icons/menu/loja.svg", label: "Loja", requiresLevel: 10 },
];

export default function DashboardShell({
  children,
  noAside = false,
  requiresLevel,
}: {
  children: ReactNode;
  /** true em telas sem a coluna direita (.app-aside) */
  noAside?: boolean;
  /** nível mínimo para acessar a página (redireciona para /jornada se menor) */
  requiresLevel?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Protege a rota: sem sessão → login. Com sessão, carrega o perfil. */
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const session = data.session;
      if (!session) {
        router.replace("/login");
        return;
      }
      const meta = session.user.user_metadata as { name?: string };
      setUser({
        name: meta.name ?? session.user.email?.split("@")[0] ?? "Aventureiro",
        email: session.user.email ?? "",
      });
      setChecking(false);
      const p = await getProfile();
      if (!active) return;
      if (p) setProfile(p);
      // guarda de nível: bloqueia acesso direto por URL
      if (requiresLevel != null && (p?.level ?? 1) < requiresLevel) {
        router.replace("/jornada");
      }
    });
    return () => {
      active = false;
    };
  }, [router, pathname, requiresLevel]);

  // valores reais do backend, com fallback (caso o SQL ainda não tenha sido rodado)
  const level = profile?.level ?? 1;
  const gold = profile?.gold ?? 0;
  const lives = profile?.lives ?? 5;
  const streak = profile?.streak ?? 0;

  /* Fecha o menu do perfil ao clicar fora / ESC */
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (checking || !user) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "var(--muted)" }}>
        <p className="display" style={{ fontSize: 22 }}>Abrindo seu portal…</p>
      </main>
    );
  }

  return (
    <>
      {/* ===================== TOPBAR ===================== */}
      <header className="app-top">
        <div className="app-top-inner">
          <button
            className="nav-burger app-menu-btn"
            aria-label="Abrir menu"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((o) => !o)}
          >
            ☰
          </button>
          <Link href="/" className="logo">
            SOLO <span className="r">ENGLISH</span>
          </Link>

          <div className="player-pills">
            <span className="pill" title="Ofensiva">
              <img className="pill-ic" src="/icons/recursos_topo/streak.svg" alt="" aria-hidden="true" /> <b>{streak}</b>
            </span>
            <span className="pill gold" title="Gemas disponíveis">
              <img className="pill-ic" src="/icons/recursos_topo/gemas.svg" alt="" aria-hidden="true" /> <b className="mono">{gold}</b>
            </span>
            <span className="pill lives" title="Vidas restantes">
              <img className="pill-ic" src="/icons/recursos_topo/vidas.svg" alt="" aria-hidden="true" /> <b>{lives}</b>
            </span>

            <div className="player-menu">
              <button
                className="player-chip"
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                title={`${user.name} · Nível ${level}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
              >
                <span className="pc-ava">🥷</span>
                <span className="pc-meta">
                  <small>{user.name}</small>
                  <b className="display">NÍVEL {level}</b>
                </span>
                <span className={`pc-caret${menuOpen ? " up" : ""}`} aria-hidden="true">▾</span>
              </button>

              {menuOpen ? (
                <div className="player-dropdown" role="menu" onClick={(e) => e.stopPropagation()}>
                  <Link href="/jornada/perfil" role="menuitem" className="pd-item">
                    <svg className="pd-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20a8 8 0 0 1 16 0" />
                    </svg>
                    Conta
                  </Link>
                  <button type="button" role="menuitem" className="pd-item danger" onClick={handleLogout}>
                    <svg className="pd-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
                      <path d="m10 17 5-5-5-5" />
                      <path d="M15 12H3" />
                    </svg>
                    Sair
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* ===================== SHELL ===================== */}
      <div className={`app-shell${noAside ? " no-aside" : ""}`}>
        <aside className={sidebarOpen ? "app-side open" : "app-side"}>
          <nav className="side-nav">
            {SIDE_LINKS.map((link) => {
              const locked = link.requiresLevel != null && level < link.requiresLevel;
              if (locked) {
                return (
                  <span
                    key={link.href}
                    className="side-link locked"
                    title={`Libera no nível ${link.requiresLevel}`}
                    aria-disabled="true"
                  >
                    <span className="si"><img src={link.icon} alt="" aria-hidden="true" /></span>
                    {link.label}
                    <span className="side-lock" aria-hidden="true">🔒 Nv {link.requiresLevel}</span>
                  </span>
                );
              }
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={active ? "side-link active" : "side-link"}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="si"><img src={link.icon} alt="" aria-hidden="true" /></span> {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="side-promo panel glow corner">
            <p className="eyebrow" style={{ fontSize: "11px" }}>Caçador</p>
            <p style={{ fontSize: "13px", color: "var(--muted)", margin: "6px 0 12px" }}>
              Desbloqueie missões ilimitadas e o tutor de IA.
            </p>
            <Link href="/#planos" className="btn block" style={{ fontSize: "13px", padding: "11px 14px" }}>
              Despertar poder
            </Link>
          </div>
        </aside>

        {children}
      </div>
    </>
  );
}
