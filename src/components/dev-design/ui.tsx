import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="text-mono flex items-center gap-3 text-[10px] text-[color:var(--muted-foreground)]">
      <span className="h-px w-8 bg-[color:var(--cyan-dim)]" />
      <span className="text-[color:var(--cyan)]">{index}</span>
      <span>// {title}</span>
    </div>
  );
}

export function HudTag({
  children,
  tone = "cyan",
  className,
}: {
  children: ReactNode;
  tone?: "cyan" | "purple" | "muted";
  className?: string;
}) {
  const toneClass =
    tone === "purple"
      ? "border-[color:var(--purple-dim)] text-[color:var(--purple)]"
      : tone === "muted"
      ? "border-[color:var(--border)] text-[color:var(--muted-foreground)]"
      : "border-[color:var(--cyan-dim)] text-[color:var(--cyan)]";
  return (
    <span
      className={cn(
        "text-mono inline-flex items-center gap-1.5 border bg-[color:var(--surface-1)]/60 px-2 py-1 text-[10px]",
        toneClass,
        className,
      )}
    >
      <span className="h-1 w-1 bg-current" />
      {children}
    </span>
  );
}

export function TerminalButton({
  children,
  variant = "primary",
  href,
  onClick,
  external,
  className,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
  onClick?: () => void;
  external?: boolean;
  className?: string;
}) {
  const isPrimary = variant === "primary";
  const cls = cn(
    "text-mono group relative inline-flex items-center gap-3 border px-5 py-3 text-[11px] transition-all duration-300",
    "bg-[color:var(--surface-1)]/60 backdrop-blur-sm",
    isPrimary
      ? "border-[color:var(--cyan)] text-[color:var(--cyan)] hover:bg-[color:var(--cyan)]/10 glow-border"
      : "border-[color:var(--border)] text-foreground hover:border-[color:var(--cyan-dim)] hover:text-[color:var(--cyan)]",
    className,
  );
  const content = (
    <>
      <span className="h-1.5 w-1.5 bg-current" />
      <span>{children}</span>
      <span className="opacity-60 transition-transform group-hover:translate-x-1">→</span>
      <span className="absolute -top-px -left-px h-2 w-2 border-t border-l border-current" />
      <span className="absolute -bottom-px -right-px h-2 w-2 border-b border-r border-current" />
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cls}
      >
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {content}
    </button>
  );
}

export function CornerFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative border border-[color:var(--border)]", className)}>
      <span className="absolute -top-px -left-px h-3 w-3 border-t border-l border-[color:var(--cyan)]" />
      <span className="absolute -top-px -right-px h-3 w-3 border-t border-r border-[color:var(--cyan)]" />
      <span className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-[color:var(--cyan)]" />
      <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-[color:var(--cyan)]" />
      {children}
    </div>
  );
}
