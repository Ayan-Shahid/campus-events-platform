import type { Metadata } from 'next';
import { MobileTabBar } from '@/components/layout/mobile-tab-bar';
import { SkipLink } from '@/components/layout/skip-link';
import { TopNav } from '@/components/layout/top-nav';
import { Panel } from './_components/showcase';
import { Sheet1Tokens } from './_sheets/sheet-1-tokens';
import { Sheet2Forms } from './_sheets/sheet-2-forms';
import { Sheet3Feedback } from './_sheets/sheet-3-feedback';
import { Sheet4Layout } from './_sheets/sheet-4-layout';

export const metadata: Metadata = {
  title: 'UI showcase (dev only)',
  robots: { index: false, follow: false },
};

const checklist = [
  'Both themes: use the toggle in the top nav, then re-read every sheet.',
  'Widths 390 / 834 / 1440: nothing overflows sideways; tab bar below md, top nav links from md.',
  'Keyboard pass: Tab through the whole page. Every control shows a focus ring and nothing is skipped.',
  'Esc closes the dialog, the sheet, the dropdown menu and the select, and focus returns to the trigger.',
];

export default function UiShowcasePage() {
  return (
    <div className="flex min-h-screen flex-col text-foreground">
      <SkipLink targetId="main" />
      <TopNav />

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-24 p-6 pb-28 outline-none sm:p-12 md:pb-16"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs tracking-wider text-primary uppercase">
              Gather · Component library · Dev only
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Component library showcase
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              One section per design sheet, in the same order, built from the real components so it
              can be compared with the reference side by side. This route returns a 404 in
              production.
            </p>
          </div>
          <Panel>
            <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
              Checklist
            </p>
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm">
              {checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Panel>
        </div>

        <Sheet1Tokens />
        <Sheet2Forms />
        <Sheet3Feedback />
        <Sheet4Layout />
      </main>

      {/* The live, fixed bar: `md:hidden` is applied because `fixed` defaults to true. */}
      <MobileTabBar variant="student" aria-label="App mobile" data-testid="app-mobile-tab-bar" />
    </div>
  );
}
