/* The tool the cursor is "holding" (pen, eyedropper, hand…). Written by
   <Cursor>, read by <ToolPalette> via useSyncExternalStore — no React
   re-render of the page on every pointer move. */
import { useSyncExternalStore } from "react";

let tool = "move";
const listeners = new Set();

export function setTool(next) {
  if (next === tool) return;
  tool = next;
  listeners.forEach((listener) => listener());
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useActiveTool = () => useSyncExternalStore(subscribe, () => tool, () => tool);
