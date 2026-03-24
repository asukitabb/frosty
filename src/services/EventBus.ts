import type { EventMap } from '@/types';

type EventKey = keyof EventMap;
type EventHandler<T extends EventKey> = (payload: EventMap[T]) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandlerMap = { [K in EventKey]?: Set<EventHandler<any>> };

/**
 * Singleton EventBus — decouples Módulo 1 (POS) from Módulo 2 (Almacén).
 * Emits strongly-typed events defined in EventMap.
 */
class EventBusClass {
  private handlers: HandlerMap = {};

  on<K extends EventKey>(event: K, handler: EventHandler<K>): void {
    if (!this.handlers[event]) {
      this.handlers[event] = new Set();
    }
    (this.handlers[event] as Set<EventHandler<K>>).add(handler);
  }

  off<K extends EventKey>(event: K, handler: EventHandler<K>): void {
    (this.handlers[event] as Set<EventHandler<K>> | undefined)?.delete(handler);
  }

  emit<K extends EventKey>(event: K, payload: EventMap[K]): void {
    (this.handlers[event] as Set<EventHandler<K>> | undefined)?.forEach((h) =>
      h(payload)
    );
    console.info(`[EventBus] Emitted: ${event}`, payload);
  }
}

export const EventBus = new EventBusClass();
