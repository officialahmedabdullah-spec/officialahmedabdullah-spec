import { MARK_PATH, MARK_SIZE } from "@/lib/brand";

/* The Design Dynamo "DD" mark as inline SVG, in currentColor so it can
   be burgundy on cream, lime on black, or anything a context needs. */
export default function BrandMark({ title, className, ...props }) {
  return (
    <svg
      viewBox={`0 0 ${MARK_SIZE} ${MARK_SIZE}`}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      <path fill="currentColor" fillRule="evenodd" d={MARK_PATH} />
    </svg>
  );
}
