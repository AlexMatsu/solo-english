"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DashboardShell from "@/components/DashboardShell";
import {
  getProfile,
  getCompletedLessons,
  xpIntoLevel,
  XP_PER_LEVEL,
  type Profile,
} from "@/lib/game";
import "@/styles/dashboard.css";

/* ---------- Tipos ---------- */
type NodeStatus = "done" | "current" | "locked";

interface BaseNode {
  id: string;
  name: string;
  label: string;
  icon: string;
  xp?: number;
  boss?: boolean;
  hasLesson?: boolean;
  requiresLevel?: number;
}

interface TrailNode extends BaseNode {
  status: NodeStatus;
  flag?: string;
  ariaLabel: string;
}

interface Mission {
  id: string;
  icon: string;
  title: string;
  reward: string;
  progress: number;
  count: string;
}

interface SelectedLesson {
  id: string;
  name: string;
  xp?: number;
  hasLesson?: boolean;
  locked?: boolean;
}

/* ---------- Lições da trilha (status calculado pelo progresso real) ---------- */
const BASE_NODES: BaseNode[] = [
  { id: "saudacoes", name: "Saudações", label: "Saudações", icon: "⚡", xp: 50, hasLesson: true },
  { id: "vocabulario", name: "Vocabulário do Dia", label: "Vocabulário", icon: "📚", xp: 60 },
  { id: "to-be", name: "Verbo To Be", label: "Verbo To Be", icon: "✏️", xp: 80 },
  { id: "listening", name: "Listening: Anime OST", label: "Listening: Anime OST", icon: "🎧", xp: 120 },
  { id: "speaking", name: "Speaking: Treino de Voz", label: "Speaking", icon: "🎙️", xp: 100 },
  { id: "boss", name: "Boss: Diálogo do Portão", label: "Diálogo do Portão", icon: "👹", xp: 500, boss: true, requiresLevel: 10 },
];

/* Calcula done/current/locked a partir das lições concluídas e do nível. */
function buildTrail(completed: string[], level: number): TrailNode[] {
  let currentSet = false;
  return BASE_NODES.map((n) => {
    const done = completed.includes(n.id);
    const levelLocked = n.requiresLevel != null && level < n.requiresLevel;
    let status: NodeStatus;
    let flag: string | undefined;

    if (done) {
      status = "done";
    } else if (levelLocked) {
      status = "locked";
      flag = `NÍVEL ${n.requiresLevel}`;
    } else if (!currentSet) {
      status = "current";
      currentSet = true;
      flag = n.boss ? "BOSS" : "VOCÊ ESTÁ AQUI";
    } else {
      status = "locked";
    }
    if (n.boss && status !== "locked") flag = "BOSS";

    return {
      ...n,
      status,
      flag,
      ariaLabel:
        status === "locked"
          ? `Lição bloqueada: ${n.name}`
          : status === "done"
          ? `Lição concluída: ${n.name}`
          : `Lição atual: ${n.name}. Iniciar.`,
    };
  });
}

const missions: Mission[] = [
  { id: "palavras", icon: "📚", title: "Aprenda 10 palavras novas", reward: "+50 XP · +20 Gold", progress: 0, count: "0/10" },
  { id: "listening", icon: "🎧", title: "Complete um listening", reward: "+80 XP", progress: 0, count: "0/1" },
  { id: "speaking", icon: "🎙️", title: "Faça 1 exercício de speaking", reward: "+100 XP", progress: 0, count: "0/1" },
  { id: "primeira", icon: "🛡️", title: "Conclua sua primeira lição", reward: "+30 XP", progress: 0, count: "0/1" },
];

const rankRows = [
  { pos: 1, badge: "bronze", name: "AnimeKing", xp: "60" },
  { pos: 2, badge: "bronze", name: "SoloPlayer", xp: "45" },
  { pos: 3, badge: "bronze", name: "Lunatic", xp: "35" },
  { pos: 4, badge: "bronze", name: "EternalStudent", xp: "20" },
  { pos: 5, badge: "bronze", name: "Você", you: true, xp: "0" },
];

const WELCOME_NEWS = [
  { icon: "trilha_aprendizado/reading", text: "Novas lições e trilhas de vocabulário, gramática e listening" },
  { icon: "missoes/boss_battle", text: "Bosses semanais com recompensas épicas" },
  { icon: "menu/guilda", text: "Guildas, ranking ao vivo e eventos com a comunidade" },
  { icon: "menu/loja", text: "Loja de avatares, skins e títulos exclusivos" },
];

