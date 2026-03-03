import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/types";
import { locales } from "@/lib/i18n";
import { getCategories, getLessons } from "@/lib/content";
import { t } from "@/lib/i18n";

export function generateStaticParams() {
  const params: { locale: string; category: string }[] = [];
  for (const locale of locales) {
    for (const cat of getCategories(locale)) {
      params.push({ locale, category: cat.slug });
    }
  }
  return params;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const loc = locale as Locale;
  const categories = getCategories(loc);
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  const lessons = getLessons(loc, category);

  return (
    <div>
      <Link
        href={`/${locale}`}
        className="inline-flex items-center text-sm text-stone-400 hover:text-emerald-600 mb-4 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t(loc, "home")}
      </Link>

      <h1 className="text-xl font-bold text-stone-900 leading-snug">
        {cat.label}
      </h1>
      {cat.description && (
        <p className="text-stone-500 text-sm mt-1">{cat.description}</p>
      )}

      <div className="mt-6 space-y-2">
        {lessons.map((lesson, i) => (
          <Link
            key={lesson.slug}
            href={`/${locale}/${category}/${lesson.slug}`}
            className="flex items-center gap-4 p-4 rounded-xl border border-stone-100 bg-white hover:bg-stone-50 hover:border-stone-200 hover:shadow-sm transition-all active:scale-[0.98]"
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold flex items-center justify-center">
              {i + 1}
            </span>
            <span className="flex-1 text-sm font-medium text-stone-800 leading-snug">
              {lesson.title}
            </span>
            <svg
              className="w-4 h-4 text-stone-300 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
