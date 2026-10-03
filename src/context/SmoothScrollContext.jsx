import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { chromeTop, reducedMotion } from "@/lib/utils";

const SmoothScrollContext = createContext(null);

/* Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and
   Lenis share one frame loop. Off when the visitor prefers reduced motion. */
export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const lenis = new Lenis({ lerp: 0.1, anchors: false });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback((target, { immediate = false, offset } = {}) => {
    const lenis = lenisRef.current;
    const top = offset ?? -chromeTop();
    if (lenis) {
      lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : top, immediate, duration: 1.3 });
      return;
    }
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
      return;
    }
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element) return;
    const y = element.getBoundingClientRect().top + window.scrollY + top;
    window.scrollTo({ top: y, behavior: immediate || reducedMotion() ? "auto" : "smooth" });
  }, []);

  const stop = useCallback(() => lenisRef.current?.stop(), []);
  const start = useCallback(() => lenisRef.current?.start(), []);

  const value = useMemo(() => ({ scrollTo, stop, start }), [scrollTo, stop, start]);
  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

export const useSmoothScroll = () => useContext(SmoothScrollContext);
