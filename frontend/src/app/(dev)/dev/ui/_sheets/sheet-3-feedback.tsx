'use client';

import * as React from 'react';
import { Download, Pencil, QrCode, RotateCw, Search, Ticket, X } from 'lucide-react';
import { toast } from 'sonner';
import Banner from '@/components/feedback/banner';
import EmptyState from '@/components/feedback/empty-state';
import QueryError from '@/components/feedback/query-error';
import {
  EventCardSkeleton,
  KPITileSkeleton,
  TableRowSkeleton,
} from '@/components/feedback/skeleton-presets';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldLabel } from '@/components/ui/field';
import Meter from '@/components/ui/meter';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmptyRow,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SurfaceCard } from '@/components/visual/surface-card';
import { cn } from '@/lib/utils';
import { Block, Eyebrow, Hint, Panel, ShowcaseSheet } from '../_components/showcase';

function Banners() {
  const [dismissed, setDismissed] = React.useState(false);

  return (
    <Block title="Banner" hint="components/feedback/banner">
      <Panel className="flex flex-col gap-3">
        <Banner variant="info" title="Free cancellation" description="until Thu 12 Nov, 18:30." />
        {dismissed ? (
          <Button type="button" size="sm" variant="outline" onClick={() => setDismissed(false)}>
            Show the dismissed banner again
          </Button>
        ) : (
          <Banner
            variant="success"
            title="You're registered."
            description="A confirmation was sent to your university email."
            onDismiss={() => setDismissed(true)}
          />
        )}
        <Banner
          variant="warning"
          title="Seat counts may be out of date."
          description="Showing numbers from 18:31."
          action={
            <Button size="sm" variant="outline" className="h-8">
              <RotateCw aria-hidden="true" /> Retry
            </Button>
          }
        />
        <Banner
          variant="error"
          title="We couldn't sign you in."
          description="Fix the 2 highlighted fields and try again."
        />
        <Hint>
          info / success / warning → role=&quot;status&quot; · error → role=&quot;alert&quot;
        </Hint>
      </Panel>
    </Block>
  );
}

function QueryErrorAndToast() {
  return (
    <Block title="QueryError & toast" hint="feedback/query-error · sonner">
      <Panel className="flex flex-col gap-4">
        <Eyebrow>QueryError (any failed query)</Eyebrow>
        <QueryError onRetry={() => new Promise((resolve) => setTimeout(resolve, 1200))} />
        <Hint>Retry → query.refetch() · button shows a spinner while refetching</Hint>

        <Eyebrow className="mt-2">Toast</Eyebrow>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              toast.success('Cancelled Photography Walk. Your seat went to the waitlist.')
            }
          >
            Success toast
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              toast('Event saved as draft.', {
                action: { label: 'Undo', onClick: () => toast('Draft restored.') },
              })
            }
          >
            Toast with action
          </Button>
        </div>
        <Hint>bottom-right desktop · top on mobile (clear of tab bar) · never errors-only</Hint>
      </Panel>
    </Block>
  );
}

function EmptyAndSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <Block title="EmptyState" hint="feedback/empty-state · heading level is a prop">
        <Panel className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <EmptyState
            icon={Search}
            heading="No events match"
            headingLevel="h4"
            description='Try removing "After 5 pm" or searching all campuses.'
            actions={
              <Button size="sm" variant="outline">
                Clear filters
              </Button>
            }
            className="p-6 sm:p-6"
          />
          <EmptyState
            icon={Ticket}
            heading="No registrations yet"
            headingLevel="h4"
            description="Events you register for will appear here."
            actions={<Button size="sm">Browse events</Button>}
            className="p-6 sm:p-6"
          />
        </Panel>
      </Block>

      <Block title="Skeleton" hint="feedback/skeleton-presets · same shape as content">
        <Panel className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Eyebrow>Event card</Eyebrow>
            <EventCardSkeleton />
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Eyebrow>Table rows</Eyebrow>
              <table className="w-full">
                <tbody>
                  <TableRowSkeleton columns={3} />
                  <TableRowSkeleton columns={3} />
                  <TableRowSkeleton columns={3} />
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-2">
              <Eyebrow>KPI tile</Eyebrow>
              <KPITileSkeleton />
            </div>
            <Hint>aria-busy=&quot;true&quot; · motion off when prefers-reduced-motion</Hint>
          </div>
        </Panel>
      </Block>
    </div>
  );
}

