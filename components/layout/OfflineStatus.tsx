"use client";

import { useState, useEffect, useCallback } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

type Status = "online" | "offline-ready" | "offline-partial" | "refreshing" | "downloading";

export default function OfflineStatus({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<Status>("online");
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const checkCacheStatus = useCallback(() => {
    const sw = navigator.serviceWorker?.controller;
    if (!sw) {
      if (!navigator.onLine) setStatus("offline-partial");
      return;
    }
    sw.postMessage({ type: "GET_CACHE_STATUS" });
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    function handleMessage(e: MessageEvent) {
      const { data } = e;
      if (!data?.type) return;

      if (data.type === "CACHE_STATUS") {
        const ratio = data.total > 0 ? data.cached / data.total : 0;
        if (!navigator.onLine) {
          setStatus(ratio > 0.8 ? "offline-ready" : "offline-partial");
          setVisible(true);
        } else {
          // Online — only show briefly if fully cached
          if (ratio > 0.8) {
            setStatus("online");
            setVisible(false);
          }
        }
      }

      if (data.type === "REFRESH_PROGRESS") {
        setProgress(Math.round((data.completed / data.total) * 100));
      }

      if (data.type === "REFRESH_DONE") {
        setStatus(navigator.onLine ? "online" : "offline-ready");
        setVisible(true);
        // Auto-hide after a few seconds when online
        if (navigator.onLine) {
          setTimeout(() => setVisible(false), 3000);
        }
      }
    }

    navigator.serviceWorker.addEventListener("message", handleMessage);

    // Listen for SW install completing (fires on first install)
    navigator.serviceWorker.ready.then((reg) => {
      if (reg.installing) {
        setStatus("downloading");
        setVisible(true);
        reg.installing.addEventListener("statechange", () => {
          if (reg.active) {
            checkCacheStatus();
          }
        });
      } else {
        // Already installed, check cache
        checkCacheStatus();
      }
    });

    // Online/offline events
    function handleOnline() {
      setStatus("online");
      setVisible(true);
      checkCacheStatus();
      setTimeout(() => setVisible(false), 3000);
    }

    function handleOffline() {
      setVisible(true);
      checkCacheStatus();
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setVisible(true);
      checkCacheStatus();
    }

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [checkCacheStatus]);

  function handleRefresh() {
    const sw = navigator.serviceWorker?.controller;
    if (!sw) return;
    setStatus("refreshing");
    setProgress(0);
    setVisible(true);
    sw.postMessage({ type: "REFRESH_CACHE" });
  }

  // Determine display text and styles
  let text = "";
  let bgClass = "";
  let icon: "check" | "warn" | "refresh" | "download" = "check";

  switch (status) {
    case "offline-ready":
      text = t(locale, "offlineReady");
      bgClass = "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300";
      icon = "check";
      break;
    case "offline-partial":
      text = t(locale, "offlinePartial");
      bgClass = "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300";
      icon = "warn";
      break;
    case "refreshing":
      text = `${t(locale, "refreshing")} ${progress}%`;
      bgClass = "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300";
      icon = "refresh";
      break;
    case "downloading":
      text = t(locale, "downloadingOffline");
      bgClass = "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300";
      icon = "download";
      break;
    case "online":
      text = t(locale, "online");
      bgClass = "bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400";
      icon = "check";
      break;
  }

  // When online and not refreshing/downloading, show a compact refresh button instead
  if (status === "online" && !visible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-14 left-0 right-0 z-40 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className={`border-t px-4 py-2 flex items-center justify-between gap-2 text-xs font-medium ${bgClass}`}>
        <div className="flex items-center gap-1.5">
          {icon === "check" && (
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
          {icon === "warn" && (
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          )}
          {(icon === "refresh" || icon === "download") && (
            <svg className="w-3.5 h-3.5 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
          )}
          <span>{text}</span>
        </div>

        {status === "online" && (
          <button
            onClick={handleRefresh}
            className="px-2 py-0.5 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
          >
            {t(locale, "refreshContent")}
          </button>
        )}

        {(status === "offline-ready" || status === "offline-partial") && (
          <button
            onClick={() => setVisible(false)}
            className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
