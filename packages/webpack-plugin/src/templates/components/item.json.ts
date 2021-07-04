import { ComponentDesc } from '../../constants/components';
import { getFeatures } from '../../constants/features';
import { getComponentTagName } from '../commons/wxmlElement';
import { CommonContext } from '../helpers/context';

export const itemJson = ({
  relativePathToBridge,
  components,
}: {
  relativePathToBridge: string;
  components: ComponentDesc[];
}) => {
  const features = getFeatures(CommonContext.read().target);
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
  if (features.useSubtree) {
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
