"use client";

import { useRef } from "react";
import { openDevMenu, setDev, toast, useDev } from "@/lib/dev";

// Android's oldest easter egg: tap the build number seven times to become a
// developer. Here it unlocks the React Native Dev Menu.
export function BuildNumber({ value }: { value: string }) {
  const { developer } = useDev();
  const taps = useRef(0);
  const last = useRef(0);

  function tap() {
    if (developer) {
      toast("No need, you are already a developer.");
      return;
    }
    const now = Date.now();
    taps.current = now - last.current < 1500 ? taps.current + 1 : 1;
    last.current = now;
    const left = 7 - taps.current;
    if (left === 0) {
      setDev({ developer: true });
      toast("You are now a developer!");
      setTimeout(openDevMenu, 1000);
    } else if (left <= 4) {
      toast(`You are now ${left} ${left === 1 ? "step" : "steps"} away from being a developer.`);
    }
  }

  return (
    <button
      type="button"
      onClick={tap}
      aria-label={`Build number ${value}`}
      className="select-none text-left tabular-nums text-muted"
    >
      {value}
    </button>
  );
}
