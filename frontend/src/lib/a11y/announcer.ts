type Politeness = 'polite' | 'assertive';

export function announce(message: string, politeness: Politeness = 'polite') {
  if (typeof window === 'undefined') return;

  const id = `a11y-announcer-${politeness}`;
  const announcement = document.getElementById(id);

  if (announcement) {
    announcement.textContent = '';
    window.requestAnimationFrame(() => {
      announcement.textContent = message;
    });
  }
}
