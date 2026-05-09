import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { getLocale, getTranslations } from "@/lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Home Discover Screen - Premium Real Estate",
  description: "Luxe Estate application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getTranslations(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} font-display antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background-light text-nordic-dark selection:bg-mosque selection:text-white min-h-screen flex flex-col">
        <LanguageProvider initialLocale={locale} initialMessages={messages}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
