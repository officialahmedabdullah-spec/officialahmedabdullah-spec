/* Studio state shared by the left tool palette and the /studio canvas:
   the drawing tool in hand and the foreground / background colours. */
import { useSyncExternalStore } from "react";

// palette buttons (grouped like Photoshop); the studio's own bar also offers the variants
export const STUDIO_TOOLS = [
  { id: "brush", icon: "brush", key: "B" },
  { id: "eraser", icon: "eraser", key: "E" },
  { id: "shape", icon: "shape", key: "U" },
  { id: "text", icon: "type", key: "T" },
  { id: "fill", icon: "bucket", key: "G" },
  { id: "picker", icon: "eyedropper", key: "I" },
  { id: "image", icon: "image", key: "M" },
];

let state = { tool: "brush", pen: "brush", shape: "rect", filled: false, size: 8, fg: "#1a1814", bg: "#ffffff" };
const listeners = new Set();

export function setStudio(patch) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

export const swapColors = () => setStudio({ fg: state.bg, bg: state.fg });

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useStudio = () => useSyncExternalStore(subscribe, () => state, () => state);
