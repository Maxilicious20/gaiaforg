import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google"; // <--- Cinzel importiert
import "./globals.css";
import { Providers } from "./providers";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "./api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ["latin"], variable: '--font-cinzel' }); // <--- Variable definiert

export const metadata: Metadata = {
  title: "GaiaForge",
  description: "AI Powered Hytale Modding Tutor",
};

const prisma = new PrismaClient();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side: try to get the user's preferred background
  let bg = "hero-bg.jpg";
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (user?.backgroundImage) bg = user.backgroundImage;
    }
  } catch (e) {
    // ignore and use default
    console.error("Error fetching user background:", e);
  }

  return (
    <html lang="en">
      {/* Beide Fonts hier laden */}
      <body className={`${inter.className} ${cinzel.variable}`}>
        {/* Global background image (applies to all pages) */}
        <div className="fixed inset-0 z-0">
          <Image src={`/${bg}`} alt="Background" fill className="object-cover opacity-40" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-transparent" />
        </div>

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}