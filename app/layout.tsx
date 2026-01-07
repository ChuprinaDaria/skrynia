import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Скриня Пані Дарії | Автентичні Прикраси Ручної Роботи",
  description: "Унікальні прикраси ручної роботи за мотивами слов'янської, вікінгської та кельтської культури. Натуральний корал, срібло 925 проби.",
  keywords: ["прикраси", "ручна робота", "корал", "срібло", "слов'янські символи", "вікінги", "кельтські орнаменти"],
  authors: [{ name: "Дарія" }],
  openGraph: {
    title: "Скриня Пані Дарії",
    description: "Автентичні прикраси ручної роботи",
    type: "website",
    locale: "uk_UA",
    alternateLocale: ["en_US", "de_DE", "pl_PL"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
