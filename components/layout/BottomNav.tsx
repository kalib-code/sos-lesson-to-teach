"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/types";

export default function BottomNav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const isHome = pathname === `/${locale}`;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-t border-stone-200 dark:border-stone-700">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-14">
        <Link
          href={`/${locale}`}
          className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors ${
            isHome
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <button
          onClick={scrollToTop}
          className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
          <span className="text-[10px] font-medium">Top</span>
        </button>
      </div>
    </nav>
  );
}
