import { useEffect } from "react";
import { site } from "@/data/portfolioData";

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${site.name}` : `${site.name} — ${site.role}`;
  }, [title]);
}
