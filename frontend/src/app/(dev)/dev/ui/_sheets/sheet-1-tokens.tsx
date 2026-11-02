import Link from 'next/link';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Info,
  Plus,
  Ticket,
} from 'lucide-react';
import Banner from '@/components/feedback/banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Meter from '@/components/ui/meter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SurfaceCard } from '@/components/visual/surface-card';
import { cn } from '@/lib/utils';
import { Block, Eyebrow, Hint, Panel, ShowcaseSheet } from '../_components/showcase';

const neutralSwatches = [
  { name: 'background', className: 'bg-background', note: 'page canvas' },
  { name: 'card', className: 'bg-card', note: 'surfaces' },
  { name: 'foreground', className: 'bg-foreground', note: 'body text' },
  { name: 'muted-foreground', className: 'bg-muted-foreground', note: 'secondary text' },
  { name: 'faint', className: 'bg-faint', note: 'tertiary text' },
  { name: 'input', className: 'bg-input', note: 'field fill' },
  { name: 'border', className: 'bg-border', note: 'hairlines' },
  { name: 'border-strong', className: 'bg-border-strong', note: 'control edges' },
  { name: 'primary', className: 'bg-primary', note: 'brand · ring' },
  { name: 'primary-foreground', className: 'bg-primary-foreground', note: 'text on primary' },
  { name: 'bg-mesh-primary', className: 'bg-mesh-primary', note: 'utility · gradient' },
  { name: 'secondary', className: 'bg-secondary', note: 'chips · tabs' },
];

const statusTones = [
  {
    name: 'success',
    Icon: CheckCircle2,
    swatches: ['bg-success', 'bg-success-subtle', 'bg-success-border'],
    sample: 'border-success-border bg-success-subtle text-success-foreground',
  },
  {
    name: 'warning',
    Icon: AlertTriangle,
    swatches: ['bg-warning', 'bg-warning-subtle', 'bg-warning-border'],
    sample: 'border-warning-border bg-warning-subtle text-warning-foreground',
  },
  {
    name: 'destructive',
    Icon: AlertCircle,
    swatches: ['bg-destructive', 'bg-destructive-subtle', 'bg-destructive-border'],
    sample: 'border-destructive-border bg-destructive-subtle text-destructive-text',
  },
  {
    name: 'info',
    Icon: Info,
    swatches: ['bg-info', 'bg-info-subtle', 'bg-info-border'],
    sample: 'border-info-border bg-info-subtle text-info-foreground',
  },
];

const typeScale = [
  {
    role: 'display-xl · 56/1.0 · 600',
    sample: 'Discover events',
    className: 'font-display text-4xl leading-none font-semibold sm:text-[56px]',
  },
  {
    role: 'display-lg · 40/1.05 · 600',
    sample: 'Good evening, Hira',
    className: 'font-display text-3xl leading-[1.05] font-semibold sm:text-[40px]',
  },
  {
    role: 'heading · 24/1.2 · 600',
    sample: 'About this event',
    className: 'font-sans text-2xl leading-[1.2] font-semibold',
  },
  {
    role: 'title · 18/1.25 · 600',
    sample: 'Data Viz Night: Telling Stories with CSV',
    className: 'font-sans text-lg leading-tight font-semibold',
  },
  {
    role: 'body · 15/1.5 · 400',
    sample: 'A hands-on evening for turning raw spreadsheets into charts.',
    className: 'font-sans text-[15px] leading-normal',
  },
  {
    role: 'small · 13/1.45 · 400',
    sample: 'Free cancellation until Thu 12 Nov, 18:30',
    className: 'font-sans text-[13px] leading-[1.45]',
  },
  {
    role: 'mono · 13 · tabular',
    sample: '54/60 · RMU-2024-01234 · 18:30',
    className: 'font-mono text-[13px] tabular-nums',
  },
  {
    role: 'eyebrow · mono 12 · caps',
    sample: 'Fall semester · Week 9',
    className: 'font-mono text-xs tracking-wider text-primary uppercase',
  },
];

const radii = [
  { px: 10, use: 'sm btn', className: 'rounded-sm' },
  { px: 12, use: 'input', className: 'rounded-md' },
  { px: 16, use: 'tile', className: 'rounded-lg' },
  { px: 20, use: 'card', className: 'rounded-xl' },
  { px: 999, use: 'chip', className: 'rounded-full' },
];

