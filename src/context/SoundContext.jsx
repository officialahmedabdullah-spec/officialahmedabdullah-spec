import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { playSound } from "@/lib/sound";

const SoundContext = createContext({ enabled: false, toggle() {}, play() {} });

// Sound is off until the visitor turns it on.
export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem("sound") === "on";
    } catch {
      return false;
    }
  });

  const play = useCallback((name, pitch) => enabled && playSound(name, pitch), [enabled]);

  const toggle = useCallback(() => {
    setEnabled((on) => {
      const next = !on;
      try {
        localStorage.setItem("sound", next ? "on" : "off");
      } catch {
        // ignore
      }
      if (next) playSound("toggle");
      return next;
    });
  }, []);

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export const useSound = () => useContext(SoundContext);
