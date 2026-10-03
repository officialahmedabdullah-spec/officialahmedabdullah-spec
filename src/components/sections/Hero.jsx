import { useRef, useState } from "react";
import { useIntro } from "@/context/IntroContext";
import { useSound } from "@/context/SoundContext";
import { hero, site } from "@/data/portfolioData";
import { Draggable, gsap, useGSAP } from "@/lib/gsap";
import { asset, cx, reducedMotion } from "@/lib/utils";
import Artboard from "@/components/ui/Artboard";
import BrandMark from "@/components/ui/BrandMark";
import Button from "@/components/ui/Button";
import RevealText from "@/components/ui/RevealText";
import SelectionBox from "@/components/ui/SelectionBox";
import TextLink from "@/components/ui/TextLink";
import styles from "./Hero.module.css";

/* home.psd — the first artboard: headline with a live selection, a placed
   portrait and stickers you can drag and throw around the sheet. */
export default function Hero() {
  const { ready } = useIntro();
  const { play } = useSound();
  const ref = useRef(null);
  const [selected, setSelected] = useState(false);

  // stickers: drag, throw (inertia), squash on grab, settle on release
  useGSAP(
    () => {
      const sheet = ref.current.closest("section").querySelector("[data-sheet]") ?? ref.current;
      Draggable.create(`.${styles.sticker}`, {
        bounds: sheet,
        inertia: !reducedMotion(),
        zIndexBoost: true,
        onPress() {
          play("press");
          if (!reducedMotion()) gsap.to(this.target, { scale: 1.1, rotate: "+=5", duration: 0.25, ease: "power2.out" });
        },
        onRelease() {
          play("release");
          if (!reducedMotion()) gsap.to(this.target, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" });
        },
      });
    },
    { scope: ref }
  );

  // entrance, timed to the end of the preloader
  useGSAP(
    () => {
      if (reducedMotion()) {
        setSelected(true);
        return;
      }
      const rest = gsap.utils.toArray("[data-intro]", ref.current);
      const stickers = gsap.utils.toArray(`.${styles.sticker}`, ref.current);
      if (!ready) {
        gsap.set(rest, { opacity: 0, y: 28 });
        gsap.set(`.${styles.photo}`, { clipPath: "inset(100% 0 0 0)" });
        gsap.set(stickers, { scale: 0 });
        return;
      }
      gsap
        .timeline({ delay: 0.15 })
        .fromTo(`.${styles.photo}`, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.3, ease: "expo.inOut" }, 0)
        .fromTo(rest, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.55)
        .add(() => setSelected(true), 0.9)
        .fromTo(stickers, { scale: 0, rotate: -25 }, { scale: 1, rotate: 0, duration: 0.9, ease: "back.out(2.4)", stagger: 0.09 }, 1);
    },
    { scope: ref, dependencies: [ready] }
  );

  return (
    <Artboard id="hero" name="Hero" file="hero.psd" sheetClassName={styles.sheet}>
      <div ref={ref} className={styles.hero}>
        <div className={styles.copy}>
          <p className={cx("eyebrow", "mono")} data-intro>
            {hero.eyebrow}
          </p>
          <RevealText as="h1" className={cx("h-xl", styles.title)} play={ready} delay={0.2} data-cursor="pen" data-cursor-label="Headline · Bricolage 800">
            {hero.headline[0]}{" "}
            <SelectionBox key="sel" label={`Layer · “${hero.headline[1]}”`} active={selected}>
              {hero.headline[1]}
            </SelectionBox>{" "}
            {hero.headline[2]}
          </RevealText>
          <p className={cx("lede", styles.lede)} data-intro>
            {hero.lede}
          </p>
          <div className={styles.actions} data-intro>
            <Button to={hero.primary.to}>{hero.primary.label}</Button>
            <TextLink to={hero.secondary.to}>{hero.secondary.label}</TextLink>
          </div>
          <p className={cx(styles.meta, "mono")} data-intro>
            <span>{site.location}</span>
            <span>{site.availability}</span>
          </p>
        </div>

        <figure className={styles.photo} data-cursor="view" data-cursor-label="Hi 👋">
          <img src={asset(site.portrait)} alt={`${site.name}, graphic and web designer`} width="801" height="820" />
          <span className={styles.halftone} aria-hidden="true" />
          <figcaption className={cx(styles.caption, "mono")}>portrait.jpg · placed</figcaption>
        </figure>

        <div className={styles.stickers} aria-hidden="true">
          <div className={cx(styles.sticker, styles.stamp)} data-cursor="drag" data-cursor-label="Drag me">
            <svg viewBox="0 0 100 100">
              <defs>
                <path id="stamp-ring" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
              </defs>
              <text>
                <textPath href="#stamp-ring" textLength="236">
                  OPEN FOR PROJECTS • WORLDWIDE • 2026 •
                </textPath>
              </text>
            </svg>
            <b>
              Say
              <br />
              hello
            </b>
          </div>
          <div className={cx(styles.sticker, styles.dd)} data-cursor="drag" data-cursor-label="Design Dynamo">
            <BrandMark />
          </div>
          <div className={cx(styles.sticker, styles.app, styles.ps)} data-cursor="drag" data-cursor-label="Photoshop">
            Ps
          </div>
          <div className={cx(styles.sticker, styles.app, styles.ai)} data-cursor="drag" data-cursor-label="Illustrator">
            Ai
          </div>
          <div className={cx(styles.sticker, styles.app, styles.fg)} data-cursor="drag" data-cursor-label="Figma">
            <svg viewBox="0 0 38 57" className={styles.figma}>
              <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
              <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
              <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
              <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
              <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
            </svg>
          </div>
          <div className={cx(styles.sticker, styles.app, styles.cdr)} data-cursor="drag" data-cursor-label="CorelDRAW">
            Cdr
          </div>
          <div className={cx(styles.sticker, styles.note)} data-cursor="drag" data-cursor-label="Drag me">
            4+ years, zero boring logos.
            <small className="mono">sticky note · drag it</small>
          </div>
        </div>
      </div>
    </Artboard>
  );
}
