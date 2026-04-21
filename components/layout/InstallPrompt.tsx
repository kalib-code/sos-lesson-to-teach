"use client";

import { useState, useEffect } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "sos-install-dismissed";
const DISMISS_DAYS = 7;

export default function InstallPrompt({ locale }: { locale: Locale }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already installed (running as PWA)?
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    // Recently dismissed?
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const when = parseInt(dismissed, 10);
      const daysSince = (Date.now() - when) / (1000 * 60 * 60 * 24);
      if (daysSince < DISMISS_DAYS) return;
    }

    // Detect iOS Safari (no beforeinstallprompt support)
    const ua = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua) && !(window as { MSStream?: unknown }).MSStream;
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    if (iOS && isSafari) {
      setIsIOS(true);
      setTimeout(() => setVisible(true), 2000);
      return;
    }

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setVisible(true), 2000);
    }

    function handleAppInstalled() {
      setVisible(false);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
    }
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  }

  if (!visible) return null;

  return (
    <div
      className="fixed top-16 left-0 right-0 z-40 px-4 pointer-events-none"
      role="dialog"
      aria-label={t(locale, "installTitle")}
    >
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl shadow-lg p-4 animate-in slide-in-from-top">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm">
                {t(locale, "installTitle")}
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5 leading-relaxed">
                {isIOS ? t(locale, "installIOS") : t(locale, "installDesc")}
              </p>
              {!isIOS && (
                <button
                  onClick={handleInstall}
                  className="mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  {t(locale, "installButton")}
                </button>
              )}
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors text-emerald-600 dark:text-emerald-400"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
