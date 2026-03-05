import type { Locale } from "./types";

export const locales: Locale[] = ["en", "tl-ph"];
export const defaultLocale: Locale = "en";

const uiStrings: Record<Locale, Record<string, string>> = {
  en: {
    siteTitle: "SOS Training Manual",
    siteDescription: "Biblical training materials for church planting and evangelism",
    homeGreeting: "What would you like to study?",
    home: "Home",
    blog: "Blog",
    backToCategory: "Back",
    previous: "Previous",
    next: "Next",
    readLesson: "Read lesson",
    switchLanguage: "Filipino",
    lessons: "lessons",
    lesson: "lesson",
    offlineReady: "All lessons available offline",
    offlinePartial: "Some content may be unavailable",
    online: "Online",
    refreshContent: "Update content",
    refreshing: "Updating…",
    downloadingOffline: "Downloading lessons for offline use…",
  },
  "tl-ph": {
    siteTitle: "Mga Aral na Ituturo",
    siteDescription: "Mga materyal sa pagsasanay para sa pagtatanim ng simbahan at pag-eebanghelyo",
    homeGreeting: "Ano ang nais mong pag-aralan?",
    home: "Tahanan",
    blog: "Blog",
    backToCategory: "Bumalik",
    previous: "Nakaraan",
    next: "Susunod",
    readLesson: "Basahin",
    switchLanguage: "English",
    lessons: "mga aral",
    lesson: "aral",
    offlineReady: "Lahat ng aral ay available offline",
    offlinePartial: "Maaaring hindi available ang ibang nilalaman",
    online: "Online",
    refreshContent: "I-update ang nilalaman",
    refreshing: "Nag-a-update…",
    downloadingOffline: "Dina-download ang mga aral para sa offline…",
  },
};

export function t(locale: Locale, key: string): string {
  return uiStrings[locale]?.[key] ?? uiStrings.en[key] ?? key;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "tl-ph" : "en";
}
