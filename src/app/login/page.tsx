"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PrimaryButton } from "@/components/Button";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [senhaErr, setSenhaErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    });
    setLoading(false);

    if (error) {
      if (/not confirmed|confirm/i.test(error.message)) {
        setEmailErr(
          "Confirme seu e-mail pelo link que enviamos antes de entrar."
        );
      } else {
        setSenhaErr("E-mail ou senha incorretos. Confira e tente de novo.");
      }
      return;
    }

    setSuccess(true);
    sessionStorage.setItem("welcomeBack", "1");
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
                    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
                  </svg>
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

            <PrimaryButton type="submit" block disabled={loading}>
              {loading ? "Entrando…" : "Entrar na jornada"}{" "}
              <span className="arrow">→</span>
            </PrimaryButton>

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

          <p className="auth-foot">
            Ainda não é um aventureiro? <Link href="/cadastro">Criar conta</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
