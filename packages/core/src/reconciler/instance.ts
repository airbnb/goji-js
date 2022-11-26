import { Container } from '../container';
import { TYPE_TEXT, TYPE_SUBTREE, getTemplateIds, GOJI_VIRTUAL_ROOT } from '../constants';
import { gojiEvents } from '../events';
import { getNextInstanceId } from '../utils/id';
import { styleAttrStringify } from '../utils/styleAttrStringify';
import { findSimplifyId } from '../utils/simplify';
import { shallowEqual } from '../utils/shallowEqual';
import { subtreeMaxDepthFromConfig, useSubtree } from '../components/subtree';
import { batchedUpdates } from '.';

// prop types from ComponentDesc
export type PuredValue = undefined | null | boolean | number | string | object | Array<any>;
export type Updates = Record<string, PuredValue | ElementNode | TextNode>;
export type InstanceProps = Record<string, any>;

// these fields must keep in sync with `getTemplateIds`

export type ElementNodeProduction = {
  t: string;
  p: InstanceProps;
  c: Array<ElementNode | TextNode>;
  i: number;
  s?: number;
};

export type ElementNodeDevelopment = {
  type: string;
  props: InstanceProps;
  children: Array<ElementNode | TextNode>;
  id: number;
  simplifiedId?: number;
};

export type ElementNode = ElementNodeProduction | ElementNodeDevelopment;

export type TextNodeProduction = {
  t: string;
  x: string;
};

export type TextNodeDevelopment = {
  type: string;
  text: string;
};

export type TextNode = TextNodeProduction | TextNodeDevelopment;

export enum UpdateType {
  CREATED,
  UPDATED,
  REMOVED,
}

export abstract class BaseInstance {
  public constructor(public type: string, public container: Container) {
    this.tag = UpdateType.CREATED;
    this.id = getNextInstanceId();
  }

  public id: number;

  protected parent?: ElementInstance;

  public setParent(parent: ElementInstance | undefined) {
    this.parent = parent;
  }

  public abstract pure(path: string, parentTag?: UpdateType): [ElementNode | TextNode, Updates];

  public abstract registerEventHandler(): void;

  public abstract unregisterEventHandler(): void;

  public tag: UpdateType | undefined;
}

// remove useless `children` in `props`
const removeChildrenFromProps = (props: InstanceProps) => {
  if (typeof props.children !== 'undefined') {
    const { children: uselessChildren, ...restProps } = props;
    return restProps;
  }
  return props;
};

export class ElementInstance extends BaseInstance {
  public constructor(
    public override type: string,
    public props: InstanceProps,
    public children: Array<ElementInstance | TextInstance> = [],
    public override container: Container,
  ) {
    super(type, container);
    this.props = removeChildrenFromProps(props);
  }

  public previous: InstanceProps | undefined;

  private previousSimplifyId: number | undefined;

  private hasChildrenUpdate = false;

  public subtreeDepth?: number;

  public getSubtreeId(): number | undefined {
    const subtreeMaxDepth = useSubtree ? subtreeMaxDepthFromConfig : Infinity;
    // wrapped component should return its wrapper as subtree id
    // `process.env.GOJI_WRAPPED_COMPONENTS` is generated from `@goji/webpack-plugin` to tell which
    // components are wrapped as custom components
    const wrappedComponentsFromWebpack: Array<string> = process.env.GOJI_WRAPPED_COMPONENTS as any;
    if (wrappedComponentsFromWebpack.includes(this.type)) {
      return this.id;
    }
    const ancestors: Array<ElementInstance> = [];
    let cursor: ElementInstance | undefined = this.parent;
    // topGojiId === undefined : no <Subtree> from this element to container
    // topGojiId === cursor.id : the id of closest <Subtree>
    let topGojiId: number | undefined;
    while (cursor?.type !== GOJI_VIRTUAL_ROOT) {
      if (!cursor) {
        console.warn(
          'Cannot find parent in ElementInstance. This might be an internal error in GojiJS.',
        );
        return undefined;
      }
      // wrapped component creates a new subtree
      if (
        (useSubtree && cursor.type === TYPE_SUBTREE) ||
        wrappedComponentsFromWebpack.includes(cursor.type)
      ) {
        topGojiId = cursor.id;
        break;
      }
      ancestors.unshift(cursor);
      cursor = cursor.parent;
    }
    // find the closest subtree from this element to root
    const subtreePosition = ancestors.length - (ancestors.length % subtreeMaxDepth) - 1;
    const subtreeElement = ancestors[subtreePosition];
    if (subtreeElement) {
      return subtreeElement.id;
    }

    return topGojiId;
  }

