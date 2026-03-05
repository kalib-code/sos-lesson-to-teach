import type { Locale } from "@/lib/types";
import { locales } from "@/lib/i18n";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import OfflineStatus from "@/components/layout/OfflineStatus";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div lang={locale}>
      <Header locale={locale as Locale} />
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {children}
      </main>
      <OfflineStatus locale={locale as Locale} />
      <BottomNav locale={locale as Locale} />
    </div>
  );
}
