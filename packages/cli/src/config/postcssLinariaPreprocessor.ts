/* eslint-disable import/no-import-module-exports */
import type { PluginCreator } from 'postcss';
import valueParser from 'postcss-value-parser';

const reserved = [
  'none',
  'inherited',
  'initial',
  'unset',
  /* single-timing-function */
  'linear',
  'ease',
  'ease-in',
  'ease-in-out',
  'ease-out',
  'step-start',
  'step-end',
  'start',
  'end',
  /* single-animation-iteration-count */
  'infinite',
  /* single-animation-direction */
  'normal',
  'reverse',
  'alternate',
  'alternate-reverse',
  /* single-animation-fill-mode */
  'forwards',
  'backwards',
  'both',
  /* single-animation-play-state */
  'running',
  'paused',
];

interface Options {}

const postcssLinariaPreprocessor: PluginCreator<Options> = () => ({
  postcssPlugin: 'postcss-linaria-preprocessor',
  Once(root, postcss) {
    const nodes = [...root.nodes];
    for (const node of nodes) {
      if (node.type === 'rule' && node.selector.startsWith('.')) {
        // use unique keyframe name to avoid conflict
        // inspired from https://github.com/css-modules/postcss-icss-keyframes/blob/5f890e4068820daa80025d88a4f750a3a085dcc8/src/index.js
        const keyframeNameMapping = new Map<string, string>();
        node.walkAtRules(/keyframes$/, atRule => {
          const name = atRule.params;
          if (reserved.includes(name)) {
            postcss.result.warn(`Unable to use reserve '${name}' animation name`, {
              node: atRule,
            });

            return;
          }
          const newName = `${name}-${node.selector.replace(/^\./, '')}`;
          keyframeNameMapping.set(name, newName);
          atRule.params = newName;
        });
        node.walkDecls(/animation$|animation-name$/, decl => {
          const parsed = valueParser(decl.value);
          for (const item of parsed.nodes) {
            if (item.type === 'word' && keyframeNameMapping.has(item.value)) {
              item.value = keyframeNameMapping.get(item.value)!;
            }
          }
          decl.value = parsed.toString();
        });

        // extract the global rule to the top of the root
        node.walkRules(/^:global\(\)$/, globalRule => {
          globalRule.remove();
          for (const globalNode of globalRule.nodes) {
            root.insertAfter(node, globalNode);
          }
        });
      }
    }
  },
  Declaration(decl) {
    // escape breaking control characters
    // from: https://github.com/thysultan/stylis/blob/v3.5.4/tests/spec.js#L113C3-L116
    if (decl.value.match(/[\0\r\f]/)) {
      decl.value = decl.value.replace(/\0/g, '\\0').replace(/\r/g, '\\r').replace(/\f/g, '\\f');
    }
  },
});

postcssLinariaPreprocessor.postcss = true;

module.exports = postcssLinariaPreprocessor;
