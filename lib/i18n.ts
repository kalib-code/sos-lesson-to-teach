import type { Locale } from "./types";

export const locales: Locale[] = ["en", "tl-ph", "hil-ph"];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  "tl-ph": "Filipino",
  "hil-ph": "Hiligaynon",
};

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
    switchLanguage: "Language",
    lessons: "lessons",
    lesson: "lesson",
    offlineReady: "All lessons available offline",
    offlinePartial: "Some content may be unavailable",
    online: "Online",
    refreshContent: "Update content",
    refreshing: "Updating…",
    downloadingOffline: "Downloading lessons for offline use…",
    installTitle: "Install this app",
    installDesc: "Add it to your home screen for quick access and offline reading.",
    installIOS: "Tap the Share icon, then \"Add to Home Screen\" to install.",
    installButton: "Install",
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
    switchLanguage: "Wika",
    lessons: "mga aral",
    lesson: "aral",
    offlineReady: "Lahat ng aral ay available offline",
    offlinePartial: "Maaaring hindi available ang ibang nilalaman",
    online: "Online",
    refreshContent: "I-update ang nilalaman",
    refreshing: "Nag-a-update…",
    downloadingOffline: "Dina-download ang mga aral para sa offline…",
    installTitle: "I-install ang app na ito",
    installDesc: "Idagdag sa home screen para sa mabilis na access at offline na pagbabasa.",
    installIOS: "Pindutin ang Share icon, pagkatapos ay \"Add to Home Screen\" upang i-install.",
    installButton: "I-install",
  },
  "hil-ph": {
    siteTitle: "Mga Leksyon nga Itudlo",
    siteDescription: "Mga materyal sa pagtuon para sa pagtukod sang iglesia kag pag-ebanghelyo",
    homeGreeting: "Ano ang gusto mo tun-an?",
    home: "Balay",
    blog: "Blog",
    backToCategory: "Balik",
    previous: "Antes",
    next: "Sunod",
    readLesson: "Basahon",
    switchLanguage: "Hambal",
    lessons: "mga leksyon",
    lesson: "leksyon",
    offlineReady: "Tanan nga leksyon makita sa offline",
    offlinePartial: "May iban nga sulod nga indi makita",
    online: "Online",
    refreshContent: "I-update ang sulod",
    refreshing: "Nagaupdate…",
    downloadingOffline: "Ginadownload ang mga leksyon para sa offline…",
    installTitle: "I-install ini nga app",
    installDesc: "Idugang sa imo home screen para sa mabilis nga access kag offline nga pagbasa.",
    installIOS: "Pislita ang Share icon, dayon \"Add to Home Screen\" para makainstall.",
    installButton: "I-install",
  },
};

export function t(locale: Locale, key: string): string {
  return uiStrings[locale]?.[key] ?? uiStrings.en[key] ?? key;
}

/** @deprecated kept for back-compat — UI now uses a multi-locale dropdown */
export function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "tl-ph" : "en";
}
