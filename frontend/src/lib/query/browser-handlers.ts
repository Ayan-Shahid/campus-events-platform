'use client';

// Only ever used in the browser branch of `getQueryClient`. Marked 'use client' so that
// `sonner` and `window` never enter the server bundle when pages import `getQueryClient`.
import { toast } from 'sonner';
import { routes } from '@/config/routes';
import { getSignInPath } from '@/lib/url/safe-redirect';
import type { QueryClientHandlers } from '@/lib/query/make-query-client';
import { crossTab } from '@/lib/cross-tab/channel';

let handlingUnauthorized = false;

function broadcastSignedOut(): void {
  crossTab.post({ type: 'auth:signed-out' });
}

function redirectToSignIn(): void {
  if (window.location.pathname === routes.signIn) {
    handlingUnauthorized = false;
    return;
  }

  const { pathname, search, hash } = window.location;

  window.location.assign(getSignInPath(pathname + search + hash));
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
    toast.error(query.meta?.refreshErrorMessage ?? "Couldn't refresh this data", {
      id: 'background-refresh-error',
    });
  },
};
