import { ComponentDesc } from '../../constants/components';
import { nativeComponentJson } from '../commons/nativeComponentJson';

export const subtreeJson = ({
  relativePathToBridge,
  components,
}: {
  relativePathToBridge: string;
  components: ComponentDesc[];
}) => nativeComponentJson({ relativePathToBridge, components, isLeaf: false });
