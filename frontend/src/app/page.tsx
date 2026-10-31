'use client';

import { useState } from 'react';
import ThemeToggle from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Mail, CheckCircle2, User, Lock, Eye, EyeOff } from 'lucide-react';

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
            <Button>Book Campus Event</Button>
            <Button variant="outline">Book Campus Event</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive">Cancel Booking</Button>
            <Button loading>Processing</Button>
          </div>
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
