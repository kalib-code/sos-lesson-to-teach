import type { Locale } from "@/lib/types";
import { getCategories, getLessons } from "@/lib/content";
import { t } from "@/lib/i18n";
import CategoryCard from "@/components/home/CategoryCard";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const categories = getCategories(loc);

  return (
    <div>
      <section className="pt-4 pb-6">
        <h1 className="text-lg font-semibold text-stone-800">
          {t(loc, "homeGreeting")}
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          {t(loc, "siteDescription")}
        </p>
      </section>

      <div className="space-y-3">
        {categories.map((cat) => {
          const lessons = getLessons(loc, cat.slug);
          return (
            <CategoryCard
              key={cat.slug}
              category={cat}
              locale={loc}
              lessonCount={lessons.length}
            />
          );
        })}
      </div>
    </div>
  );
}
