import { ComponentDesc } from '../../constants/components';
import { nativeComponentJson } from '../commons/nativeComponentJson';

export const wrappedJson = ({
  relativePathToBridge,
  component,
  components,
}: {
  relativePathToBridge: string;
  component: ComponentDesc;
  components: ComponentDesc[];
}) => nativeComponentJson({
    relativePathToBridge,
    components,
    isLeaf: component.isLeaf ?? false,
  });