interface DemoEventCardProps {
  day: string;
  weekday: string;
  title: string;
  taken: number;
  capacity: number;
  status: 'open' | 'full' | 'closed';
  waitlisted?: number;
  gradient: string;
}

/** Composed in-page from SurfaceCard + Badge + Meter + Button. The real EventCard lands in features/events. */
function DemoEventCard({
  day,
  weekday,
  title,
  taken,
  capacity,
  status,
  waitlisted,
  gradient,
}: DemoEventCardProps) {
  const seatsLeft = capacity - taken;
  const statusBadge =
    status === 'open' ? (
      <Badge variant="warning">
        {seatsLeft} of {capacity} seats left
      </Badge>
    ) : status === 'full' ? (
      <Badge variant="destructive">Full · {waitlisted} waitlisted</Badge>
    ) : (
      <Badge variant="neutral">Registration closed</Badge>
    );

  return (
    <SurfaceCard
      surface="shader"
      shaderGraphic={<div aria-hidden="true" className={cn('h-36 w-full', gradient)} />}
      className="p-3"
    >
      <div className="flex h-28 flex-col justify-between">
        <div className="flex w-fit flex-col items-center rounded-lg border border-border bg-card/80 px-2.5 py-1 backdrop-blur">
          <span className="font-display text-lg leading-none font-bold">{day}</span>
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
            {weekday}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-3">
        <div>{statusBadge}</div>
        <h4 className="font-display text-lg font-semibold">{title}</h4>
        <Meter
          value={taken}
          max={capacity}
          tone={status === 'full' ? 'danger' : 'default'}
          label={`${taken} of ${capacity} seats taken`}
          aria-label={`${title}: ${taken} of ${capacity} seats taken`}
        />
        {status === 'open' && (
          <div className="flex gap-2">
            <Button className="flex-1">Register</Button>
            <Button variant="outline">Details</Button>
          </div>
        )}
        {status === 'full' && (
          <Button variant="outline" className="w-full">
            Join waitlist
          </Button>
        )}
        {status === 'closed' && (
          <Button variant="outline" className="w-full" disabled>
            Cut-off passed
          </Button>
        )}
      </div>
    </SurfaceCard>
  );
}

function SurfaceAndEventCards() {
  return (
    <Block
      title="SurfaceCard & event card states"
      hint="visual/surface-card · features/events/components/event-card"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <SurfaceCard as="div" surface="shader" className="p-4">
            <p className="font-sans text-sm font-semibold">surface=&quot;shader&quot;</p>
            <Hint className="mt-1">canvas layer aria-hidden · pointer-events-none</Hint>
          </SurfaceCard>
          <SurfaceCard as="div" surface="plain" className="p-4">
            <p className="font-sans text-sm font-semibold">surface=&quot;plain&quot;</p>
            <Hint className="mt-1">also the no-WebGL fallback</Hint>
          </SurfaceCard>
          <SurfaceCard as="div" className="p-4">
            <a
              href="#surface-card-focus"
              id="surface-card-focus"
              className="font-sans text-sm font-semibold outline-none"
            >
              focus-within
            </a>
            <Hint className="mt-1">ring shows when the whole card is a link</Hint>
          </SurfaceCard>
        </div>

        <DemoEventCard
          day="13"
          weekday="FRI"
          title="Data Viz Night"
          taken={54}
          capacity={60}
          status="open"
          gradient="bg-gradient-to-br from-teal-500/50 via-blue-700/40 to-card"
        />
        <DemoEventCard
          day="15"
          weekday="SUN"
          title="Weekend Hackathon"
          taken={120}
          capacity={120}
          waitlisted={12}
          status="full"
          gradient="bg-gradient-to-br from-amber-500/50 via-rose-600/40 to-card"
        />
        <DemoEventCard
          day="21"
          weekday="SAT"
          title="Commuter Society Mixer"
          taken={30}
          capacity={60}
          status="closed"
          gradient="bg-gradient-to-br from-sky-500/40 via-fuchsia-600/40 to-card"
        />
      </div>
    </Block>
  );
}

