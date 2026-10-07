import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/fraunces";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
// Arabic partners for each family; unicode-range means they only download
// when Arabic text is on the page
import "@fontsource-variable/readex-pro";
import "@fontsource-variable/noto-naskh-arabic";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/type.css";
import "./styles/rtl.css";

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
import { LanguageProvider } from "./i18n/LanguageContext";
import { watchStaleAssets } from "./lib/staleAssets";

// scroll position is managed by the page transition
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

// a tab left open across a deploy reloads instead of showing broken images
watchStaleAssets();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* outermost: changing language re-mounts everything inside */}
      <LanguageProvider>
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
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
