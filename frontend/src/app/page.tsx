import ThemeToggle from '@/components/layout/theme-toggle';

export default function Home() {
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
    { name: 'info-subtle', class: 'bg-info-subtle text-info border border-info-border' },
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
          <div className="flex items-center gap-4">
            <button className="rounded-[12px] bg-mesh-primary px-6 py-3 font-sans text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Book Campus Event
            </button>
          </div>
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
