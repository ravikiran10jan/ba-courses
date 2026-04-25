import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";
import { getMetadata } from "@/lib/content";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const meta = getMetadata();

export const metadata: Metadata = {
  title: {
    default: meta.defaultTitle,
    template: meta.titleTemplate,
  },
  description: meta.description,
  keywords: meta.keywords,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
