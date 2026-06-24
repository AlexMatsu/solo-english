"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getProfile, xpIntoLevel, XP_PER_LEVEL, type Profile } from "@/lib/game";
import { IconLock, IconSword } from "@/components/icons";

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

/* Bottom nav (mobile): Ranking dá lugar a "Estudar" — CTA em destaque */
const BOTTOM_NAV = [
  { href: "/jornada", icon: "/icons/menu/inicio.svg", label: "Início" },
  { href: "/jornada/missoes", icon: "/icons/menu/missoes.svg", label: "Missões" },
  { href: "/jornada/licao/saudacoes", icon: "/icons/trilha_aprendizado/reading.svg", label: "Estudar", cta: true },
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
  const xpInLevel = xpIntoLevel(profile?.xp ?? 0);
  const xpPct = (xpInLevel / XP_PER_LEVEL) * 100;
  const firstName = (user?.name ?? "Caçador").split(" ")[0];

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
      {/* fundo de cenário (mobile): castelo (parallax lento) + véu + chão (corrida) */}
      <div className="app-bg" aria-hidden="true">
        <div className="bg-castle" />
        <div className="bg-veil" />
        <div className="bg-floor" />
      </div>

      {/* ===================== TOPBAR ===================== */}
      <header className="app-top">
        <div className="app-top-inner">
          <Link href="/" className="logo">
            SOLO <span className="r">ENGLISH</span>
          </Link>

          <div className="player-pills">
            {/* Energia */}
            <span className="pill energy" title="Energia">
              <img className="pill-ic" src="/icons/recursos_topo/energia.svg" alt="" aria-hidden="true" />
              <b className="mono">25/30</b>
              <button type="button" className="pill-add" aria-label="Recarregar energia">
                <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/></svg>
              </button>
              <small className="pill-timer">10m 15s</small>
            </span>

            {/* Gold */}
            <span className="pill gold" title="Gold">
              <img className="pill-ic" src="/icons/recompensas_epicas/moedas.svg" alt="" aria-hidden="true" />
              <b className="mono">34K</b>
              <button type="button" className="pill-add" aria-label="Comprar gold">
                <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/></svg>
              </button>
            </span>

            {/* Diamantes */}
            <span className="pill gems" title="Diamantes">
              <img className="pill-ic" src="/icons/recursos_topo/gemas.svg" alt="" aria-hidden="true" />
              <b className="mono">1440</b>
              <button type="button" className="pill-add" aria-label="Comprar diamantes">
                <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/></svg>
              </button>
            </span>
          </div>

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
                <span className="pc-ava-ring">
                  <span className="pc-ava"><img src="/avatar.png" alt="" aria-hidden="true" /></span>
                </span>
                <span className="pc-power">
                  <span className="pc-xp-row">
                    <span className="pc-level">{level}</span>
                    <span className="xpbar"><i style={{ width: "10%" }} /></span>
                  </span>
                  <span className="pc-power-val">
                    <IconSword width={13} height={13} /> 1k
                  </span>
                </span>
                <span className="pc-info">
                  <span className="pc-name display">{firstName}</span>
                  <span className="pc-sub">
                    <span className="pc-class">Caçador</span>
                    <span className="pc-lvl">Nível {level}</span>
                  </span>
                  <span className="pc-xp">
                    <span className="pc-xp-num mono">{xpInLevel} / {XP_PER_LEVEL} XP</span>
                    <span className="xpbar"><i style={{ width: `${xpPct}%` }} /></span>
                  </span>
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
      </header>

      {/* ===================== SHELL ===================== */}
      <div className={`app-shell${noAside ? " no-aside" : ""}`}>
        <aside className="app-side">
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

      {/* ===================== BOTTOM NAV (mobile) ===================== */}
      <nav className="bottom-nav" aria-label="Navegação">
        {BOTTOM_NAV.map((link) => {
          const cta = "cta" in link && link.cta;
          const locked = link.requiresLevel != null && level < link.requiresLevel;
          if (locked) {
            return (
              <span
                key={link.href}
                className="bn-item locked"
                aria-disabled="true"
                title={`Libera no nível ${link.requiresLevel}`}
              >
                <span className="bn-ic"><img src={link.icon} alt="" aria-hidden="true" /></span>
                <small>{link.label}</small>
                <span className="bn-lock" aria-hidden="true">
                  <IconLock width={11} height={11} />
                </span>
              </span>
            );
          }
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className={`bn-item${active ? " active" : ""}${cta ? " bn-cta" : ""}`}>
              <span className="bn-ic"><img src={link.icon} alt="" aria-hidden="true" /></span>
              <small>{link.label}</small>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
