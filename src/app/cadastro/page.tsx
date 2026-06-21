"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const COLORS = {
  weak: "var(--accent)",
  mid: "var(--gold)",
  strong: "#2ecc71",
};
const EMPTY = "#1c1c28";

function scorePassword(v: string): number {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  return s; // 0..4
}

function strengthState(v: string): {
  level: number;
  color: string;
  label: string;
  isError: boolean;
} {
  const score = scorePassword(v);
  if (v.length === 0)
    return {
      level: 0,
      color: EMPTY,
      label: "Use 8+ caracteres com letras, números e símbolos.",
      isError: false,
    };
  if (score <= 1)
    return {
      level: 1,
      color: COLORS.weak,
      label: "Força: fraca — adicione mais variedade.",
      isError: true,
    };
  if (score === 2)
    return {
      level: 2,
      color: COLORS.mid,
      label: "Força: média — quase lá, junte símbolos.",
      isError: false,
    };
  if (score === 3)
    return {
      level: 3,
      color: COLORS.strong,
      label: "Força: boa — sua senha está sólida.",
      isError: false,
    };
  return {
    level: 4,
    color: COLORS.strong,
    label: "Força: forte — digna de um caçador de elite!",
    isError: false,
  };
}

export default function CadastroPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [termos, setTermos] = useState(false);

  const [nomeErr, setNomeErr] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [senhaErr, setSenhaErr] = useState<string | null>(null);
  const [termosErr, setTermosErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = strengthState(senha);
  // senhaErr (submit-level) overrides the live strength hint when present.
  const senhaHintText = senhaErr ?? strength.label;
  const senhaHintError = senhaErr ? true : strength.isError;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    let ok = true;

    if (nome.trim().length < 2) {
      setNomeErr("Escolha um nome de aventureiro (2+ letras).");
      ok = false;
    } else {
      setNomeErr(null);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailErr("Digite um e-mail válido.");
      ok = false;
    } else {
      setEmailErr(null);
    }

    if (scorePassword(senha) < 2) {
      setSenhaErr("Sua senha ainda está fraca. Reforce antes de despertar.");
      ok = false;
    } else {
      setSenhaErr(null);
    }

    if (!termos) {
      setTermosErr("Aceite os termos para criar sua conta.");
      ok = false;
    } else {
      setTermosErr(null);
    }

    if (!ok) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: senha,
      options: { data: { name: nome.trim() } },
    });
    setLoading(false);

    if (error) {
      const msg = /registered|already/i.test(error.message)
        ? "Este e-mail já tem uma conta. Tente entrar."
        : error.message;
      setEmailErr(msg);
      return;
    }

    // Se a confirmação de e-mail estiver ligada no Supabase, não há sessão ainda.
    if (!data.session) {
      setEmailErr(
        "Conta criada! Confirme pelo link enviado ao seu e-mail e depois entre."
      );
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
            Desperte seu potencial
          </p>
          <h2
            className="display"
            style={{ fontSize: "clamp(34px,4.4vw,52px)", color: "#fff" }}
          >
            Sua lenda
            <br />
            <span className="r" style={{ textShadow: "0 0 28px var(--glow)" }}>
              começa agora.
            </span>
          </h2>
          <ul
            style={{
              listStyle: "none",
              marginTop: 26,
              display: "grid",
              gap: 14,
            }}
          >
            <li
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                color: "var(--text)",
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  filter: "drop-shadow(0 0 8px var(--glow))",
                }}
              >
                ⚔️
              </span>
              <span>
                <b>Missões diárias</b>
                <br />
                <small style={{ color: "var(--muted)" }}>
                  Ganhe XP e Gold todo dia que jogar.
                </small>
              </span>
            </li>
            <li
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                color: "var(--text)",
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  filter: "drop-shadow(0 0 8px var(--glow))",
                }}
              >
                🏆
              </span>
              <span>
                <b>Ranking mundial</b>
                <br />
                <small style={{ color: "var(--muted)" }}>
                  Suba de posição e prove seu valor.
                </small>
              </span>
            </li>
            <li
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                color: "var(--text)",
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  filter: "drop-shadow(0 0 8px var(--glow))",
                }}
              >
                🤖
              </span>
              <span>
                <b>Tutor de IA</b>
                <br />
                <small style={{ color: "var(--muted)" }}>
                  Treine speaking 24h ao seu lado.
                </small>
              </span>
            </li>
          </ul>
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
          <p style={{ fontStyle: "italic", color: "var(--text)", fontSize: 14 }}>
            &quot;Todo mestre já foi um aprendiz. O primeiro passo é
            despertar.&quot;
          </p>
        </div>
      </aside>

      {/* Formulário */}
      <section className="auth-main">
        <div className="auth-card">
          <h1>
            Comece sua <span className="r">jornada</span>
          </h1>
          <p className="sub">
            Crie sua conta em segundos e desperte seu poder no inglês.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="nome">Nome de aventureiro</label>
              <div className="input-wrap">
                <span className="lead" aria-hidden="true">
                  🧙
                </span>
                <input
                  className={`input${nomeErr ? " err" : ""}`}
                  type="text"
                  id="nome"
                  name="nome"
                  autoComplete="nickname"
                  placeholder="Como deseja ser chamado?"
                  value={nome}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNome(e.target.value)
                  }
                  required
                />
              </div>
              {nomeErr ? <p className="hint error">{nomeErr}</p> : null}
            </div>

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
                  autoComplete="new-password"
                  placeholder="Crie uma senha forte"
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
              <div className="steps-strength" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    style={{
                      background: i < strength.level ? strength.color : EMPTY,
                    }}
                  ></span>
                ))}
              </div>
              <p className={`hint${senhaHintError ? " error" : ""}`}>
                {senhaHintText}
              </p>
            </div>

            <label
              className="checkrow"
              style={{ margin: "6px 0 22px", alignItems: "flex-start" }}
            >
              <input
                type="checkbox"
                id="termos"
                name="termos"
                style={{ marginTop: 3 }}
                checked={termos}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTermos(e.target.checked)
                }
              />
              <span>
                Li e aceito os{" "}
                <a
                  href="#"
                  style={{ color: "var(--accent-3)", fontWeight: 600 }}
                >
                  Termos de Uso
                </a>{" "}
                e a{" "}
                <a
                  href="#"
                  style={{ color: "var(--accent-3)", fontWeight: 600 }}
                >
                  Política de Privacidade
                </a>
                .
              </span>
            </label>
            {termosErr ? <p className="hint error">{termosErr}</p> : null}

            <button type="submit" className="btn block lg" disabled={loading}>
              {loading ? "Despertando…" : "Criar conta e despertar poder"}{" "}
              <span className="arrow">→</span>
            </button>

            {success ? (
              <p
                className="hint"
                role="status"
                style={{ textAlign: "center", marginTop: 14, color: "#2ecc71" }}
              >
                Poder desperto! Preparando seu portal de iniciante...
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
            Já tem conta? <Link href="/login">Entrar</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
