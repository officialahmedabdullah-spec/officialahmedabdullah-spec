import { useEffect, useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { t } from "@/i18n";
import { designsConfigured, fetchDesigns } from "@/lib/designs";
import PageHeader from "@/components/sections/PageHeader";
import Studio from "@/components/studio/Studio";
import Artboard from "@/components/ui/Artboard";
import styles from "@/components/studio/Studio.module.css";

/* /studio — draw with the tools from the left palette; send the result
   for approval; approved designs show in the gallery below. */
export default function StudioPage() {
  useDocumentTitle(t("studio.title"));
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    if (!designsConfigured) return;
    fetchDesigns().then(setDesigns, () => setDesigns([]));
  }, []);

  return (
    <>
      <PageHeader file="studio.psd" eyebrow={t("studio.title")} title={t("studio.headline")} lede={t("studio.lede")} />
      <Artboard id="studio" name={t("layer.studio")} file="untitled-1.psd">
        <Studio />
      </Artboard>
      {designs.length > 0 && (
        <Artboard id="gallery" name={t("layer.gallery")} file="community.psd">
          <h2 className="h-lg">{t("studio.gallery")}</h2>
          <ul className={styles.gallery}>
            {designs.map((design) => (
              <li key={design.id}>
                <img src={design.image_url} alt={design.title || t("studio.untitled")} loading="lazy" width="1200" height="750" />
                <p className="mono">
                  {design.title || t("studio.untitled")} · {design.name}
                </p>
              </li>
            ))}
          </ul>
        </Artboard>
      )}
    </>
  );
}