const badgeRows = [
  {
    variant: 'success',
    badges: ['Open · 42 seats', 'Confirmed'],
  },
  { variant: 'warning', badges: ['6 seats left', 'Filling fast'] },
  { variant: 'destructive', badges: ['Full · 12 waitlisted'] },
  { variant: 'info', badges: ["Waitlist · you're #3"] },
  { variant: 'neutral', badges: ['Registration closed', 'Online'] },
  { variant: 'draft', badges: ['Draft'] },
] as const;

export function Sheet1Tokens() {
  return (
    <ShowcaseSheet
      number={1}
      title="Tokens, buttons, badges & meters"
      description={
        <>
          Names match the Tailwind utilities and shadcn variants you create, e.g.{' '}
          <code className="font-mono">bg-card</code>,{' '}
          <code className="font-mono">border-destructive-border</code>,{' '}
          <code className="font-mono">variant=&quot;outline&quot;</code>. Flip the theme toggle to
          check both palettes; hover and focus-visible states are checked live with the mouse and
          the keyboard.
        </>
      }
    >
      <Block title="Colour tokens" hint="Semantic names · follows the active theme">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {neutralSwatches.map((swatch) => (
            <div key={swatch.name} className="flex flex-col gap-2">
              <div
                aria-hidden="true"
                className={cn('h-16 rounded-lg border border-border', swatch.className)}
              />
              <span className="font-mono text-xs font-semibold">{swatch.name}</span>
              <Hint className="text-[11px]">{swatch.note}</Hint>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statusTones.map(({ name, Icon, swatches, sample }) => (
            <Panel key={name} className="flex flex-col gap-3 p-4 sm:p-4">
              <span className="font-mono text-xs font-semibold">{name}</span>
              <div aria-hidden="true" className="grid grid-cols-3 gap-2">
                {swatches.map((swatch) => (
                  <div key={swatch} className={cn('h-8 rounded-md border border-border', swatch)} />
                ))}
              </div>
              <Hint className="text-[11px]">base · -subtle · -border</Hint>
              <div
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs',
                  sample,
                )}
              >
                <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                <span>Text on {name}-subtle</span>
              </div>
            </Panel>
          ))}
        </div>
      </Block>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[3fr_2fr]">
        <Block title="Typography" hint="next/font · --font-display / --font-sans / --font-mono">
          <Panel>
            <dl className="flex flex-col gap-5">
              {typeScale.map((row) => (
                <div
                  key={row.role}
                  className="grid grid-cols-1 gap-1 sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-6"
                >
                  <dt className="font-mono text-xs text-muted-foreground">{row.role}</dt>
                  <dd className={cn('min-w-0 wrap-break-word', row.className)}>{row.sample}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </Block>

        <Block title="Radius & elevation" hint="@theme --radius-*">
          <Panel className="flex flex-col gap-6">
            <ul className="flex flex-wrap gap-4">
              {radii.map((radius) => (
                <li key={radius.use} className="flex flex-col items-start gap-2">
                  <div
                    aria-hidden="true"
                    className={cn(
                      'size-12 border border-border-strong bg-secondary',
                      radius.className,
                    )}
                  />
                  <Hint className="text-[11px]">
                    {radius.px === 999 ? 'full' : radius.px} · {radius.use}
                  </Hint>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-2">
              <SurfaceCard as="div" className="p-4">
                <Hint>shadow-card + inset 1px highlight</Hint>
              </SurfaceCard>
              <SurfaceCard as="div" surface="plain" className="p-4">
                <Hint>surface=&quot;plain&quot; (no WebGL)</Hint>
              </SurfaceCard>
            </div>

            <div className="border-t border-border pt-6">
              <Eyebrow>Spacing</Eyebrow>
              <p className="mt-2 text-sm text-muted-foreground">
                Tailwind default 4 px scale. Card padding 20–28 · section gap 24–32 · field gap 8 ·
                form gap 20.
              </p>
            </div>
          </Panel>
        </Block>
      </div>

      <Block title="Button" hint="components/ui/button · cva variants · min height 44 px">
        <Panel className="flex flex-col gap-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Variant</TableHead>
                <TableHead scope="col">Default</TableHead>
                <TableHead scope="col">Loading</TableHead>
                <TableHead scope="col">Disabled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs">default</TableCell>
                <TableCell>
                  <Button>Reserve seat</Button>
                </TableCell>
                <TableCell>
                  <Button loading>Reserve seat</Button>
                </TableCell>
                <TableCell>
                  <Button disabled>Reserve seat</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs">outline</TableCell>
                <TableCell>
                  <Button variant="outline">Details</Button>
                </TableCell>
                <TableCell>
                  <Button variant="outline" loading>
                    Exporting
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="outline" disabled>
                    Details
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs">ghost</TableCell>
                <TableCell>
                  <Button variant="ghost">Cancel</Button>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" loading>
                    Loading
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" disabled>
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs">destructive</TableCell>
                <TableCell>
                  <Button variant="destructive">Cancel event</Button>
                </TableCell>
                <TableCell>
                  <Button variant="destructive" loading>
                    Cancelling
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="destructive" disabled>
                    Cancel event
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs">link</TableCell>
                <TableCell>
                  <Button variant="link">Forgot password?</Button>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">n/a</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">n/a</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex flex-wrap items-end gap-x-8 gap-y-6 border-t border-border pt-6">
            <div className="flex flex-col items-start gap-2">
              <Button size="sm" variant="outline">
                Edit
              </Button>
              <Hint className="text-[11px]">size=&quot;sm&quot; · 36 · tables only</Hint>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Button variant="outline">Details</Button>
              <Hint className="text-[11px]">size=&quot;default&quot; · 44</Hint>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Button size="lg">
                Create account <ArrowRight aria-hidden="true" />
              </Button>
              <Hint className="text-[11px]">size=&quot;lg&quot; · 52 · form submit</Hint>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Button size="icon" variant="outline" aria-label="Notifications">
                <Bell aria-hidden="true" />
              </Button>
              <Hint className="text-[11px]">size=&quot;icon&quot; · 44 · aria-label</Hint>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Button variant="outline" nativeButton={false} render={<Link href="#" />}>
                <Ticket aria-hidden="true" /> View ticket
              </Button>
              <Hint className="text-[11px]">render → real &lt;a href&gt;</Hint>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Button>
                <Plus aria-hidden="true" /> New event
              </Button>
              <Hint className="text-[11px]">icon + label · icon aria-hidden</Hint>
            </div>
          </div>

          <Banner
            variant="info"
            title="Loading keeps the label in the DOM."
            description='Screen readers hear "Reserve seat, busy". Uses aria-busy and disabled, so focus is not lost mid-submit.'
          />
        </Panel>
      </Block>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <Block title="Badge" hint="components/ui/badge">
          <Panel className="flex flex-col gap-4">
            {badgeRows.map((row) => (
              <div
                key={row.variant}
                className="grid grid-cols-1 gap-2 sm:grid-cols-[7rem_1fr] sm:items-center"
              >
                <span className="font-mono text-xs text-muted-foreground">{row.variant}</span>
                <div className="flex flex-wrap gap-2">
                  {row.badges.map((text) => (
                    <Badge key={text} variant={row.variant}>
                      {text}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            <Hint>Always text. Colour never carries meaning alone.</Hint>
          </Panel>
        </Block>

        <Block title="Meter" hint="wraps ui/progress · label → aria-valuetext">
          <Panel className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-muted-foreground">tone=&quot;default&quot; · 90%</span>
                <span>54/60</span>
              </div>
              <Meter value={54} max={60} tone="default" label="54 of 60 seats taken" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-muted-foreground">tone=&quot;success&quot; · 48%</span>
                <span>38/80</span>
              </div>
              <Meter value={38} max={80} tone="success" label="38 of 80 spots remaining" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-muted-foreground">tone=&quot;danger&quot; · full</span>
                <span>120/120</span>
              </div>
              <Meter value={120} max={120} tone="danger" label="120 capacity reached" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                segmented · password strength 1 of 4
              </span>
              <Meter segmented value={25} label="Password strength: weak, 1 of 4" />
            </div>
            <Hint>SeatMeter (capacity + waitlist logic) lives in features/events, not here.</Hint>
          </Panel>
        </Block>
      </div>
    </ShowcaseSheet>
  );
}
