import { Link } from "react-router";
import { cx } from "@/lib/utils";
import { Icon } from "./Icon";
import styles from "./TextLink.module.css";

/* Inline link whose underline draws in from the left on hover. */
export default function TextLink({ to, href, external, className, children, arrow = true, ...props }) {
  const content = (
    <>
      <span className={styles.text}>{children}</span>
      {arrow && <Icon name="arrowUpRight" size={15} className={styles.arrow} />}
    </>
  );
  const cls = cx(styles.link, className);
  if (to != null)
    return (
      <Link to={to} className={cls} {...props}>
        {content}
      </Link>
    );
  return (
    <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)} {...props}>
      {content}
    </a>
  );
}
