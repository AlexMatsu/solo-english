"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useT } from "@/i18n/LangContext";

// Troque pelo ID do vídeo do trailer no YouTube (parte depois de "watch?v=").
// Ex.: para https://youtube.com/watch?v=ABC123 → YOUTUBE_ID = "ABC123".
const YOUTUBE_ID = "";

export default function TrailerButton() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useT();

  // Garante que createPortal só roda no client (document existe).
  useEffect(() => setMounted(true), []);

  // Fecha no ESC e trava o scroll do body enquanto a modal está aberta.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setPlaying(false);
  };

  const modal = (
    <div
      className="trailer-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Trailer do Solo English"
      onClick={close}
    >
      <button
        type="button"
        className="trailer-close"
        aria-label="Fechar trailer"
        onClick={close}
      >
        ✕
      </button>

      <div className="trailer-frame" onClick={(e) => e.stopPropagation()}>
        <div className="trailer-screen">
          {playing && YOUTUBE_ID ? (
            <iframe
              className="trailer-video"
              src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
              title="Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className="trailer-play"
              aria-label="Reproduzir trailer"
              onClick={() => setPlaying(true)}
            >
              <svg viewBox="0 0 68 48" aria-hidden="true">
                <path
                  className="yt-bg"
                  d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                />
                <path className="yt-arrow" d="M 45,24 27,14 27,34" />
              </svg>
            </button>
          )}
          {!YOUTUBE_ID && playing ? (
            <p className="trailer-soon">🎬 Trailer em breve</p>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="btn ghost lg"
        onClick={() => setOpen(true)}
      >
        {t.hero.trailer} ▶
      </button>

      {open && mounted ? createPortal(modal, document.body) : null}
    </>
  );
}
