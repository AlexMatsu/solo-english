"use client";

import { Fragment } from "react";
import Link from "next/link";
import TrailerButton from "@/components/TrailerButton";
import ScrollReveal from "@/components/ScrollReveal";
import Carousel from "@/components/Carousel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useT } from "@/i18n/LangContext";
import "@/styles/landing.css";

const LADDER = [
  { lv: "1", tier: "bronze", name: "Beginner" },
  { lv: "10", tier: "prata", name: "Explorer" },
  { lv: "20", tier: "ouro", name: "Warrior" },
  { lv: "35", tier: "rubi", name: "Elite" },
  { lv: "50", tier: "diamante", name: "Master" },
  { lv: "80", tier: "mestre", name: "Grand Master" },
  { lv: "100", tier: "lendario", name: "LEGEND", legend: true },
];
const REWARD_ICONS = [
  "avatares", "skins", "titulos", "molduras", "emotes", "armas", "mascotes", "bau_epico",
];
const RANK_ROWS = [
  { icon: "lendario", name: "ShadowHunter", xp: "25.680" },
  { icon: "mestre", name: "AnimeKing", xp: "24.310" },
  { icon: "diamante", name: "SoloPlayer", xp: "21.450" },
  { icon: "rubi", name: "Lunatic", xp: "18.760" },
  { icon: "ouro", name: "EternalStudent", xp: "17.980" },
];
const MISSION_ROWS = [
  { icon: "trilha_aprendizado/vocabulary", reward: "+50 XP · +20 Gold", prog: "0/10" },
  { icon: "trilha_aprendizado/listening", reward: "+80 XP", prog: "0/1" },
  { icon: "trilha_aprendizado/speaking", reward: "+100 XP", prog: "0/1" },
  { icon: "recursos_topo/streak", reward: "+200 XP", prog: "5/7", done: true },
];
const JOURNEY_ICONS = ["classes/warrior", "menu/missoes", "recursos_topo/xp", "recursos_topo/nivel"];
const TESTI = [
  { icon: "rubi", name: "Lucas T.", lvl: "32", tier: "Elite" },
  { icon: "diamante", name: "Mariana S.", lvl: "45", tier: "Master" },
  { icon: "ouro", name: "Gabriel M.", lvl: "28", tier: "Warrior" },
];
const FEAT_ICONS = ["missoes/desafios", "trilha_aprendizado/reading", "menu/guilda", "botoes_elementos/lock"];

