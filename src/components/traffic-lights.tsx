import { ArrowsInSimple, ArrowsOutSimple, Minus, X } from "@phosphor-icons/react";

type LightsProps = {
  title: string;
  fullscreen: boolean;
  onClose: () => void;
  onMinimise: () => void;
  onZoom: () => void;
  /** Defaults to "Close <title>". */
  closeLabel?: string;
  /** False greys out the green button, as macOS does for windows that can't go full screen. */
  canZoom?: boolean;
};

// Real buttons: close, minimise and full screen, with the glyphs macOS shows
// when you hover the group. The glass look, the bounce and the grey of an
// inactive window are in globals.css (.light). Used by both kinds of window:
// the desktop's (window.tsx) and the sub-pages' (document-window.tsx).
export function TrafficLights({ title, fullscreen, onClose, onMinimise, onZoom, closeLabel, canZoom = true }: LightsProps) {
  const light =
    "light flex h-3 w-3 items-center justify-center rounded-full text-black/60 outline-offset-2 max-md:h-3.5 max-md:w-3.5";
  const glyph = "opacity-0 transition-opacity group-hover/lights:opacity-100 group-focus-within/lights:opacity-100";

  return (
    <div className="lights group/lights relative z-10 flex gap-2" onDoubleClick={(e) => e.stopPropagation()}>
      <button type="button" aria-label={closeLabel ?? `Close ${title}`} onClick={onClose} className={`${light} light-close`}>
        <X size={8} weight="bold" className={glyph} aria-hidden />
      </button>
      <button type="button" aria-label={`Minimise ${title}`} onClick={onMinimise} className={`${light} light-minimise`}>
        <Minus size={8} weight="bold" className={glyph} aria-hidden />
      </button>
      <button
        type="button"
        aria-label={fullscreen ? `Exit full screen` : `Enter full screen`}
        aria-pressed={fullscreen}
        disabled={!canZoom}
        onClick={onZoom}
        className={`${light} light-zoom`}
      >
        {canZoom &&
          (fullscreen ? (
            <ArrowsInSimple size={8} weight="bold" className={glyph} aria-hidden />
          ) : (
            <ArrowsOutSimple size={8} weight="bold" className={glyph} aria-hidden />
          ))}
      </button>
    </div>
  );
}
