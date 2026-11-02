'use client';

import dynamic from 'next/dynamic';

const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? dynamic(
        () =>
          import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })),
        { ssr: false },
      )
    : () => null;

export default function Devtools() {
  return <ReactQueryDevtools initialIsOpen={false} />;
}
