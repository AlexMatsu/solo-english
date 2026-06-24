"use client";

import DashboardShell from "@/components/DashboardShell";
import "@/styles/dashboard.css";

const items = [
  { icon: "avatares", name: "Avatares", price: "500" },
  { icon: "skins", name: "Skins", price: "800" },
  { icon: "titulos", name: "Títulos", price: "300" },
  { icon: "molduras", name: "Molduras", price: "650" },
  { icon: "emotes", name: "Emotes", price: "250" },
  { icon: "mascotes", name: "Mascotes", price: "1.200" },
  { icon: "cristais", name: "Cristais de XP", price: "400" },
  { icon: "bau_epico", name: "Baú Épico", price: "1.500" },
];

export default function LojaPage() {
  return (
    <DashboardShell noAside requiresLevel={10}>
      <main className="app-main">
        <section className="hero-greet panel glow corner">
          <div className="hg-left">
            <p className="eyebrow">Mercado do caçador</p>
            <h1 className="display" style={{ fontSize: "clamp(28px,4.5vw,40px)", margin: "6px 0 8px" }}>
              <span className="r">Loja</span> de recompensas
            </h1>
            <p style={{ color: "var(--muted)", maxWidth: 460 }}>
              Troque suas gemas por skins, avatares, molduras e itens que turbinam sua evolução.
            </p>
            <div className="boss-rewards" style={{ marginTop: 14 }}>
              <span className="chip" style={{ color: "var(--gold)", borderColor: "rgba(255,182,39,.4)", background: "rgba(255,182,39,.1)" }}>
                <img src="/icons/recursos_topo/gemas.svg" alt="" aria-hidden="true" style={{ width: 16, height: 16 }} /> Você tem 0 gemas
              </span>
            </div>
          </div>
          <div className="hg-hex hex"><span className="ic">💎</span></div>
        </section>

        {/* Upsell do plano */}
        <section className="boss-card panel glow corner">
          <div className="boss-aura" />
          <div className="boss-content">
            <p className="eyebrow">Plano Caçador</p>
            <h2 className="display" style={{ fontSize: "clamp(22px,3.5vw,30px)", margin: "8px 0 10px" }}>
              Desbloqueie <span className="r">tudo</span>
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: 420, marginBottom: 14 }}>
              Missões ilimitadas, tutor de IA 24h, sem anúncios e itens exclusivos da loja.
            </p>
            <a href="/cadastro" className="btn lg boss-btn">Despertar poder <span className="arrow">→</span></a>
          </div>
          <div className="boss-emoji">👑</div>
        </section>

        <section className="panel glow" style={{ padding: "26px" }}>
          <div className="sec-title" style={{ marginBottom: "16px" }}>
            <h2 className="display" style={{ fontSize: "24px" }}>Itens <span className="r">cosméticos</span></h2>
          </div>
          <div className="store-grid">
            {items.map((it) => (
              <div key={it.icon} className="store-item">
                <img src={`/icons/recompensas_epicas/${it.icon}.svg`} alt="" aria-hidden="true" />
                <b>{it.name}</b>
                <span className="price">
                  <img src="/icons/recursos_topo/gemas.svg" alt="" aria-hidden="true" /> {it.price}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}
