import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import type { Locale } from "@/lib/types";
import { locales } from "@/lib/i18n";
import {
  getCategories,
  getLesson,
  getLessons,
  getAllLessonParams,
} from "@/lib/content";
import { t } from "@/lib/i18n";
import LessonNav from "@/components/lesson/LessonNav";
import LessonArticle from "@/components/lesson/LessonArticle";
import {
  ScriptureParagraph,
  ScriptureListItem,
  ScriptureH2,
  ScriptureH3,
  ScriptureH4,
} from "@/components/lesson/ScripturePopover";

export function generateStaticParams() {
  const params: { locale: string; category: string; slug: string }[] = [];
  for (const locale of locales) {
    params.push(...getAllLessonParams(locale));
  }
  return params;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  const loc = locale as Locale;

  const lesson = getLesson(loc, category, slug);
  if (!lesson) notFound();

  const categories = getCategories(loc);
  const cat = categories.find((c) => c.slug === category);

  const lessons = getLessons(loc, category);
  const currentIndex = lessons.findIndex((l) => l.slug === slug);
  const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const { content } = await compileMDX({
    source: lesson.source,
    options: { parseFrontmatter: false },
    components: {
      p: ScriptureParagraph,
      li: ScriptureListItem,
      h2: ScriptureH2,
      h3: ScriptureH3,
      h4: ScriptureH4,
    },
  });

  return (
    <div>
      <div className="sticky top-14 z-40 -mx-4 px-4 py-2.5 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/${locale}/${category}`}
            className="inline-flex items-center shrink-0 px-2.5 py-1 rounded-full text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {cat?.label ?? t(loc, "backToCategory")}
          </Link>
          <span className="text-sm font-medium text-stone-600 dark:text-stone-300 truncate text-right">
            {lesson.title}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <LessonArticle>{content}</LessonArticle>
      </div>

      <LessonNav locale={loc} prev={prev} next={next} />
    </div>
  );
}
