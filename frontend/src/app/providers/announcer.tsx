export default function Announcer() {
  return (
    <div className="sr-only">
      <div id="a11y-announcer-polite" role="status" aria-live="polite" aria-atomic="true" />
      <div id="a11y-announcer-assertive" role="alert" aria-live="assertive" aria-atomic="true" />
    </div>
  );
}
