import { ComponentDesc } from '../../constants/components';
import { getComponentTagName } from './components.wxml';

export const subtreeJson = ({
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
    }
  }
  usingComponents[
    getComponentTagName({ isWrapped: true, name: 'subtree' })
  ] = `${relativePathToBridge}/subtree`;

  return JSON.stringify(
    {
      component: true,
      usingComponents,
    },
    null,
    2,
  );
};
