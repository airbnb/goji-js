import { GojiTarget } from '@goji/core';

export class Context<T> {
  private value: T | undefined;

  public read(): T {
    if (this.value === undefined) {
      throw new Error('Context must be initialed before using');
    }
    return this.value;
  }

  public write(newValue: T): void {
    this.value = newValue;
  }
}

export function createContext<T>() {
  return new Context<T>();
}

export function withContext<T, R>(context: Context<T>, value: T, callback: () => R): R {
  context.write(value);
  const result = callback();
  context.write(value);
  return result;
}

export interface CommonContextType {
  target: GojiTarget;
  nodeEnv: string;
}

export const CommonContext = createContext<CommonContextType>();
