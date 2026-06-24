"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { completeLesson, xpIntoLevel, XP_PER_LEVEL, type Profile } from "@/lib/game";
import "@/styles/dashboard.css";

const LESSON_ID = "saudacoes";
const LESSON_XP = 50;

interface Question {
  prompt: string;
  options: string[];
  answer: number;
}

const QUESTIONS: Question[] = [
  { prompt: 'Como se diz "Olá" em inglês?', options: ["Bye", "Hello", "Please", "Sorry"], answer: 1 },
  { prompt: 'O que significa "Good morning"?', options: ["Boa noite", "Boa tarde", "Bom dia", "Tchau"], answer: 2 },
  { prompt: 'Como você responde "How are you?"', options: ["I'm fine, thanks", "My name is", "See you", "Good night"], answer: 0 },
  { prompt: 'O que significa "Nice to meet you"?', options: ["Até logo", "Prazer em conhecer você", "Por favor", "Com licença"], answer: 1 },
  { prompt: 'Como se diz "Tchau" de forma informal?', options: ["Welcome", "Thanks", "Bye", "Yes"], answer: 2 },
];

type Phase = "play" | "saving" | "done";

export default function LicaoSaudacoes() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [phase, setPhase] = useState<Phase>("play");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [err, setErr] = useState<string | null>(null);

  /* guarda de rota */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login");
      else setAuthed(true);
    });
  }, [router]);

  if (!authed) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "var(--muted)" }}>
        <p className="display" style={{ fontSize: 22 }}>Carregando lição…</p>
      </main>
    );
  }

  const q = QUESTIONS[i];
  const isLast = i === QUESTIONS.length - 1;
  const answered = selected !== null;

  const choose = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    if (idx === q.answer) setCorrect((c) => c + 1);
  };

  const next = async () => {
    if (!isLast) {
      setI((v) => v + 1);
      setSelected(null);
      return;
    }
    // última pergunta → conclui no backend
    setPhase("saving");
    setErr(null);
    try {
      const p = await completeLesson(LESSON_ID, LESSON_XP);
      setProfile(p);
      setPhase("done");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao salvar.");
      setPhase("play");
    }
  };

  const progress = phase === "done" ? 100 : Math.round((i / QUESTIONS.length) * 100);

  return (
    <main className="lesson">
      <div className="lesson-top">
        <Link href="/jornada" className="lesson-close" aria-label="Sair da lição">✕</Link>
        <div className="xpbar lesson-prog"><i style={{ width: `${progress}%` }} /></div>
        <span className="chip" style={{ fontSize: 12 }}>+{LESSON_XP} XP</span>
      </div>

      {phase === "done" && profile ? (
        <div className="lesson-card panel glow corner" style={{ textAlign: "center" }}>
          <div className="modal-hex hex" style={{ margin: "0 auto 16px" }}><span className="ic">🎉</span></div>
          <p className="eyebrow">Lição concluída</p>
          <h1 className="display" style={{ fontSize: 30, margin: "6px 0 8px" }}>
            Saudações <span className="r">dominadas!</span>
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: 18 }}>
            Você acertou <b style={{ color: "var(--text)" }}>{correct}/{QUESTIONS.length}</b> e ganhou{" "}
            <b style={{ color: "var(--gold)" }}>+{LESSON_XP} XP</b>.
          </p>

          <div className="lvl-row" style={{ justifyContent: "center", marginBottom: 22 }}>
            <span className="lvl-badge display">{profile.level}</span>
            <div className="lvl-prog" style={{ maxWidth: 280 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
                <span>NÍVEL {profile.level}</span>
                <span className="mono">{xpIntoLevel(profile.xp)} / {XP_PER_LEVEL} XP</span>
              </div>
              <div className="xpbar"><i style={{ width: `${(xpIntoLevel(profile.xp) / XP_PER_LEVEL) * 100}%` }} /></div>
            </div>
          </div>

          <Link href="/jornada" className="btn block lg">Voltar à jornada <span className="arrow">→</span></Link>
        </div>
      ) : (
        <div className="lesson-card panel glow corner">
          <p className="eyebrow" style={{ marginBottom: 6 }}>
            Pergunta {i + 1} de {QUESTIONS.length}
          </p>
          <h1 className="display" style={{ fontSize: 26, marginBottom: 22 }}>{q.prompt}</h1>

          <div className="lesson-opts">
            {q.options.map((opt, idx) => {
              let cls = "lesson-opt";
              if (answered) {
                if (idx === q.answer) cls += " correct";
                else if (idx === selected) cls += " wrong";
              }
              return (
                <button key={idx} className={cls} onClick={() => choose(idx)} disabled={answered}>
                  {opt}
                </button>
              );
            })}
          </div>

          {err ? <p className="hint error" style={{ marginTop: 14 }}>{err}</p> : null}

          <button
            className="btn block lg"
            style={{ marginTop: 22, ...(answered ? {} : { opacity: 0.5, pointerEvents: "none" }) }}
            disabled={!answered || phase === "saving"}
            onClick={next}
          >
            {phase === "saving" ? "Salvando…" : isLast ? "Concluir lição" : "Próxima"}{" "}
            <span className="arrow">→</span>
          </button>
        </div>
      )}
    </main>
  );
}
