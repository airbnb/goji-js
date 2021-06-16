import { source } from 'common-tags';

function runFunc(f: any) {
  return typeof f === 'function' ? runFunc(f()) : f;
}

export const t = (template: TemplateStringsArray, ...substitutions: any[]) => {
  const calledSubstitutions = substitutions.map(runFunc);

  return source(template, ...calledSubstitutions);
};

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
