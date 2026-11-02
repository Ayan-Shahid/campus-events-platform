'use client';

import * as React from 'react';
import { Eye, EyeOff, Lock, MapPin, Search } from 'lucide-react';
import Banner from '@/components/feedback/banner';
import FormField from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldError, FieldLabel, FieldSet } from '@/components/ui/field';
import { FilterChip, RemovableChip } from '@/components/ui/filter-chip';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { announce } from '@/lib/a11y/announcer';
import { cn } from '@/lib/utils';
import { Block, Eyebrow, Hint, Panel, ShowcaseSheet } from '../_components/showcase';

const campuses = ['City Centre', 'North Campus', 'Online'];

/** Leading / trailing adornments around an Input. There is no InputGroup component yet. */
function AdornedInput({
  leading,
  trailing,
  className,
  ...props
}: React.ComponentProps<typeof Input> & {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {leading && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground [&_svg]:size-4"
        >
          {leading}
        </span>
      )}
      <Input className={cn(leading && 'pl-10', trailing && 'pr-14', className)} {...props} />
      {trailing && (
        <span className="absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
          {trailing}
        </span>
      )}
    </div>
  );
}

function TextInputStates() {
  return (
    <Block title="Text input states" hint="components/ui/input · 48 px · radius 12">
      <Panel className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <FormField label="Full name" id="si-default">
          <Input placeholder="e.g. Ayan Shahid" />
        </FormField>
        <FormField label="Full name" id="si-filled" hint="Filled">
          <Input defaultValue="Ayan Shahid" />
        </FormField>
        <FormField
          label="Student ID"
          id="si-invalid"
          error="Format not recognised. Use RMU-2024-01234."
        >
          <Input defaultValue="2024-1234" />
        </FormField>
        <FormField label="Campus" id="si-disabled" hint="disabled attr · not focusable">
          <Input defaultValue="City Centre" disabled />
        </FormField>
      </Panel>
      <Hint>
        Invalid styling is driven by aria-invalid only, set by FormField. Hover and focus-visible
        are checked live: hover a field, then Tab into it.
      </Hint>
    </Block>
  );
}

function Adornments() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Block title="Inputs with adornments" hint="composed in-page · no InputGroup yet">
      <Panel className="flex flex-col gap-5">
        <FormField label="University email" id="ad-email" hint="leading icon · aria-hidden">
          <AdornedInput leading={<Search />} placeholder="name@rmu.edu.pk" type="email" />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Password · hidden" id="ad-password-hidden">
            <AdornedInput leading={<Lock />} type="password" defaultValue="correct-horse" />
          </FormField>
          <div className="flex flex-col gap-2">
            <FormField label="Password · toggle" id="ad-password-toggle">
              <AdornedInput
                leading={<Lock />}
                type={showPassword ? 'text' : 'password'}
                defaultValue="hunter2hunter"
              />
            </FormField>
            <Button
              type="button"
              size="sm"
              variant="outline"
              aria-pressed={showPassword}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              {showPassword ? 'Hide password' : 'Show password'}
            </Button>
          </div>
        </div>
        <Hint>toggle = real &lt;button&gt; · visible label + aria-pressed</Hint>

        <FormField label="Search" id="ad-search" hint='role="searchbox" via type="search"'>
          <AdornedInput leading={<Search />} type="search" placeholder="Search events…" />
        </FormField>

        <FormField label="Seats" id="ad-seats" hint="trailing unit text">
          <AdornedInput trailing="seats" type="number" inputMode="numeric" defaultValue={60} />
        </FormField>
      </Panel>
    </Block>
  );
}

