'use client';

import "./globals.css";
import NavDesktop from "@/components/elements/Navbar/NavDekstop";
import localFont from 'next/font/local';
import { usePathname } from 'next/navigation';
import Head from 'next/head';

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
  ],
  variable: '--font-pokemon-solid'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isGalleryPage = pathname === '/gallery';

  return (
    <html lang="en">
      <Head>
        <title>Pokemon Card Generator</title>
        <meta name="description" content="Generate your own Pokemon cards" />
      </Head>
      <body className={`${pokemonSolid.variable} ${outfit.variable} ${fontspringDemoGreycliff.variable} w-screen max-w-full bg-[#E4FDFF] flex flex-col`}>
        <NavDesktop />
        <main className={`w-full gradient-border ${isGalleryPage ? 'h-fit min-h-screen' : 'h-screen'}`}>
          {children}
        </main>
      </body>
    </html>
  );
}
