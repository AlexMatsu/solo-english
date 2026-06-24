"use client";

import { useEffect } from "react";

/**
 * Reveal-on-scroll inspirado em agências como a Insany: elementos sobem com
 * fade + leve stagger ao entrar na viewport. Usa IntersectionObserver (sem
 * libs) e respeita prefers-reduced-motion.
 */
const SELECTORS = [
  ".section-head",
  ".je-head",
  ".je-progress",
  ".je-char",
  ".je-card",
  ".cols-3 > .panel",
  ".reward",
  ".mission",
  ".testi-grid figure",
  ".plans > .panel",
  ".feat",
  ".faq-item",
  ".cta-reveal",
];

export default function ScrollReveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>(SELECTORS.join(","))
    );
    if (!els.length) return;

    // stagger: atraso por posição dentro do mesmo grupo (pai)
    const perParent = new Map<Element, number>();
    els.forEach((el) => {
      const parent = el.parentElement ?? document.body;
      const i = perParent.get(parent) ?? 0;
      perParent.set(parent, i + 1);
      el.style.transitionDelay = `${Math.min(i, 6) * 90}ms`;
      el.classList.add("reveal");
    });

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
