"use client";

import { MessageCircle } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { bookingHref, whatsappHref } from "@/lib/links";
import { track } from "@/lib/analytics";
import { ActionLink } from "@/components/ui/ActionLink";
import { useToast } from "@/components/ui/Toast";

/**
 * Celular: barra fixa de agendamento (quem chega pelo Instagram converte aqui).
 * Desktop: botão flutuante de WhatsApp.
 */
export function FloatingActions() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const { notify } = useToast();
  const wa = whatsappHref("Olá, Dom Pablo! Vim pelo site e gostaria de falar com vocês.");

  useMotionValueEvent(scrollY, "change", (y) => {
    const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 160;
    setShow(y > window.innerHeight * 0.6 && !nearEnd);
  });

  const onWhatsapp = (e: React.MouseEvent) => {
    if (!wa) {
      e.preventDefault();
      notify("Número de WhatsApp ainda não configurado (src/config/site.ts).");
    }
    track("whatsapp_click", { label: "flutuante" });
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            key="mobile-bar"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-ink/90 px-[max(0.75rem,env(safe-area-inset-left))] pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden"
          >
            <ActionLink href={bookingHref()} event="agendar_click" eventLabel="barra-mobile" className="!h-12 flex-1">
              Agendar experiência
            </ActionLink>
            <a
              href={wa ?? "#"}
              onClick={onWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp"
              className="flex size-12 shrink-0 items-center justify-center border border-bone/25 text-bone"
            >
              <MessageCircle strokeWidth={1.4} className="size-5" />
            </a>
          </motion.div>

          <motion.a
            key="desktop-wa"
            href={wa ?? "#"}
            onClick={onWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="group fixed bottom-[max(2rem,env(safe-area-inset-bottom))] right-[max(2rem,env(safe-area-inset-right))] z-40 hidden items-center gap-3 md:flex"
          >
            <span className="translate-x-2 bg-graphite px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-bone opacity-0 transition-all duration-500 ease-luxe group-hover:translate-x-0 group-hover:opacity-100">
              WhatsApp
            </span>
            <span className="flex size-14 items-center justify-center rounded-full border border-bronze/50 bg-ink/80 text-bronze-soft backdrop-blur transition-colors duration-500 group-hover:bg-bronze group-hover:text-bone">
              <MessageCircle strokeWidth={1.4} className="size-6" />
            </span>
          </motion.a>
        </>
      )}
    </AnimatePresence>
  );
}