function TextareaAndSelect() {
  const [description, setDescription] = React.useState(
    'A hands-on evening for turning raw spreadsheets into charts people actually read.',
  );

  return (
    <Block title="Textarea & select" hint="ui/textarea · ui/select">
      <Panel className="flex flex-col gap-5">
        <FormField label="Description" id="ta-description" hint="Shown on the event page.">
          <Textarea
            value={description}
            maxLength={2000}
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormField>
        <p className="-mt-3 text-right font-mono text-xs text-muted-foreground">
          {description.length} / 2000
        </p>

        <FormField
          label="Reason for cancelling"
          id="ta-reason"
          error="Add a reason (at least 10 characters). It's emailed to all 132 attendees."
        >
          <Textarea placeholder="Tell attendees why…" />
        </FormField>

        <Field>
          <FieldLabel id="select-campus-label">Campus</FieldLabel>
          <Select defaultValue="City Centre">
            <SelectTrigger aria-labelledby="select-campus-label" className="w-full">
              <MapPin aria-hidden="true" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {campuses.map((campus) => (
                <SelectItem key={campus} value={campus}>
                  {campus}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>
            Open it with Enter or Space; arrow keys move, Esc closes.
          </FieldDescription>
        </Field>
      </Panel>
    </Block>
  );
}

function CheckboxTabsAndChips() {
  const [filters, setFilters] = React.useState(['After 5 pm', 'City Centre']);

  const removeFilter = (filter: string) => {
    setFilters((current) => current.filter((item) => item !== filter));
    announce(`Removed ${filter}`);
  };

  return (
    <Block
      title="Checkbox, segmented tabs & filter chips"
      hint="ui/checkbox · ui/tabs · toggle chips"
    >
      <Panel className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Eyebrow>Checkbox states</Eyebrow>
          <Field orientation="horizontal">
            <Checkbox id="cb-unchecked" />
            <FieldLabel htmlFor="cb-unchecked" className="font-normal">
              Unchecked
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="cb-checked" defaultChecked />
            <FieldLabel htmlFor="cb-checked" className="font-normal">
              Checked
            </FieldLabel>
          </Field>
          <Field orientation="horizontal" data-disabled="true">
            <Checkbox id="cb-disabled" disabled />
            <FieldLabel htmlFor="cb-disabled" className="font-normal">
              Disabled
            </FieldLabel>
          </Field>
          <Field orientation="horizontal" data-disabled="true">
            <Checkbox id="cb-disabled-checked" disabled defaultChecked />
            <FieldLabel htmlFor="cb-disabled-checked" className="font-normal">
              Disabled checked
            </FieldLabel>
          </Field>
          <Field data-invalid="true">
            <div className="flex items-center gap-2">
              <Checkbox id="cb-invalid" aria-invalid="true" aria-describedby="cb-invalid-err" />
              <FieldLabel htmlFor="cb-invalid" className="font-normal">
                I&apos;ve read the cancellation rules
              </FieldLabel>
            </div>
            <FieldError
              id="cb-invalid-err"
              title="Please confirm"
              detail="so your seat can go to the waitlist if needed."
            />
          </Field>
          <Hint>whole label row is clickable · 44 px target</Hint>
        </div>

        <div className="flex flex-col gap-4">
          <Eyebrow>Segmented tabs</Eyebrow>
          <Tabs defaultValue="student">
            <TabsList aria-label="Role" className="w-full">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="organizer">Organizer</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs defaultValue="online">
            <TabsList aria-label="Attendance mode" className="w-full">
              <TabsTrigger value="in-person">In person</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs defaultValue="any">
            <TabsList aria-label="Location filter" className="w-full">
              <TabsTrigger value="any">Any</TabsTrigger>
              <TabsTrigger value="on-campus">On campus</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
            </TabsList>
          </Tabs>
          <Hint>← → arrow keys move · roving tabindex</Hint>
        </div>

        <div className="flex flex-col gap-4">
          <Eyebrow>Filter chips (aria-pressed)</Eyebrow>
          <div className="flex flex-wrap gap-2">
            <FilterChip defaultChecked>All</FilterChip>
            <FilterChip>Workshops</FilterChip>
            <FilterChip>Careers</FilterChip>
            <FilterChip>Online</FilterChip>
          </div>
          <Hint>on · off · focus · with icon</Hint>

          <Eyebrow className="mt-2">Removable chip</Eyebrow>
          <div className="flex min-h-9 flex-wrap gap-2">
            {filters.map((filter) => (
              <RemovableChip
                key={filter}
                removeLabel={`Remove ${filter}`}
                onRemove={() => removeFilter(filter)}
              >
                {filter}
              </RemovableChip>
            ))}
            {filters.length === 0 && <Hint>All filters removed. Reload to reset.</Hint>}
          </div>
        </div>
      </Panel>
    </Block>
  );
}

function FormFieldAnatomy() {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <Block title="FormField anatomy" hint="components/forms/form-field">
        <Panel className="flex flex-col gap-6">
          <FormField
            label="Student ID"
            id="anatomy-student-id"
            required
            hint="Printed on your student card."
            error={{
              title: "Student ID format isn't recognised.",
              detail: 'Use the ID on your card, e.g. RMU-2024-01234.',
            }}
          >
            <Input defaultValue="2024-1234" />
          </FormField>
          <ol className="flex flex-col gap-2 border-t border-border pt-4 font-mono text-xs text-muted-foreground">
            <li>1 · Label: htmlFor wired automatically; required marker is visual only</li>
            <li>2 · Control (children): gets id, aria-invalid, aria-describedby</li>
            <li>3 · Hint: optional · id=&quot;&#36;&#123;id&#125;-hint&quot;</li>
            <li>4 · FieldError: boxed · id=&quot;&#36;&#123;id&#125;-err&quot; · no role=alert</li>
          </ol>
        </Panel>
      </Block>

      <Block title="FieldError variants" hint="components/forms/field-error">
        <Panel className="flex flex-col gap-4">
          <Eyebrow>Title only</Eyebrow>
          <FieldError title="Passwords don't match." />
          <Eyebrow>Title + detail</Eyebrow>
          <FieldError
            title="Too weak."
            detail="Use at least 10 characters, including a number and a symbol."
          />
          <Eyebrow>With action (server error)</Eyebrow>
          <FieldError
            title="This email already has an account."
            detail="Sign in instead, or reset your password."
            action={
              <Button type="button" size="sm" variant="link">
                Sign in
              </Button>
            }
          />
          <Eyebrow>Business rule</Eyebrow>
          <FieldError
            title="Can't go below 120."
            detail="That many students are already registered."
          />
          <Eyebrow>Hidden (no error)</Eyebrow>
          <FieldError />
          <Hint>renders null · keeps layout stable via gap</Hint>
        </Panel>
      </Block>
    </div>
  );
}

function WholeFormStates() {
  return (
    <Block
      title="Whole-form states"
      hint="React Hook Form + Zod · mode onTouched · shouldFocusError"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel>
          <form
            className="flex flex-col gap-5"
            noValidate
            onSubmit={(event) => event.preventDefault()}
          >
            <Eyebrow>1 · Pristine</Eyebrow>
            <FormField label="University email" id="wf1-email">
              <Input type="email" placeholder="name@rmu.edu.pk" />
            </FormField>
            <FormField label="Password" id="wf1-password">
              <Input type="password" />
            </FormField>
            <Button type="submit" size="lg">
              Sign in
            </Button>
            <Hint>no errors until blur or submit</Hint>
          </form>
        </Panel>

        <Panel>
          <form
            className="flex flex-col gap-5"
            noValidate
            onSubmit={(event) => event.preventDefault()}
          >
            <Eyebrow>2 · Submitted with errors</Eyebrow>
            <Banner variant="error" title="Fix 2 fields" description="to continue." />
            <FormField label="University email" id="wf2-email" error="Use your university email.">
              <Input type="email" defaultValue="ayan@gmail.com" />
            </FormField>
            <FormField label="Password" id="wf2-password" error="Password is required.">
              <Input type="password" />
            </FormField>
            <Button type="submit" size="lg">
              Sign in
            </Button>
            <Hint>summary role=&quot;alert&quot; · focus → first invalid</Hint>
          </form>
        </Panel>

        <Panel>
          <form
            className="flex flex-col gap-5"
            noValidate
            onSubmit={(event) => event.preventDefault()}
          >
            <FieldSet disabled className="flex flex-col gap-5">
              <Eyebrow>3 · Submitting</Eyebrow>
              <FormField label="University email" id="wf3-email">
                <Input type="email" defaultValue="ayan.shahid@rmu.edu.pk" />
              </FormField>
              <FormField label="Password" id="wf3-password">
                <Input type="password" defaultValue="correct-horse" />
              </FormField>
              <Button type="submit" size="lg" loading>
                Sign in
              </Button>
            </FieldSet>
            <Hint>fieldset disabled · button aria-busy · no double submit</Hint>
          </form>
        </Panel>
      </div>
    </Block>
  );
}

export function Sheet2Forms() {
  return (
    <ShowcaseSheet
      number={2}
      title="Inputs, field errors & form states"
      description={
        <>
          Invalid styling is driven by <code className="font-mono">aria-invalid</code> only, so what
          screen readers hear and what users see can&apos;t drift apart. Every field is wrapped in{' '}
          <code className="font-mono">FormField</code>.
        </>
      }
    >
      <TextInputStates />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <Adornments />
        <TextareaAndSelect />
      </div>
      <CheckboxTabsAndChips />
      <FormFieldAnatomy />
      <WholeFormStates />
    </ShowcaseSheet>
  );
}
