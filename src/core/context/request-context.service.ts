import { Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable({ scope: Scope.DEFAULT })
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<Map<string, any>>();

  run(
    callback: (...args: any[]) => any,
    context: Map<string, any> = new Map(),
  ) {
    this.storage.run(context, callback);
  }

  set(key: string, value: any) {
    const store = this.storage.getStore();
    if (store) store.set(key, value);
  }

  get<T>(key: string): T | undefined {
    const store = this.storage.getStore();
    return store ? (store.get(key) as T) : undefined;
  }
}
