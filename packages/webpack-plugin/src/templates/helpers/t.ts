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

const trimEndSubstitutions = (): TemplateTransformer => ({
  onSubstitution(sub) {
    return sub.toString().replace(/\n+\s*$/, '');
  },
});

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
