"use client";

import { usePreferences } from "@/components/providers/PreferencesProvider";

const fontSizeClass = {
  sm: "prose-sm",
  base: "prose-base",
  lg: "prose-lg",
} as const;

export default function LessonArticle({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fontSize } = usePreferences();

  return (
    <article
      className={`prose prose-stone ${fontSizeClass[fontSize]} max-w-none prose-headings:text-stone-900 dark:prose-headings:text-stone-100 prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-stone-700 dark:prose-p:text-stone-300 prose-p:leading-relaxed prose-li:text-stone-700 dark:prose-li:text-stone-300 prose-strong:text-stone-900 dark:prose-strong:text-stone-100`}
    >
      {children}
    </article>
  );
}
