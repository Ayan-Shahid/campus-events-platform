import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {},

  client: {
    /** Your own origin. Used by the safe-redirect check and `metadataBase`. */
    NEXT_PUBLIC_APP_URL: z.url(),
    /** Backend base URL. Also goes into the CSP `connect-src`. */
    NEXT_PUBLIC_API_URL: z.url(),
    /** Turns the browser mock API on (phase 3). */
    NEXT_PUBLIC_API_MOCKING: z.enum(['enabled', 'disabled']).default('disabled'),
  },

  // Next.js inlines `NEXT_PUBLIC_*` at build time only for literal `process.env.NAME`
  // accesses, so every client variable must be listed here by hand.
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_MOCKING: process.env.NEXT_PUBLIC_API_MOCKING,
  },

  // `FOO=` in a .env file counts as "not set", so defaults and required checks apply.
  emptyStringAsUndefined: true,
});
