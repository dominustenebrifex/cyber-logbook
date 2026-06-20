import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "ABOUT", href: "#about" },
  { label: "TIMELINE", href: "#timeline" },
  { label: "TRACKS", href: "#tracks" },
  { label: "PARTNERS", href: "#partners" },
  { label: "TEAM", href: "#team" },
  { label: "ACCESS", href: "#access" },
];

export function ProtocolMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative grid h-9 w-9 shrink-0 place-items-center border border-[color:var(--cyan-dim)] bg-[color:var(--surface-1)]/70",
        className,
      )}
      aria-label="D-001 Protocol"
    >
      <span className="text-display text-[color:var(--cyan)] text-lg leading-none">D</span>
      <span className="absolute -top-1 -left-1 h-1.5 w-1.5 bg-[color:var(--cyan)]" />
      <span className="absolute -bottom-1 -right-1 h-1.5 w-1.5 bg-[color:var(--cyan)]" />
      <span className="text-mono absolute -bottom-3 left-1/2 -translate-x-1/2 text-[7px] text-[color:var(--muted-foreground)]">
        001
      </span>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-3 max-w-7xl px-3 sm:px-6">
        <nav className="hud-panel flex items-center justify-between gap-4 border-[color:var(--cyan-dim)] px-3 py-2.5 sm:px-5">
          <div className="flex items-center gap-3">
            <ProtocolMark />
            <div className="hidden flex-col text-mono text-[10px] leading-tight text-[color:var(--muted-foreground)] sm:flex">
              <span>PROTOCOL // D-001</span>
              <span className="text-[color:var(--cyan)]">ARCHIVE STATUS: ACTIVE</span>
            </div>
          </div>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-mono group relative px-3 py-1.5 text-[11px] text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--cyan)]"
                >
                  {item.label}
                  <span className="absolute inset-x-2 -bottom-0.5 h-px scale-x-0 bg-[color:var(--cyan)] transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <span className="h-1.5 w-1.5 animate-blink bg-[color:var(--cyan)]" />
            <span className="text-mono text-[10px] text-[color:var(--muted-foreground)]">
              SIGNAL // LIVE
            </span>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-mono lg:hidden inline-flex items-center gap-2 border border-[color:var(--cyan-dim)] px-3 py-1.5 text-[10px] text-[color:var(--cyan)]"
            aria-expanded={open}
            aria-label="Toggle archive menu"
          >
            {open ? "CLOSE" : "MENU"}
            <span className="flex flex-col gap-[3px]">
              <span className="h-[1px] w-3 bg-current" />
              <span className="h-[1px] w-3 bg-current" />
            </span>
          </button>
        </nav>
      </div>

      {/* Mobile fullscreen menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 origin-top bg-[color:var(--surface-0)]/97 backdrop-blur-md transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="relative flex h-full flex-col px-6 pt-24 pb-10">
          <p className="text-mono text-[10px] text-[color:var(--muted-foreground)]">
            ARCHIVE DIRECTORY // INDEX 00
          </p>
          <ul className="mt-6 flex flex-col divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-5"
                >
                  <span className="text-display text-2xl text-foreground">{item.label}</span>
                  <span className="text-mono text-[10px] text-[color:var(--muted-foreground)]">
                    {String(i + 1).padStart(3, "0")} //
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center justify-between pt-8">
            <span className="text-mono text-[10px] text-[color:var(--muted-foreground)]">
              CLEARANCE 01
            </span>
            <span className="text-mono text-[10px] text-[color:var(--cyan)]">
              D-001 // STABLE
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
