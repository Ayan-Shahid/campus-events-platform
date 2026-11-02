import type { HttpHandler } from 'msw';

// Per-feature handler arrays will be imported and combined here:
// import { eventHandlers } from './events.handlers';
// import { registrationHandlers } from './registrations.handlers';

export const handlers: HttpHandler[] = [
  // ...eventHandlers,
  // ...registrationHandlers,
];
