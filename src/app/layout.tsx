import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

import "@/style/globals.css";
import Header from "@/components/layout/header";
import { SWRProvider } from "@/components/providers/swr-provider";
import { THEME_INIT_SCRIPT } from "@/utils/theme-script";

// ─── Font ─────────────────────────────────────────────────────────────────────
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "Frontend Mentor | FX Checker — Live Currency Converter",
    template: "%s | Frontend Mentor | FX Checker",
  },
  description:
    "Real-time foreign exchange rates, currency converter, historical charts, and multi-currency comparison. Powered by ECB data via Frankfurter API.",
  keywords: ["currency converter", "exchange rates", "forex", "FX", "ECB"],
  authors: [{ name: "Souleymane Sy" }],
  openGraph: {
    title: "Frontend Mentor | FX Checker — Live Currency Converter",
    description: "Real-time exchange rates powered by ECB data.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={[jetbrainsMono.className, "min-h-full", "antialiased"].join(
          " ",
        )}
      >
        {/* Raw <script>, not next/script: must run synchronously before
            hydration to avoid a flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <SWRProvider>
          <Header />
          {children}
        </SWRProvider>
      </body>
    </html>
  );
}
