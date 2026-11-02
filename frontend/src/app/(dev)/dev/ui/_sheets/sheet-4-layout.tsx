import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MobileTabBar } from '@/components/layout/mobile-tab-bar';
import { PageHeader } from '@/components/layout/page-header';
import { Sidebar } from '@/components/layout/sidebar';
import ThemeToggle from '@/components/layout/theme-toggle';
import { TopNav } from '@/components/layout/top-nav';
import { Download } from 'lucide-react';
import { Block, Eyebrow, Hint, Panel, ShowcaseSheet } from '../_components/showcase';

function TabCount({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-secondary px-1.5 font-mono text-[11px] text-secondary-foreground">
      {children}
    </span>
  );
}

function SkipLinkAndTopNav() {
  return (
    <Block title="SkipLink & TopNav" hint="layout/skip-link · layout/top-nav (md and up)">
      <Panel className="flex flex-col gap-4 overflow-hidden">
        <p className="text-sm text-muted-foreground">
          The skip link is the live one at the very top of this page: press Tab once from the
          address bar and it appears, first in the tab order. Enter moves focus into{' '}
          <code className="font-mono">main</code>.
        </p>
        <div className="overflow-hidden rounded-xl border border-border">
          <TopNav />
        </div>
        <Hint>
          active · aria-current=&quot;page&quot; · hover · focus-visible · theme toggle · icon
          buttons with aria-label · avatar opens account menu
        </Hint>
      </Panel>
    </Block>
  );
}

function PageHeaderAndTabs() {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <Block title="PageHeader" hint="layout/page-header · owns the page h1">
        <Panel className="flex flex-col gap-6">
          <PageHeader
            headingAs="h2"
            eyebrow="Fall semester · Week 9"
            title="Discover events"
            description="128 upcoming · 31 fit your commute"
            actions={
              <Button size="sm" variant="outline">
                <Download aria-hidden="true" /> Export (.ics)
              </Button>
            }
          />
          <Hint>
            eyebrow (optional) · title → h1 · description · actions slot wraps below on mobile
          </Hint>

          <div className="flex flex-col gap-3 border-t border-border pt-6">
            <Eyebrow>With breadcrumb</Eyebrow>
            <PageHeader
              headingAs="h2"
              title="Edit event"
              breadcrumbs={[
                { label: 'Events', href: '#' },
                { label: 'Weekend Hackathon', href: '#' },
                { label: 'Edit' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-6">
            <Eyebrow>With back link (mobile detail)</Eyebrow>
            <PageHeader
              headingAs="h2"
              title="Weekend Hackathon"
              backLink={{ label: 'Back to events', href: '#' }}
            />
          </div>
        </Panel>
      </Block>

      <Block title="Underline tabs" hint='ui/tabs variant="line" · My registrations'>
        <Panel className="flex flex-col gap-6">
          <Tabs defaultValue="upcoming">
            <TabsList variant="line" aria-label="Registration status" className="w-full">
              <TabsTrigger value="upcoming">
                Upcoming <TabCount>3</TabCount>
              </TabsTrigger>
              <TabsTrigger value="waitlisted">
                Waitlisted <TabCount>1</TabCount>
              </TabsTrigger>
              <TabsTrigger value="past">
                Past <TabCount>8</TabCount>
              </TabsTrigger>
              <TabsTrigger value="cancelled" disabled>
                Cancelled <TabCount>0</TabCount>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Hint>selected · hover · focus-visible · disabled (count 0)</Hint>

          <div className="flex flex-col gap-3 border-t border-border pt-6">
            <Eyebrow>ThemeToggle</Eyebrow>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Hint>
                dark → “Switch to light theme” · light → “Switch to dark theme” · inert placeholder
                until hydrated
              </Hint>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-6">
            <Eyebrow>Avatar</Eyebrow>
            <div className="flex flex-wrap items-center gap-4">
              <Avatar name="Ayan Shahid" size="sm" />
              <Avatar name="Ayan Shahid" size="md" />
              <Avatar name="Hira Khan" size="lg" />
              <Hint>28 / 36 / 44 · initials fallback · alt = full name</Hint>
            </div>
          </div>
        </Panel>
      </Block>
    </div>
  );
}

function SidebarBlock() {
  return (
    <Block
      title="Sidebar (organizer)"
      hint="layout/sidebar · full ≥ lg · icon rail md–lg · hidden on mobile"
    >
      <div className="flex flex-wrap items-start gap-6">
        <Sidebar mode="full" />
        <Sidebar mode="rail" />
        <Panel className="min-w-64 flex-1">
          <p className="text-sm font-semibold">States shown</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Overview = active (aria-current). Hover and focus-visible are checked live: Tab through
            the rail and the labels appear as tooltips.
          </p>
          <p className="mt-6 text-sm font-semibold">Rules</p>
          <ul className="mt-2 flex list-disc flex-col gap-2 pl-4 text-sm text-muted-foreground">
            <li>
              Rail items are icon-only, so each has an aria-label plus a tooltip on hover/focus.
            </li>
            <li>Counts are part of the link text: “Events, 14”.</li>
            <li>Not sticky / not 100vh; the shell is a flex-wrap row so it stacks cleanly.</li>
            <li>Sign-out is a button (an action), not a link.</li>
          </ul>
        </Panel>
      </div>
    </Block>
  );
}

function MobileTabBarBlock() {
  return (
    <Block
      title="MobileTabBar & floating action"
      hint="layout/mobile-tab-bar · below md · fixed bottom · safe-area padding"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Eyebrow>Student</Eyebrow>
          <div className="flex h-56 flex-col justify-end overflow-hidden rounded-xl border border-border bg-background">
            <MobileTabBar variant="student" fixed={false} aria-label="Student mobile (demo)" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Eyebrow>Organizer + FAB</Eyebrow>
          <div className="flex h-56 flex-col justify-end overflow-hidden rounded-xl border border-border bg-background">
            <MobileTabBar variant="organizer" fixed={false} aria-label="Organizer mobile (demo)" />
          </div>
        </div>
        <Panel>
          <p className="text-sm font-semibold">Rules</p>
          <ul className="mt-2 flex list-disc flex-col gap-2 pl-4 text-sm text-muted-foreground">
            <li>Icon + visible text label on every tab (never icon-only).</li>
            <li>Each tab ≥ 44 × 64 px target.</li>
            <li>Bottom padding uses env(safe-area-inset-bottom).</li>
            <li>Page content gets bottom padding so the last item isn&apos;t hidden.</li>
            <li>FAB has a text label; sits above the bar.</li>
          </ul>
          <Hint className="mt-4">
            The live, fixed bar is at the bottom of this page below md (try 390 px).
          </Hint>
        </Panel>
      </div>
    </Block>
  );
}

export function Sheet4Layout() {
  return (
    <ShowcaseSheet
      number={4}
      title="Layout & navigation"
      description={
        <>
          Landmarks first: one <code className="font-mono">&lt;header&gt;</code>, labelled{' '}
          <code className="font-mono">&lt;nav&gt;</code>s, one{' '}
          <code className="font-mono">&lt;main id=&quot;main&quot;&gt;</code>, one{' '}
          <code className="font-mono">&lt;h1&gt;</code> per page. Active links use{' '}
          <code className="font-mono">aria-current=&quot;page&quot;</code> and are styled from that
          attribute.
        </>
      }
    >
      <SkipLinkAndTopNav />
      <PageHeaderAndTabs />
      <SidebarBlock />
      <MobileTabBarBlock />
    </ShowcaseSheet>
  );
}
