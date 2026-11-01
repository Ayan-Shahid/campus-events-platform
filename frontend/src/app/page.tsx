'use client';

import { useState } from 'react';
import ThemeToggle from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
} from '@/components/ui/field';
import { FilterChip, RemovableChip } from '@/components/ui/filter-chip';
import {
  Mail,
  CheckCircle2,
  User,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Wifi,
  CalendarX2,
  RotateCw,
  Pencil,
  Download,
  QrCode,
  X,
  MoreHorizontal,
} from 'lucide-react';
import Meter from '@/components/ui/meter';
import Banner from '@/components/feedback/banner';
import QueryError from '@/components/feedback/query-error';
import EmptyState from '@/components/feedback/empty-state';
import {
  EventCardSkeleton,
  TableRowSkeleton,
  KPITileSkeleton,
} from '@/components/feedback/skeleton-presets';
import { SurfaceCard } from '@/components/visual/surface-card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableEmptyRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { toast } from 'sonner';
import { announce } from '@/lib/a11y/announcer';

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);

  const swatches = [
    { name: 'background', class: 'bg-background text-foreground border border-border' },
    { name: 'card', class: 'bg-card text-card-foreground border border-border' },
    { name: 'muted', class: 'bg-muted text-muted-foreground' },
    { name: 'faint', class: 'bg-faint text-background' },
    { name: 'primary', class: 'bg-primary text-primary-foreground' },
    { name: 'mesh-primary', class: 'bg-mesh-primary text-primary-foreground' },
    { name: 'success', class: 'bg-success text-background' },
    {
      name: 'success-subtle',
      class: 'bg-success-subtle text-success border border-success-border',
    },
    { name: 'warning', class: 'bg-warning text-background' },
    {
      name: 'warning-subtle',
      class: 'bg-warning-subtle text-warning border border-warning-border',
    },
    { name: 'destructive', class: 'bg-destructive text-background' },
    {
      name: 'destructive-subtle',
      class: 'bg-destructive-subtle text-destructive border border-destructive-border',
    },
    { name: 'info', class: 'bg-info text-background' },
    {
      name: 'info-subtle',
      class: 'bg-info-subtle text-info border border-info-border',
    },
  ];

  return (
    <main className="flex flex-1 flex-col items-center justify-start gap-8 bg-background p-8 text-foreground transition-colors sm:p-16">
      {/* Top Bar with Theme Toggle */}
      <div className="flex w-full max-w-4xl items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="font-display text-xl font-bold">Theme &amp; Token Preview</h1>
          <p className="font-sans text-sm text-muted-foreground">
            Night Commute Design System Verification
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="flex w-full max-w-4xl flex-col gap-10">
        {/* Typography Section */}
        <section
          className="flex flex-col gap-4 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
            Typography Ratios
          </h2>
          <div className="flex flex-col gap-3">
            <p className="font-display text-3xl font-bold">
              Display Font: Bricolage Grotesque (Headings)
            </p>
            <p className="font-sans text-base font-normal">
              Body Font: IBM Plex Sans (Regular text, descriptions, and UI labels)
            </p>
            <p className="font-mono text-sm font-semibold">
              Mono Font: IBM Plex Mono (Seat counts, IDs, times: 04, 12, 2026)
            </p>
          </div>
        </section>

        {/* Mesh Button Section */}
        <section
          className="flex flex-col gap-4 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
            Mesh-Ember Primary Button
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button>
              <span>Book Campus Event</span>
              <RotateCw />
            </Button>
            <Button variant="outline">Book Campus Event</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive">Cancel Booking</Button>
            <Button loading>Processing</Button>
          </div>
        </section>

        {/* SurfaceCard & Event Card States Section[cite: 4] */}
        <section
          className="flex flex-col gap-6 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
              SurfaceCard &amp; Event Card States
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              visual/surface-card · features/events/components/event-card
            </span>
          </div>

          {/* Surface Spec Indicators */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SurfaceCard surface="shader" className="p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                surface=&quot;shader&quot;
              </span>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                canvas layer aria-hidden · pointer-events-none
              </p>
            </SurfaceCard>

            <SurfaceCard surface="plain" className="p-4">
              <span className="font-mono text-xs font-semibold text-foreground">
                surface=&quot;plain&quot;
              </span>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                also the no-WebGL fallback
              </p>
            </SurfaceCard>

            <SurfaceCard surface="plain" className="p-4">
              <a
                href="#focus-demo"
                onClick={(e) => e.preventDefault()}
                className="flex flex-col outline-none"
              >
                <span className="font-mono text-xs font-semibold text-foreground">
                  focus-within
                </span>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  tab here — ring appears when anything inside has focus
                </p>
              </a>
            </SurfaceCard>
          </div>

          {/* 3 Event Card States */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* State 1: Open / Few Seats */}
            <SurfaceCard surface="shader" as="article" className="p-4">
              <div className="mb-12 inline-flex w-fit flex-col items-center rounded-sm border border-border-strong bg-background/80 px-2.5 py-1.5 font-mono text-xs backdrop-blur-sm">
                <span className="font-display text-base font-black text-foreground">13</span>
                <span className="text-[10px] font-bold text-primary-subtle uppercase">FRI</span>
              </div>
              <div className="flex flex-col gap-3">
                <Badge variant="warning" className="w-fit">
                  • 6 of 60 seats left
                </Badge>
                <h3 className="font-display text-base font-bold">Data Viz Night</h3>
                <Meter value={54} max={60} tone="default" label="54 of 60 seats taken" />
                <div className="mt-1 flex items-center gap-2">
                  <Button size="sm" className="flex-1">
                    Register
                  </Button>
                  <Button size="sm" variant="outline">
                    Details
                  </Button>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  open / few seats
                </span>
              </div>
            </SurfaceCard>

            {/* State 2: Full -> Waitlist */}
            <SurfaceCard
              surface="shader"
              as="article"
              shaderGraphic={
                <div className="h-36 w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-warning/40 via-destructive/30 to-transparent opacity-90 blur-xl" />
              }
              className="p-4"
            >
              <div className="mb-12 inline-flex w-fit flex-col items-center rounded-lg bg-background/80 px-2.5 py-1 font-mono text-xs backdrop-blur-sm">
                <span className="font-bold text-foreground">15</span>
                <span className="text-[10px] text-muted-foreground uppercase">SUN</span>
              </div>
              <div className="flex flex-col gap-3">
                <Badge variant="destructive" className="w-fit">
                  • Full · 12 waitlisted
                </Badge>
                <h3 className="font-display text-base font-bold">Weekend Hackathon</h3>
                <Meter value={120} max={120} tone="danger" label="120 of 120 capacity reached" />
                <div className="mt-1">
                  <Button size="sm" variant="outline" className="w-full">
                    Join waitlist
                  </Button>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">full → waitlist</span>
              </div>
            </SurfaceCard>

            {/* State 3: Closed / Disabled */}
            <SurfaceCard surface="plain" as="article" className="p-4">
              <div className="mb-12 inline-flex w-fit flex-col items-center rounded-lg border border-border bg-muted/40 px-2.5 py-1 font-mono text-xs">
                <span className="font-bold text-foreground">21</span>
                <span className="text-[10px] text-muted-foreground uppercase">SAT</span>
              </div>
              <div className="flex flex-col gap-3">
                <Badge variant="secondary" className="w-fit">
                  • Registration closed
                </Badge>
                <h3 className="font-display text-base font-bold">Commuter Society Mixer</h3>
                <Meter value={30} max={60} tone="default" label="Registration closed" />
                <div className="mt-1">
                  <Button size="sm" variant="outline" disabled className="w-full">
                    Cut-off passed
                  </Button>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  closed · disabled + reason text
                </span>
              </div>
            </SurfaceCard>
          </div>
        </section>

        {/* Table & Dropdown Menu Section[cite: 4] */}
        <section
          className="flex flex-col gap-6 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
              Table &amp; Dropdown Menu
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              ui/table (overflow-x box) · ui/dropdown-menu (row actions)
            </span>
          </div>

          <p className="font-mono text-xs text-muted-foreground">
            &lt;caption&gt; (visually hidden in app) · th scope=&quot;col&quot; · row hover ·
            trigger aria-expanded · &quot;…&quot; = opens confirm
          </p>

          {/* Populated Table */}
          <Table>
            <TableCaption>Organizer Campus Events Overview</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Data Viz Night</TableCell>
                <TableCell>
                  <Badge variant="success">• Published</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">54/60</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger aria-label="Row actions for Data Viz Night">
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => announce('Editing Data Viz Night')}>
                        <Pencil /> Edit event
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => announce('Exporting attendees CSV')}>
                        <Download /> Export attendees (CSV)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => announce('Opening check-in view')}>
                        <QrCode /> Open check-in
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        // opensConfirm
                        onClick={() => announce('Cancel confirmation requested')}
                      >
                        <X /> Cancel event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">
                  Weekend Hackathon{' '}
                  <span className="ml-1 font-mono text-xs text-muted-foreground">· row hover</span>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive">• Full</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">120/120</TableCell>
                <TableCell className="text-right">
                  <Button size="xs" variant="outline">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">ML Reading Group</TableCell>
                <TableCell>
                  <Badge variant="draft">• Draft</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">—</TableCell>
                <TableCell className="text-right">
                  <Button size="xs" variant="outline">
                    Continue
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Empty Row State Table Demo */}
          <div className="flex flex-col gap-2 pt-2">
            <h3 className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
              Empty Row State
            </h3>
            <Table>
              <TableCaption>Archived Campus Events</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableEmptyRow colSpan={4} message='Empty row state: "No events in this tab."' />
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Overlays: Dialog & Sheet Section[cite: 4] */}
        <section
          className="flex flex-col gap-6 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
              Overlays (Dialog &amp; Sheet)
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              ui/dialog (desktop confirm) · ui/sheet (mobile bottom sheet, filters drawer)
            </span>
          </div>

          <p className="font-mono text-xs text-muted-foreground">
            focus starts on the safe action · trapped · Esc closes · returns focus to trigger on
            close
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {/* Desktop Destructive Confirmation Dialog */}
            <Dialog>
              <DialogTrigger
                render={<Button variant="destructive">Cancel event… (Desktop Dialog)</Button>}
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel this event?</DialogTitle>
                  <DialogDescription>
                    All 132 registered and waitlisted students will be emailed. This can&apos;t be
                    undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  {/* Safe action receives initial focus via autoFocus */}
                  <DialogClose render={<Button variant="outline">Keep event</Button>} />
                  <DialogClose
                    render={
                      <Button
                        variant="destructive"
                        onClick={() => {
                          toast('Event cancelled.', {
                            description: 'All 132 registered students have been notified.',
                            icon: <CheckCircle2 className="size-4 text-success" />,
                          });
                          announce('Event cancelled.');
                        }}
                      >
                        Cancel event
                      </Button>
                    }
                  />
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Mobile Filter Bottom Sheet */}
            <Sheet>
              <SheetTrigger
                render={<Button variant="outline">Filters Drawer (Bottom Sheet)</Button>}
              />
              <SheetContent side="bottom" className="mx-auto max-w-lg">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <button
                    type="button"
                    onClick={() => announce('Filters reset')}
                    className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  >
                    Reset
                  </button>
                </SheetHeader>
                <SheetDescription className="sr-only">
                  Filter campus events by time, weekend availability, and attendance mode.
                </SheetDescription>

                <div className="flex flex-col gap-3 py-2">
                  <Field orientation="horizontal" className="items-center">
                    <Checkbox id="sheet-evening" defaultChecked />
                    <FieldLabel htmlFor="sheet-evening" className="cursor-pointer font-normal">
                      Evening (after 5 pm)
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal" className="items-center">
                    <Checkbox id="sheet-weekends" />
                    <FieldLabel htmlFor="sheet-weekends" className="cursor-pointer font-normal">
                      Weekends
                    </FieldLabel>
                  </Field>

                  <Tabs defaultValue="any" className="mt-2 w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="any">Any</TabsTrigger>
                      <TabsTrigger value="campus">On campus</TabsTrigger>
                      <TabsTrigger value="online">Online</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <SheetClose
                  render={
                    <Button className="w-full" onClick={() => announce('Showing 31 events')}>
                      Show 31 events
                    </Button>
                  }
                />
              </SheetContent>
            </Sheet>
          </div>
        </section>

        {/* Feedback Banners & Query Error Section[cite: 2] */}
        <section
          className="flex flex-col gap-6 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex flex-col gap-1">
            <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
              Banners (Feedback)
            </h2>
            <p className="font-mono text-xs text-muted-foreground">
              info / success / warning → role=&quot;status&quot; · error → role=&quot;alert&quot;
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Banner
              variant="info"
              title="Free cancellation"
              description="until Thu 12 Nov, 18:30."
            />
            <Banner
              variant="success"
              title="You're registered."
              description="A confirmation was sent to your university email."
              onDismiss={() => announce('Registration banner dismissed')}
            />
            <Banner
              variant="warning"
              title="Seat counts may be out of date."
              description="Showing numbers from 18:31."
              action={
                <Button size="sm" variant="outline">
                  <RotateCw />
                  <span className="text-foreground">Retry</span>
                </Button>
              }
            />
            <Banner
              variant="error"
              title="We couldn't sign you in."
              description="Fix the 2 highlighted fields and try again."
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <h3 className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
              QueryError (Any Failed Query)
            </h3>
            <QueryError
              title="Couldn't load events."
              description="Check your connection and try again."
              onRetry={async () => {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                announce('Events reloaded successfully.');
              }}
            />
          </div>
        </section>

        {/* Sonner Toasts Confirmation Section[cite: 2] */}
        <section
          className="flex flex-col gap-4 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex flex-col gap-1">
            <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
              Toaster Confirmations (Sonner)
            </h2>
            <p className="font-mono text-xs text-muted-foreground">
              bottom-right desktop · top on mobile · confirmations only (never errors)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                toast('Cancelled Photography Walk.', {
                  description: 'Your seat went to the waitlist.',
                  icon: <CheckCircle2 className="size-4 text-success" />,
                });
                announce('Cancelled Photography Walk. Your seat went to the waitlist.');
              }}
            >
              Toast · Success
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                toast('Event saved as draft.', {
                  action: {
                    label: 'Undo',
                    onClick: () => {
                      announce('Draft restoration undone.');
                    },
                  },
                  icon: <CheckCircle2 className="size-4 text-success" />,
                });
                announce('Event saved as draft.');
              }}
            >
              Toast · With Action
            </Button>
          </div>
        </section>

        {/* Empty State Component Section */}
        <section
          className="flex flex-col gap-4 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
            Empty State
          </h2>
          <EmptyState
            icon={CalendarX2}
            heading="No upcoming campus events"
            headingLevel="h3"
            description="You haven't registered for any sessions this week. Explore the catalog to discover upcoming hackathons and career fairs."
            actions={<Button size="sm">Browse Campus Catalog</Button>}
          />
        </section>

        {/* Skeleton Presets Section */}
        <section
          className="flex flex-col gap-6 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex flex-col gap-1">
            <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
              Skeleton Presets (aria-busy)
            </h2>
            <p className="font-mono text-xs text-muted-foreground">
              Presets for KPI Tile, Event Card, and Data Table Rows
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <KPITileSkeleton />
            <EventCardSkeleton />
          </div>

          <Table aria-busy="true">
            <TableCaption>Loading Campus Events</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRowSkeleton columns={4} />
              <TableRowSkeleton columns={4} />
              <TableRowSkeleton columns={4} />
            </TableBody>
          </Table>
        </section>

        {/* Badges Demo Section */}
        <section
          className="flex flex-col gap-4 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
            Badge Variants
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="ghost">Ghost</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="draft">Draft</Badge>
            <Badge variant="default" className="gap-1">
              <Sparkles className="size-3" /> Featured
            </Badge>
          </div>
        </section>

        {/* Filter Chips & Removable Chips Section[cite: 1] */}
        <section
          className="flex flex-col gap-6 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          {/* Filter Chips (aria-pressed) */}
          <div className="flex flex-col gap-3">
            <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
              Filter Chips (aria-pressed)
            </h2>
            <div className="flex flex-wrap items-center gap-2.5">
              <FilterChip defaultChecked>All</FilterChip>
              <FilterChip>Workshops</FilterChip>
              <FilterChip>Careers</FilterChip>
              <FilterChip>
                <Wifi className="size-4" />
                Online
              </FilterChip>
            </div>
            <p className="font-mono text-xs text-muted-foreground">on · off · focus · with icon</p>
          </div>

          {/* Removable Chips */}
          <div className="flex flex-col gap-3">
            <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
              Removable Chip
            </h2>
            <div className="flex flex-wrap items-center gap-2.5">
              <RemovableChip onRemove={() => announce('Removed After 5 pm filter')}>
                After 5 pm
              </RemovableChip>
              <RemovableChip onRemove={() => announce('Removed City Centre filter')}>
                City Centre
              </RemovableChip>
            </div>
          </div>
        </section>

        {/* Progress Bars Demo Section */}
        <section
          className="flex flex-col gap-5 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
            Progress Indicators
          </h2>

          <div className="flex flex-col gap-4">
            <Progress value={75}>
              <div className="flex w-full items-center">
                <ProgressLabel>Seat Allocation Capacity</ProgressLabel>
                <ProgressValue />
              </div>
            </Progress>

            <Progress value={30}>
              <div className="flex w-full items-center">
                <ProgressLabel>Early Bird Registration Limit</ProgressLabel>
                <ProgressValue />
              </div>
            </Progress>
          </div>
          <div className="flex flex-col gap-6 rounded-[20px] border border-border bg-card p-6">
            {/* 1. Default Tone */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                tone=&quot;default&quot; · 90%
              </span>
              <Meter value={54} max={60} tone="default" label="54 of 60 seats taken" />
              <span className="text-xs text-muted-foreground">
                aria-valuetext=&quot;54 of 60 seats taken&quot;
              </span>
            </div>

            {/* 2. Success Tone */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                tone=&quot;success&quot; · 48%
              </span>
              <Meter value={38} max={80} tone="success" label="38 of 80 spots remaining" />
            </div>

            {/* 3. Danger Tone */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                tone=&quot;danger&quot; · full
              </span>
              <Meter value={120} max={120} tone="danger" label="120 of 120 capacity reached" />
            </div>

            {/* 4. Segmented Password Strength */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                segmented · password strength 1 of 4
              </span>
              <Meter
                value={25}
                max={100}
                segmented
                segmentsCount={4}
                tone="danger"
                label="Password strength 1 of 4"
              />
            </div>

            <p className="pt-2 text-xs text-muted-foreground">
              SeatMeter (capacity + waitlist logic) lives in features/events, not here.
            </p>
          </div>
        </section>

        {/* Tabs Demo Section */}
        <section
          className="flex flex-col gap-4 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
            Navigation Tabs
          </h2>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList variant="line">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="registered">My Registrations</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <div className="mt-4 pt-2">
              <TabsContent value="upcoming" className="text-muted-foreground">
                Displaying active events scheduled for the upcoming campus semester.
              </TabsContent>
              <TabsContent value="registered" className="text-muted-foreground">
                You are currently registered for 2 tech workshops and 1 hackathon.
              </TabsContent>
              <TabsContent value="archived" className="text-muted-foreground">
                No archived events found from previous semesters.
              </TabsContent>
            </div>
          </Tabs>
        </section>

        {/* Form Fields & Inputs Demo Section */}
        <section
          className="flex flex-col gap-6 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
            Form Fields &amp; Input States
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 1. Username Input (with aria-hidden leading icon) */}
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <div className="relative flex items-center">
                <User
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 z-10 size-4 text-muted-foreground"
                />
                <Input id="username" type="text" placeholder="ayan_shahid" className="pl-10" />
              </div>
              <FieldDescription>
                Choose a unique handle for your organizer profile.
              </FieldDescription>
            </Field>

            {/* 2. Password Input (with password toggle button using aria-label and aria-pressed) */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative flex items-center">
                <Lock
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 z-10 size-4 text-muted-foreground"
                />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="SecretPass123!"
                  className="pr-10 pl-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 z-10 rounded text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            </Field>

            {/* 3. Default State */}
            <Field>
              <FieldLabel htmlFor="event-name">
                Event Name <span className="text-primary">*</span>
              </FieldLabel>
              <Input id="event-name" type="text" placeholder="e.g. AI & Web3 Hackathon" />
              <FieldDescription>
                Provide a clear and concise title for the campus event.
              </FieldDescription>
            </Field>

            {/* 4. Icon Prefixed Input */}
            <Field>
              <FieldLabel htmlFor="organizer-email">Organizer Email</FieldLabel>
              <div className="relative flex items-center">
                <Mail
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 z-10 size-4 text-muted-foreground"
                />
                <Input
                  id="organizer-email"
                  type="email"
                  required
                  minLength={10}
                  defaultValue="ayan.shahid@university.edu"
                  className="pl-10"
                />
              </div>
              <FieldDescription className="flex items-center gap-1 text-success">
                <CheckCircle2 className="size-3.5" /> Verified university domain credentials
              </FieldDescription>
            </Field>

            {/* 5. Input with Trailing Unit ("seats") */}
            <Field>
              <FieldLabel htmlFor="seat-allocation">Seat Allocation</FieldLabel>
              <div className="relative flex items-center">
                <Input id="seat-allocation" type="number" defaultValue={120} className="pr-16" />
                <span className="pointer-events-none absolute right-3.5 font-mono text-xs text-muted-foreground">
                  seats
                </span>
              </div>
              <FieldDescription>Maximum occupancy limit for the venue.</FieldDescription>
            </Field>

            {/* 6. Select Demo */}
            <Field>
              <FieldLabel htmlFor="event-category">Event Category</FieldLabel>
              <Select defaultValue="tech">
                <SelectTrigger id="event-category" className="h-12 w-full">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="tech">Technology &amp; AI</SelectItem>
                    <SelectItem value="business">Entrepreneurship</SelectItem>
                    <SelectItem value="arts">Culture &amp; Arts</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>Select the primary domain of the event.</FieldDescription>
            </Field>

            {/* 7. Invalid / Error State */}
            <Field data-invalid="true">
              <FieldLabel htmlFor="max-attendees">Maximum Attendees</FieldLabel>
              <Input id="max-attendees" type="number" defaultValue={-5} aria-invalid="true" />
              <FieldError
                errors={[{ message: 'Capacity must be a positive integer greater than zero.' }]}
              />
            </Field>

            {/* 8. Disabled State */}
            <Field>
              <FieldLabel htmlFor="venue-location" className="opacity-60">
                Venue Location (Locked)
              </FieldLabel>
              <Input
                id="venue-location"
                type="text"
                disabled
                value="I-11/2 Auditorium, Islamabad"
              />
              <FieldDescription className="opacity-60">
                Managed centrally by university administration.
              </FieldDescription>
            </Field>
          </div>

          {/* 9. Checkbox Demo */}
          <Field orientation="horizontal" className="items-center pt-2">
            <Checkbox id="terms-agreement" aria-invalid={true} />
            <FieldLabel
              htmlFor="terms-agreement"
              className="cursor-pointer font-sans text-sm font-normal"
            >
              I agree to the university campus hosting guidelines and safety policies.
            </FieldLabel>
          </Field>

          {/* 10. Textarea Demo */}
          <Field className="pt-2">
            <FieldLabel htmlFor="event-description">Event Description &amp; Guidelines</FieldLabel>
            <Textarea
              id="event-description"
              placeholder="Provide a detailed summary of what attendees can expect..."
              aria-invalid={false}
            />
            <FieldDescription className="text-right">Maximum 500 characters</FieldDescription>
          </Field>
        </section>

        {/* FieldSet & FieldGroup Component Demos */}
        <section
          className="flex flex-col gap-6 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
            FieldSet &amp; FieldGroup Compositions
          </h2>

          <FieldSet>
            <FieldLegend variant="legend">Event Logistics Configuration</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="group-venue">Venue Identifier</FieldLabel>
                <Input id="group-venue" placeholder="e.g. Hall-B" />
                <FieldDescription>
                  Assigned automatically based on campus schedules.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="group-capacity">Seating Limit</FieldLabel>
                <Input id="group-capacity" type="number" placeholder="150" />
              </Field>
            </FieldGroup>
          </FieldSet>
        </section>

        {/* Color Swatches Grid */}
        <section
          className="flex flex-col gap-4 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
            Semantic Colour Swatches
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {swatches.map((swatch) => (
              <div
                key={swatch.name}
                className={`flex items-center justify-between rounded-[12px] p-4 font-mono text-xs font-medium ${swatch.class}`}
              >
                <span>{swatch.name}</span>
                <span className="opacity-75">token</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
