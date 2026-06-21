"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  /** Se informado, renderiza um <Link> de navegação em vez de <button>. */
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  block?: boolean;
  size?: "md" | "lg";
  className?: string;
};

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Botão PRIMÁRIO da marca — gradiente roxo + efeito de raio passando e flash
 * ao pressionar (classe .btn-bolt). Use sempre este para CTAs principais.
 */
export function PrimaryButton({
  children,
  href,
  type = "button",
  disabled,
  onClick,
  block,
  size = "lg",
  className,
}: ButtonProps) {
  const cls = cx("btn", "btn-bolt", size === "lg" && "lg", block && "block", className);
  const inner = <span className="btn-bolt-label">{children}</span>;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {inner}
    </button>
  );
}

/**
 * Botão SECUNDÁRIO (ghost) — fundo transparente, borda roxa e hover discreto.
 */
export function SecondaryButton({
  children,
  href,
  type = "button",
  disabled,
  onClick,
  block,
  size = "lg",
  className,
}: ButtonProps) {
  const cls = cx("btn", "ghost", size === "lg" && "lg", block && "block", className);

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
