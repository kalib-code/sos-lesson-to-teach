import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

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
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/img/sos-logo.png" />
      </head>
      <body className={`${inter.className} antialiased bg-stone-50 text-stone-900`}>
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
