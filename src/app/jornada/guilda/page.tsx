"use client";

import DashboardShell from "@/components/DashboardShell";
import "@/styles/dashboard.css";

const members = [
  { badge: "lendario", name: "AnimeKing", role: "Líder", xp: "8.310" },
  { badge: "mestre", name: "SoloPlayer", role: "Oficial", xp: "7.450" },
  { badge: "diamante", name: "Lunatic", role: "Membro", xp: "5.760" },
  { badge: "rubi", name: "EternalStudent", role: "Membro", xp: "4.980" },
  { badge: "bronze", name: "Você", role: "Recruta", you: true, xp: "0" },
];

export default function GuildaPage() {
  return (
    <DashboardShell noAside requiresLevel={10}>
      <main className="app-main">
        <section className="hero-greet panel glow corner">
          <div className="hg-left">
            <p className="eyebrow">Sua irmandade</p>
            <h1 className="display" style={{ fontSize: "clamp(28px,4.5vw,40px)", margin: "6px 0 8px" }}>
              Guilda <span className="r">Caçadores da Aurora</span>
            </h1>
            <p style={{ color: "var(--muted)", maxWidth: 460 }}>
              Estude com a guilda, some XP coletivo e suba de divisão juntos. Vocês estão na <b style={{ color: "var(--accent-3)" }}>Divisão Bronze</b>.
            </p>
            <div className="boss-rewards" style={{ marginTop: 14 }}>
              <span className="chip">👥 5 membros</span>
              <span className="chip">⚡ 27.500 XP da guilda</span>
              <span className="chip" style={{ color: "var(--gold)", borderColor: "rgba(255,182,39,.4)", background: "rgba(255,182,39,.1)" }}>🏆 Top 12% mundial</span>
            </div>
          </div>
          <div className="hg-hex hex"><span className="ic">⚔️</span></div>
        </section>

        <section className="panel glow" style={{ padding: "26px" }}>
          <div className="sec-title" style={{ marginBottom: "16px" }}>
            <h2 className="display" style={{ fontSize: "24px" }}>Membros da <span className="r">guilda</span></h2>
            <span className="chip" style={{ fontSize: "11px" }}>Meta semanal: 40.000 XP</span>
          </div>
          <ol className="rank-list">
            {members.map((m, i) => (
              <li key={m.name} className={m.you ? "me" : undefined}>
                <span className="pos">{i + 1}</span>
                <span className="pa"><img src={`/icons/ranking_liga/${m.badge}.svg`} alt="" aria-hidden="true" /></span>
                <span className="pn">{m.name}{m.you && <em> · você</em>} <small>{m.role}</small></span>
                <span className="px mono">{m.xp}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </DashboardShell>
  );
}
