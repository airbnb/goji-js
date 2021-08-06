import difference from 'lodash/difference';
import camelCase from 'lodash/camelCase';
import { InstanceProps } from '../reconciler/instance';
import { SIMPLIFY_COMPONENTS } from '../constants';

const isSubsetOf = <T>(subset: Array<T>, fullset: Array<T>) => difference(subset, fullset).length === 0;

const filterPropsAndEventsName = (names: Array<string>) => {
  const props: Array<string> = [];
  const events: Array<string> = [];
  for (const name of names) {
    if (name.startsWith('on')) {
      events.push(camelCase(name.replace(/^on/, '')));
    } else {
      props.push(name);
    }
  }
  return {
    props,
    events,
  };
};

export const findSimplifyId = (type: string, names: InstanceProps) => {
  const { props, events } = filterPropsAndEventsName(Object.keys(names));
  const index = SIMPLIFY_COMPONENTS.findIndex(
    item =>
      item.name === type && isSubsetOf(props, item.properties) && isSubsetOf(events, item.events),
  );

  return index === -1 ? undefined : index;
};
