import Link from "next/link";
import type { Locale } from "@/lib/types";
import { getBlogPosts } from "@/lib/content";
import { t } from "@/lib/i18n";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const posts = getBlogPosts();

  return (
    <div>
      <Link
        href={`/${locale}`}
        className="inline-flex items-center text-sm text-stone-400 hover:text-stone-600 mb-4 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t(loc, "home")}
      </Link>

      <h1 className="text-xl font-bold text-stone-900 mb-6">
        {t(loc, "blog")}
      </h1>

      <div className="space-y-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${locale}/blog/${post.slug}`}
            className="block p-4 rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all active:scale-[0.98]"
          >
            <h2 className="text-sm font-semibold text-stone-800">
              {post.title}
            </h2>
            {post.date && (
              <p className="text-xs text-stone-400 mt-1">{post.date}</p>
            )}
            <p className="text-sm text-stone-500 mt-2 line-clamp-2">
              {post.excerpt}
            </p>
          </Link>
        ))}

        {posts.length === 0 && (
          <p className="text-stone-400 text-sm">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
