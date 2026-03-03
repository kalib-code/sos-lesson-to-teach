import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function Header({ locale }: { locale: Locale }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <Image
            src="/img/sos-logo.png"
            alt="Lessons to Teach"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="font-semibold text-stone-900 text-sm">
            {t(locale, "siteTitle")}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/blog`}
            className="text-sm text-stone-500 hover:text-emerald-700 transition-colors"
          >
            Blog
          </Link>
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
