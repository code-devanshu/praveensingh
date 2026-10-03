import * as icons from "simple-icons";
import { stack } from "@/content";
import { Window } from "./window";

// Pick a dark or light glyph so each logo reads on its own brand colour.
function glyphColour(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.6 ? "#1d1d1f" : "#ffffff";
}

// Launchpad-style grid. Logos come from the simple-icons package.
export function Stack() {
  return (
    <Window id="tools" title="Tools">
      <div className="p-6 md:p-10">
        <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">Tools I ship with</h2>
        <ul className="mt-8 grid grid-cols-4 gap-x-2 gap-y-6 sm:grid-cols-5 md:grid-cols-7">
          {stack.map(({ icon, label }) => {
            const { path, hex } = icons[icon];
            return (
              <li key={label} className="flex flex-col items-center gap-2 text-center">
                <span
                  className="icon-glass flex h-14 w-14 items-center justify-center rounded-[22.5%] md:h-16 md:w-16"
                  style={{ backgroundColor: `#${hex}` }}
                >
                  <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8" fill={glyphColour(hex)}>
                    <path d={path} />
                  </svg>
                </span>
                <span className="text-xs leading-tight">{label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </Window>
  );
}
