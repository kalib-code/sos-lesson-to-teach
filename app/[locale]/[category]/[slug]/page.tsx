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
  });

  return (
    <div>
      <Link
        href={`/${locale}/${category}`}
        className="inline-flex items-center text-sm text-stone-400 hover:text-emerald-600 mb-4 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {cat?.label ?? t(loc, "backToCategory")}
      </Link>

      <article className="prose prose-stone prose-sm max-w-none prose-headings:text-stone-900 prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-stone-700 prose-p:leading-relaxed prose-li:text-stone-700 prose-blockquote:border-stone-300 prose-blockquote:text-stone-600 prose-blockquote:italic">
        {content}
      </article>

      <LessonNav locale={loc} prev={prev} next={next} />
    </div>
  );
}
