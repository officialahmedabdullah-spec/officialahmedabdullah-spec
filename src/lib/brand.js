/* Design Dynamo brand mark — the mirrored "DD".
   Rebuilt as a vector from the brand artwork (fits the original PNG to
   within 0.14% of pixels). Geometry, in a 1410-unit square:
   - two circles of radius 705.3, centred at (20, 705) and (1390, 705);
     their overlap makes the waist where the two Ds meet
   - two teardrop counters, the right one a mirror of the left */

export const MARK_SIZE = 1410;

export const MARK_CIRCLES = [
  { cx: 20, cy: 705, r: 705.3 },
  { cx: 1390, cy: 705, r: 705.3 },
];

const OUTER =
  "M0 0A705.3 705.3 0 0 1 705 537A705.3 705.3 0 0 1 1410 0V1410A705.3 705.3 0 0 1 705 873A705.3 705.3 0 0 1 0 1410Z";

const counter = (mirror) => {
  const x = (n) => (mirror ? MARK_SIZE - n : n);
  return (
    `M${x(132)} 170Q${x(132)} 155 ${x(147)} 155Q${x(158)} 155 ${x(162)} 165` +
    `C${x(270)} 502 ${x(570)} 755 ${x(530)} 985` +
    `C${x(480)} 1180 ${x(290)} 1240 ${x(148)} 1255` +
    `Q${x(132)} 1256 ${x(132)} 1240Z`
  );
};

export const MARK_OUTER = OUTER;
export const MARK_COUNTERS = [counter(false), counter(true)];
export const MARK_PATH = `${OUTER} ${MARK_COUNTERS.join(" ")}`;

// Bézier anchors and handles of the left counter (the right one mirrors it),
// shown in the logo-construction scene.
export const MARK_ANCHORS = [
  [162, 165],
  [530, 985],
  [148, 1255],
];
export const MARK_HANDLES = [
  [[162, 165], [270, 502]],
  [[530, 985], [570, 755]],
  [[530, 985], [480, 1180]],
  [[148, 1255], [290, 1240]],
];

export const BRAND = {
  burgundy: "#7c1034",
  lime: "#c1ee04",
  orange: "#ff6d00",
  cream: "#fff2e2",
  black: "#010101",
};
