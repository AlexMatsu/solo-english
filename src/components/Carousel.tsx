"use client";

import { type ReactNode } from "react";

/**
 * Envolve um track (que mantém a classe original: journey / testi-grid / plans)
 * e adiciona setas chevron neon de navegação. As setas só aparecem no mobile,
 * onde o track vira carrossel (scroll horizontal + snap).
 */
export default function Carousel({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <div className="carousel">
      <div className={className}>{children}</div>
    </div>
  );
}
