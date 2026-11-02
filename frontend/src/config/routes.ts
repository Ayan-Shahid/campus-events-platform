/**
 * The only place URLs are written. Everything else imports `routes`.
 * Dynamic segments are always run through `encodeURIComponent`.
 */
const segment = (value: string) => encodeURIComponent(value);

export const routes = {
  home: '/',

  // Auth
  signIn: '/sign-in',
  signUp: '/sign-up',

  // Student
  events: '/events',
  event: (eventId: string) => `/events/${segment(eventId)}`,
  myRegistrations: '/my-registrations',

  // Organizer
  organizerEvents: '/organizer/events',
  organizerNewEvent: '/organizer/events/new',
  organizerEditEvent: (eventId: string) => `/organizer/events/${segment(eventId)}/edit`,
  organizerRegistrations: '/organizer/registrations',
} as const;

export type Routes = typeof routes;
