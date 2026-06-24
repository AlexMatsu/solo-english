"use client";

import { useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import "@/styles/dashboard.css";

const TABS = ["XP semanal", "Ofensiva", "Pronúncia"];

/* Todos na Divisão Bronze (iniciantes) — diferenças pequenas.
   Cada aba é um leaderboard com métrica e ordem própria. */
const BOARDS: { name: string; you?: boolean; val: string }[][] = [
  // XP semanal
  [
    { name: "AnimeKing", val: "120" },
    { name: "SoloPlayer", val: "105" },
    { name: "DarkMage", val: "90" },
    { name: "Lunatic", val: "80" },
    { name: "EternalStudent", val: "70" },
    { name: "KenjiX", val: "55" },
    { name: "SakuraFan", val: "45" },
    { name: "BladeRunner", val: "35" },
    { name: "NovaSensei", val: "20" },
    { name: "Você", you: true, val: "0" },
  ],
  // Ofensiva (dias seguidos)
  [
    { name: "SakuraFan", val: "6 dias" },
    { name: "KenjiX", val: "5 dias" },
    { name: "AnimeKing", val: "5 dias" },
    { name: "NovaSensei", val: "4 dias" },
    { name: "SoloPlayer", val: "4 dias" },
    { name: "Lunatic", val: "3 dias" },
    { name: "BladeRunner", val: "3 dias" },
    { name: "DarkMage", val: "2 dias" },
    { name: "EternalStudent", val: "2 dias" },
    { name: "Você", you: true, val: "0 dias" },
  ],
  // Pronúncia (precisão média)
  [
    { name: "NovaSensei", val: "78%" },
    { name: "BladeRunner", val: "75%" },
    { name: "SoloPlayer", val: "72%" },
    { name: "SakuraFan", val: "70%" },
    { name: "AnimeKing", val: "68%" },
    { name: "DarkMage", val: "65%" },
    { name: "KenjiX", val: "62%" },
    { name: "Lunatic", val: "59%" },
    { name: "EternalStudent", val: "56%" },
    { name: "Você", you: true, val: "—" },
  ],
];

export default function RankingPage() {
  const [tab, setTab] = useState(0);
  const rows = BOARDS[tab];
  return (
    <DashboardShell noAside>
      <main className="app-main">
        <section className="hero-greet panel glow corner">
          <div className="hg-left">
            <p className="eyebrow">Classificação mundial</p>
            <h1 className="display" style={{ fontSize: "clamp(28px,4.5vw,40px)", margin: "6px 0 8px" }}>
              Ranking <span className="r">mundial</span>
            </h1>
            <p style={{ color: "var(--muted)", maxWidth: 460 }}>
              Suba de divisão acumulando XP. Você está na <b style={{ color: "var(--accent-3)" }}>Divisão Bronze</b> — conclua lições para subir!
            </p>
          </div>
          <div className="hg-hex hex"><span className="ic">🏆</span></div>
        </section>

        <section className="panel glow" style={{ padding: "26px" }}>
          <div className="rank-tabs" style={{ marginBottom: 18 }}>
            {TABS.map((t, i) => (
              <button key={t} className={i === tab ? "active" : undefined} onClick={() => setTab(i)}>{t}</button>
            ))}
          </div>
          <ol className="rank-list">
            {rows.map((row, i) => (
              <li key={row.name} className={row.you ? "me" : undefined}>
                <span className="pos">{i + 1}</span>
                <span className="pa"><img src="/icons/ranking_liga/bronze.svg" alt="" aria-hidden="true" /></span>
                <span className="pn">{row.name}{row.you && <em> · você</em>} <small>Bronze</small></span>
                <span className="px mono">{row.val}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </DashboardShell>
  );
}