export default function Home() {
  const t = useT();

  return (
    <>
      <Navbar />
      <ScrollReveal />

      {/* HERO */}
      <section id="inicio" className="section hero-bg" style={{ paddingTop: 72, overflow: "hidden" }}>
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-bg.png"
          aria-hidden="true"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="wrap hero-split">
          <div>
            <p className="eyebrow" style={{ marginBottom: 18 }}>{t.hero.eyebrow}</p>
            <h1 className="display" style={{ fontSize: "clamp(34px,4.6vw,58px)" }}>
              {t.hero.titleA}<br />{t.hero.titleB}<br />
              <span style={{ color: "var(--accent)", fontSize: "1.18em", textShadow: "0 0 28px var(--glow)" }}>
                {t.hero.titleHi}
              </span>
            </h1>
            <p style={{ color: "var(--muted)", fontSize: 18, maxWidth: 480, margin: "24px 0 32px" }}>
              {t.hero.subtitle}
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/cadastro" className="btn lg btn-bolt">
                <span className="btn-bolt-label">
                  {t.hero.ctaStart} <span className="arrow">→</span>
                </span>
              </Link>
              <TrailerButton />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 30 }}>
              <div style={{ display: "flex" }}>
                <span className="avatar-stack">🧝</span>
                <span className="avatar-stack">🥷</span>
                <span className="avatar-stack">🧛</span>
                <span className="avatar-stack">⚔️</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--muted)" }}>
                <b style={{ color: "var(--text)" }}>{t.hero.advNum}</b><br />
                {t.hero.advText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como" className="section alt">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">{t.journey.eyebrow}</p>
            <h2>{t.journey.titlePre} <span className="r">{t.journey.titleHi}</span></h2>
          </div>
          <Carousel className="journey">
            {t.journey.steps.map((step, i) => (
              <Fragment key={i}>
                {i > 0 ? <span className="jsep" aria-hidden="true">→</span> : null}
                <div className="jstep">
                  <div className="hex svg-badge">
                    <img className="ic-img" src={`/icons/${JOURNEY_ICONS[i]}.svg`} alt="" aria-hidden="true" />
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h4 className="display">{step.t}</h4>
                  <p>{step.d}</p>
                </div>
              </Fragment>
            ))}
          </Carousel>
        </div>
      </section>

      {/* RECURSOS: progressão / recompensas / ranking */}
      <section id="recursos" className="section">
        <div className="wrap cols-3">
          {/* Progressão */}
          <div className="panel glow" style={{ padding: 26 }}>
            <h3 className="display" style={{ fontSize: 20, marginBottom: 18 }}>
              {t.progression.titlePre} <span className="r">{t.progression.titleHi}</span>
            </h3>
            <ul className="ladder">
              {LADDER.map((row) => (
                <li key={row.lv} className={row.legend ? "legend" : undefined}>
                  <span className="lv mono">{row.lv}</span>{" "}
                  <img className="lig" src={`/icons/ranking_liga/${row.tier}.svg`} alt="" aria-hidden="true" />{" "}
                  <span>{row.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recompensas */}
          <div className="panel glow" style={{ padding: 26 }}>
            <h3 className="display" style={{ fontSize: 20 }}>{t.rewards.titlePre} <span className="r">{t.rewards.titleHi}</span></h3>
            <p style={{ color: "var(--muted)", fontSize: 14, margin: "8px 0 18px" }}>
              {t.rewards.subtitle}
            </p>
            <div className="reward-grid">
              {REWARD_ICONS.map((icon, i) => (
                <div className="reward" key={icon}>
                  <img src={`/icons/recompensas_epicas/${icon}.svg`} alt="" aria-hidden="true" />
                  <b>{t.rewards.items[i]}</b>
                </div>
              ))}
            </div>
            <Link href="/cadastro" className="btn ghost block">{t.rewards.cta}</Link>
          </div>

          {/* Ranking */}
          <div className="panel glow" style={{ padding: 26 }}>
            <h3 className="display" style={{ fontSize: 20, marginBottom: 16 }}>{t.ranking.titlePre} <span className="r">{t.ranking.titleHi}</span></h3>
            <div className="rank-tabs">
              {t.ranking.tabs.map((tab, i) => (
                <button key={tab} className={i === 0 ? "active" : undefined}>{tab}</button>
              ))}
            </div>
            <ol className="rank-list">
              {RANK_ROWS.map((row, i) => (
                <li key={row.name}>
                  <span className="pos">{i + 1}</span>
                  <span className="pa"><img src={`/icons/ranking_liga/${row.icon}.svg`} alt={t.ranking.tiers[i]} /></span>
                  <span className="pn">{row.name} <small>{t.ranking.tiers[i]}</small></span>
                  <span className="px mono">{row.xp}</span>
                </li>
              ))}
            </ol>
            <Link href="/cadastro" className="btn ghost block">{t.ranking.cta}</Link>
          </div>
        </div>

        {/* Missões diárias destaque */}
        <div className="wrap" style={{ marginTop: 24 }}>
          <div className="panel glow" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 12 }}>
              <h3 className="display" style={{ fontSize: 22 }}>{t.missions.titlePre} <span className="r">{t.missions.titleHi}</span></h3>
              <span className="chip">{t.missions.streak}</span>
            </div>
            <div className="missions">
              {MISSION_ROWS.map((m, i) => (
                <div className={`mission${m.done ? " done" : ""}`} key={i}>
                  <span className="mi"><img src={`/icons/${m.icon}.svg`} alt="" aria-hidden="true" /></span>
                  <div className="mt"><b>{t.missions.items[i]}</b><small>{m.reward}</small></div>
                  <span className="mp mono">{m.prog}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="section alt">
        <div className="wrap">
          <div className="section-head" style={{ textAlign: "center" }}>
            <h2>{t.testi.titlePre} <span className="r">{t.testi.titleHi}</span></h2>
          </div>
          <Carousel className="testi-grid">
            {TESTI.map((p, i) => (
              <figure className="panel glow" style={{ padding: 26 }} key={p.name}>
                <div className="stars">★★★★★</div>
                <blockquote>&quot;{t.testi.quotes[i]}&quot;</blockquote>
                <figcaption>
                  <span className="ava"><img src={`/icons/ranking_liga/${p.icon}.svg`} alt="" aria-hidden="true" /></span>
                  <div><b>{p.name}</b><small>{t.testi.level} {p.lvl} · {p.tier}</small></div>
                </figcaption>
              </figure>
            ))}
          </Carousel>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="section">
        <div className="wrap">
          <div className="section-head" style={{ textAlign: "center" }}>
            <p className="eyebrow">{t.plans.eyebrow}</p>
            <h2>{t.plans.titlePre} <span className="r">{t.plans.titleHi}</span></h2>
          </div>
          <Carousel className="plans">
            <div className="panel" style={{ padding: 32 }}>
              <h3 className="display" style={{ fontSize: 24 }}>{t.plans.aprendiz.name}</h3>
              <div className="display" style={{ fontSize: 46, margin: "10px 0" }}>
                R$0<span style={{ fontSize: 16, color: "var(--muted)", fontStyle: "normal" }}> {t.plans.perMonth}</span>
              </div>
              <ul className="plan-list">
                {t.plans.aprendiz.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <Link href="/cadastro" className="btn ghost block lg">{t.plans.aprendiz.cta}</Link>
            </div>
            <div className="panel glow corner" style={{ padding: 32, position: "relative" }}>
              <span className="chip" style={{ position: "absolute", top: -13, left: 32 }}>{t.plans.popular}</span>
              <h3 className="display" style={{ fontSize: 24, color: "var(--accent-3)" }}>{t.plans.cacador.name}</h3>
              <div className="display" style={{ fontSize: 46, margin: "10px 0" }}>
                R$39<span style={{ fontSize: 16, color: "var(--muted)", fontStyle: "normal" }}> {t.plans.perMonth}</span>
              </div>
              <ul className="plan-list">
                {t.plans.cacador.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <Link href="/cadastro" className="btn block lg btn-bolt">
                <span className="btn-bolt-label">{t.plans.cacador.cta}</span>
              </Link>
            </div>
            <div className="panel" style={{ padding: 32, position: "relative" }}>
              <span className="chip" style={{ position: "absolute", top: -13, left: 32, background: "var(--gold)", color: "#2a1c00" }}>{t.plans.eliteTag}</span>
              <h3 className="display" style={{ fontSize: 24, color: "var(--gold)" }}>{t.plans.monarca.name}</h3>
              <div className="display" style={{ fontSize: 46, margin: "10px 0" }}>
                R$79<span style={{ fontSize: 16, color: "var(--muted)", fontStyle: "normal" }}> {t.plans.perMonth}</span>
              </div>
              <ul className="plan-list">
                {t.plans.monarca.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <Link href="/cadastro" className="btn block lg btn-bolt">
                <span className="btn-bolt-label">{t.plans.monarca.cta}</span>
              </Link>
            </div>
          </Carousel>
        </div>
      </section>

      {/* CTA */}
      <section className="section alt" style={{ textAlign: "center" }}>
        <div className="wrap">
          <div className="hero-aura" style={{ margin: "0 auto 0", opacity: ".4" }}></div>
          <h2 className="display" style={{ fontSize: "clamp(34px,5.5vw,60px)", marginTop: -40 }}>
            {t.cta.titlePre}<br />
            <span className="r" style={{ textShadow: "0 0 28px var(--glow)" }}>{t.cta.titleHi}</span>
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 18, margin: "18px 0 30px" }}>
            {t.cta.subtitle}
          </p>
          <Link href="/cadastro" className="btn lg btn-bolt">
            <span className="btn-bolt-label">
              {t.cta.button} <span className="arrow">→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="section" style={{ padding: "48px 0" }}>
        <div className="wrap cols-4">
          {t.feat.map((f, i) => (
            <div className="feat" key={i}>
              <span className="hex svg-badge" style={{ width: 54, height: 60 }}>
                <img className="ic-img" src={`/icons/${FEAT_ICONS[i]}.svg`} alt="" aria-hidden="true" />
              </span>
              <div><b>{f.t}</b><p>{f.d}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section alt">
        <div className="wrap faq-wrap">
          <div className="section-head" style={{ textAlign: "center" }}>
            <p className="eyebrow">{t.faq.eyebrow}</p>
            <h2>{t.faq.titlePre} <span className="r">{t.faq.titleHi}</span></h2>
          </div>
          <div className="faq-list">
            {t.faq.items.map((item, i) => (
              <details className="faq-item" key={i}>
                <summary>
                  <span>{item.q}</span>
                  <span className="faq-ic" aria-hidden="true">+</span>
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
