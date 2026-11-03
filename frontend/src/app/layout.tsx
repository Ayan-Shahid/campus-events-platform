import type { Metadata } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import type { ReactNode } from 'react';
import { defaultMetadata } from '@/config/site';
import Providers from './providers/providers';
import { headers } from 'next/headers';
import { ShaderBackground } from '@/components/visual/shader-background';

const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolageGrotesque.variable} ${ibmPlexMono.variable} ${ibmPlexSans.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ShaderBackground />
        <Providers nonce={nonce}>{children}</Providers>
      </body>
    </html>
  );
}