function TableAndMenu() {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[3fr_2fr]">
      <Block title="Table" hint="ui/table · overflow-x box on small screens">
        <Panel>
          <Table>
            <TableCaption>Showcase events table</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Event</TableHead>
                <TableHead scope="col">Status</TableHead>
                <TableHead scope="col">Seats</TableHead>
                <TableHead scope="col" className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Data Viz Night</TableCell>
                <TableCell>
                  <Badge variant="success">Published</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">54/60</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Weekend Hackathon</TableCell>
                <TableCell>
                  <Badge variant="destructive">Full</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">120/120</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ML Reading Group</TableCell>
                <TableCell>
                  <Badge variant="draft">Draft</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">—</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">
                    Continue
                  </Button>
                </TableCell>
              </TableRow>
              <TableEmptyRow colSpan={4} message="Empty row state: “No events in this tab.”" />
            </TableBody>
          </Table>
        </Panel>
      </Block>

      <Block title="Dropdown menu" hint="ui/dropdown-menu · row actions">
        <Panel className="flex flex-col items-start gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon" aria-label="Row actions" />}
            >
              <span aria-hidden="true">…</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Pencil /> Edit event
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download /> Export attendees (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem>
                <QrCode /> Open check-in
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <X /> Cancel event…
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Hint>
            trigger aria-expanded · ↑↓ moves · Esc returns focus to trigger · “…” opens confirm
          </Hint>
        </Panel>
      </Block>
    </div>
  );
}

function Overlays() {
  return (
    <Block title="Overlays" hint="ui/dialog (desktop confirm) · ui/sheet (mobile bottom sheet)">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_1fr]">
        <Panel className="flex flex-col items-start gap-4">
          <Eyebrow>Dialog</Eyebrow>
          <Dialog>
            <DialogTrigger render={<Button variant="destructive">Cancel event… (Dialog)</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel this event?</DialogTitle>
                <DialogDescription>
                  All 132 registered and waitlisted students will be emailed. This can&apos;t be
                  undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline">Keep event</Button>} />
                <DialogClose
                  render={
                    <Button variant="destructive" onClick={() => toast('Event cancelled.')}>
                      Cancel event
                    </Button>
                  }
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Hint>focus starts inside · trapped · Esc closes · returns to this button</Hint>
        </Panel>

        <Panel className="flex flex-col items-start gap-4">
          <Eyebrow>Sheet (side=&quot;bottom&quot;)</Eyebrow>
          <Sheet>
            <SheetTrigger render={<Button variant="outline">Filters drawer (Sheet)</Button>} />
            <SheetContent side="bottom" className="mx-auto max-w-lg">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <SheetDescription className="sr-only">Filter the list of events.</SheetDescription>
              <div className="flex flex-col gap-4 py-4">
                <Field orientation="horizontal">
                  <Checkbox id="sheet-evening" defaultChecked />
                  <FieldLabel htmlFor="sheet-evening" className="font-normal">
                    Evening (after 5 pm)
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="sheet-weekends" />
                  <FieldLabel htmlFor="sheet-weekends" className="font-normal">
                    Weekends
                  </FieldLabel>
                </Field>
                <Tabs defaultValue="any">
                  <TabsList aria-label="Location" className="w-full">
                    <TabsTrigger value="any">Any</TabsTrigger>
                    <TabsTrigger value="on-campus">On campus</TabsTrigger>
                    <TabsTrigger value="online">Online</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <SheetClose render={<Button className="w-full">Show 31 events</Button>} />
            </SheetContent>
          </Sheet>
          <Hint>Esc closes · focus returns to this button</Hint>
        </Panel>

        <Panel>
          <Eyebrow>Overlay rules</Eyebrow>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-4 text-sm text-muted-foreground">
            <li>
              Dialog for destructive confirms on desktop; Sheet (side=&quot;bottom&quot;) on mobile.
            </li>
            <li>Title wired via aria-labelledby; body via aria-describedby.</li>
            <li>Background is inert; scroll locked.</li>
            <li>On close, focus returns to the button that opened it.</li>
            <li>
              The sheet&apos;s primary action reports the result (&quot;Show 31 events&quot;).
            </li>
          </ul>
        </Panel>
      </div>
    </Block>
  );
}

export function Sheet3Feedback() {
  return (
    <ShowcaseSheet
      number={3}
      title="Feedback, data display & overlays"
      description="Errors stay on the page until fixed. Toasts only confirm completed actions. Every loading state has a skeleton with the same shape as the content."
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <Banners />
        <QueryErrorAndToast />
      </div>
      <EmptyAndSkeleton />
      <SurfaceAndEventCards />
      <TableAndMenu />
      <Overlays />
    </ShowcaseSheet>
  );
}
