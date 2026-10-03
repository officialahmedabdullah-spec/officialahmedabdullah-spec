import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/fraunces";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/type.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { IntroProvider } from "./context/IntroContext";
import { LayersProvider } from "./context/LayersContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import { SmoothScrollProvider } from "./context/SmoothScrollContext";
import { SoundProvider } from "./context/SoundContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

// scroll position is managed by the page transition
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <SoundProvider>
          <SmoothScrollProvider>
            <IntroProvider>
              <LayersProvider>
                <ToastProvider>
                  <ReviewsProvider>
                    <App />
                  </ReviewsProvider>
                </ToastProvider>
              </LayersProvider>
            </IntroProvider>
          </SmoothScrollProvider>
        </SoundProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
