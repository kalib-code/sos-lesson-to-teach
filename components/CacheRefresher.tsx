"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Keeps the offline cache fresh for PWA users (especially iOS standalone,
 * where there is no manual refresh). Silently posts messages to the service
 * worker — failures are absorbed by the SW so the user never sees an error
 * and never loses access to cached content.
 */
export default function CacheRefresher() {
  const pathname = usePathname();
  const didFullRefresh = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (!navigator.onLine) return;

    navigator.serviceWorker.ready.then((reg) => {
      const sw = reg.active;
      if (!sw) return;

      if (!didFullRefresh.current) {
        didFullRefresh.current = true;
        sw.postMessage({ type: "REFRESH_SILENT" });
        return;
      }

      if (pathname) {
        sw.postMessage({ type: "REFRESH_URL", url: pathname });
      }
    });
  }, [pathname]);

  return null;
}
