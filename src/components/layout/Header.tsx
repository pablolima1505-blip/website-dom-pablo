"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { navigation, site } from "@/config/site";
import { bookingHref, instagramHref, pageHref, whatsappHref } from "@/lib/links";
import { ActionLink } from "@/components/ui/ActionLink";
import { useLenis } from "./SmoothScroll";

export function Header() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setHidden(y > 600 && y > prev && !open);
  });

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: hidden ? "-100%" : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-[background-color,border-color,backdrop-filter] duration-700 ${
          solid || open ? "border-b border-line bg-ink/80 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <div className="gutter mx-auto flex h-[4.5rem] max-w-[1600px] items-center justify-between md:h-20">
          {/* Sem marca no canto: o logotipo aparece na abertura. O espaço equilibra o menu centralizado. */}
          <div className="hidden w-[8.5rem] lg:block" aria-hidden />

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={pageHref(item.href)}
                    className="group relative py-2 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-bone/70 transition-colors duration-300 hover:text-bone"
                  >
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-bronze-soft transition-transform duration-500 ease-luxe group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-4 lg:ml-0">
            <ActionLink
              href={bookingHref()}
              variant="primary"
              event="agendar_click"
              eventLabel="header"
              className="!hidden !h-11 !px-6 md:!inline-flex"
            >
              Agendar
            </ActionLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              className="relative z-10 flex h-11 items-center gap-3 lg:hidden"
            >
              <span className="eyebrow text-bone">{open ? "Fechar" : "Menu"}</span>
              <span className="relative block h-3 w-7" aria-hidden>
                <span className={`absolute left-0 h-px w-full bg-bone transition-all duration-500 ease-luxe ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px bg-bronze-soft transition-all duration-500 ease-luxe ${open ? "top-1.5 w-full -rotate-45 bg-bone" : "top-3 w-4"}`} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="gutter fixed inset-0 z-40 flex flex-col bg-ink pb-[max(2rem,env(safe-area-inset-bottom))] pt-28"
          >
            <ul className="flex flex-1 flex-col justify-center gap-1">
              {navigation.map((item, i) => (
                <li key={item.href} className="overflow-hidden border-b border-line">
                  <motion.a
                    href={pageHref(item.href)}
                    onClick={() => setOpen(false)}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-baseline justify-between py-3"
                  >
                    <span className="display text-[clamp(2.6rem,11vw,4.5rem)] text-bone">{item.label}</span>
                    <span className="font-display text-lg text-bronze-soft">0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-8 flex flex-col gap-5"
            >
              <ActionLink href={bookingHref()} event="agendar_click" eventLabel="menu-mobile" className="w-full">
                Agendar experiência
              </ActionLink>
              <div className="flex justify-between text-[0.7rem] uppercase tracking-[0.24em] text-ash">
                <span>
                  {site.city} — {site.state}
                </span>
                <span className="flex gap-5">
                  {instagramHref() && <a href={instagramHref()!} target="_blank" rel="noopener noreferrer">Instagram</a>}
                  {whatsappHref() && <a href={whatsappHref()!} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
