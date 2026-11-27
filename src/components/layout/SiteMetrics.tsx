"use client";

import { useEffect } from "react";
import { classifyLink, metricClick, metricExit, metricVisit, visitCode } from "@/lib/metrics";
import { withCode } from "@/lib/siteCode";

/** Mede visitas, cada toque em link/botão do site e quanto tempo a pessoa ficou (tela "Site" do app). */
export function SiteMetrics() {
  useEffect(() => {
    metricVisit();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const link = a as HTMLAnchorElement;
      // WhatsApp: põe o código da visita no fim da mensagem antes de abrir (recepção confirma a conversa no app)
      if (/wa\.me|whatsapp\.com/.test(link.getAttribute("href") ?? "")) {
        const code = visitCode();
        if (code) link.href = withCode(link.href, code);
      }
      const { button, label } = classifyLink(link);
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
