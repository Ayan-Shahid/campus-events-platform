import { z } from 'zod';

export const CHANNEL_NAME = 'gather:v1';
export const MESSAGE_VERSION = 1;

const envelope = {
  v: z.literal(MESSAGE_VERSION),
  senderId: z.string().min(1).max(64),
  sentAt: z.number().int().nonnegative(),
};

export const crossTabMessageSchema = z.discriminatedUnion('type', [
  z.object({ ...envelope, type: z.literal('auth:signed-out') }),
  z.object({ ...envelope, type: z.literal('auth:signed-in') }),
  z.object({
    ...envelope,
    type: z.literal('query:invalidate'),
    queryKey: z.array(z.json()).min(1).max(10),
  }),
]);

export type CrossTabMessage = z.infer<typeof crossTabMessageSchema>;

export type CrossTabMessageInput =
  | { type: 'auth:signed-out' }
  | { type: 'auth:signed-in' }
  | { type: 'query:invalidate'; queryKey: readonly unknown[] };
