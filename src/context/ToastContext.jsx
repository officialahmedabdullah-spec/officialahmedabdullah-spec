import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import styles from "./Toast.module.css";

const ToastContext = createContext(() => {});

// Short status messages ("Copied #FF5B2E"), announced to screen readers.
export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null);
  const timer = useRef(0);

  const toast = useCallback((text) => {
    clearTimeout(timer.current);
    setMessage({ text, id: Date.now() });
    timer.current = setTimeout(() => setMessage(null), 1800);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className={styles.region} role="status" aria-live="polite">
        <AnimatePresence>
          {message && (
            <motion.p
              key={message.id}
              className={styles.toast}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 500, damping: 30 } }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
            >
              {message.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
