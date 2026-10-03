import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useOutlet } from "react-router";
import { useLayers } from "@/context/LayersContext";
import { useSmoothScroll } from "@/context/SmoothScrollContext";
import { useSound } from "@/context/SoundContext";
import { t } from "@/i18n";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cx, reducedMotion } from "@/lib/utils";
import { currentFile } from "./Topbar";
import Footer from "./Footer";
import styles from "./PageTransition.module.css";

const EASE_IN = [0.65, 0, 0.35, 1];
const EASE_OUT = [0.16, 1, 0.3, 1];

// Keeps the outgoing page rendered while it animates out.
function Page({ children }) {
  const [frozen] = useState(children);
  const reduce = reducedMotion();
  return (
    <motion.div
      className={styles.page}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 0.9, ease: EASE_OUT, delay: reduce ? 0 : 0.35 } }}
      exit={reduce ? { opacity: 0, transition: { duration: 0.15 } } : { opacity: 0, y: -40, transition: { duration: 0.5, ease: EASE_IN } }}
      onAnimationComplete={() => ScrollTrigger.refresh()}
    >
      {frozen}
      <Footer />
    </motion.div>
  );
}

/* Artboard-style page change: the old page slides up as a panel rises with
   the next document's name, then lifts off the new page. */
export default function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const { scrollTo } = useSmoothScroll();
  const { reset } = useLayers();
  const { play } = useSound();
  const curtain = useRef(null);
  // compare paths (not a "first render" flag) so StrictMode's double
  // effect run doesn't play the curtain on page load
  const lastPath = useRef(location.pathname);
  const [label, setLabel] = useState(currentFile(location.pathname));

  useEffect(() => {
    if (lastPath.current === location.pathname) return;
    lastPath.current = location.pathname;
    reset();
    setLabel(currentFile(location.pathname));
    if (reducedMotion()) return;
    play("swoosh");
    gsap
      .timeline()
      .fromTo(curtain.current, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.5, ease: "expo.inOut" })
      .fromTo(`.${styles.curtainLabel}`, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45 }, "-=0.15")
      .to(curtain.current, { clipPath: "inset(0 0 100% 0)", duration: 0.65, ease: "expo.inOut" }, "+=0.15");
  }, [location.pathname, reset, play]);

  return (
    <>
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => scrollTo(0, { immediate: true })}>
        <Page key={location.pathname}>{outlet}</Page>
      </AnimatePresence>
      <div ref={curtain} className={styles.curtain} aria-hidden="true">
        <p className={cx(styles.curtainLabel)}>
          <span className="mono">{t("transition.opening")}</span>
          {label}
        </p>
      </div>
    </>
  );
}
