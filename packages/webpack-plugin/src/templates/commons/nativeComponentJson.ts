import { ComponentDesc } from '../../constants/components';
import { getComponentTagName } from './wxmlElement';
import { getFeatures } from '../../constants/features';
import { CommonContext } from '../helpers/context';
import { PluginComponentDesc } from '../../utils/pluginComponent';

/**
 * Generate the JSON file of native component.
 * @param isComponent Whether this JSON file is for a component, or a page.
 * @param isLeaf Whether to render `usingComponents`.
 * @param relativePathToBridge The path to bridge folder.
 * @param components Component list.
 * @param pluginComponent Plugin component list.
 */
export const nativeComponentJson = ({
  isComponent,
  isLeaf,
  relativePathToBridge,
  components,
  pluginComponents,
}: {
  isComponent: boolean;
  isLeaf: boolean;
  relativePathToBridge: string;
  components: ComponentDesc[];
  pluginComponents: PluginComponentDesc[];
}) => {
  const features = getFeatures(CommonContext.read().target);

  const usingComponents: Record<string, string> = {};
  if (!isLeaf) {
    // add wrapped components
    for (const component of components) {
      if (component.isWrapped) {
        usingComponents[
          getComponentTagName({ isWrapped: component.isWrapped, name: component.name })
        ] = `${relativePathToBridge}/components/${component.name}`;
      }
    }
    // add plugin components
    for (const component of pluginComponents) {
      usingComponents[component.name] = component.nativePath;
    }
    if (features.useSubtree) {
      usingComponents[
        getComponentTagName({ isWrapped: true, name: 'subtree' })
      ] = `${relativePathToBridge}/subtree`;
    }
  }

  return JSON.stringify(
    {
      // use `undefined` to skip this field
      component: isComponent || undefined,
      usingComponents,
    },
    null,
    2,
  );
};
