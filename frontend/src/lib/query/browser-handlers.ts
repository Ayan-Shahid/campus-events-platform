'use client';

import { toast } from 'sonner';
import { routes } from '@/config/routes';
import type { QueryClientHandlers } from '@/lib/query/make-query-client';

let handlingUnauthorized = false;

function broadcastSignedOut(): void {
  // Wired up in step 5.
}

function redirectToSignIn(): void {
  if (window.location.pathname === routes.signIn) {
    handlingUnauthorized = false;
    return;
  }

  // Step 4 replaces this with the shared safe-redirect check. A same-origin path taken
  // straight from `location` cannot point at another site.
  const returnTo = window.location.pathname + window.location.search;
  const url = new URL(routes.signIn, window.location.origin);
  url.searchParams.set('returnTo', returnTo);

  // A full navigation, not router.push: it also drops everything held in memory.
  window.location.assign(url.href);
}

export const browserHandlers: QueryClientHandlers = {
  onUnauthorized(_error, client) {
    if (handlingUnauthorized) return;
    handlingUnauthorized = true;

    client.clear();
    broadcastSignedOut();
    redirectToSignIn();
  },

  onBackgroundRefreshError(_error, query) {
    // One shared id so a burst of failing refetches shows a single toast.
    toast.error(query.meta?.refreshErrorMessage ?? "Couldn't refresh this data", {
      id: 'background-refresh-error',
    });
  },
};
