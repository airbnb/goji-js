import { useSubtree } from '@goji/core/dist/cjs/components/subtree';
import { ComponentDesc } from '../../constants/components';
import { getComponentTagName } from './components.wxml';

export const itemJson = ({
  relativePathToBridge,
  components,
}: {
  relativePathToBridge: string;
  components: ComponentDesc[];
}) => {
  const usingComponents: Record<string, string> = {};
  for (const component of components) {
    if (component.isWrapped) {
      usingComponents[
        getComponentTagName({ isWrapped: component.isWrapped, name: component.name })
      ] = `${relativePathToBridge}/components/${component.name}`;
    } else if (component.nativePath) {
      usingComponents[component.name] = component.nativePath;
    }
  }
  if (useSubtree) {
    usingComponents[
      getComponentTagName({ isWrapped: true, name: 'subtree' })
    ] = `${relativePathToBridge}/subtree`;
  }

  return JSON.stringify(
    {
      usingComponents,
    },
    null,
    2,
  );
};
