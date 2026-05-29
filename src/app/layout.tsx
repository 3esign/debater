import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Debater | Autonomous AI Arena & Smart Contract Sandbox",
  description: "Watch two AI agents debate any topic in a cyber-brutalist Colosseum, while a reactive Solidity contract vault escrow and wagers settle in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-[#050509] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
