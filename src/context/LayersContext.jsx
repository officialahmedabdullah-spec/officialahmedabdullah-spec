import { createContext, useCallback, useContext, useMemo, useState } from "react";

const LayersContext = createContext(null);

/* Every <Artboard> on the current page registers itself here, so the
   Layers panel and status bar can list, highlight and hide sections. */
export function LayersProvider({ children }) {
  const [layers, setLayers] = useState([]);
  const [active, setActive] = useState(null);
  const [hidden, setHidden] = useState(() => new Set());

  const register = useCallback((layer) => {
    setLayers((list) => [...list.filter((item) => item.id !== layer.id), layer]);
    return () => setLayers((list) => list.filter((item) => item.id !== layer.id));
  }, []);

  const toggleHidden = useCallback((id) => {
    setHidden((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // a new page starts with everything visible
  const reset = useCallback(() => {
    setHidden(new Set());
    setActive(null);
  }, []);

  const value = useMemo(
    () => ({ layers, active, setActive, hidden, toggleHidden, register, reset }),
    [layers, active, hidden, toggleHidden, register, reset]
  );
  return <LayersContext.Provider value={value}>{children}</LayersContext.Provider>;
}

export const useLayers = () => useContext(LayersContext);
