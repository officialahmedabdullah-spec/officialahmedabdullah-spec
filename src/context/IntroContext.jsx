import { createContext, useContext, useMemo, useState } from "react";

const IntroContext = createContext({ ready: true, finish() {} });

// The preloader plays once per browser session.
const seen = () => {
  try {
    return sessionStorage.getItem("intro") === "done";
  } catch {
    return false;
  }
};

/* "ready" flips once the preloader has wiped away, so the hero can start
   its entrance at the right moment instead of behind the overlay. */
export function IntroProvider({ children }) {
  const [ready, setReady] = useState(seen);

  const value = useMemo(
    () => ({
      ready,
      finish() {
        try {
          sessionStorage.setItem("intro", "done");
        } catch {
          // ignore
        }
        setReady(true);
      },
    }),
    [ready]
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);
