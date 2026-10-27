"use client";

import Script from "next/script";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { pageHref } from "@/lib/links";

type Choice = "granted" | "denied" | null;
const KEY = "dp-consent-v1";

function read(): Choice {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Consentimento (LGPD) + carregamento de GA4 e Meta Pixel.
 * Nada de medição carrega antes do "Aceitar". Sem IDs configurados, o banner não aparece.
 */
export function Consent() {
  const { ga4Id, metaPixelId } = site.analytics;
  const hasTracking = Boolean(ga4Id || metaPixelId);
  const [choice, setChoice] = useState<Choice>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChoice(read());
    setReady(true);
  }, []);

  const decide = (c: Exclude<Choice, null>) => {
    try {
      localStorage.setItem(KEY, c);
    } catch {}
    setChoice(c);
  };

  if (!hasTracking) return null;

  return (
    <>
      {choice === "granted" && ga4Id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
gtag('js',new Date());gtag('config','${ga4Id}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {choice === "granted" && metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}

      <AnimatePresence>
        {ready && choice === null && (
          <motion.div
            role="region"
            aria-label="Preferências de cookies"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] right-[max(1rem,env(safe-area-inset-right))] z-[65] max-w-md border border-line bg-graphite/95 p-5 backdrop-blur md:left-8 md:right-auto"
          >
            <p className="text-sm leading-relaxed text-bone/80">
              Usamos cookies para medir visitas e melhorar sua experiência. Você decide.{" "}
              <a href={pageHref("/privacidade")} className="text-bronze-soft underline-offset-4 hover:underline">
                Política de privacidade
              </a>
            </p>
            <div className="mt-4 flex gap-3">
              <button onClick={() => decide("granted")} className="h-10 flex-1 bg-bronze text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-bone">
                Aceitar
              </button>
              <button onClick={() => decide("denied")} className="h-10 flex-1 border border-bone/25 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-bone">
                Recusar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
