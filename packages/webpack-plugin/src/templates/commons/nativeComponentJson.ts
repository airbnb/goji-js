import { ComponentDesc } from '../../constants/components';
import { getComponentTagName } from './wxmlElement';
import { getFeatures } from '../../constants/features';
import { CommonContext } from '../helpers/context';

export const nativeComponentJson = ({
  isLeaf,
  relativePathToBridge,
  components,
}: {
  isLeaf: boolean;
  relativePathToBridge: string;
  components: ComponentDesc[];
}) => {
  const features = getFeatures(CommonContext.read().target);

  const usingComponents: Record<string, string> = {};
  if (!isLeaf) {
    for (const component of components) {
      if (component.isWrapped) {
        usingComponents[
          getComponentTagName({ isWrapped: component.isWrapped, name: component.name })
        ] = `${relativePathToBridge}/components/${component.name}`;
      }
    }
    if (features.useSubtree) {
      usingComponents[
        getComponentTagName({ isWrapped: true, name: 'subtree' })
      ] = `${relativePathToBridge}/subtree`;
    }
  }

  return JSON.stringify(
    {
      component: true,
      usingComponents,
    },
    null,
    2,
  );
};
