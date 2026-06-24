"use client";

import { useState } from "react";
import Link from "next/link";
import { IconMail, IconShield } from "@/components/icons";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [resendMsg, setResendMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const val = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailErr("Digite um e-mail válido para enviarmos o link.");
      return;
    }
    setEmailErr(null);
    setSentEmail(val);
    setSent(true);
  };

  const handleResend = () => {
    setResendMsg(`Reenviamos o link para ${sentEmail}.`);
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
            Nem todo herói lembra a senha
          </p>
          <h2
            className="display"
            style={{ fontSize: "clamp(32px,4.2vw,50px)", color: "#fff" }}
          >
            Todo herói
            <br />
            tropeça.
            <br />
            <span className="r" style={{ textShadow: "0 0 28px var(--glow)" }}>
              O importante é levantar.
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
            Sua ofensiva, seu nível e suas conquistas continuam intactos. Vamos
            te trazer de volta em segundos.
          </p>
        </div>

        <div
          className="panel glow corner"
          style={{
            padding: "18px 20px",
            position: "relative",
            zIndex: 2,
            maxWidth: 320,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                color: "var(--accent-3)",
                filter: "drop-shadow(0 0 8px var(--glow))",
                flex: "0 0 auto",
              }}
            >
              <IconShield width={26} height={26} />
            </span>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              Dica: confira a pasta de{" "}
              <b style={{ color: "var(--text)" }}>spam</b> caso o link demore a
              chegar.
            </p>
          </div>
        </div>
      </aside>

      {/* Formulário */}
      <section className="auth-main">
        <div className="auth-card">
          {!sent ? (
            /* Estado 1: pedir e-mail */
            <div>
              <h1>
                Recuperar seu <span className="r">acesso</span>
              </h1>
              <p className="sub">
                Informe o e-mail da sua conta. Enviaremos um link para você
                redefinir a senha e voltar à jornada.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="email">E-mail</label>
                  <div className="input-wrap">
                    <span className="lead" aria-hidden="true">
                      <IconMail />
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

                <button type="submit" className="btn block lg btn-bolt">
                  <span className="btn-bolt-label">
                    Enviar link de recuperação <span className="arrow">→</span>
                  </span>
                </button>
              </form>

              <p className="auth-foot">
                <Link href="/login">← Voltar para o login</Link>
              </p>
            </div>
          ) : (
            /* Estado 2: sucesso */
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "var(--accent)",
                  filter: "drop-shadow(0 0 18px var(--glow))",
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <IconMail width={56} height={56} strokeWidth={1.5} />
              </div>
              <h1>
                Link <span className="r">enviado!</span>
              </h1>
              <p className="sub" style={{ marginBottom: 24 }}>
                Enviamos um link de recuperação para{" "}
                <b style={{ color: "var(--text)" }}>{sentEmail}</b>. Verifique
                sua caixa de entrada e a pasta de spam.
              </p>

              <button
                type="button"
                className="btn block lg"
                onClick={handleResend}
              >
                Reenviar link
              </button>
              {resendMsg ? (
                <p
                  className="hint"
                  role="status"
                  style={{
                    textAlign: "center",
                    marginTop: 12,
                    color: "#2ecc71",
                  }}
                >
                  {resendMsg}
                </p>
              ) : null}

              <p className="auth-foot">
                <Link href="/login">← Voltar para o login</Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
