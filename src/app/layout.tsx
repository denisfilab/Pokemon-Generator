import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavDesktop from "@/components/elements/Navbar/NavDekstop";
import localFont from 'next/font/local'

const fontspringDemoGreycliff = localFont({
  src: [
    {
      path: './fonts/Fontspring-DEMO-greycliffcf-medium.woff',
      weight: '500',
      style: 'normal',
    }
  ],
  variable: '--font-fontspring'
});

const outfit = localFont({
  src: [
    {
      path: './fonts/Outfit-Bold.woff',
      weight: 'bold',
      style: 'normal',
    },
    {
      path: './fonts/Outfit-Medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Outfit-Regular.woff',
      weight: 'normal',
      style: 'normal',
    }
  ],
  variable: '--font-outfit'
});

const pokemonSolid = localFont({
  src: [
    {
      path: './fonts/Pokemon-Solid.woff',
      weight: 'normal',
      style: 'normal',
    }
  ], variable: '--font-pokemon-solid'
});

export const metadata: Metadata = {
  title: "Pokemon Card Generator",
  description: "Generate your own Pokemon cards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pokemonSolid.variable} ${outfit.variable} ${fontspringDemoGreycliff.variable} w-screen max-w-full bg-[#E4FDFF] flex flex-col`}>
        <NavDesktop />
        <main className="w-full gradient-border h-screen">
          {children}
        </main>
      </body>

    </html>
  );
}
