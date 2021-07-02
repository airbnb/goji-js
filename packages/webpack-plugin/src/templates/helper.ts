import {
  stripIndent,
  TemplateTransformer,
  createTag,
  inlineArrayTransformer,
  splitStringTransformer,
  // @ts-ignore
  removeNonPrintingValuesTransformer,
  trimResultTransformer,
} from 'common-tags';

const runFunctionSubstitutions = (): TemplateTransformer => {
  function runFunc(f: any): string {
    return typeof f === 'function' ? runFunc(f()) : f;
  }

  return {
    onSubstitution(sub) {
      return runFunc(sub as any);
    },
  };
};

const trimEndSubstitutions = (): TemplateTransformer => {
  return {
    onSubstitution(sub) {
      return sub.toString().replace(/\n+\s*$/, '');
    },
  };
};

// @ts-ignore
export const t = createTag(
  // support function substitutions: ${() => 'hi'}
  runFunctionSubstitutions(),
  splitStringTransformer('\n'),
  removeNonPrintingValuesTransformer(),
  inlineArrayTransformer(),
  // always trim end of substitutions
  trimEndSubstitutions(),
  stripIndent,
  // always trim end of result
  trimResultTransformer('end'),
);

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
