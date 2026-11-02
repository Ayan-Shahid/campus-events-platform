import {
  CHANNEL_NAME,
  MESSAGE_VERSION,
  crossTabMessageSchema,
  type CrossTabMessage,
  type CrossTabMessageInput,
} from '@/lib/cross-tab/messages';

export type CrossTabHandler = (message: CrossTabMessage) => void;

export interface CrossTabChannel {
  post: (message: CrossTabMessageInput) => void;
  subscribe: (handler: CrossTabHandler) => () => void;
  close: () => void;
}

export interface CreateCrossTabChannelOptions {
  senderId?: string;
  name?: string;
}

const STORAGE_KEY = `${CHANNEL_NAME}:message`;

function createSenderId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function createCrossTabChannel({
  senderId = createSenderId(),
  name = CHANNEL_NAME,
}: CreateCrossTabChannelOptions = {}): CrossTabChannel {
  const handlers = new Set<CrossTabHandler>();
  const broadcastChannel =
    typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(name);

  function receive(data: unknown): void {
    const parsed = crossTabMessageSchema.safeParse(data);
    if (!parsed.success || parsed.data.senderId === senderId) return;

    for (const handler of handlers) {
      try {
        handler(parsed.data);
      } catch (error) {
        console.error('[cross-tab] handler failed', error);
      }
    }
  }

  const onBroadcastMessage = (event: MessageEvent) => receive(event.data);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      receive(JSON.parse(event.newValue));
    } catch {
      // Not JSON: ignore.
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', onBroadcastMessage);
  } else {
    window.addEventListener('storage', onStorage);
  }

  return {
    post(message) {
      const full = { ...message, v: MESSAGE_VERSION, senderId, sentAt: Date.now() };

      const parsed = crossTabMessageSchema.safeParse(full);
      if (!parsed.success) {
        console.warn('[cross-tab] refusing to send an invalid message', parsed.error);
        return;
      }

      if (broadcastChannel) {
        broadcastChannel.postMessage(parsed.data);
        return;
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.data));
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Storage blocked (private mode, quota): other tabs simply miss this one.
      }
    },

    subscribe(handler) {
      handlers.add(handler);
      return () => {
        handlers.delete(handler);
      };
    },

    close() {
      handlers.clear();
      broadcastChannel?.removeEventListener('message', onBroadcastMessage);
      broadcastChannel?.close();
      window.removeEventListener('storage', onStorage);
    },
  };
}

let sharedChannel: CrossTabChannel | undefined;

function getSharedChannel(): CrossTabChannel | null {
  if (typeof window === 'undefined') return null;
  sharedChannel ??= createCrossTabChannel();
  return sharedChannel;
}

export const crossTab = {
  post(message: CrossTabMessageInput): void {
    getSharedChannel()?.post(message);
  },
  subscribe(handler: CrossTabHandler): () => void {
    return getSharedChannel()?.subscribe(handler) ?? (() => {});
  },
};
