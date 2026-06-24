"use client";

import DashboardShell from "@/components/DashboardShell";
import "@/styles/dashboard.css";

const daily = [
  { id: "palavras", icon: "📚", title: "Aprenda 10 palavras novas", reward: "+50 XP · +20 Gold", progress: 0, count: "0/10" },
  { id: "listening", icon: "🎧", title: "Complete um listening", reward: "+80 XP", progress: 0, count: "0/1" },
  { id: "speaking", icon: "🎙️", title: "Faça 1 exercício de speaking", reward: "+100 XP", progress: 0, count: "0/1" },
  { id: "primeira", icon: "🛡️", title: "Conclua sua primeira lição", reward: "+30 XP", progress: 0, count: "0/1" },
];

const weekly = [
  { id: "streak", icon: "🔥", title: "Mantenha 7 dias de ofensiva", reward: "+500 XP · Moldura exclusiva", progress: 0, count: "0/7" },
  { id: "boss", icon: "👹", title: "Derrote o Boss da Semana", reward: "+800 XP · +1.000 Gold", progress: 0, count: "0/1" },
  { id: "licoes", icon: "⚡", title: "Complete 20 lições", reward: "+400 XP", progress: 0, count: "0/20" },
];

export default function MissoesPage() {
  return (
    <DashboardShell noAside>
      <main className="app-main">
        <section className="hero-greet panel glow corner">
          <div className="hg-left">
            <p className="eyebrow">Central de</p>
            <h1 className="display" style={{ fontSize: "clamp(28px,4.5vw,40px)", margin: "6px 0 8px" }}>
              Suas <span className="r">missões</span>
            </h1>
            <p style={{ color: "var(--muted)", maxWidth: 460 }}>
              Cumpra missões para ganhar XP, Gold e recompensas. As diárias renovam à meia-noite.
            </p>
          </div>
          <div className="hg-hex hex"><span className="ic">📜</span></div>
        </section>

        <section className="panel glow" style={{ padding: "26px" }}>
          <div className="sec-title" style={{ marginBottom: "6px" }}>
            <h2 className="display" style={{ fontSize: "24px" }}>Missões <span className="r">diárias</span></h2>
            <span style={{ fontSize: "12px", color: "var(--faint)" }}>Renova em <b className="mono" style={{ color: "var(--accent-3)" }}>08h 42m</b></span>
          </div>
          <div className="missions" style={{ marginTop: 16 }}>
            {daily.map((m) => (
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

        <section className="panel glow" style={{ padding: "26px" }}>
          <div className="sec-title" style={{ marginBottom: "16px" }}>
            <h2 className="display" style={{ fontSize: "24px" }}>Missões <span className="r">semanais</span></h2>
            <span className="chip" style={{ fontSize: "11px" }}>Reseta em 5 dias</span>
          </div>
          <div className="missions">
            {weekly.map((m) => (
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
      </main>
    </DashboardShell>
  );
}
