'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Meter from '@/components/ui/meter';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FilterChip, RemovableChip } from '@/components/ui/filter-chip';
import Banner from '@/components/feedback/banner';
import QueryError from '@/components/feedback/query-error';
import EmptyState from '@/components/feedback/empty-state';

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
import { SkipLink } from '@/components/layout/skip-link';
import { TopNav } from '@/components/layout/top-nav';
import { PageHeader } from '@/components/layout/page-header';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileTabBar } from '@/components/layout/mobile-tab-bar';
import { Avatar } from '@/components/ui/avatar';
import ThemeToggle from '@/components/layout/theme-toggle';
import {
  Sparkles,
  Wifi,
  CalendarX2,
  RotateCw,
  Pencil,
  Download,
  X,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import { announce } from '@/lib/a11y/announcer';
import { cn } from '@/lib/utils';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';

export default function HomePage() {
  return (
    <div
      className={cn('flex min-h-screen flex-col bg-background text-foreground transition-colors')}
    >
      <SkipLink targetId="main" />
      <TopNav unreadCount={2} userName="Ayan Shahid" />

      <main
        id="main"
        tabIndex={-1}
        className={cn(
          'mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 p-6 pb-28 outline-none',
          'sm:p-12',
          'md:pb-16',
        )}
      >
        <div className={cn('flex flex-col gap-2 border-b border-border pb-6')}>
          <span className={cn('font-mono text-xs tracking-wider text-muted-foreground uppercase')}>
            GATHER DESIGN SYSTEM · COMPONENT LIBRARY SHOWCASE
          </span>
          <h1 className={cn('font-display text-3xl font-bold')}>
            Dev-Only UI Showcase (Sheets 1 — 4)
          </h1>
          <p className={cn('font-sans text-sm text-muted-foreground')}>
            Verify themes (dark/light), responsive widths (390 / 834 / 1440), and full keyboard
            accessibility passes.
          </p>
        </div>

        {/* ========================================================= */}
        {/* SHEET 1: Tokens, Buttons, Badges & Meters */}
        {/* ========================================================= */}
        <section
          className={cn(
            'flex flex-col gap-8 rounded-3xl border border-border bg-card p-8 shadow-sm',
          )}
        >
          <div className={cn('border-b border-border pb-4')}>
            <h2 className={cn('font-mono text-sm tracking-wider text-primary uppercase')}>
              Sheet 1 — Tokens, Buttons, Badges &amp; Meters
            </h2>
          </div>

          {/* Colour Tokens Swatches */}
          <div className={cn('flex flex-col gap-4')}>
            <h3 className={cn('font-mono text-xs text-muted-foreground uppercase')}>
              Colour Tokens
            </h3>
            <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6')}>
              <div
                className={cn(
                  'rounded-xl border border-border bg-background p-4 font-mono text-xs',
                )}
              >
                background
              </div>
              <div
                className={cn(
                  'rounded-xl border border-border bg-card p-4 font-mono text-xs text-card-foreground',
                )}
              >
                card
              </div>
              <div className={cn('rounded-xl bg-foreground p-4 font-mono text-xs text-background')}>
                foreground
              </div>
              <div
                className={cn('rounded-xl bg-muted p-4 font-mono text-xs text-muted-foreground')}
              >
                muted
              </div>
              <div
                className={cn(
                  'rounded-xl bg-primary p-4 font-mono text-xs text-primary-foreground',
                )}
              >
                primary
              </div>
              <div
                className={cn(
                  'rounded-xl bg-mesh-primary p-4 font-mono text-xs text-primary-foreground',
                )}
              >
                mesh-primary
              </div>
            </div>
            <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-3')}>
              <div
                className={cn(
                  'rounded-xl border border-success-border bg-success-subtle p-4 font-mono text-xs text-success',
                )}
              >
                success · subtle / border / text
              </div>
              <div
                className={cn(
                  'rounded-xl border border-warning-border bg-warning-subtle p-4 font-mono text-xs text-warning',
                )}
              >
                warning · subtle / border / text
              </div>
              <div
                className={cn(
                  'rounded-xl border border-destructive-border bg-destructive-subtle p-4 font-mono text-xs text-destructive',
                )}
              >
                destructive · subtle / border / text
              </div>
            </div>
          </div>

          {/* Typography Ratios */}
          <div className={cn('flex flex-col gap-3 border-t border-border pt-6')}>
            <h3 className={cn('font-mono text-xs text-muted-foreground uppercase')}>Typography</h3>
            <p className={cn('font-display text-4xl font-bold')}>Display +1 · 56 / 1.0 · 600</p>
            <p className={cn('font-display text-3xl font-bold')}>Display lg · 40 / 1.05 · 600</p>
            <p className={cn('font-sans text-xl font-semibold')}>Heading · 24 / 1.2 · 600</p>
            <p className={cn('font-sans text-lg font-medium')}>Title · 18 / 1.25 · 500</p>
            <p className={cn('font-sans text-base font-normal')}>Body · 15 / 1.5 · 400</p>
            <p className={cn('font-mono text-sm')}>Mono · 13 / 1.45 · 400</p>
            <p className={cn('font-mono text-xs tracking-wider uppercase')}>Eyebrow · 12 · 700</p>
          </div>

          {/* Button Variants & States */}
          <div className={cn('flex flex-col gap-4 border-t border-border pt-6')}>
            <h3 className={cn('font-mono text-xs text-muted-foreground uppercase')}>
              Button Matrix
            </h3>
            <div className={cn('flex flex-wrap items-center gap-4')}>
              <Button>Default</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
              <Button loading>Processing</Button>
            </div>
          </div>

          {/* Badges & Meters */}
          <div className={cn('grid grid-cols-1 gap-6 border-t border-border pt-6 md:grid-cols-2')}>
            <div className={cn('flex flex-col gap-3')}>
              <h3 className={cn('font-mono text-xs text-muted-foreground uppercase')}>Badges</h3>
              <div className={cn('flex flex-wrap gap-2')}>
                <Badge variant="success">Published</Badge>
                <Badge variant="warning">6 seats left</Badge>
                <Badge variant="destructive">Full</Badge>
                <Badge variant="info">Waitlist</Badge>
                <Badge variant="neutral">Closed</Badge>
                <Badge variant="draft">Draft</Badge>
                <Badge variant="default" className={cn('gap-1')}>
                  <Sparkles className={cn('size-3')} /> Featured
                </Badge>
              </div>
            </div>

            <div className={cn('flex flex-col gap-3')}>
              <h3 className={cn('font-mono text-xs text-muted-foreground uppercase')}>Meters</h3>
              <div className={cn('flex flex-col gap-3')}>
                <Meter value={54} max={60} tone="default" label="54 of 60 seats taken" />
                <Meter value={38} max={80} tone="success" label="38 of 80 spots remaining" />
                <Meter value={120} max={120} tone="danger" label="120 capacity reached" />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SHEET 2: Inputs, Field Errors & Form States */}
        {/* ========================================================= */}
        <section
          className={cn(
            'flex flex-col gap-8 rounded-3xl border border-border bg-card p-8 shadow-sm',
          )}
        >
          <div className={cn('border-b border-border pb-4')}>
            <h2 className={cn('font-mono text-sm tracking-wider text-primary uppercase')}>
              Sheet 2 — Inputs, Field Errors &amp; Form States
            </h2>
          </div>

          <div className={cn('grid grid-cols-1 gap-6 md:grid-cols-2')}>
            <Field>
              <FieldLabel htmlFor="dev-fullname">Full Name</FieldLabel>
              <Input id="dev-fullname" defaultValue="Ayan Shahid" />
              <FieldDescription>Choose your legal display name.</FieldDescription>
            </Field>

            <Field data-invalid="true">
              <FieldLabel htmlFor="dev-studentid">Student ID</FieldLabel>
              <Input id="dev-studentid" defaultValue="RMU-2026-00336" aria-invalid="true" />
              <FieldError errors={[{ message: 'Format not recognized. Use RMU-YYYY-XXXXX.' }]} />
            </Field>
          </div>

          {/* Filter & Removable Chips */}
          <div className={cn('flex flex-col gap-4 border-t border-border pt-6')}>
            <h3 className={cn('font-mono text-xs text-muted-foreground uppercase')}>
              Filter Chips &amp; Removable Chips
            </h3>
            <div className={cn('flex flex-wrap items-center gap-3')}>
              <FilterChip defaultChecked>All</FilterChip>
              <FilterChip>Workshops</FilterChip>
              <FilterChip>Careers</FilterChip>
              <FilterChip>
                <Wifi className={cn('size-4')} /> Online
              </FilterChip>
            </div>
            <div className={cn('flex flex-wrap items-center gap-3')}>
              <RemovableChip onRemove={() => announce('Removed After 5 pm')}>
                After 5 pm
              </RemovableChip>
              <RemovableChip onRemove={() => announce('Removed City Centre')}>
                City Centre
              </RemovableChip>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SHEET 3: Feedback, Data Display & Overlays */}
        {/* ========================================================= */}
        <section
          className={cn(
            'flex flex-col gap-8 rounded-3xl border border-border bg-card p-8 shadow-sm',
          )}
        >
          <div className={cn('border-b border-border pb-4')}>
            <h2 className={cn('font-mono text-sm tracking-wider text-primary uppercase')}>
              Sheet 3 — Feedback, Data Display &amp; Overlays
            </h2>
          </div>

          {/* Banners */}
          <div className={cn('flex flex-col gap-3')}>
            <Banner
              variant="info"
              title="Free cancellation"
              description="until Thu 12 Nov, 18:30."
            />
            <Banner
              variant="success"
              title="You're registered."
              description="Confirmation sent to university email."
            />
            <Banner
              variant="warning"
              title="Seat counts may be out of date."
              description="Showing numbers from 18:31."
              action={
                <Button size="sm" variant="outline" className={cn('h-8')}>
                  <RotateCw className={cn('size-3.5')} /> Retry
                </Button>
              }
            />
            <Banner
              variant="error"
              title="We couldn't sign you in."
              description="Fix highlighted fields."
            />
          </div>

          {/* QueryError & Empty State */}
          <div className={cn('grid grid-cols-1 gap-6 border-t border-border pt-6 md:grid-cols-2')}>
            <QueryError onRetry={async () => await new Promise((res) => setTimeout(res, 1000))} />
            <EmptyState
              icon={CalendarX2}
              heading="No events match"
              description="Try removing active filters or searching again."
              actions={<Button size="sm">Clear filters</Button>}
            />
          </div>

          {/* SurfaceCard & Event Card States */}
          <div className={cn('flex flex-col gap-4 border-t border-border pt-6')}>
            <h3 className={cn('font-mono text-xs text-muted-foreground uppercase')}>
              SurfaceCard &amp; Event Cards
            </h3>
            <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-3')}>
              {/*<EventCard*/}
              {/*  day="13"*/}
              {/*  weekday="FRI"*/}
              {/*  title="Data Viz Night"*/}
              {/*  taken={54}*/}
              {/*  capacity={60}*/}
              {/*  status="open"*/}
              {/*  surface="shader"*/}
              {/*/>*/}
              {/*<EventCard*/}
              {/*  day="15"*/}
              {/*  weekday="SUN"*/}
              {/*  title="Weekend Hackathon"*/}
              {/*  taken={120}*/}
              {/*  capacity={120}*/}
              {/*  waitlisted={12}*/}
              {/*  status="full"*/}
              {/*  surface="shader"*/}
              {/*  shaderTone="warm"*/}
              {/*/>*/}
              {/*<EventCard*/}
              {/*  day="21"*/}
              {/*  weekday="SAT"*/}
              {/*  title="Commuter Mixer"*/}
              {/*  taken={30}*/}
              {/*  capacity={60}*/}
              {/*  status="closed"*/}
              {/*  surface="plain"*/}
              {/*/>*/}
            </div>
          </div>

          {/* Table & Dropdown Menu */}
          <div className={cn('flex flex-col gap-4 border-t border-border pt-6')}>
            <h3 className={cn('font-mono text-xs text-muted-foreground uppercase')}>
              Table &amp; Dropdown Menu
            </h3>
            <Table>
              <TableCaption>Showcase Events Table</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead className={cn('text-right')}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className={cn('font-medium')}>Data Viz Night</TableCell>
                  <TableCell>
                    <Badge variant="success">Published</Badge>
                  </TableCell>
                  <TableCell className={cn('font-mono text-xs')}>54/60</TableCell>
                  <TableCell className={cn('text-right')}>
                    <DropdownMenu>
                      <DropdownMenuTrigger aria-label="Row actions">
                        <MoreHorizontal className={cn('size-4')} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Pencil /> Edit event
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download /> Export CSV
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                          <X /> Cancel event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableEmptyRow colSpan={4} message='Empty row state: "No events in this tab."' />
              </TableBody>
            </Table>
          </div>

          {/* Overlays: Dialog & Sheet */}
          <div className={cn('flex flex-wrap items-center gap-4 border-t border-border pt-6')}>
            <Dialog>
              <DialogTrigger
                render={<Button variant="destructive">Cancel Event… (Dialog)</Button>}
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel this event?</DialogTitle>
                  <DialogDescription>All registered students will be notified.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline">Keep event</Button>} />
                  <DialogClose
                    render={
                      <Button variant="destructive" onClick={() => toast('Cancelled')}>
                        Confirm cancel
                      </Button>
                    }
                  />
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger render={<Button variant="outline">Filters Drawer (Sheet)</Button>} />
              <SheetContent side="bottom" className={cn('mx-auto max-w-lg')}>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <SheetDescription className={cn('sr-only')}>Filter options</SheetDescription>
                <div className={cn('py-4')}>
                  <Field orientation="horizontal" className={cn('items-center')}>
                    <Checkbox id="dev-sheet-filter" defaultChecked />
                    <FieldLabel htmlFor="dev-sheet-filter" className={cn('font-normal')}>
                      Evening (after 5 pm)
                    </FieldLabel>
                  </Field>
                </div>
                <SheetClose render={<Button className={cn('w-full')}>Show results</Button>} />
              </SheetContent>
            </Sheet>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SHEET 4: Layout & Navigation */}
        {/* ========================================================= */}
        <section
          className={cn(
            'flex flex-col gap-8 rounded-3xl border border-border bg-card p-8 shadow-sm',
          )}
        >
          <div className={cn('border-b border-border pb-4')}>
            <h2 className={cn('font-mono text-sm tracking-wider text-primary uppercase')}>
              Sheet 4 — Layout &amp; Navigation
            </h2>
          </div>

          <div className={cn('flex flex-col gap-6')}>
            <PageHeader
              eyebrow="FALL SEMESTER · WEEK 7"
              title="Discover events"
              description="128 upcoming · 31 fit your commute"
              breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Discover' }]}
              actions={<Button size="sm">Export (.ics)</Button>}
            />

            <div
              className={cn('grid grid-cols-1 gap-6 border-t border-border pt-6 md:grid-cols-2')}
            >
              <div className={cn('flex flex-col gap-4')}>
                <span className={cn('font-mono text-xs text-muted-foreground uppercase')}>
                  Sidebar (Organizer Full)
                </span>
                <Sidebar mode="full" />
              </div>

              <div className={cn('flex flex-col gap-4')}>
                <span className={cn('font-mono text-xs text-muted-foreground uppercase')}>
                  Avatars &amp; Theme Toggle
                </span>
                <div className={cn('flex items-center gap-4')}>
                  <Avatar name="Ayan Shahid" size="sm" />
                  <Avatar name="Ayan Shahid" size="md" />
                  <Avatar name="Hira Khan" size="lg" />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MobileTabBar variant="organizer" fixed={false} onFabClick={() => announce('FAB clicked')} />
    </div>
  );
}
