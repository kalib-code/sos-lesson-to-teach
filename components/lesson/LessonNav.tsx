import Link from "next/link";
import type { Lesson, Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

export default function LessonNav({
  locale,
  prev,
  next,
}: {
  locale: Locale;
  prev: Lesson | null;
  next: Lesson | null;
}) {
  return (
    <nav className="flex items-stretch gap-3 mt-10 pt-6 border-t border-stone-100">
      {prev ? (
        <Link
          href={`/${locale}/${prev.category}/${prev.slug}`}
          className="flex-1 p-4 rounded-xl border border-stone-100 bg-white hover:bg-stone-50 hover:border-stone-200 hover:shadow-sm transition-all active:scale-[0.98]"
        >
          <span className="text-xs text-emerald-600 uppercase tracking-wide font-medium">
            {t(locale, "previous")}
          </span>
          <p className="text-sm font-medium text-stone-700 mt-1 leading-snug">
            {prev.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/${locale}/${next.category}/${next.slug}`}
          className="flex-1 p-4 rounded-xl border border-stone-100 bg-white hover:bg-stone-50 hover:border-stone-200 hover:shadow-sm transition-all text-right active:scale-[0.98]"
        >
          <span className="text-xs text-emerald-600 uppercase tracking-wide font-medium">
            {t(locale, "next")}
          </span>
          <p className="text-sm font-medium text-stone-700 mt-1 leading-snug">
            {next.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