  public pure(path: string, parentTag?: UpdateType): [ElementNode, Updates] {
    const ids = getTemplateIds();
    const { type, children, id, props } = this;
    let { tag } = this;

    this.tag = undefined;

    // TODO: more optimization here, now if there is any update in children, will re-generate the whole subtree
    if (this.hasChildrenUpdate || parentTag === UpdateType.CREATED) {
      tag = UpdateType.CREATED;
    }

    this.hasChildrenUpdate = false;
    const prefix = path ? `${path}.` : path;
    let updates = {};
    const pureChildren: Array<TextNode | ElementNode> = [];

    children.forEach((child, index) => {
      const [pureChild, update] = child.pure(`${prefix}${ids.children}[${index}]`, tag);
      updates = Object.assign(updates, update);
      pureChildren.push(pureChild);
    });

    const pureProps = this.pureProps();
    const node: ElementNode = {
      [ids.type]: type,
      [ids.props]: pureProps,
      [ids.children]: pureChildren,
      [ids.gojiId]: id,
    } as any;

    const simplifyId = findSimplifyId(type, props);
    if (simplifyId !== undefined) {
      node[ids.simplifiedId] = simplifyId;
    }

    if (this.previous && simplifyId !== this.previousSimplifyId) {
      updates[`${path}.${ids.simplifiedId}`] =
        typeof simplifyId === 'undefined' ? null : simplifyId;
    }

    this.previousSimplifyId = simplifyId;

    if (parentTag === UpdateType.CREATED) {
      return [node, updates];
    }

    if (tag === UpdateType.UPDATED && !shallowEqual(this.previous, pureProps)) {
      updates[`${path}.${ids.props}`] = pureProps;
    }

    if (tag === UpdateType.CREATED) {
      if (path) {
        updates[path] = node;
      } else {
        // always use fully update for root element
        Object.assign(updates, node);
      }
    }

    return [node, updates];
  }

  public registerEventHandler() {
    const { id } = this;
    gojiEvents.registerEventHandler(id, this);
  }

  public unregisterEventHandler() {
    gojiEvents.unregisterEventHandler(this.id);

    // if a sub-tree were removed, only the root node will run `removeChild` or `removeChildFromContainer`
    // we have to unregister handlers recursively
    if (this.children) {
      this.children.forEach(child => {
        child.unregisterEventHandler();
      });
    }
  }

  public triggerEvent(propKey: string, data: any) {
    const listener = this.props[propKey];
    if (listener) {
      if (typeof listener !== 'function') {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `Expected \`${propKey}\` listener to be a function, instead got a value of \`${typeof listener}\` type.`,
          );
        }
        return;
      }
      // batch all event handler
      batchedUpdates(() => listener(data));
    }
  }

  public updateProps(newProps: InstanceProps) {
    this.previous = this.pureProps();
    this.props = removeChildrenFromProps(newProps);
    this.tag = UpdateType.UPDATED;
  }

  public removeChild(child: ElementInstance | TextInstance) {
    child.unregisterEventHandler();
    const index = this.children.indexOf(child);
    this.children.splice(index, 1);
    child.setParent(undefined);
    this.hasChildrenUpdate = true;
  }

  public appendChild(child: ElementInstance | TextInstance) {
    // remove existed child before append
    // in react-dom the host config call `Node.appendChild()` which could handle this case automatically
    // https://github.com/facebook/react/blob/9fe1031244903e442de179821f1d383a9f2a59f2/packages/react-dom/src/client/ReactDOMHostConfig.js#L414
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
    const existedIndex = this.children.indexOf(child);
    if (existedIndex !== -1) {
      this.children.splice(existedIndex, 1);
    }
    this.children.push(child);
    child.setParent(this);
    this.hasChildrenUpdate = true;
  }

  public insertBefore(
    child: ElementInstance | TextInstance,
    beforeChild: ElementInstance | TextInstance,
  ) {
    // remove existed child before insert
    const existedIndex = this.children.indexOf(child);
    if (existedIndex !== -1) {
      this.children.splice(existedIndex, 1);
    }
    const index = this.children.indexOf(beforeChild);
    this.children.splice(index, 0, child);
    child.setParent(this);
    this.hasChildrenUpdate = true;
  }

  public clear() {
    for (const child of this.children) {
      this.removeChild(child);
    }
  }

  private pureProps() {
    const { props } = this;
    const result: Record<string, PuredValue> = {};
    for (const propKey of Object.keys(props)) {
      if (typeof props[propKey] === 'function') {
        // pass
      } else if (propKey === 'style' || propKey.endsWith('Style')) {
        result[propKey] = styleAttrStringify(props[propKey]);
      } else if (propKey === 'children') {
        // pass
      } else if (propKey === 'className') {
        result[propKey] = props.className;
        // FIXME: this condition fix the Baidu className bug with sdk < 3.150
        // className cannot work if changed from '' to any class so we have to provide a initial value 'BD_FIX_CLS'
        // swanide://fragment/a37c071fa45e833ae72d082f43bb64eb1582689802337
        if (process.env.GOJI_TARGET === 'baidu' && !result[propKey]) {
          result[propKey] = 'BD_FIX_CLS';
        }
      } else {
        result[propKey] = props[propKey];
      }
    }
    return result;
  }
}

export class TextInstance extends BaseInstance {
  public constructor(public text: string, public override container: Container) {
    super(TYPE_TEXT, container);
  }

  public previous: string | undefined;

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  public registerEventHandler() {}

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  public unregisterEventHandler() {}

  public updateText(newText: string) {
    this.previous = this.text;
    this.text = newText;
    this.tag = UpdateType.UPDATED;
  }

  public pure(path: string, parentTag?: UpdateType): [TextNode, Updates] {
    const ids = getTemplateIds();
    const { id, type, text, tag } = this;
    this.tag = undefined;

    const node: TextNode = {
      [ids.gojiId]: id,
      [ids.type]: type,
      [ids.text]: text,
    } as any;

    const updates = {};

    if (parentTag === UpdateType.CREATED) {
      return [node, updates];
    }

    if (tag === UpdateType.UPDATED && this.text !== this.previous) {
      updates[`${path}.${ids.text}`] = node[ids.text];
    }

    if (tag === UpdateType.CREATED) {
      updates[path] = node;
    }

    return [node, updates];
  }
}
