import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import type { Locale } from "@/lib/types";
import { locales } from "@/lib/i18n";
import { getBlogPost, getBlogPosts } from "@/lib/content";
import { t } from "@/lib/i18n";

export function generateStaticParams() {
  const posts = getBlogPosts();
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }
  return params;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.source,
    options: { parseFrontmatter: false },
  });

  return (
    <div>
      <Link
        href={`/${locale}/blog`}
        className="inline-flex items-center text-sm text-stone-400 hover:text-stone-600 mb-4 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t(loc, "blog")}
      </Link>

      <h1 className="text-xl font-bold text-stone-900 mb-1">{post.title}</h1>
      {post.date && (
        <p className="text-sm text-stone-400 mb-6">{post.date}</p>
      )}

      <article className="prose prose-stone prose-sm max-w-none prose-headings:text-stone-900 prose-headings:font-semibold prose-p:text-stone-700 prose-p:leading-relaxed">
        {content}
      </article>
    </div>
  );
}
