import posthtml from 'posthtml';
import { parser } from 'posthtml-parser';
import {
  addBracketsToTemplateData,
  includeAndImportSrcExt,
  removeDirectiveBrackets,
  transformConditionDirective,
  transformLoopDirective,
} from './plugins';
import { render } from './render';

export const wxmlToSwan = async (source: string) => {
  const { html } = await posthtml([
    removeDirectiveBrackets(),
    transformConditionDirective(),
    transformLoopDirective(),
    includeAndImportSrcExt(),
    addBracketsToTemplateData(),
  ]).process(source, {
    parser: (node: Parameters<typeof parser>[0]) => parser(node, { xmlMode: true }),
    render,
  });

  return html;
};
