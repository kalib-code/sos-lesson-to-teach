import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import PreferencesProvider from "@/components/providers/PreferencesProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SOS Training Manual",
  description: "Biblical training materials for church planting and evangelism",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SOS Training Manual",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e6b4e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/img/sos-logo.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors`}>
        <PreferencesProvider>
          {children}
          <ServiceWorkerRegistrar />
        </PreferencesProvider>
      </body>
    </html>
  );
}
