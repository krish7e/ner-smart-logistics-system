import { useEffect, useState } from "react";
import { BrainCircuit, X } from "lucide-react";
import { useSimulation } from "@/lib/simulation";

const CRITICAL_MESSAGES = {
  rain: "🚨 CRITICAL ALERT: Heavy rainfall detected near NH-37, Nagaon–Dimapur corridor",
  landslide: "🚨 CRITICAL ALERT: Landslide risk detected near NH-37 corridor",
} as const;

/** Fixed overlays keep crisis messaging visible without moving existing page content. */
export function GlobalSimulationOverlay() {
  const sim = useSimulation();
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    if (!sim.active) {
      setPopupOpen(false);
      return;
    }

    setPopupOpen(true);
    const timer = window.setTimeout(() => setPopupOpen(false), 3000);
    return () => window.clearTimeout(timer);
  }, [sim.active, sim.event]);

  if (sim.analyzing) {
    return (
      <div className="pointer-events-none fixed top-16 right-3 left-3 z-[70] flex justify-center lg:left-67" aria-live="polite">
        <div className="flex items-center gap-2 rounded-md border border-cyan/40 bg-surface-2/95 px-4 py-2.5 text-xs font-semibold text-cyan shadow-xl backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" />
          Analyzing live environmental data...
        </div>
      </div>
    );
  }

  if (!sim.active) return null;

  return (
    <div className="pointer-events-none fixed top-16 right-3 left-3 z-[70] lg:left-67" aria-live="assertive">
      <div className="mx-auto flex max-w-2xl items-center justify-center gap-2 rounded-md border border-danger/45 bg-danger/15 px-4 py-2.5 text-center text-xs font-semibold text-danger shadow-xl backdrop-blur">
        <BrainCircuit className="h-4 w-4 shrink-0" />
        <span>AI detected critical environmental risk. System is recalculating safe logistics routes.</span>
      </div>

      {popupOpen && sim.event !== "off" ? (
        <div className="pointer-events-auto mt-3 ml-auto flex w-full max-w-sm items-start gap-3 rounded-md border border-danger/60 bg-surface-2/95 p-3.5 shadow-2xl backdrop-blur">
          <span className="flex-1 text-xs font-bold leading-5 text-danger">
            {CRITICAL_MESSAGES[sim.event]}
          </span>
          <button
            type="button"
            onClick={() => setPopupOpen(false)}
            className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-danger/15 hover:text-danger"
            aria-label="Close critical alert"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}