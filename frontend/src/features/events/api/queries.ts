// import { queryOptions } from '@tanstack/react-query';
// import { staleTimes } from '@/lib/query/make-query-client';
// import { request } from '@/lib/api/http-client';
// import { eventKeys } from './keys';
// // import { eventSchema } from './schemas'; // when it exists
//
// export const eventQueries = {
//   detail: (id: string) =>
//     queryOptions({
//       queryKey: eventKeys.detail(id),
//       queryFn: ({ signal }) =>
//         request({ path: `/events/${encodeURIComponent(id)}`, schema: eventSchema, signal }),
//       staleTime: staleTimes.seats,
//       meta: { refreshErrorMessage: "Couldn't refresh seat counts" },
//     }),
// };
