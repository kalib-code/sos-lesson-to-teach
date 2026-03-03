import type { Locale } from "@/lib/types";
import { locales } from "@/lib/i18n";
import Header from "@/components/layout/Header";

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
      <main className="max-w-2xl mx-auto px-4 py-6 pb-20">{children}</main>
    </div>
  );
}
