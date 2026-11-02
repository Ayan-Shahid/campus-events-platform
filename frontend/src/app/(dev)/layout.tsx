import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Everything under the (dev) route group is development tooling. In a production build the
 * whole group responds with a 404, so the showcase can never ship to students.
 */
export default function DevLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return children;
}
