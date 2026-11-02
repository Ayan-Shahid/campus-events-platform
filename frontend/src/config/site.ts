import type { Metadata } from 'next';
import { env } from '@/config/env';

export const siteConfig = {
  name: 'Gather',
  description: 'Discover, book and manage campus events effortlessly',
  url: env.NEXT_PUBLIC_APP_URL,
} as const;

/** Default metadata for the root layout. Pages override `title` with a plain string. */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  },
};
