import { useLocation } from "react-router";
import { getService } from "@/data/portfolioData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { t } from "@/i18n";
import PageHeader from "@/components/sections/PageHeader";
import Button from "@/components/ui/Button";

// old static-site addresses (/work.html, /logo-design.html…) → new routes
const LEGACY = {
  "index.html": "/",
  "work.html": "/work",
  "services.html": "/services",
  "about.html": "/about",
  "contact.html": "/contact",
  "legal.html": "/legal",
};

// used by <Workspace> to redirect before any page mounts
export function legacyTarget(pathname) {
  const file = pathname.split("/").pop();
  if (!file?.endsWith(".html")) return null;
  if (LEGACY[file]) return LEGACY[file];
  const slug = file.replace(/\.html$/, "");
  return getService(slug) ? `/services/${slug}` : null;
}

export default function NotFoundPage() {
  const { pathname } = useLocation();
  useDocumentTitle(t("notFound.title"));

  return (
    <PageHeader
      id="not-found"
      name={t("layer.notFound")}
      file="missing-layer.psd"
      eyebrow={t("notFound.eyebrow")}
      title={t("notFound.headline")}
      lede={t("notFound.lede", { path: pathname })}
    >
      <div style={{ marginTop: 32 }}>
        <Button to="/">{t("notFound.back")}</Button>
      </div>
    </PageHeader>
  );
}
