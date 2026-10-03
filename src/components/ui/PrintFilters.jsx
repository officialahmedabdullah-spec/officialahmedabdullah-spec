/* SVG colour-matrix filters, one per printing plate. Each keeps a single
   ink channel and turns everything else white; multiplied together the
   three plates rebuild the image, and offsetting them reproduces print
   misregistration. Rendered once by the workspace. */
export default function PrintFilters() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <filter id="plate-c" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
      </filter>
      <filter id="plate-m" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 1 0 0 0  0 0 0 0 1  0 0 0 1 0" />
      </filter>
      <filter id="plate-y" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 1 0 0  0 0 0 1 0" />
      </filter>
    </svg>
  );
}
