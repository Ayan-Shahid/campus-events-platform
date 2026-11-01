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
          <h1 className="font-display text-xl font-bold">Theme & Token Preview</h1>
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

        {/* Feedback Banners & Query Error Section */}
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
              description=" until Thu 12 Nov, 18:30."
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
                  <RotateCw className="size-3.5" />
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

        {/* Sonner Toasts Confirmation Section */}
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

          <div className="overflow-hidden rounded-xl border border-border">
            <table aria-busy="true" className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-mono text-xs text-muted-foreground uppercase">
                  <th className="p-4">Event ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Occupancy</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                <TableRowSkeleton columns={4} />
                <TableRowSkeleton columns={4} />
                <TableRowSkeleton columns={4} />
              </tbody>
            </table>
          </div>
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
            <Badge variant="default" className="gap-1">
              <Sparkles className="size-3" /> Featured
            </Badge>
          </div>
        </section>

        {/* Filter Chips & Removable Chips Section */}
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
              <RemovableChip>After 5 pm</RemovableChip>
              <RemovableChip>City Centre</RemovableChip>
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
            Form Fields & Input States
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
                    <SelectItem value="tech">Technology & AI</SelectItem>
                    <SelectItem value="business">Entrepreneurship</SelectItem>
                    <SelectItem value="arts">Culture & Arts</SelectItem>
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
            <FieldLabel htmlFor="event-description">Event Description & Guidelines</FieldLabel>
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
            FieldSet & FieldGroup Compositions
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

        {/* Status Banners & Errors */}
        <section
          className="flex flex-col gap-4 rounded-[20px] border border-border bg-card p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <h2 className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
            Status Banners & Field Errors
          </h2>

          {/* Subtle Status Banner */}
          <div className="flex items-center justify-between rounded-[12px] border border-success-border bg-success-subtle p-4 font-sans text-sm text-success">
            <span>Seats confirmed! Your booking for the Tech Workshop has been secured.</span>
            <span className="font-mono text-xs">10:36 AM</span>
          </div>

          {/* Boxed Field Error */}
          <div className="flex flex-col gap-1 rounded-[12px] border border-destructive-border bg-destructive-subtle p-4 font-sans text-sm text-destructive">
            <span className="font-semibold">Registration Failed</span>
            <span className="text-xs opacity-90">
              This event is fully booked. Join the waitlist to receive a notification if a spot
              opens up.
            </span>
          </div>
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
