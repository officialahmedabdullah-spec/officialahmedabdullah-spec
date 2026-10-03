// One place to register GSAP plugins (all free since GSAP 3.13).
// Text is split into words by React (<RevealText>), not SplitText, so GSAP
// never rewrites DOM that React owns.
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable, InertiaPlugin, Physics2DPlugin);

gsap.defaults({ ease: "expo.out", duration: 1 });

// handy in the browser console while developing; stripped from builds
if (import.meta.env.DEV) Object.assign(window, { gsap, ScrollTrigger });

export { gsap, useGSAP, ScrollTrigger, Draggable, InertiaPlugin };