const streakDays = [
  { id: "seg", label: "S" },
  { id: "ter", label: "T" },
  { id: "qua", label: "Q" },
  { id: "qui", label: "Q" },
  { id: "sex", label: "S" },
  { id: "sab", label: "S" },
  { id: "dom", label: "D", today: true },
];

export default function JornadaPage() {
  const [firstName, setFirstName] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<SelectedLesson | null>(null);
  const [welcome, setWelcome] = useState<string | null>(null);

  /* nome + perfil + progresso (sessão já validada pelo DashboardShell) */
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;
      if (!session) return;
      const meta = session.user.user_metadata as { name?: string };
      const name = meta.name ?? session.user.email?.split("@")[0] ?? "Aventureiro";
      const first = name.split(" ")[0];
      setFirstName(first);
      // toast de boas-vindas logo após o login (flag setada na tela de login)
      if (sessionStorage.getItem("welcomeBack")) {
        sessionStorage.removeItem("welcomeBack");
        setWelcome(first);
      }
      const [p, done] = await Promise.all([getProfile(), getCompletedLessons()]);
      if (p) setProfile(p);
      setCompleted(done);
    });
  }, []);

  /* fecha o modal de boas-vindas com Esc */
  useEffect(() => {
    if (!welcome) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setWelcome(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [welcome]);

  const level = profile?.level ?? 1;
  const xp = profile?.xp ?? 0;
  const xpInLevel = xpIntoLevel(xp);
  const trailNodes = buildTrail(completed, level);

  const openLesson = (node: TrailNode) => {
    if (node.status === "locked") return;
    setSelectedLesson({ id: node.id, name: node.name, xp: node.xp, hasLesson: node.hasLesson });
  };
  const closeLesson = () => setSelectedLesson(null);

  useEffect(() => {
    if (!selectedLesson) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeLesson();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedLesson]);

  const modalXp = selectedLesson?.xp ? `+${selectedLesson.xp} XP` : "+0 XP";

  return (
    <>
      {/* Modal de boas-vindas (aparece após login bem-sucedido) */}
      <div
        className="modal-overlay"
        hidden={!welcome}
        onClick={(e) => {
          if (e.target === e.currentTarget) setWelcome(null);
        }}
      >
        <div className="modal welcome-modal panel glow corner" role="dialog" aria-modal="true" aria-labelledby="welcomeTitle">
          <button className="modal-close" aria-label="Fechar" onClick={() => setWelcome(null)}>✕</button>
          <div className="welcome-orb" aria-hidden="true">
            <span className="welcome-orb-ring" />
            <span className="welcome-orb-ring delay" />
            <img className="welcome-orb-ic" src="/icons/classes/warrior.svg" alt="" />
          </div>
          <p className="eyebrow" style={{ textAlign: "center" }}>Sua jornada começa agora</p>
          <h2 className="display" id="welcomeTitle" style={{ fontSize: "clamp(28px,5vw,40px)", textAlign: "center", margin: "6px 0 12px" }}>
            Bem-vindo, <span className="r">{welcome}!</span>
          </h2>
          <p className="welcome-lead">
            Que bom te ver por aqui! O <b>Solo English</b> está em plena evolução —
            e você chegou cedo na aventura.
          </p>
          <div className="welcome-news">
            <p className="welcome-news-title">Em breve na sua jornada</p>
            <ul>
              {WELCOME_NEWS.map((n) => (
                <li key={n.text}>
                  <img src={`/icons/${n.icon}.svg`} alt="" aria-hidden="true" />
                  {n.text}
                </li>
              ))}
            </ul>
          </div>
          <button className="btn block lg" onClick={() => setWelcome(null)}>
            Começar minha jornada <span className="arrow">→</span>
          </button>
        </div>
      </div>

      <DashboardShell>
        {/* ---------- MAIN ---------- */}
        <main className="app-main">
          {/* Saudação + barra de nível */}
          <section className="hero-greet panel glow corner">
            <div className="hg-left">
              <p className="eyebrow">Bem-vindo, caçador</p>
              <h1 className="display" style={{ fontSize: "clamp(28px,4.5vw,42px)", margin: "6px 0 18px" }}>
                Bom te ver, <span className="r">{firstName || "Aventureiro"}.</span>
              </h1>
              <div className="lvl-row">
                <span className="lvl-badge display">{level}</span>
                <div className="lvl-prog">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--muted)", marginBottom: "8px" }}>
                    <span>NÍVEL {level} · {level < 10 ? "Beginner" : "Warrior"}</span>
                    <span className="mono">{xpInLevel} / {XP_PER_LEVEL} XP</span>
                  </div>
                  <div className="xpbar"><i style={{ width: `${(xpInLevel / XP_PER_LEVEL) * 100}%` }} /></div>
                  <p style={{ fontSize: "12px", color: "var(--faint)", marginTop: "8px" }}>
                    Faltam <b style={{ color: "var(--accent-3)" }}>{XP_PER_LEVEL - xpInLevel} XP</b> para o Nível {level + 1}.
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
              <h2 className="display">Trilha de <span className="r">hoje</span></h2>
              <span className="chip">🔥 Comece sua ofensiva</span>
            </div>
            <p className="sec-sub">Avance nó a nó. Conclua o atual para desbloquear o próximo desafio.</p>

            <div className="trail" role="list">
              {trailNodes.map((node) => {
                const classes = ["node", node.boss ? "boss" : "", node.status].filter(Boolean).join(" ");
                return (
                  <button
                    key={node.id}
                    className={classes}
                    role="listitem"
                    aria-label={node.ariaLabel}
                    disabled={node.status === "locked"}
                    onClick={() => openLesson(node)}
                  >
                    <span className="hex"><span className="ic">{node.icon}</span></span>
                    {node.flag && (
                      <span className={node.boss ? "node-flag boss-flag" : "node-flag"}>{node.flag}</span>
                    )}
                    <span className="node-label">{node.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ===== MISSÕES DIÁRIAS ===== */}
          <section className="panel glow" style={{ padding: "26px", marginTop: "8px" }}>
            <div className="sec-title" style={{ marginBottom: "6px" }}>
              <h2 className="display" style={{ fontSize: "24px" }}>Missões <span className="r">diárias</span></h2>
              <span style={{ fontSize: "12px", color: "var(--faint)" }}>
                Renova em <b className="mono" style={{ color: "var(--accent-3)" }}>08h 42m</b>
              </span>
            </div>
            <p className="sec-sub" style={{ marginBottom: "20px" }}>
              Complete as missões antes da meia-noite e mantenha sua ofensiva viva.
            </p>

            <div className="missions">
              {missions.map((m) => (
                <div key={m.id} className="mission">
                  <span className="mi">{m.icon}</span>
                  <div className="mt">
                    <b>{m.title}</b>
                    <small>{m.reward}</small>
                    <div className="xpbar mission-bar"><i style={{ width: `${m.progress}%` }} /></div>
                  </div>
                  <span className="mp mono">{m.count}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ===== BOSS DA SEMANA ===== */}
          <section className="boss-card panel glow corner">
            <div className="boss-aura" />
            <div className="boss-content">
              <p className="eyebrow">Evento da semana</p>
              <h2 className="display" style={{ fontSize: "clamp(24px,4vw,36px)", margin: "8px 0 10px" }}>
                Boss da Semana:
                <br />
                <span className="r" style={{ textShadow: "0 0 28px var(--glow)" }}>O Dragão do Listening</span>
              </h2>
              <p style={{ color: "var(--muted)", maxWidth: "420px", marginBottom: "8px" }}>
                Encare 10 desafios de compreensão auditiva em sequência. Sobreviva e prove que seu ouvido é digno de um caçador de elite.
              </p>
              <div className="boss-rewards">
                <span className="chip">🏆 Moldura &quot;Domador de Dragões&quot;</span>
                <span className="chip" style={{ color: "var(--gold)", borderColor: "rgba(255,182,39,.4)", background: "rgba(255,182,39,.1)" }}>💎 +1.000 Gold</span>
                <span className="chip">⚡ +800 XP</span>
              </div>
              <div className="boss-timer">
                Termina em <b className="mono" style={{ color: "var(--accent-3)" }}>2d 14h 06m</b>
              </div>
              <a href="#" className="btn lg boss-btn">Enfrentar boss <span className="arrow">⚔️</span></a>
            </div>
            <div className="boss-emoji">🐲</div>
          </section>
        </main>

        {/* ---------- ASIDE ---------- */}
        <aside className="app-aside">
          {/* Mini-ranking da guilda */}
          <div className="panel glow" style={{ padding: "22px" }}>
            <div className="aside-head">
              <h3 className="display" style={{ fontSize: "18px" }}>Liga da <span className="r">Guilda</span></h3>
              <span className="chip" style={{ fontSize: "11px" }}>Divisão Bronze</span>
            </div>
            <ol className="rank-list">
              {rankRows.map((row) => (
                <li key={row.pos} className={row.you ? "me" : undefined}>
                  <span className="pos">{row.pos}</span>
                  <span className="pa"><img src={`/icons/ranking_liga/${row.badge}.svg`} alt="" aria-hidden="true" /></span>
                  <span className="pn">{row.name}{row.you && <em> · você</em>}</span>
                  <span className="px mono">{row.xp}</span>
                </li>
              ))}
            </ol>
            <Link href="/jornada/ranking" className="btn ghost block" style={{ marginTop: "14px", fontSize: "13px", padding: "11px" }}>
              Ver liga completa
            </Link>
          </div>

          {/* Ofensiva da semana */}
          <div className="panel glow" style={{ padding: "22px" }}>
            <div className="aside-head">
              <h3 className="display" style={{ fontSize: "18px" }}>Ofensiva <span className="r">🔥</span></h3>
              <b className="display" style={{ fontSize: "22px", color: "var(--accent-3)" }}>0 dias</b>
            </div>
            <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 16px" }}>
              Conclua uma lição hoje para iniciar sua ofensiva!
            </p>
            <div className="streak-week">
              {streakDays.map((day) => (
                <span key={day.id} className={day.today ? "day today" : "day off"}>
                  {day.label}
                  <i>{day.today ? "🔥" : "·"}</i>
                </span>
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "var(--faint)", marginTop: "14px" }}>
              Conclua a trilha de hoje para garantir o <b style={{ color: "var(--text)" }}>dia 1</b>.
            </p>
          </div>

          {/* Próxima recompensa */}
          <div className="panel glow corner" style={{ padding: "22px" }}>
            <h3 className="display" style={{ fontSize: "18px", marginBottom: "14px" }}>Próxima <span className="r">recompensa</span></h3>
            <div className="next-reward">
              <div className="nr-hex hex"><span className="ic">🎭</span></div>
              <div>
                <b style={{ display: "block", fontSize: "15px" }}>Avatar &quot;Aprendiz Desperto&quot;</b>
                <small style={{ color: "var(--muted)", fontSize: "12px" }}>Desbloqueia no Nível 2</small>
              </div>
            </div>
            <div style={{ marginTop: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--muted)", marginBottom: "6px" }}>
                <span>Progresso</span>
                <span className="mono">100 XP restantes</span>
              </div>
              <div className="xpbar"><i style={{ width: "0%" }} /></div>
            </div>
          </div>
        </aside>
      </DashboardShell>

      {/* ===================== MODAL DE LIÇÃO ===================== */}
      <div
        className="modal-overlay"
        hidden={!selectedLesson}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLesson();
        }}
      >
        <div className="modal panel glow corner" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <button className="modal-close" aria-label="Fechar" onClick={closeLesson}>✕</button>
          <div className="modal-hex hex"><span className="ic">⚡</span></div>
          <p className="eyebrow" style={{ textAlign: "center" }}>Próxima lição</p>
          <h3 className="display" id="modalTitle" style={{ fontSize: "26px", textAlign: "center", margin: "6px 0 4px" }}>
            {selectedLesson?.name ?? "Saudações"}
          </h3>
          <p className="modal-xp" style={{ textAlign: "center", color: "var(--gold)", fontWeight: 600, marginBottom: "20px" }}>
            Recompensa: <span>{modalXp}</span>
          </p>
          {selectedLesson?.hasLesson ? (
            <Link href={`/jornada/licao/${selectedLesson.id}`} className="btn block lg">
              Iniciar lição <span className="arrow">→</span>
            </Link>
          ) : (
            <button className="btn block lg" disabled style={{ opacity: 0.55, cursor: "default" }}>
              Em breve
            </button>
          )}
          <button className="btn ghost block modal-cancel" style={{ marginTop: "10px", fontSize: "13px", padding: "11px" }} onClick={closeLesson}>
            Agora não
          </button>
        </div>
      </div>
    </>
  );
}
