import { brandLogos } from "@/data/brandLogos";

/* A brand's own mark (LinkedIn, WhatsApp…) in currentColor. Decorative:
   the link next to it always carries the name. */
export default function BrandLogo({ id, size = 18, className }) {
  if (!brandLogos[id]) return null;
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={brandLogos[id]} fill="currentColor" />
    </svg>
  );
}
