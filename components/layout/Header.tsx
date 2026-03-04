"use client";

import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { usePreferences } from "@/components/providers/PreferencesProvider";

const fontSizeLabels = { sm: "A-", base: "A", lg: "A+" } as const;

export default function Header({ locale }: { locale: Locale }) {
  const { theme, fontSize, toggleTheme, cycleFontSize } = usePreferences();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-emerald-100 dark:border-stone-700">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <Image
            src="/img/sos-logo.png"
            alt="SOS Training Manual"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
            {t(locale, "siteTitle")}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={cycleFontSize}
            className="text-xs font-bold w-8 h-8 rounded-full border border-stone-200 dark:border-stone-600 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Change font size"
          >
            {fontSizeLabels[fontSize]}
          </button>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-600 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            {theme === "light" ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </button>
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
