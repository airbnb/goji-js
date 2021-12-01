import posthtml from 'posthtml';
import { closingSingleTagOptionEnum, render } from 'posthtml-render';
import { getBuiltInComponents } from '../../../constants/components';
import {
  addBracketsToTemplateData,
  includeAndImportSrcExt,
  removeDirectiveBrackets,
  transformConditionDirective,
  transformLoopDirective,
} from './plugins';

const singleTags = [
  ...getBuiltInComponents('baidu')
    .filter(component => component.isLeaf)
    .map(component => component.name),
  'include',
  'template',
];

export const wxmlToSwan = async (source: string) => {
  const { html } = await posthtml([
    removeDirectiveBrackets(),
    transformConditionDirective(),
    transformLoopDirective(),
    includeAndImportSrcExt(),
    addBracketsToTemplateData(),
  ]).process(source, {
    render: (tree: Parameters<typeof render>[0]) =>
      render(tree, {
        singleTags,
        closingSingleTag: closingSingleTagOptionEnum.slash,
        replaceQuote: false,
      }),
  });

  return html;
};
