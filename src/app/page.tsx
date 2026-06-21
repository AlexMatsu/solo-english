import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/styles/landing.css";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section id="inicio" className="section" style={{ paddingTop: 72, overflow: "hidden" }}>
        <div className="wrap hero-split">
          <div>
            <p className="eyebrow" style={{ marginBottom: 18 }}>Desperte seu potencial</p>
            <h1 className="display" style={{ fontSize: "clamp(40px,6.5vw,78px)" }}>
              Transforme seu<br />inglês em seu<br />
              <span style={{ color: "var(--accent)", fontSize: "1.18em", textShadow: "0 0 28px var(--glow)" }}>
                maior poder.
              </span>
            </h1>
            <p style={{ color: "var(--muted)", fontSize: 18, maxWidth: 480, margin: "24px 0 32px" }}>
              Suba de nível todos os dias através de missões, desafios e batalhas inspiradas nos melhores animes japoneses.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/cadastro" className="btn lg">
                Começar jornada <span className="arrow">→</span>
              </Link>
              <a href="#como" className="btn ghost lg">Assistir trailer ▶</a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 30 }}>
              <div style={{ display: "flex" }}>
                <span className="avatar-stack">🧝</span>
                <span className="avatar-stack">🥷</span>
                <span className="avatar-stack">🧛</span>
                <span className="avatar-stack">⚔️</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--muted)" }}>
                <b style={{ color: "var(--text)" }}>+50.000 aventureiros</b><br />
                já evoluindo o inglês!
              </p>
            </div>
          </div>

          {/* HUD do herói */}
          <div style={{ position: "relative" }}>
            <div className="hero-aura"></div>
            <div className="panel glow corner" style={{ padding: 24, position: "relative", zIndex: 2, maxWidth: 330, marginLeft: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--muted)", letterSpacing: 1 }}>NÍVEL</div>
                  <div className="display" style={{ fontSize: 52, color: "#fff", lineHeight: ".8" }}>24</div>
                </div>
                <div className="hex" style={{ width: 64, height: 70 }}>
                  <span className="ic" style={{ fontSize: 22 }}>🐉</span>
                </div>
              </div>
              <div style={{ margin: "20px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
                  <span>XP</span><span className="mono">2.450 / 3.000</span>
                </div>
                <div className="xpbar"><i style={{ width: "81%" }}></i></div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
                <span style={{ fontSize: 20 }}>🏆</span>
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1 }}>RANKING GLOBAL</div>
                  <div className="display" style={{ fontSize: 24, color: "var(--accent-3)" }}>#452</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como" className="section alt">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Sua jornada</p>
            <h2>Sua jornada de <span className="r">evolução</span></h2>
          </div>
          <div className="journey">
            <div className="jstep">
              <div className="hex"><span className="ic">🥷</span><span className="num">01</span></div>
              <h4 className="display">Escolha sua classe</h4>
              <p>Defina seu caminho e desperte habilidades únicas de aprendizado.</p>
            </div>
            <span className="jsep">→</span>
            <div className="jstep">
              <div className="hex"><span className="ic">📕</span><span className="num">02</span></div>
              <h4 className="display">Complete missões</h4>
              <p>Exercícios de vocabulário, gramática, listening e speaking.</p>
            </div>
            <span className="jsep">→</span>
            <div className="jstep">
              <div className="hex"><span className="ic">⚡</span><span className="num">03</span></div>
              <h4 className="display">Ganhe XP</h4>
              <p>Cada missão te deixa mais forte. Ganhe XP, Gold e itens.</p>
            </div>
            <span className="jsep">→</span>
            <div className="jstep">
              <div className="hex"><span className="ic">👑</span><span className="num">04</span></div>
              <h4 className="display">Suba de nível</h4>
              <p>Desbloqueie novos mundos, habilidades e recompensas épicas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RECURSOS: progressão / recompensas / ranking */}
      <section id="recursos" className="section">
        <div className="wrap cols-3">
          {/* Progressão */}
          <div className="panel glow" style={{ padding: 26 }}>
            <h3 className="display" style={{ fontSize: 20, marginBottom: 18 }}>
              Sistema de <span className="r">progressão</span>
            </h3>
            <ul className="ladder">
              <li><span className="lv mono">1</span> <span>Beginner</span></li>
              <li><span className="lv mono">10</span> <span>Explorer</span></li>
              <li><span className="lv mono">20</span> <span>Warrior</span></li>
              <li><span className="lv mono">35</span> <span>Elite</span></li>
              <li><span className="lv mono">50</span> <span>Master</span></li>
              <li><span className="lv mono">80</span> <span>Grand Master</span></li>
              <li className="legend"><span className="lv mono">100</span> <span>LEGEND</span></li>
            </ul>
          </div>

          {/* Recompensas */}
          <div className="panel glow" style={{ padding: 26 }}>
            <h3 className="display" style={{ fontSize: 20 }}>Recompensas <span className="r">épicas</span></h3>
            <p style={{ color: "var(--muted)", fontSize: 14, margin: "8px 0 18px" }}>
              Quanto mais você aprende, mais forte você fica.
            </p>
            <div className="reward-grid">
              <div className="reward"><span>🎭</span><b>Avatares</b></div>
              <div className="reward"><span>🛡️</span><b>Skins</b></div>
              <div className="reward"><span>🏷️</span><b>Títulos</b></div>
              <div className="reward"><span>🖼️</span><b>Molduras</b></div>
              <div className="reward"><span>😎</span><b>Emotes</b></div>
              <div className="reward"><span>⚔️</span><b>Armas</b></div>
              <div className="reward"><span>🐺</span><b>Mascotes</b></div>
              <div className="reward"><span>✨</span><b>E mais</b></div>
            </div>
            <Link href="/cadastro" className="btn ghost block" style={{ marginTop: 18 }}>Ver loja</Link>
          </div>

          {/* Ranking */}
          <div className="panel glow" style={{ padding: 26 }}>
            <h3 className="display" style={{ fontSize: 20, marginBottom: 16 }}>Ranking <span className="r">mundial</span></h3>
            <div className="rank-tabs">
              <button className="active">XP semanal</button><button>Streak</button><button>Pronúncia</button>
            </div>
            <ol className="rank-list">
              <li><span className="pos">1</span><span className="pa">🥷</span><span className="pn">ShadowHunter</span><span className="px mono">25.680</span></li>
              <li><span className="pos">2</span><span className="pa">⚔️</span><span className="pn">AnimeKing</span><span className="px mono">24.310</span></li>
              <li><span className="pos">3</span><span className="pa">🐉</span><span className="pn">SoloPlayer</span><span className="px mono">21.450</span></li>
              <li><span className="pos">4</span><span className="pa">🌙</span><span className="pn">Lunatic</span><span className="px mono">18.760</span></li>
              <li><span className="pos">5</span><span className="pa">📖</span><span className="pn">EternalStudent</span><span className="px mono">17.980</span></li>
            </ol>
            <Link href="/cadastro" className="btn ghost block" style={{ marginTop: 16 }}>Ver ranking completo</Link>
          </div>
        </div>

        {/* Missões diárias destaque */}
        <div className="wrap" style={{ marginTop: 24 }}>
          <div className="panel glow" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 className="display" style={{ fontSize: 22 }}>Missões <span className="r">diárias</span></h3>
              <span className="chip">🔥 Sequência de 7 dias</span>
            </div>
            <div className="missions">
              <div className="mission"><span className="mi">📚</span><div className="mt"><b>Aprenda 10 palavras</b><small>+50 XP · +20 Gold</small></div><span className="mp mono">0/10</span></div>
              <div className="mission"><span className="mi">🎧</span><div className="mt"><b>Complete um listening</b><small>+80 XP</small></div><span className="mp mono">0/1</span></div>
              <div className="mission"><span className="mi">🎙️</span><div className="mt"><b>Faça um exercício de speaking</b><small>+100 XP</small></div><span className="mp mono">0/1</span></div>
              <div className="mission done"><span className="mi">🛡️</span><div className="mt"><b>Mantenha a sequência</b><small>+200 XP</small></div><span className="mp mono">5/7</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="section alt">
        <div className="wrap">
          <div className="section-head" style={{ textAlign: "center" }}>
            <h2>Aventureiros reais, <span className="r">resultados reais</span></h2>
          </div>
          <div className="testi-grid">
            <figure className="panel glow" style={{ padding: 26 }}>
              <div className="stars">★★★★★</div>
              <blockquote>&quot;Passei de básico para intermediário em 6 meses! O sistema de missões me mantém motivado todos os dias.&quot;</blockquote>
              <figcaption><span className="ava">🥷</span><div><b>Lucas T.</b><small>Nível 32 · Elite</small></div></figcaption>
            </figure>
            <figure className="panel glow" style={{ padding: 26 }}>
              <div className="stars">★★★★★</div>
              <blockquote>&quot;O melhor método que já usei! Aprendo jogando e me divirto demais.&quot;</blockquote>
              <figcaption><span className="ava">🌙</span><div><b>Mariana S.</b><small>Nível 45 · Master</small></div></figcaption>
            </figure>
            <figure className="panel glow" style={{ padding: 26 }}>
              <div className="stars">★★★★★</div>
              <blockquote>&quot;A temática anime me conquistou. Hoje não fico um dia sequer sem completar minhas missões!&quot;</blockquote>
              <figcaption><span className="ava">⚔️</span><div><b>Gabriel M.</b><small>Nível 28 · Warrior</small></div></figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="section">
        <div className="wrap">
          <div className="section-head" style={{ textAlign: "center" }}>
            <p className="eyebrow">Escolha seu pacto</p>
            <h2>Comece grátis, <span className="r">evolua sem limites</span></h2>
          </div>
          <div className="plans">
            <div className="panel" style={{ padding: 32 }}>
              <h3 className="display" style={{ fontSize: 24 }}>Aprendiz</h3>
              <div className="display" style={{ fontSize: 46, margin: "10px 0" }}>
                R$0<span style={{ fontSize: 16, color: "var(--muted)", fontStyle: "normal" }}> /mês</span>
              </div>
              <ul className="plan-list">
                <li>1 missão por dia</li>
                <li>Vocabulário essencial</li>
                <li>Ranking e ofensiva</li>
                <li>Avatar básico</li>
              </ul>
              <Link href="/cadastro" className="btn ghost block">Começar grátis</Link>
            </div>
            <div className="panel glow corner" style={{ padding: 32, position: "relative" }}>
              <span className="chip" style={{ position: "absolute", top: -13, left: 32 }}>Mais popular</span>
              <h3 className="display" style={{ fontSize: 24, color: "var(--accent-3)" }}>Caçador</h3>
              <div className="display" style={{ fontSize: 46, margin: "10px 0" }}>
                R$39<span style={{ fontSize: 16, color: "var(--muted)", fontStyle: "normal" }}> /mês</span>
              </div>
              <ul className="plan-list">
                <li>Missões ilimitadas</li>
                <li>Tutor de IA 24h (speaking)</li>
                <li>Sem anúncios + modo offline</li>
                <li>Skins, títulos e molduras exclusivas</li>
                <li>Acesso a guildas e eventos</li>
              </ul>
              <Link href="/cadastro" className="btn block lg">Despertar poder</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section alt" style={{ textAlign: "center" }}>
        <div className="wrap">
          <div className="hero-aura" style={{ margin: "0 auto 0", opacity: ".4" }}></div>
          <h2 className="display" style={{ fontSize: "clamp(34px,5.5vw,60px)", marginTop: -40 }}>
            Está pronto para<br />
            <span className="r" style={{ textShadow: "0 0 28px var(--glow)" }}>despertar seu poder?</span>
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 18, margin: "18px 0 30px" }}>
            Junte-se a milhares de aventureiros e domine o inglês de forma épica.
          </p>
          <Link href="/cadastro" className="btn lg">
            Começar minha jornada <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="section" style={{ padding: "48px 0" }}>
        <div className="wrap cols-4">
          <div className="feat">
            <span className="hex" style={{ width: 54, height: 60 }}><span className="ic" style={{ fontSize: 18 }}>🎮</span></span>
            <div><b>Método gamificado</b><p>Aprenda jogando com missões e desafios.</p></div>
          </div>
          <div className="feat">
            <span className="hex" style={{ width: 54, height: 60 }}><span className="ic" style={{ fontSize: 18 }}>🎓</span></span>
            <div><b>Conteúdo de qualidade</b><p>Aulas criadas por especialistas em idiomas.</p></div>
          </div>
          <div className="feat">
            <span className="hex" style={{ width: 54, height: 60 }}><span className="ic" style={{ fontSize: 18 }}>🤝</span></span>
            <div><b>Comunidade ativa</b><p>Guildas, chat e eventos todos os dias.</p></div>
          </div>
          <div className="feat">
            <span className="hex" style={{ width: 54, height: 60 }}><span className="ic" style={{ fontSize: 18 }}>🔒</span></span>
            <div><b>Seguro e confiável</b><p>Seus dados protegidos com segurança total.</p></div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
