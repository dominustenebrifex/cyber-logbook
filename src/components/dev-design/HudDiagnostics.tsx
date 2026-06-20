import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function fmtUTC(d: Date | null) {
  if (!d) return "--:--:--";
  return d.toISOString().slice(11, 19);
}

function useSignal() {
  const [v, setV] = useState(86);
  useEffect(() => {
    const id = setInterval(() => {
      setV((p) => {
        const next = p + (Math.random() * 6 - 3);
        return Math.max(72, Math.min(99, Math.round(next)));
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);
  return v;
}

function Bars({ value }: { value: number }) {
  const bars = 5;
  const active = Math.round((value / 100) * bars);
  return (
    <span className="inline-flex items-end gap-[2px]">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "w-[2px]",
            i < active ? "bg-[color:var(--cyan)]" : "bg-[color:var(--muted-foreground)]/35",
          )}
          style={{ height: `${4 + i * 2}px` }}
        />
      ))}
    </span>
  );
}

/** Tiny fixed bottom-right HUD overlay. Non-distracting, no pointer events. */
export function HudOverlay() {
  const now = useNow();
  const signal = useSignal();
  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-30 hidden sm:block">
      <div className="hud-panel text-mono flex items-center gap-3 border-[color:var(--cyan-dim)] px-2.5 py-1.5 text-[9px] text-[color:var(--muted-foreground)]">
        <span className="flex items-center gap-1.5">
          <span className="h-1 w-1 animate-blink bg-[color:var(--cyan)]" />
          UTC {fmtUTC(now)}
        </span>
        <span className="h-2 w-px bg-[color:var(--border)]" />
        <span className="flex items-center gap-1.5">
          SIG <Bars value={signal} />
          <span className="text-[color:var(--cyan)]">{signal}%</span>
        </span>
        <span className="h-2 w-px bg-[color:var(--border)]" />
        <span>CORE // <span className="text-[color:var(--cyan)]">STABLE</span></span>
      </div>
    </div>
  );
}

/** Inline mini-HUD strip you can drop at the top of any section. */
export function SectionDiagnostics({
  records,
  label = "ARCHIVE",
  className,
}: {
  records: string;
  label?: string;
  className?: string;
}) {
  const now = useNow();
  const signal = useSignal();
  return (
    <div
      className={cn(
        "text-mono flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] text-[color:var(--muted-foreground)]",
        className,
      )}
    >
      <span className="flex items-center gap-1.5">
        <span className="h-1 w-1 animate-blink bg-[color:var(--cyan)]" />
        {label} // {records}
      </span>
      <span className="hidden sm:inline">SYNC {fmtUTC(now)}</span>
      <span className="hidden sm:flex items-center gap-1.5">
        LINK <Bars value={signal} />
      </span>
      <span>AI CORE // <span className="text-[color:var(--cyan)]">ONLINE</span></span>
    </div>
  );
}
