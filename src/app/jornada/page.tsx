"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DashboardShell from "@/components/DashboardShell";
import { IconLock, IconMail } from "@/components/icons";
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

/* Regiões do mapa da jornada (posições no palco via classes .r1..r5) */
const REGIONS = [
  { id: "vila", num: "01", name: "Vila Inicial", scene: "vila" },
  { id: "floresta", num: "02", name: "Floresta das Palavras", scene: "floresta" },
  { id: "montanha", num: "03", name: "Montanha da Gramática", scene: "montanha" },
  { id: "castelo", num: "04", name: "Castelo da Conversação", scene: "castelo" },
  { id: "trono", num: "05", name: "Trono do Monarca", scene: "trono" },
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
  const currentNode = trailNodes.find((n) => n.status === "current") ?? trailNodes[0];
  const regionTotal = 10;
  const regionDone = Math.min(completed.length, regionTotal);
  const openCurrent = () => currentNode && openLesson(currentNode);

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
          {/* hero mobile: seletor de capítulo + coluna esquerda */}
          <div className="dash-hero">
            <div className="chapter">
              <span className="chapter-eyebrow">Capítulo 1</span>
              <h2 className="chapter-title display">{REGIONS[0].name}</h2>
              <span className="chapter-sub">Lições <b>{regionDone}/{regionTotal}</b></span>
            </div>

            <div className="hero-side">
              {/* Season Pass (pulsando) */}
              <button type="button" className="hero-sidebtn season-pass">
                <span className="hsb-ic"><img src="/icons/ranking_liga/lendario.svg" alt="" aria-hidden="true" /></span>
                <small>Season Pass</small>
              </button>

              <button type="button" className="hero-sidebtn">
                <span className="hsb-ic"><img src="/icons/conquistas/sete_dias.svg" alt="" aria-hidden="true" /></span>
                <small>Check-in</small>
              </button>
              <button type="button" className="hero-sidebtn">
                <span className="hsb-ic"><img src="/icons/missoes/evento.svg" alt="" aria-hidden="true" /></span>
                <small>Evento</small>
              </button>
              <Link href="/jornada/ranking" className="hero-sidebtn">
                <span className="hsb-ic"><img src="/icons/menu/ranking.svg" alt="" aria-hidden="true" /></span>
                <small>Ranking</small>
              </Link>
            </div>

            <div className="hero-side right">
              <button type="button" className="hero-sidebtn">
                <span className="hsb-ic"><img src="/icons/recompensas_epicas/bau_epico.svg" alt="" aria-hidden="true" /></span>
                <small>Mochila</small>
              </button>
              <button type="button" className="hero-sidebtn">
                <span className="hsb-ic"><IconMail width={28} height={28} /></span>
                <small>Correios</small>
              </button>
              <button type="button" className="hero-sidebtn">
                <span className="hsb-ic"><img src="/icons/conquistas/guilda.svg" alt="" aria-hidden="true" /></span>
                <small>Convidar</small>
              </button>
            </div>

            {/* personagem correndo no chão */}
            <img className="hero-runner" src="/runner.webp" alt="" aria-hidden="true" />

            {/* base do hero: Boss (esq) e Dungeon (dir) */}
            <div className="hero-bottom">
              <button type="button" className="hero-mode boss">
                <span className="hm-ic"><img src="/icons/missoes/boss_battle.svg" alt="" aria-hidden="true" /></span>
                <span className="hm-txt"><b>Boss</b><small>Desafio da semana</small></span>
              </button>
              <button type="button" className="hero-mode dungeon">
                <span className="hm-ic"><img src="/icons/missoes/desafios.svg" alt="" aria-hidden="true" /></span>
                <span className="hm-txt"><b>Dungeon</b><small>Treino intenso</small></span>
              </button>
            </div>
          </div>

          <div className="dash-content">
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

          {/* ===== MAPA DA JORNADA ===== */}
          <section className="map-wrap panel glow corner">
            <div className="sec-title">
              <h2 className="display">Mapa da <span className="r">jornada</span></h2>
              <button type="button" className="btn ghost map-details-btn" onClick={openCurrent}>
                Ver detalhes da região
              </button>
            </div>
            <p className="sec-sub">
              Conclua as regiões para desbloquear novos desafios e evoluir como caçador.
            </p>

            <div className="map-stage">
              <svg className="map-path" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
                <path d="M160 180 C 300 140, 380 200, 470 198 C 580 196, 700 140, 800 205 C 905 275, 770 510, 600 468 C 490 442, 410 475, 300 492" />
              </svg>

              {REGIONS.map((r, i) => {
                const status = i === 0 ? "current" : "locked";
                const locked = status === "locked";
                return (
                  <button
                    key={r.id}
                    type="button"
                    className={`region r${i + 1} ${status}`}
                    disabled={locked}
                    aria-label={locked ? `${r.name} (bloqueado)` : `${r.name} — região atual`}
                    onClick={openCurrent}
                  >
                    {!locked && (
                      <span className="region-pin" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="26" height="26">
                          <path
                            d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Z"
                            fill="var(--accent)" stroke="#fff" strokeWidth="1.2"
                          />
                          <circle cx="12" cy="9" r="2.6" fill="#fff" />
                        </svg>
                      </span>
                    )}
                    <span className="region-art">
                      <img src={`/icons/mapa/${r.scene}.svg`} alt="" aria-hidden="true" />
                      {locked && (
                        <span className="region-lock" aria-hidden="true">
                          <IconLock width={22} height={22} />
                        </span>
                      )}
                    </span>
                    <span className="region-num display">{r.num}</span>
                    <span className="region-name display">{r.name}</span>
                    {locked ? (
                      <span className="region-tag">Bloqueado</span>
                    ) : (
                      <span className="region-prog">
                        <span className="mono">{regionDone} / {regionTotal}</span>
                        <span className="xpbar"><i style={{ width: `${(regionDone / regionTotal) * 100}%` }} /></span>
                      </span>
                    )}
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
          </div>
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
