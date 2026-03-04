import Link from "next/link";
import type { Category, Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

const categoryColors: Record<string, { bg: string; border: string; accent: string }> = {
  "lessons-to-teach": {
    bg: "bg-emerald-50/60 dark:bg-emerald-950/30",
    border: "border-emerald-100 dark:border-emerald-900",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  "new-believer": {
    bg: "bg-sky-50/60 dark:bg-sky-950/30",
    border: "border-sky-100 dark:border-sky-900",
    accent: "text-sky-600 dark:text-sky-400",
  },
  assimilation: {
    bg: "bg-amber-50/60 dark:bg-amber-950/30",
    border: "border-amber-100 dark:border-amber-900",
    accent: "text-amber-600 dark:text-amber-400",
  },
  baptisms: {
    bg: "bg-violet-50/60 dark:bg-violet-950/30",
    border: "border-violet-100 dark:border-violet-900",
    accent: "text-violet-600 dark:text-violet-400",
  },
};

const defaultColor = {
  bg: "bg-stone-50 dark:bg-stone-800",
  border: "border-stone-200 dark:border-stone-700",
  accent: "text-stone-500 dark:text-stone-400",
};

export default function CategoryCard({
  category,
  locale,
  lessonCount,
}: {
  category: Category;
  locale: Locale;
  lessonCount: number;
}) {
  const colors = categoryColors[category.slug] ?? defaultColor;

  return (
    <Link
      href={`/${locale}/${category.slug}`}
      className={`flex items-center justify-between p-5 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-md transition-all active:scale-[0.98]`}
    >
      <div>
        <h2 className="font-semibold text-stone-900 dark:text-stone-100 text-base leading-snug">
          {category.label}
        </h2>
        <p className={`text-sm mt-1 ${colors.accent}`}>
          {lessonCount} {lessonCount === 1 ? t(locale, "lesson") : t(locale, "lessons")}
        </p>
      </div>
      <svg
        className="w-5 h-5 text-stone-300 dark:text-stone-600 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
