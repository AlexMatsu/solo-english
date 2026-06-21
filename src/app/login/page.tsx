"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [senhaErr, setSenhaErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    let ok = true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailErr("Digite um e-mail válido para entrar.");
      ok = false;
    } else {
      setEmailErr(null);
    }

    if (senha.length < 6) {
      setSenhaErr("Sua senha tem ao menos 6 caracteres.");
      ok = false;
    } else {
      setSenhaErr(null);
    }

    if (!ok) return;

    const res = login(email, senha);
    if (!res.ok) {
      setSenhaErr(res.error ?? "Não foi possível entrar.");
      return;
    }

    setSuccess(true);
    router.push("/jornada");
  };

  return (
    <main className="auth">
      {/* Painel imersivo */}
      <aside className="auth-aside">
        <div className="aura"></div>

        <Link href="/" className="logo">
          SOLO
          <br />
          <span className="r">ENGLISH</span>
        </Link>

        <div style={{ position: "relative", zIndex: 2 }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>
            Sua jornada continua
          </p>
          <h2
            className="display"
            style={{ fontSize: "clamp(34px,4.4vw,52px)", color: "#fff" }}
          >
            Bem-vindo de
            <br />
            volta,
            <br />
            <span className="r" style={{ textShadow: "0 0 28px var(--glow)" }}>
              Caçador.
            </span>
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: 16,
              maxWidth: 340,
              marginTop: 18,
            }}
          >
            O mundo não espera. Suas missões estão prontas e o ranking não para
            de subir.
          </p>
        </div>

        {/* HUD preview: nível / streak */}
        <div
          className="panel glow corner"
          style={{ padding: 22, position: "relative", zIndex: 2, maxWidth: 320 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  letterSpacing: 1,
                }}
              >
                NÍVEL
              </div>
              <div
                className="display"
                style={{ fontSize: 44, color: "#fff", lineHeight: 0.8 }}
              >
                24
              </div>
            </div>
            <span className="chip">🔥 Streak 7 dias</span>
          </div>
          <div style={{ margin: "18px 0 4px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "var(--muted)",
                marginBottom: 8,
              }}
            >
              <span>XP</span>
              <span className="mono">2.450 / 3.000</span>
            </div>
            <div className="xpbar">
              <i style={{ width: "81%" }}></i>
            </div>
          </div>
        </div>
      </aside>

      {/* Formulário */}
      <section className="auth-main">
        <div className="auth-card">
          <h1>
            Entrar na sua <span className="r">jornada</span>
          </h1>
          <p className="sub">
            Retome de onde parou e mantenha sua ofensiva viva.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <div className="input-wrap">
                <span className="lead" aria-hidden="true">
                  ✉
                </span>
                <input
                  className={`input${emailErr ? " err" : ""}`}
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>
              {emailErr ? <p className="hint error">{emailErr}</p> : null}
            </div>

            <div className="field">
              <label htmlFor="senha">Senha</label>
              <div className="input-wrap">
                <span className="lead" aria-hidden="true">
                  🔒
                </span>
                <input
                  className={`input${senhaErr ? " err" : ""}`}
                  type={showPass ? "text" : "password"}
                  id="senha"
                  name="senha"
                  autoComplete="current-password"
                  placeholder="Sua senha secreta"
                  value={senha}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSenha(e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  className="toggle-pass"
                  aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? "ocultar" : "mostrar"}
                </button>
              </div>
              {senhaErr ? <p className="hint error">{senhaErr}</p> : null}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "4px 0 22px",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <label className="checkrow">
                <input type="checkbox" id="manter" name="manter" />
                Manter conectado
              </label>
              <Link
                href="/recuperar"
                style={{
                  color: "var(--accent-3)",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Esqueci minha senha
              </Link>
            </div>

            <button type="submit" className="btn block lg">
              Entrar na jornada <span className="arrow">→</span>
            </button>

            {success ? (
              <p
                className="hint"
                role="status"
                style={{ textAlign: "center", marginTop: 14, color: "#2ecc71" }}
              >
                Acesso concedido. Abrindo seu portal...
              </p>
            ) : null}
          </form>

          <div className="divider">ou continue com</div>

          <div className="social-btns">
            <button type="button" className="social-btn">
              🔴 Google
            </button>
            <button type="button" className="social-btn">
              🎮 Discord
            </button>
          </div>

          <p className="auth-foot">
            Ainda não é um aventureiro? <Link href="/cadastro">Criar conta</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
