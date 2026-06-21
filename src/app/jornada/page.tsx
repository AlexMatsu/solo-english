"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "@/styles/dashboard.css";

interface SessionUser {
  name: string;
  email: string;
}

/* ---------- Tipos ---------- */
type NodeStatus = "done" | "current" | "locked";

interface TrailNode {
  id: string;
  name: string;
  label: string;
  icon: string;
  status: NodeStatus;
  xp?: number;
  flag?: string;
  boss?: boolean;
  ariaLabel: string;
}

interface Mission {
  id: string;
  icon: string;
  title: string;
  reward: string;
  progress: number;
  count: string;
  done?: boolean;
}

interface SideLink {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

interface RankRow {
  pos: number;
  avatar: string;
  name: string;
  you?: boolean;
  xp: string;
}

interface StreakDay {
  id: string;
  label: string;
  icon: string;
  state: "on" | "today";
}

interface SelectedLesson {
  name: string;
  xp?: number;
}

/* ---------- Dados ---------- */
const sideLinks: SideLink[] = [
  { id: "inicio", icon: "🏠", label: "Início", active: true },
  { id: "missoes", icon: "📜", label: "Missões" },
  { id: "ranking", icon: "🏆", label: "Ranking" },
  { id: "guilda", icon: "⚔️", label: "Guilda" },
  { id: "loja", icon: "💎", label: "Loja" },
  { id: "perfil", icon: "🥷", label: "Perfil" },
];

const trailNodes: TrailNode[] = [
  {
    id: "saudacoes",
    name: "Saudações",
    label: "Saudações",
    icon: "✓",
    status: "done",
    ariaLabel: "Lição concluída: Saudações",
  },
  {
    id: "vocabulario",
    name: "Vocabulário do Dia",
    label: "Vocabulário",
    icon: "✓",
    status: "done",
    ariaLabel: "Lição concluída: Vocabulário do Dia",
  },
  {
    id: "to-be",
    name: "Verbo To Be",
    label: "Verbo To Be",
    icon: "⚡",
    status: "current",
    xp: 80,
    flag: "VOCÊ ESTÁ AQUI",
    ariaLabel: "Lição atual: Verbo To Be. Iniciar.",
  },
  {
    id: "listening",
    name: "Listening: Anime OST",
    label: "Listening: Anime OST",
    icon: "🎧",
    status: "locked",
    xp: 120,
    ariaLabel: "Lição bloqueada: Listening Anime OST",
  },
  {
    id: "speaking",
    name: "Speaking: Treino de Voz",
    label: "Speaking",
    icon: "🎙️",
    status: "locked",
    xp: 100,
    ariaLabel: "Lição bloqueada: Speaking",
  },
  {
    id: "boss",
    name: "Boss: Diálogo do Portão",
    label: "Diálogo do Portão",
    icon: "👹",
    status: "locked",
    xp: 500,
    flag: "BOSS",
    boss: true,
    ariaLabel: "Boss bloqueado: Diálogo do Portão",
  },
];

const missions: Mission[] = [
  {
    id: "palavras",
    icon: "📚",
    title: "Aprenda 10 palavras novas",
    reward: "+50 XP · +20 Gold",
    progress: 40,
    count: "4/10",
  },
  {
    id: "listening",
    icon: "🎧",
    title: "Complete um listening",
    reward: "+80 XP",
    progress: 0,
    count: "0/1",
  },
  {
    id: "speaking",
    icon: "🎙️",
    title: "Faça 1 exercício de speaking",
    reward: "+100 XP",
    progress: 0,
    count: "0/1",
  },
  {
    id: "sequencia",
    icon: "🛡️",
    title: "Mantenha a sequência",
    reward: "+200 XP · concluída ✓",
    progress: 100,
    count: "",
    done: true,
  },
];

const rankRows: RankRow[] = [
  { pos: 1, avatar: "⚔️", name: "AnimeKing", xp: "8.310" },
  { pos: 2, avatar: "🐉", name: "SoloPlayer", xp: "7.450" },
  { pos: 3, avatar: "🥷", name: "ShadowHunter", you: true, xp: "6.980" },
  { pos: 4, avatar: "🌙", name: "Lunatic", xp: "5.760" },
  { pos: 5, avatar: "📖", name: "EternalStudent", xp: "4.980" },
];

const streakDays: StreakDay[] = [
  { id: "seg", label: "S", icon: "✓", state: "on" },
  { id: "ter", label: "T", icon: "✓", state: "on" },
  { id: "qua", label: "Q", icon: "✓", state: "on" },
  { id: "qui", label: "Q", icon: "✓", state: "on" },
  { id: "sex", label: "S", icon: "✓", state: "on" },
  { id: "sab", label: "S", icon: "✓", state: "on" },
  { id: "dom", label: "D", icon: "🔥", state: "today" },
];

export default function JornadaPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [checking, setChecking] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<SelectedLesson | null>(
    null
  );
  const [claimed, setClaimed] = useState<boolean>(false);

