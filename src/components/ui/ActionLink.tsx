"use client";

import { ArrowUpRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { useToast } from "./Toast";

type Variant = "primary" | "outline" | "ghost" | "row";

type Props = {
  href: string | null;
  children: React.ReactNode;
  variant?: Variant;
  /** Mensagem exibida quando o link ainda não foi configurado. */
  missing?: string;
  event?: Parameters<typeof track>[0];
  eventLabel?: string;
  className?: string;
  icon?: boolean;
  external?: boolean;
  ariaLabel?: string;
};

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.24em] transition-colors duration-500 ease-luxe select-none";

const variants: Record<Variant, string> = {
  primary: "h-14 px-8 bg-bronze text-bone hover:text-ink",
  outline: "h-14 px-8 border border-bone/30 text-bone hover:text-ink hover:border-bone",
  ghost: "h-10 text-bone hover:text-bronze-soft",
  row: "h-11 px-5 border border-bone/20 text-bone hover:text-bone hover:border-bronze",
};

// Camada que "sobe" no hover: microinteração discreta, sem saltos
const fill: Record<Variant, string> = {
  primary: "bg-bone",
  outline: "bg-bone",
  ghost: "",
  row: "bg-bronze",
};

export function ActionLink({
  href,
  children,
  variant = "primary",
  missing = "Agendamento ainda não configurado: falta o link do sistema de agendamento ou o WhatsApp oficial da Dom Pablo.",
  event,
  eventLabel,
  className = "",
  icon = true,
  external,
  ariaLabel,
}: Props) {
  const { notify } = useToast();
  const isExternal = external ?? (href ? /^https?:/.test(href) : false);

  return (
    <a
      href={href ?? "#"}
      aria-label={ariaLabel}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(e) => {
        if (!href) {
          e.preventDefault();
          notify(missing);
        }
        if (event) track(event, eventLabel ? { label: eventLabel } : {});
      }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {variant !== "ghost" && (
        <span
          aria-hidden
          className={`absolute inset-0 translate-y-full transition-transform duration-500 ease-luxe group-hover/btn:translate-y-0 ${fill[variant]}`}
        />
      )}
      <span className="relative">{children}</span>
      {icon && (
        <span className="relative inline-flex size-4 overflow-hidden" aria-hidden>
          <ArrowUpRight
            strokeWidth={1.5}
            className="size-4 transition-transform duration-500 ease-luxe group-hover/btn:translate-x-4 group-hover/btn:-translate-y-4"
          />
          <ArrowUpRight
            strokeWidth={1.5}
            className="absolute size-4 -translate-x-4 translate-y-4 transition-transform duration-500 ease-luxe group-hover/btn:translate-x-0 group-hover/btn:translate-y-0"
          />
        </span>
      )}
      {variant === "ghost" && (
        <span aria-hidden className="absolute bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-bronze-soft transition-transform duration-500 ease-luxe group-hover/btn:scale-x-100" />
      )}
    </a>
  );
}
