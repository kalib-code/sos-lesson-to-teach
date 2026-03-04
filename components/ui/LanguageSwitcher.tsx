"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/types";
import { getAlternateLocale, t } from "@/lib/i18n";

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const alt = getAlternateLocale(locale);
  const newPath = pathname.replace(`/${locale}`, `/${alt}`);

  return (
    <Link
      href={newPath}
      className="text-sm font-medium px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
    >
      {t(locale, "switchLanguage")}
    </Link>
  );
}
