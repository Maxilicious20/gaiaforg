import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers"; // <--- NEU IMPORTIEREN

export const metadata: Metadata = {
  title: "GaiaForge",
  description: "Hytale AI Modding Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Inter:wght@300;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Hier wickeln wir die App ein */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}