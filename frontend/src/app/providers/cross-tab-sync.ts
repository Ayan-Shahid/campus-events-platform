'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { routes } from '@/config/routes';
import { crossTab } from '@/lib/cross-tab/channel';
import type { CrossTabMessage } from '@/lib/cross-tab/messages';
import { sessionQueryKey } from '@/lib/query/session-key';
import { getSafeRedirectPath } from '@/lib/url/safe-redirect';

const AUTH_PATHS: readonly string[] = [routes.signIn, routes.signUp];

const defaultNavigate = (path: string) => window.location.assign(path);

interface CrossTabSyncProps {
  navigate?: (path: string) => void;
}

export default function CrossTabSync({ navigate = defaultNavigate }: CrossTabSyncProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const onAuthPage = () => AUTH_PATHS.includes(window.location.pathname);

    const handle = (message: CrossTabMessage) => {
      switch (message.type) {
        case 'auth:signed-out': {
          queryClient.clear();
          if (!onAuthPage()) navigate(routes.signIn);
          return;
        }

        case 'auth:signed-in': {
          void queryClient.invalidateQueries({ queryKey: sessionQueryKey });
          if (onAuthPage()) {
            const returnTo = new URLSearchParams(window.location.search).get('returnTo');
            navigate(getSafeRedirectPath(returnTo, routes.events));
          }
          return;
        }

        case 'query:invalidate': {
          void queryClient.invalidateQueries({ queryKey: message.queryKey });
          return;
        }
      }
    };

    return crossTab.subscribe(handle);
  }, [queryClient, navigate]);

  return null;
}
