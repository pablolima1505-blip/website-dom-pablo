"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";

const LenisCtx = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisCtx);

/** Topo de um elemento no fluxo da página, ignorando o deslocamento das seções grudadas. */
function layoutTop(el: HTMLElement) {
  const stack = el.closest<HTMLElement>("[data-stack]");
  if (!stack?.parentElement) return el.getBoundingClientRect().top + window.scrollY;
  let y = stack.parentElement.getBoundingClientRect().top + window.scrollY;
  for (const sib of Array.from(stack.parentElement.children) as HTMLElement[]) {
    if (sib === stack) break;
    y += sib.offsetHeight;
  }
  let inner = 0;
  for (let n: HTMLElement | null = el; n && n !== stack; n = n.offsetParent as HTMLElement | null) inner += n.offsetTop;
  return y + inner;
}

/** Rolagem fluida (Lenis). Desligada para quem pede menos movimento. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const url = new URL(a.href, location.href);
      if (!url.hash || url.pathname !== location.pathname) return;
      const target = url.hash === "#inicio" ? 0 : document.querySelector<HTMLElement>(url.hash);
      if (target === null) return;
      e.preventDefault();
      const y = target === 0 ? 0 : layoutTop(target);
      if (instance) instance.scrollTo(y, { duration: 1.6 });
      else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    };

    let instance: Lenis | null = null;
    let raf = 0;
    if (!reduce) {
      instance = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
      setLenis(instance);
      const loop = (t: number) => {
        instance?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      instance?.destroy();
    };
  }, []);

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>;
}
