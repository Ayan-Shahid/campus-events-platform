import { z } from 'zod';

export const eventIdSchema = z.uuid();

export const eventRouteParamsSchema = z.object({ eventId: eventIdSchema });

export type EventRouteParams = z.infer<typeof eventRouteParamsSchema>;
