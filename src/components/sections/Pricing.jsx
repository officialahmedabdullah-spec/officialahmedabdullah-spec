import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { useSound } from "@/context/SoundContext";
import { packages, site } from "@/data/portfolioData";
import { gsap, useGSAP } from "@/lib/gsap";
import { cx, reducedMotion } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import Button from "@/components/ui/Button";
import RevealText from "@/components/ui/RevealText";
import styles from "./Pricing.module.css";

/* pricing.psd — one lever instead of three cards side by side: pick how
   much design you need and the plan updates (one decision at a time). */
export default function Pricing() {
  const popular = packages.plans.findIndex((plan) => plan.popular);
  const [index, setIndex] = useState(popular < 0 ? 0 : popular);
  const { play } = useSound();
  const id = useId();
  const minRef = useRef(null);
  const maxRef = useRef(null);
  const plan = packages.plans[index];

  // prices count from the previous plan to the new one
  const shown = useRef({ min: plan.min, max: plan.max });
  useGSAP(
    () => {
      const state = shown.current;
      minRef.current.textContent = Math.round(state.min);
      maxRef.current.textContent = Math.round(state.max);
      gsap.to(state, {
        min: plan.min,
        max: plan.max,
        duration: reducedMotion() ? 0 : 0.8,
        ease: "expo.out",
        onUpdate: () => {
          minRef.current.textContent = Math.round(state.min);
          maxRef.current.textContent = Math.round(state.max);
        },
      });
    },
    { dependencies: [index] }
  );

  const choose = (next) => {
    setIndex(next);
    play("toggle", 1 + next * 0.2);
  };

  return (
    <Artboard id="pricing" name="Pricing" file="pricing.psd">
      <div className={styles.layout}>
        <div>
          <p className={cx("eyebrow", "mono")}>Monthly plans</p>
          <RevealText className="h-lg">Slide to how much design you need.</RevealText>
          <p className={cx("lede", styles.lede)}>{packages.note}</p>

          <div className={styles.lever}>
            <label htmlFor={id} className="sr-only">
              Plan
            </label>
            <input
              id={id}
              type="range"
              min="0"
              max={packages.plans.length - 1}
              step="1"
              value={index}
              onChange={(event) => choose(Number(event.target.value))}
              aria-valuetext={`${plan.name}, $${plan.min} to $${plan.max} a month`}
              className={styles.range}
              style={{ "--fill": `${(index / (packages.plans.length - 1)) * 100}%` }}
            />
            <div className={styles.ticks}>
              {packages.plans.map((item, i) => (
                <button key={item.name} type="button" className={cx(styles.tick, "mono")} aria-pressed={i === index} onClick={() => choose(i)}>
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <p className={cx(styles.tier, "mono")}>
            {plan.tier}
            {plan.popular && <span className={styles.badge}>Most picked</span>}
          </p>
          <p className={styles.price} aria-live="polite">
            {/* numbers are written by the count tween, not by React */}
            $<span ref={minRef} />
            <span className={styles.dash}>–</span>$<span ref={maxRef} />
            <small className="mono">/month</small>
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, x: -12, transition: { duration: 0.15 } }}
            >
              <h3 className={styles.name}>{plan.name}</h3>
              <p className={styles.description}>{plan.description}</p>
              <ul className={styles.features}>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
          <Button href={site.fiverrUrl} external>
            Order {plan.name} on Fiverr
          </Button>
          <p className={cx(styles.small, "mono")}>No contracts · pause or cancel anytime</p>
        </div>
      </div>
    </Artboard>
  );
}
