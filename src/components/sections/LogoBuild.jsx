import { useRef, useState } from "react";
import { logoBuild } from "@/data/portfolioData";
import { MARK_ANCHORS, MARK_CIRCLES, MARK_COUNTERS, MARK_HANDLES, MARK_OUTER, MARK_PATH, MARK_SIZE } from "@/lib/brand";
import { gsap, useGSAP } from "@/lib/gsap";
import { cx, pad } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import RevealText from "@/components/ui/RevealText";
import styles from "./LogoBuild.module.css";

const GRID = Array.from({ length: 13 }, (_, i) => (i * MARK_SIZE) / 12);
const mirror = ([x, y]) => [MARK_SIZE - x, y];
const ANCHORS = [...MARK_ANCHORS, ...MARK_ANCHORS.map(mirror)];
const HANDLES = [...MARK_HANDLES, ...MARK_HANDLES.map(([a, b]) => [mirror(a), mirror(b)])];

/* logo-construction.ai — the Design Dynamo mark built on scroll:
   grid → two mirrored circles (their overlap is the waist of the DD) →
   the outline → Bézier counters with their handles → brand colour.
   With reduced motion it shows the finished mark. */
export default function LogoBuild() {
  const ref = useRef(null);
  const [step, setStep] = useState(-1);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        setStep(logoBuild.length - 1);
        gsap.set(q("[data-fill]"), { opacity: 1 });
        gsap.set(q("[data-guide], [data-line]"), { opacity: 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(q("[data-gv]"), { scaleY: 0, transformOrigin: "50% 0%" });
        gsap.set(q("[data-gh]"), { scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set(q("[data-circle]"), { strokeDashoffset: 1 });
        gsap.set(q("[data-axis]"), { opacity: 0 });
        gsap.set(q("[data-handle], [data-anchor]"), { opacity: 0, scale: 0, transformOrigin: "50% 50%" });

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: ref.current,
              start: "top top+=88",
              end: "+=2000",
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
              onUpdate: (self) => setStep(Math.min(logoBuild.length - 1, Math.floor(self.progress * 4.2))),
            },
          })
          // 01 grid
          .to(q("[data-gv]"), { scaleY: 1, stagger: 0.04, duration: 0.5 })
          .to(q("[data-gh]"), { scaleX: 1, stagger: 0.04, duration: 0.5 }, "<0.1")
          // 02 two mirrored circles; the waist appears where they overlap
          .to(q("[data-axis]"), { opacity: 1, duration: 0.2 })
          .to(q("[data-circle]"), { strokeDashoffset: 0, stagger: 0.15, duration: 0.9 })
          .to(q("[data-outer]"), { strokeDashoffset: 0, duration: 0.9 })
          // 03 the counters, with their Bézier anchors and handles
          .to(q("[data-handle]"), { opacity: 1, scale: 1, stagger: 0.03, duration: 0.25 })
          .to(q("[data-anchor]"), { opacity: 1, scale: 1, stagger: 0.03, duration: 0.25 }, "<0.1")
          .to(q("[data-counter]"), { strokeDashoffset: 0, stagger: 0.1, duration: 1 })
          // 04 colour
          .to(q("[data-guide]"), { opacity: 0, duration: 0.4 })
          .to(q("[data-grid]"), { opacity: 0.12, duration: 0.4 }, "<")
          .to(q("[data-fill]"), { opacity: 1, duration: 0.5 })
          .to(q("[data-line]"), { opacity: 0, duration: 0.3 }, "<");
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Artboard id="logo-build" name="Logo build" file="design-dynamo-mark.ai" pinned>
      <div ref={ref} className={styles.build}>
        <div>
          <p className={cx("eyebrow", "mono")}>My own mark · scroll to build</p>
          <RevealText className="h-lg" data-cursor="pen">
            Watch the mark get made.
          </RevealText>
          <ol className={styles.steps}>
            {logoBuild.map((item, i) => (
              <li key={item.title} className={cx(styles.step, i <= step && styles.on)} aria-current={i === step ? "step" : undefined}>
                <span className={cx(styles.n, "mono")}>{pad(i + 1)}</span>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <svg className={styles.svg} viewBox="-120 -120 1650 1650" role="img" aria-label="The Design Dynamo mark being constructed on a grid">
          <g data-grid stroke="var(--blue)" strokeWidth="2.5" opacity=".55">
            {GRID.map((v) => (
              <line key={`v${v}`} data-gv x1={v} y1="-60" x2={v} y2={MARK_SIZE + 60} />
            ))}
            {GRID.map((v) => (
              <line key={`h${v}`} data-gh x1="-60" y1={v} x2={MARK_SIZE + 60} y2={v} />
            ))}
          </g>

          <g data-guide fill="none" stroke="var(--blue)" strokeWidth="4">
            <path data-axis d={`M${MARK_SIZE / 2} -80V${MARK_SIZE + 80}M-80 ${MARK_SIZE / 2}H${MARK_SIZE + 80}`} strokeDasharray="18 12" />
            {MARK_CIRCLES.map((c) => (
              <circle key={c.cx} data-circle cx={c.cx} cy={c.cy} r={c.r} pathLength="1" strokeDasharray="1" strokeDashoffset="0" />
            ))}
          </g>

          <path data-fill d={MARK_PATH} fill="var(--brand-burgundy)" fillRule="evenodd" opacity="0" />

          <g data-line fill="none" stroke="var(--ink)" strokeWidth="7" strokeLinejoin="round">
            <path data-outer d={MARK_OUTER} pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
            {MARK_COUNTERS.map((d) => (
              <path key={d} data-counter d={d} pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
            ))}
          </g>

          <g data-guide stroke="var(--blue)" strokeWidth="4">
            {HANDLES.map(([a, b], i) => (
              <g key={i} data-handle>
                <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
                <circle cx={b[0]} cy={b[1]} r="14" fill="var(--blue)" />
              </g>
            ))}
            {ANCHORS.map(([x, y], i) => (
              <rect key={i} data-anchor x={x - 18} y={y - 18} width="36" height="36" fill="#fff" />
            ))}
          </g>
        </svg>
      </div>
    </Artboard>
  );
}
