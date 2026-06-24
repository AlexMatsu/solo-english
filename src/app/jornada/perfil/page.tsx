"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardShell from "@/components/DashboardShell";
import "@/styles/dashboard.css";

const stats = [
  { label: "Nível", value: "1" },
  { label: "XP total", value: "0" },
  { label: "Ofensiva", value: "0 dias" },
  { label: "Lições", value: "0" },
];

const AVATARS = ["🥷", "🧙‍♂️", "🧝", "🧛", "🦸", "🦹", "🧚", "👺", "👹", "🐉"];
const AVATAR_KEY = "soloAvatar";

export default function PerfilPage() {
  const router = useRouter();
  const [name, setName] = useState("Aventureiro");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      if (!s) return;
      const meta = s.user.user_metadata as { name?: string };
      setName(meta.name ?? s.user.email?.split("@")[0] ?? "Aventureiro");
      setEmail(s.user.email ?? "");
    });
  }, []);

  // carrega o avatar salvo
  useEffect(() => {
    const saved = localStorage.getItem(AVATAR_KEY);
    if (saved && AVATARS.includes(saved)) setAvatar(saved);
  }, []);

  const chooseAvatar = (a: string) => {
    setAvatar(a);
    localStorage.setItem(AVATAR_KEY, a);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <DashboardShell noAside>
      <main className="app-main">
        <section className="hero-greet panel glow corner">
          <div className="hg-left">
            <p className="eyebrow">Sua conta</p>
            <h1 className="display" style={{ fontSize: "clamp(28px,4.5vw,40px)", margin: "6px 0 8px" }}>
              {name}
            </h1>
            <p style={{ color: "var(--muted)" }}>{email}</p>
            <div className="boss-rewards" style={{ marginTop: 16 }}>
              <span className="chip">{avatar} Classe: Caçador</span>
              <span className="chip">🏅 Divisão Bronze</span>
            </div>
          </div>
          <div className="hg-hex hex"><span className="ic">{avatar}</span></div>
        </section>

        <section className="panel glow" style={{ padding: "26px" }}>
          <h2 className="display" style={{ fontSize: "22px", marginBottom: 6 }}>Escolha seu avatar</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 18 }}>
            Personalize como você aparece na sua jornada.
          </p>
          <div className="avatar-grid">
            {AVATARS.map((a) => (
              <button
                type="button"
                key={a}
                className={`avatar-opt${a === avatar ? " active" : ""}`}
                onClick={() => chooseAvatar(a)}
                aria-label={`Avatar ${a}`}
                aria-pressed={a === avatar}
              >
                {a}
              </button>
            ))}
          </div>
        </section>

        <section className="panel glow" style={{ padding: "26px" }}>
          <h2 className="display" style={{ fontSize: "22px", marginBottom: 18 }}>Estatísticas</h2>
          <div className="store-grid">
            {stats.map((s) => (
              <div key={s.label} className="store-item">
                <b className="display" style={{ fontSize: 28, color: "var(--accent-3)" }}>{s.value}</b>
                <small style={{ color: "var(--muted)", display: "block", marginTop: 4 }}>{s.label}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="panel glow" style={{ padding: "26px" }}>
          <h2 className="display" style={{ fontSize: "22px", marginBottom: 16 }}>Conta</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="button" className="btn ghost" onClick={handleLogout}>
              Sair da conta
            </button>
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}
