"use client";

import { useRef, type ReactNode } from "react";

/**
 * Envolve um track (que mantém a classe original: journey / testi-grid / plans
 * / reel) e adiciona scroll horizontal por toque/trackpad.
 *
 * Com `drag`, habilita também arrastar com o mouse (pointer drag-to-scroll),
 * útil no desktop. Um clique que vira arrasto não dispara navegação.
 */
export default function Carousel({
  className,
  children,
  drag = false,
}: {
  className: string;
  children: ReactNode;
  drag?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.button !== 0) return;
    state.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
    el.classList.add("dragging");
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    const s = state.current;
    if (!el || !s.down) return;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > 5) s.moved = true;
    el.scrollLeft = s.startScroll - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (el) {
      el.classList.remove("dragging");
      if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
    }
    state.current.down = false;
  };

  // se houve arrasto, bloqueia o clique (evita abrir link ao soltar)
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (state.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      state.current.moved = false;
    }
  };

  const dragProps = drag
    ? { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag, onClickCapture }
    : {};

  return (
    <div className="carousel">
      <div ref={ref} className={className} {...dragProps}>
        {children}
      </div>
    </div>
  );
}
