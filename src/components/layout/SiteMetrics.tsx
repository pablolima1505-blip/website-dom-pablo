"use client";

import { useEffect } from "react";
import { classifyLink, metricClick, metricExit, metricVisit } from "@/lib/metrics";

/** Mede visitas, cada toque em link/botão do site e quanto tempo a pessoa ficou (tela "Site" do app). */
export function SiteMetrics() {
  useEffect(() => {
    metricVisit();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const { button, label } = classifyLink(a as HTMLAnchorElement);
      metricClick(button, label);
    };
    let sent = false;
    const onHide = () => {
      if (document.visibilityState === "hidden" && !sent) {
        sent = true;
        metricExit();
      } else if (document.visibilityState === "visible") sent = false;
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
  }, []);
  return null;
}