  /* Protege a rota: sem sessão → volta para o login */
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
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
    });
    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const firstName = user?.name.split(" ")[0] ?? "";

  const openLesson = (node: TrailNode): void => {
    if (node.status === "locked") return;
    setSelectedLesson({ name: node.name, xp: node.xp });
  };

  const closeLesson = (): void => setSelectedLesson(null);

  /* fechar modal no Esc */
  useEffect(() => {
    if (!selectedLesson) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") closeLesson();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedLesson]);

  const modalXp = selectedLesson?.xp ? `+${selectedLesson.xp} XP` : "+0 XP";

  if (checking || !user) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          color: "var(--muted)",
        }}
      >
        <p className="display" style={{ fontSize: 22 }}>
          Abrindo seu portal…
        </p>
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
            <span className="pill" title="Ofensiva: 7 dias seguidos">
              🔥 <b>7</b>
            </span>
            <span className="pill gold" title="Gold disponível">
              💎 <b className="mono">1.250</b>
            </span>
            <span className="pill lives" title="Vidas restantes">
              ❤️ <b>5</b>
            </span>
            <button className="player-chip" title={`${user.name} · Nível 24`}>
              <span className="pc-ava">🥷</span>
              <span className="pc-meta">
                <small>{user.name}</small>
                <b className="display">NÍVEL 24</b>
              </span>
            </button>
            <button
              className="pill"
              type="button"
              onClick={handleLogout}
              title="Sair da conta"
              aria-label="Sair da conta"
            >
              🚪 <b>Sair</b>
            </button>
          </div>
        </div>
      </header>

      {/* ===================== SHELL ===================== */}
      <div className="app-shell">
        {/* ---------- SIDEBAR ---------- */}
        <aside
          className={sidebarOpen ? "app-side open" : "app-side"}
          id="appSide"
        >
          <nav className="side-nav">
            {sideLinks.map((link) => (
              <button
                key={link.id}
                className={link.active ? "side-link active" : "side-link"}
                type="button"
              >
                <span className="si">{link.icon}</span> {link.label}
              </button>
            ))}
          </nav>

          <div className="side-promo panel glow corner">
            <p className="eyebrow" style={{ fontSize: "11px" }}>
              Caçador
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "var(--muted)",
                margin: "6px 0 12px",
              }}
            >
              Desbloqueie missões ilimitadas e o tutor de IA.
            </p>
            <Link
              href="/login"
              className="btn block"
              style={{ fontSize: "13px", padding: "11px 14px" }}
            >
              Despertar poder
            </Link>
          </div>
        </aside>

        {/* ---------- MAIN ---------- */}
        <main className="app-main">
          {/* Saudação + barra de nível */}
          <section className="hero-greet panel glow corner">
            <div className="hg-left">
              <p className="eyebrow">Bem-vindo de volta</p>
              <h1
                className="display"
                style={{
                  fontSize: "clamp(28px,4.5vw,42px)",
                  margin: "6px 0 18px",
                }}
              >
                Bom te ver, <span className="r">{firstName}.</span>
              </h1>
              <div className="lvl-row">
                <span className="lvl-badge display">24</span>
                <div className="lvl-prog">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      color: "var(--muted)",
                      marginBottom: "8px",
                    }}
                  >
                    <span>NÍVEL 24 · Warrior</span>
                    <span className="mono">2.450 / 3.000 XP</span>
                  </div>
                  <div className="xpbar">
                    <i style={{ width: "81%" }} />
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--faint)",
                      marginTop: "8px",
                    }}
                  >
                    Faltam{" "}
                    <b style={{ color: "var(--accent-3)" }}>550 XP</b> para o
                    Nível 25.
                  </p>
                </div>
              </div>
            </div>
            <div className="hg-hex hex">
              <span className="ic">🐉</span>
            </div>
          </section>

          {/* ===== TRILHA DE HOJE ===== */}
          <section className="trail-wrap">
            <div className="sec-title">
              <h2 className="display">
                Trilha de <span className="r">hoje</span>
              </h2>
              <span className="chip">🔥 Sequência de 7 dias</span>
            </div>
            <p className="sec-sub">
              Avance nó a nó. Conclua o atual para desbloquear o próximo
              desafio.
            </p>

            <div className="trail" role="list">
              {trailNodes.map((node) => {
                const classes = [
                  "node",
                  node.boss ? "boss" : "",
                  node.status,
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <button
                    key={node.id}
                    className={classes}
                    data-name={node.name}
                    data-xp={node.xp ?? ""}
                    role="listitem"
                    aria-label={node.ariaLabel}
                    disabled={node.status === "locked"}
                    onClick={() => openLesson(node)}
                  >
                    <span className="hex">
                      <span className="ic">{node.icon}</span>
                    </span>
                    {node.flag && (
                      <span
                        className={node.boss ? "node-flag boss-flag" : "node-flag"}
                      >
                        {node.flag}
                      </span>
                    )}
                    <span className="node-label">{node.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ===== MISSÕES DIÁRIAS ===== */}
          <section
            id="missoes"
            className="panel glow"
            style={{ padding: "26px", marginTop: "8px" }}
          >
            <div className="sec-title" style={{ marginBottom: "6px" }}>
              <h2 className="display" style={{ fontSize: "24px" }}>
                Missões <span className="r">diárias</span>
              </h2>
              <span style={{ fontSize: "12px", color: "var(--faint)" }}>
                Renova em{" "}
                <b className="mono" style={{ color: "var(--accent-3)" }}>
                  08h 42m
                </b>
              </span>
            </div>
            <p className="sec-sub" style={{ marginBottom: "20px" }}>
              Complete as missões antes da meia-noite e mantenha sua ofensiva
              viva.
            </p>

            <div className="missions">
              {missions.map((m) => (
                <div
                  key={m.id}
                  className={m.done ? "mission done" : "mission"}
                >
                  <span className="mi">{m.icon}</span>
                  <div className="mt">
                    <b>{m.title}</b>
                    <small>{m.reward}</small>
                    <div className="xpbar mission-bar">
                      <i style={{ width: `${m.progress}%` }} />
                    </div>
                  </div>
                  {m.done ? (
                    <button
                      className="btn gold mission-claim"
                      style={{
                        fontSize: "12px",
                        padding: "8px 14px",
                        ...(claimed
                          ? { opacity: 0.6, cursor: "default" }
                          : {}),
                      }}
                      disabled={claimed}
                      onClick={() => setClaimed(true)}
                    >
                      {claimed ? "Resgatado ✓" : "Resgatar"}
                    </button>
                  ) : (
                    <span className="mp mono">{m.count}</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ===== BOSS DA SEMANA ===== */}
          <section className="boss-card panel glow corner">
            <div className="boss-aura" />
            <div className="boss-content">
              <p className="eyebrow">Evento da semana</p>
              <h2
                className="display"
                style={{ fontSize: "clamp(24px,4vw,36px)", margin: "8px 0 10px" }}
              >
                Boss da Semana:
                <br />
                <span
                  className="r"
                  style={{ textShadow: "0 0 28px var(--glow)" }}
                >
                  O Dragão do Listening
                </span>
              </h2>
              <p
                style={{
                  color: "var(--muted)",
                  maxWidth: "420px",
                  marginBottom: "8px",
                }}
              >
                Encare 10 desafios de compreensão auditiva em sequência.
                Sobreviva e prove que seu ouvido é digno de um caçador de elite.
              </p>
              <div className="boss-rewards">
                <span className="chip">🏆 Moldura &quot;Domador de Dragões&quot;</span>
                <span
                  className="chip"
                  style={{
                    color: "var(--gold)",
                    borderColor: "rgba(255,182,39,.4)",
                    background: "rgba(255,182,39,.1)",
                  }}
                >
                  💎 +1.000 Gold
                </span>
                <span className="chip">⚡ +800 XP</span>
              </div>
              <div className="boss-timer">
                Termina em{" "}
                <b className="mono" style={{ color: "var(--accent-3)" }}>
                  2d 14h 06m
                </b>
              </div>
              <a href="#" className="btn lg boss-btn">
                Enfrentar boss <span className="arrow">⚔️</span>
              </a>
            </div>
            <div className="boss-emoji">🐲</div>
          </section>
        </main>

        {/* ---------- ASIDE ---------- */}
        <aside className="app-aside">
          {/* Mini-ranking da guilda */}
          <div className="panel glow" style={{ padding: "22px" }}>
            <div className="aside-head">
              <h3 className="display" style={{ fontSize: "18px" }}>
                Liga da <span className="r">Guilda</span>
              </h3>
              <span className="chip" style={{ fontSize: "11px" }}>
                Divisão Rubi
              </span>
            </div>
            <ol className="rank-list">
              {rankRows.map((row) => (
                <li key={row.pos} className={row.you ? "me" : undefined}>
                  <span className="pos">{row.pos}</span>
                  <span className="pa">{row.avatar}</span>
                  <span className="pn">
                    {row.name}
                    {row.you && <em> · você</em>}
                  </span>
                  <span className="px mono">{row.xp}</span>
                </li>
              ))}
            </ol>
            <a
              href="#"
              className="btn ghost block"
              style={{ marginTop: "14px", fontSize: "13px", padding: "11px" }}
            >
              Ver liga completa
            </a>
          </div>

          {/* Ofensiva da semana */}
          <div className="panel glow" style={{ padding: "22px" }}>
            <div className="aside-head">
              <h3 className="display" style={{ fontSize: "18px" }}>
                Ofensiva <span className="r">🔥</span>
              </h3>
              <b
                className="display"
                style={{ fontSize: "22px", color: "var(--accent-3)" }}
              >
                7 dias
              </b>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "var(--muted)",
                margin: "4px 0 16px",
              }}
            >
              Você está em chamas! Não quebre a corrente hoje.
            </p>
            <div className="streak-week">
              {streakDays.map((day) => (
                <span
                  key={day.id}
                  className={day.state === "today" ? "day today" : "day on"}
                >
                  {day.label}
                  <i>{day.icon}</i>
                </span>
              ))}
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "var(--faint)",
                marginTop: "14px",
              }}
            >
              Conclua a trilha de hoje para garantir o{" "}
              <b style={{ color: "var(--text)" }}>dia 8</b>.
            </p>
          </div>

          {/* Próxima recompensa */}
          <div className="panel glow corner" style={{ padding: "22px" }}>
            <h3
              className="display"
              style={{ fontSize: "18px", marginBottom: "14px" }}
            >
              Próxima <span className="r">recompensa</span>
            </h3>
            <div className="next-reward">
              <div className="nr-hex hex">
                <span className="ic">🎭</span>
              </div>
              <div>
                <b style={{ display: "block", fontSize: "15px" }}>
                  Avatar &quot;Monarca das Sombras&quot;
                </b>
                <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                  Desbloqueia no Nível 25
                </small>
              </div>
            </div>
            <div style={{ marginTop: "14px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "var(--muted)",
                  marginBottom: "6px",
                }}
              >
                <span>Progresso</span>
                <span className="mono">550 XP restantes</span>
              </div>
              <div className="xpbar">
                <i style={{ width: "81%" }} />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ===================== MODAL DE LIÇÃO ===================== */}
      <div
        className="modal-overlay"
        id="lessonModal"
        hidden={!selectedLesson}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLesson();
        }}
      >
        <div
          className="modal panel glow corner"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <button
            className="modal-close"
            aria-label="Fechar"
            onClick={closeLesson}
          >
            ✕
          </button>
          <div className="modal-hex hex">
            <span className="ic">⚡</span>
          </div>
          <p className="eyebrow" style={{ textAlign: "center" }}>
            Próxima lição
          </p>
          <h3
            className="display"
            id="modalTitle"
            style={{ fontSize: "26px", textAlign: "center", margin: "6px 0 4px" }}
          >
            {selectedLesson?.name ?? "Verbo To Be"}
          </h3>
          <p
            className="modal-xp"
            style={{
              textAlign: "center",
              color: "var(--gold)",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Recompensa: <span id="modalXp">{modalXp}</span>
          </p>
          <a href="#" className="btn block lg">
            Iniciar lição <span className="arrow">→</span>
          </a>
          <button
            className="btn ghost block modal-cancel"
            style={{ marginTop: "10px", fontSize: "13px", padding: "11px" }}
            onClick={closeLesson}
          >
            Agora não
          </button>
        </div>
      </div>
    </>
  );
}
