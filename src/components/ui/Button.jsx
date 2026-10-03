import { motion } from "motion/react";
import { Link } from "react-router";
import { useSound } from "@/context/SoundContext";
import { cx, reducedMotion } from "@/lib/utils";
import { Icon } from "./Icon";
import Magnetic from "./Magnetic";
import styles from "./Button.module.css";

const MotionLink = motion.create(Link);

// anticipation: squash on press · follow-through: springs back on release
const squash = { scaleX: 1.06, scaleY: 0.88 };
const spring = { type: "spring", stiffness: 520, damping: 14 };

/**
 *   <Button to="/contact">Start a project</Button>
 *   <Button href={site.fiverrUrl} external variant="dark">Order</Button>
 *   <Button onClick={…} variant="ghost" icon={null}>Reset</Button>
 *
 * variant: primary (signal) · dark · ghost · light
 */
export default function Button({ to, href, external, variant = "primary", icon = "arrow", size, className, children, onPointerDown, ...props }) {
  const { play } = useSound();

  const shared = {
    className: cx(styles.button, styles[variant], size === "sm" && styles.sm, className),
    whileTap: reducedMotion() ? undefined : squash,
    transition: spring,
    onPointerDown: (event) => {
      play("press");
      onPointerDown?.(event);
    },
    ...props,
  };

  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <span className={styles.icon}>
          <Icon name={icon} size={14} strokeWidth={2} />
        </span>
      )}
    </>
  );

  let element;
  if (to != null) element = <MotionLink to={to} {...shared}>{content}</MotionLink>;
  else if (href != null)
    element = (
      <motion.a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)} {...shared}>
        {content}
      </motion.a>
    );
  else element = <motion.button type="button" {...shared}>{content}</motion.button>;

  return <Magnetic>{element}</Magnetic>;
}
