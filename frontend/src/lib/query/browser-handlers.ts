'use client';

// Only ever used in the browser branch of `getQueryClient`. Marked 'use client' so that
// `sonner` and `window` never enter the server bundle when pages import `getQueryClient`.
import { toast } from 'sonner';
import { routes } from '@/config/routes';
import { getSignInPath } from '@/lib/url/safe-redirect';
import type { QueryClientHandlers } from '@/lib/query/make-query-client';

let handlingUnauthorized = false;

/** Step 5: tell other tabs the user signed out (e.g. via BroadcastChannel). */
function broadcastSignedOut(): void {
  // Wired up in step 5.
}

function redirectToSignIn(): void {
  if (window.location.pathname === routes.signIn) {
    handlingUnauthorized = false;
    return;
  }

  const { pathname, search, hash } = window.location;

  // A full navigation, not router.push: it also drops everything held in memory.
  window.location.assign(getSignInPath(pathname + search + hash));
}

export const browserHandlers: QueryClientHandlers = {
  onUnauthorized(_error, client) {
    // Several queries usually fail together; react once.
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
