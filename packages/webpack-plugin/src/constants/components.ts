import { GojiTarget } from '@goji/core';

// sort compnents to import `wx:elif` performance
const sortComponents = component => {
  // FIXME: list not finished
  const HIGHLIGHT_COMPONENTS = ['view', 'button', 'text'];
  const find = name => {
    const pos = HIGHLIGHT_COMPONENTS.indexOf(name);
    return pos === -1 ? Infinity : pos;
  };
  return component.sort((a, b) => {
    const aPos = find(a.name);
    const bPos = find(b.name);
    return aPos - bPos;
  });
};

const addCommonEvents = (target: GojiTarget, components: ComponentDesc[]) => {
  for (const component of components) {
    component.events.push(
      'touch-start',
      'touch-move',
      'touch-cancel',
      'touch-end',
      'tap',
      // Alipay doesn't support `longpress` so we have to use `longtap` in bridge templates.
      // For more details see https://github.com/airbnb/goji-js/pull/48
      target === 'alipay' ? 'long-tap' : 'long-press',
      'transition-end',
      'animation-start',
      'animation-iteration',
      'animation-end',
      'touch-force-change',
    );
  }
  return components;
};

export type PropDesc = {
  defaultValue?: any;
  required?: boolean;
};

type ComponentPropDescBase =
  | { type: 'String'; defaultValue?: string }
  | { type: 'Number'; defaultValue?: number }
  | { type: 'Boolean'; defaultValue?: boolean }
  | { type: 'Object'; defaultValue?: object }
  | { type: 'Array'; defaultValue?: Array<any> };

export type ComponentPropDesc = ComponentPropDescBase & { required?: boolean };

export type ComponentDesc = {
  name: string;
  props: Record<string, ComponentPropDesc>;
  events: string[];
  isLeaf?: boolean;
  isWrapped?: boolean;
};

// docs: https://developers.weixin.qq.com/miniprogram/en/dev/component/
export const getBuiltInComponents = (target: GojiTarget): ComponentDesc[] =>
  sortComponents(
    addCommonEvents(target, [
      // View Container
      {
        name: 'movable-view',
        props: {
          direction: {
            defaultValue: 'none',
            type: 'String',
            required: false,
          },
          inertia: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'out-of-bounds': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          x: {
            required: false,
            // Number/String
            type: 'String',
          },
          y: {
            required: false,
            // Number/String
            type: 'String',
          },
          damping: {
            defaultValue: 20,
            type: 'Number',
            required: false,
          },
          friction: {
            defaultValue: 2,
            type: 'Number',
            required: false,
          },
          disabled: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          scale: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'scale-min': {
            defaultValue: 0.5,
            type: 'Number',
            required: false,
          },
          'scale-max': {
            defaultValue: 10,
            type: 'Number',
            required: false,
          },
          'scale-value': {
            defaultValue: 1,
            type: 'Number',
            required: false,
          },
          animation: {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
        },
        events: [
          'change',
          'scale',
          // FIXME: `htouchmove` and `vtouchmove` are not prefixed with bind
          'htouchmove',
          'vtouchmove',
        ],
      },
      {
        name: 'cover-image',
        props: {
          src: {
            required: false,
            type: 'String',
          },
        },
        events: ['load', 'error'],
      },
      {
        name: 'cover-view',
        props: {
          'scroll-top': {
            required: false,
            // Number/String
            type: 'String',
          },
        },

        events: [],
      },
      {
        name: 'movable-area',
        props: {
          'scale-area': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
        },
        events: [],
      },
      {
        name: 'scroll-view',
        isWrapped: ['wechat', 'qq'].includes(target),
        props: {
          'scroll-x': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'scroll-y': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'upper-threshold': {
            defaultValue: 50,
            type: 'Number',
            required: false,
          },
          'lower-threshold': {
            defaultValue: 50,
            type: 'Number',
            required: false,
          },
          'scroll-top': {
            required: false,
            // Number/String
            type: 'String',
          },
          'scroll-left': {
            required: false,
            // Number/String
            type: 'String',
          },
          'scroll-into-view': {
            required: false,
            type: 'String',
          },
          'scroll-with-animation': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'enable-back-to-top': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'enable-flex': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'scroll-anchoring': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
        },
        events: ['scroll-to-upper', 'scroll-to-lower', 'scroll'],
      },
      {
        name: 'swiper',
        isWrapped: ['wechat', 'qq'].includes(target),
        props: {
          'indicator-dots': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'indicator-color': {
            defaultValue: 'rgba(0,0,0,.3)',
            type: 'String',
            required: false,
          },
          'indicator-active-color': {
            defaultValue: '#000000',
            type: 'String',
            required: false,
          },
          autoplay: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          current: {
            defaultValue: 0,
            type: 'Number',
            required: false,
          },
          interval: {
            defaultValue: 5000,
            type: 'Number',
            required: false,
          },
          duration: {
            defaultValue: 500,
            type: 'Number',
            required: false,
          },
          circular: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          vertical: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'previous-margin': {
            defaultValue: '0px',
            type: 'String',
            required: false,
          },
          'next-margin': {
            defaultValue: '0px',
            type: 'String',
            required: false,
          },
          'display-multiple-items': {
            defaultValue: 1,
            type: 'Number',
            required: false,
          },
          'skip-hidden-item-layout': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'easing-function': {
            defaultValue: 'default',
            type: 'String',
            required: false,
          },
        },
        events: ['change', 'transition', 'animationfinish'],
      },
      {
        name: 'swiper-item',
        props: {
          'item-id': {
            required: false,
            type: 'String',
          },
          'skip-hidden-item-layout': {
            required: false,
            type: 'Boolean',
            defaultValue: false,
          },
        },
        events: [],
      },
      {
        name: 'text',
        props: {
          selectable: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          space: {
            required: false,
            type: 'String',
          },
          decode: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
        },
        events: [],
      },
      // Basic Content
      {
        name: 'icon',
        props: {
          type: {
            required: true,
            type: 'String',
          },
          size: {
            defaultValue: 23,
            type: 'Number',
            required: false,
          },
          color: {
            required: false,
            type: 'String',
          },
        },
        events: [],
        isLeaf: true,
      },
      {
        name: 'progress',
        props: {
          percent: {
            required: false,
            type: 'Number',
          },
          'show-info': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'border-radius': {
            defaultValue: 0,
            type: 'Number',
            required: false,
          },
          'font-size': {
            defaultValue: 16,
            type: 'Number',
            required: false,
          },
          'stroke-width': {
            defaultValue: 6,
            type: 'Number',
            required: false,
          },
          color: {
            defaultValue: '#09BB07',
            type: 'String',
            required: false,
          },
          // in official document it's `activeColor`
          'active-color': {
            defaultValue: '#09BB07',
            type: 'String',
            required: false,
          },
          // in official document it's `backgroundColor`
          'background-color': {
            defaultValue: '#EBEBEB',
            type: 'String',
            required: false,
          },
          active: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'active-mode': {
            defaultValue: 'backwards',
            type: 'String',
            required: false,
          },
        },
        events: ['activeend'],
        isLeaf: true,
      },
      {
        name: 'rich-text',
        props: {
          nodes: {
            defaultValue: [],
            type: 'Array',
            required: false,
          },
          space: {
            required: false,
            type: 'String',
          },
        },
        events: [],
      },
      {
        name: 'view',
        props: {
          'hover-class': {
            defaultValue: 'none',
            type: 'String',
            required: false,
          },
          'hover-stop-propagation': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'hover-start-time': {
            defaultValue: 50,
            type: 'Number',
            required: false,
          },
          'hover-stay-time': {
            defaultValue: 400,
            type: 'Number',
            required: false,
          },
        },
        events: [],
      },
      // Form
      {
        name: 'button',
        props: {
          size: {
            defaultValue: 'default',
            type: 'String',
            required: false,
          },
          type: {
            defaultValue: '',
            type: 'String',
            required: false,
          },
          plain: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          disabled: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          loading: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'form-type': {
            required: false,
            type: 'String',
          },
          'open-type': {
            required: false,
            type: 'String',
          },
          'hover-class': {
            defaultValue: 'button-hover',
            type: 'String',
            required: false,
          },
          'hover-stop-propagation': {
            defaultValue: 'false',
            type: 'String',
            required: false,
          },
          'hover-start-time': {
            defaultValue: 20,
            type: 'Number',
            required: false,
          },
          'hover-stay-time': {
            defaultValue: 70,
            type: 'Number',
            required: false,
          },
          lang: {
            defaultValue: 'en',
            type: 'String',
            required: false,
          },
          'session-from': {
            required: false,
            type: 'String',
          },
          'send-message-title': {
            required: false,
            type: 'String',
          },
          'send-message-path': {
            required: false,
            type: 'String',
          },
          'send-message-img': {
            required: false,
            type: 'String',
          },
          'app-parameter': {
            required: false,
            type: 'String',
          },
          'show-message-card': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
        },
        events: ['getuserinfo', 'contact', 'getphonenumber', 'error', 'opensetting', 'launchapp'],
      },
      {
        name: 'checkbox',
        props: {
          value: {
            required: false,
            type: 'String',
          },
          disabled: {
            required: false,
            type: 'Boolean',
          },
          checked: {
            required: false,
            type: 'Boolean',
          },
          color: {
            defaultValue: '#09BB07',
            type: 'String',
            required: false,
          },
        },
        events: [],
      },
      {
        name: 'checkbox-group',
        props: {},
        events: ['change'],
      },
      {
        name: 'editor',
        props: {
          'read-only': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          placeholder: {
            required: false,
            type: 'String',
          },
          'show-img-size': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'show-img-toolbar': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'show-img-resize': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
        },
        events: ['ready', 'focus', 'blur', 'input', 'statuschange'],
        isLeaf: true,
      },
      {
        name: 'form',
        props: {
          'report-submit': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'report-submit-timeout': {
            defaultValue: 0,
            type: 'Number',
            required: false,
          },
        },
        events: ['submit', 'reset'],
      },
      {
        name: 'input',
        isWrapped: ['wechat', 'qq', 'baidu'].includes(target),
        props: {
          value: {
            required: true,
            type: 'String',
          },
          type: {
            defaultValue: 'text',
            type: 'String',
            required: false,
          },
          password: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          placeholder: {
            required: true,
            type: 'String',
          },
          'placeholder-style': {
            required: true,
            type: 'String',
          },
          'placeholder-class': {
            defaultValue: 'input-placeholder',
            type: 'String',
            required: false,
          },
          disabled: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          maxlength: {
            defaultValue: 140,
            type: 'Number',
            required: false,
          },
          'cursor-spacing': {
            defaultValue: 0,
            type: 'Number',
            required: false,
          },
          'auto-focus': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          focus: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'confirm-type': {
            defaultValue: 'done',
            type: 'String',
            required: false,
          },
          'confirm-hold': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          cursor: {
            required: true,
            type: 'Number',
          },
          'selection-start': {
            defaultValue: -1,
            type: 'Number',
            required: false,
          },
          'selection-end': {
            defaultValue: -1,
            type: 'Number',
            required: false,
          },
          'adjust-position': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          // Alipay MiniProgram need this prop to fix position of input box is not correct bug.
          // https://opendocs.alipay.com/mini/component/input
          // please note this event is camelCase in Alipay rather than kebab-case
          ...(target === 'alipay'
            ? {
                enableNative: {
                  defaultValue: false,
                  type: 'Boolean',
                  required: false,
                },
              }
            : {}),
        },
        events: ['input', 'focus', 'blur', 'confirm', 'keyboardheightchange'],
        isLeaf: true,
      },
      {
        name: 'label',
        props: {
          for: {
            required: false,
            type: 'String',
          },
        },
        events: [],
      },
      {
        name: 'picker',
        props: {
          mode: {
            defaultValue: 'selector',
            type: 'String',
            required: false,
          },
          disabled: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          range: {
            defaultValue: [],
            type: 'Array',
            required: false,
          },
          'range-key': {
            required: false,
            type: 'String',
          },
          value: {
            defaultValue: 0,
            type: 'Number',
            required: false,
          },
          start: {
            required: false,
            type: 'String',
          },
          end: {
            required: false,
            type: 'String',
          },
          fields: {
            defaultValue: 'day',
            type: 'String',
            required: false,
          },
          'custom-item': {
            required: false,
            type: 'String',
          },
        },
        events: ['cancel', 'change', 'columnchange'],
      },
      {
        name: 'picker-view',
        props: {
          value: {
            required: false,
            type: 'Array',
          },
          'indicator-style': {
            required: false,
            type: 'String',
          },
          'indicator-class': {
            required: false,
            type: 'String',
          },
          'mask-style': {
            required: false,
            type: 'String',
          },
          'mask-class': {
            required: false,
            type: 'String',
          },
        },
        events: ['change', 'pickstart', 'pickend'],
      },
      {
        name: 'picker-view-column',
        props: {},
        events: [],
      },
      {
        name: 'radio',
        props: {
          value: {
            required: false,
            type: 'String',
          },
          checked: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          disabled: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          color: {
            defaultValue: '#09BB07',
            type: 'String',
            required: false,
          },
        },
        events: [],
      },
      {
        name: 'radio-group',
        props: {},
        events: ['change'],
      },
      {
        name: 'slider',
        props: {
          min: {
            defaultValue: 0,
            type: 'Number',
            required: false,
          },
          max: {
            defaultValue: 100,
            type: 'Number',
            required: false,
          },
          step: {
            defaultValue: 1,
            type: 'Number',
            required: false,
          },
          disabled: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          value: {
            defaultValue: 0,
            type: 'Number',
            required: false,
          },
          color: {
            defaultValue: '#e9e9e9',
            type: 'String',
            required: false,
          },
          'selected-color': {
            defaultValue: '#1aad19',
            type: 'String',
            required: false,
          },
          // in official documentation it's `activeColor`
          'active-color': {
            defaultValue: '#1aad19',
            type: 'String',
            required: false,
          },
          // in official documentation it's `backgroundColor`
          'background-color': {
            defaultValue: '#e9e9e9',
            type: 'String',
            required: false,
          },
          'block-size': {
            defaultValue: 28,
            type: 'Number',
            required: false,
          },
          'block-color': {
            defaultValue: '#ffffff',
            type: 'String',
            required: false,
          },
          'show-value': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
        },
        events: ['change', 'changing'],
        isLeaf: true,
      },
      {
        name: 'switch',
        props: {
          checked: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          disabled: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          type: {
            defaultValue: 'switch',
            type: 'String',
            required: false,
          },
          color: {
            defaultValue: '#04BE02',
            type: 'String',
            required: false,
          },
        },
        events: ['change'],
        isLeaf: true,
      },
      {
        name: 'textarea',
        isWrapped: ['wechat', 'qq', 'baidu'].includes(target),
        props: {
          value: {
            required: false,
            type: 'String',
          },
          placeholder: {
            required: false,
            type: 'String',
          },
          'placeholder-style': {
            required: false,
            type: 'String',
          },
          'placeholder-class': {
            defaultValue: 'textarea-placeholder',
            type: 'String',
            required: false,
          },
          disabled: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          maxlength: {
            defaultValue: 140,
            type: 'Number',
            required: false,
          },
          'auto-focus': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          focus: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'auto-height': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          fixed: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'cursor-spacing': {
            defaultValue: 0,
            type: 'Number',
            required: false,
          },
          cursor: {
            defaultValue: -1,
            type: 'Number',
            required: false,
          },
          'show-confirm-bar': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          'selection-start': {
            defaultValue: -1,
            type: 'Number',
            required: false,
          },
          'selection-end': {
            defaultValue: -1,
            type: 'Number',
            required: false,
          },
          'adjust-position': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          'hold-keyboard': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'disable-default-padding': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'confirm-type': {
            defaultValue: 'return',
            type: 'String',
            required: false,
          },
          'confirm-hold': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
        },
        events: ['focus', 'blur', 'linechange', 'input', 'confirm', 'keyboardheightchange'],
        isLeaf: true,
      },
      // Navigation
      {
        name: 'functional-page-navigator',
        props: {
          version: {
            defaultValue: 'release',
            type: 'String',
            required: false,
          },
          name: {
            required: false,
            type: 'String',
          },
          args: {
            required: false,
            type: 'Object',
          },
        },
        events: ['success', 'fail'],
      },
      {
        name: 'navigator',
        props: {
          target: {
            defaultValue: 'self',
            type: 'String',
            required: false,
          },
          url: {
            required: false,
            type: 'String',
          },
          'open-type': {
            defaultValue: 'navigate',
            type: 'String',
            required: false,
          },
          delta: {
            defaultValue: 1,
            type: 'Number',
            required: false,
          },
          'app-id': {
            required: false,
            type: 'String',
          },
          path: {
            required: false,
            type: 'String',
          },
          'extra-data': {
            required: false,
            type: 'Object',
          },
          version: {
            defaultValue: 'release',
            type: 'String',
            required: false,
          },
          'hover-class': {
            defaultValue: 'navigator-hover',
            type: 'String',
            required: false,
          },
          'hover-stop-propagation': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'hover-start-time': {
            defaultValue: 50,
            type: 'Number',
            required: false,
          },
          'hover-stay-time': {
            defaultValue: 600,
            type: 'Number',
            required: false,
          },
        },
        events: ['success', 'fail', 'complete'],
      },
      // Multimedia
      {
        name: 'audio',
        props: {
          id: {
            required: false,
            type: 'String',
          },
          src: {
            required: false,
            type: 'String',
          },
          loop: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          controls: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          poster: {
            required: false,
            type: 'String',
          },
          name: {
            defaultValue: '未知音频',
            type: 'String',
            required: false,
          },
          author: {
            defaultValue: '未知作者',
            type: 'String',
            required: false,
          },
        },
        events: ['error', 'play', 'pause', 'timeupdate', 'ended'],
        isLeaf: true,
      },
      {
        name: 'camera',
        props: {
          mode: {
            defaultValue: 'normal',
            type: 'String',
            required: false,
          },
          'device-position': {
            defaultValue: 'back',
            type: 'String',
            required: false,
          },
          flash: {
            defaultValue: 'auto',
            type: 'String',
            required: false,
          },
          'frame-size': {
            defaultValue: 'medium',
            type: 'String',
            required: false,
          },
        },
        events: ['stop', 'error', 'initdone', 'scancode'],
        isLeaf: true,
      },
      {
        name: 'image',
        props: {
          src: {
            required: false,
            type: 'String',
          },
          mode: {
            defaultValue: 'scaleToFill',
            type: 'String',
            required: false,
          },
          'lazy-load': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'show-menu-by-longpress': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
        },
        events: ['error', 'load'],
        isLeaf: true,
      },
      {
        name: 'live-player',
        props: {
          src: {
            required: false,
            type: 'String',
          },
          mode: {
            defaultValue: 'live',
            type: 'String',
            required: false,
          },
          autoplay: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          muted: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          orientation: {
            defaultValue: 'vertical',
            type: 'String',
            required: false,
          },
          'object-fit': {
            defaultValue: 'contain',
            type: 'String',
            required: false,
          },
          'background-mute': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'min-cache': {
            defaultValue: 1,
            type: 'Number',
            required: false,
          },
          'max-cache': {
            defaultValue: 3,
            type: 'Number',
            required: false,
          },
          'sound-mode': {
            defaultValue: 'speaker',
            type: 'String',
            required: false,
          },
          'auto-pause-if-navigate': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          'auto-pause-if-open-native': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
        },
        events: ['statechange', 'fullscreenchange', 'netstatus'],
        isLeaf: true,
      },
      {
        name: 'live-pusher',
        props: {
          url: {
            required: false,
            type: 'String',
          },
          mode: {
            defaultValue: 'RTC',
            type: 'String',
            required: false,
          },
          autopush: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          muted: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'enable-camera': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          'auto-focus': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          orientation: {
            defaultValue: 'vertical',
            type: 'String',
            required: false,
          },
          beauty: {
            defaultValue: 0,
            type: 'Number',
            required: false,
          },
          whiteness: {
            defaultValue: 0,
            type: 'Number',
            required: false,
          },
          aspect: {
            defaultValue: '9:16',
            type: 'String',
            required: false,
          },
          'min-bitrate': {
            defaultValue: 200,
            type: 'Number',
            required: false,
          },
          'max-bitrate': {
            defaultValue: 1000,
            type: 'Number',
            required: false,
          },
          'waiting-image': {
            required: false,
            type: 'String',
          },
          'waiting-image-hash': {
            required: false,
            type: 'String',
          },
          zoom: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'device-position': {
            defaultValue: 'front',
            type: 'String',
            required: false,
          },
          'background-mute': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          mirror: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
        },
        events: ['statechange', 'netstatus', 'error', 'bgmstart', 'bgmprogress', 'bgmcomplete'],
        isLeaf: true,
      },
      {
        name: 'video',
        props: {
          src: {
            required: true,
            type: 'String',
          },
          duration: {
            required: false,
            type: 'Number',
          },
          controls: {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          'danmu-list': {
            required: false,
            type: 'Array',
          },
          'danmu-btn': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'enable-danmu': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          autoplay: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          loop: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          muted: {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'initial-time': {
            defaultValue: 0,
            type: 'Number',
            required: false,
          },
          'page-gesture': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          direction: {
            required: false,
            type: 'Number',
          },
          'show-progress': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          'show-fullscreen-btn': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          'show-play-btn': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          'show-center-play-btn': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          'enable-progress-gesture': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          'object-fit': {
            defaultValue: 'contain',
            type: 'String',
            required: false,
          },
          poster: {
            required: false,
            type: 'String',
          },
          'show-mute-btn': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          title: {
            required: false,
            type: 'String',
          },
          'play-btn-position': {
            defaultValue: 'bottom',
            type: 'String',
            required: false,
          },
          'enable-play-gesture': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'auto-pause-if-navigate': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          'auto-pause-if-open-native': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          'vslide-gesture': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'vslide-gesture-in-fullscreen': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
        },
        events: [
          'play',
          'pause',
          'ended',
          'timeupdate',
          'fullscreenchange',
          'waiting',
          'error',
          'progress',
        ],
        isLeaf: true,
      },
      // Map
      {
        name: 'map',
        isWrapped: ['wechat', 'qq'].includes(target),
        props: {
          longitude: {
            required: true,
            type: 'Number',
          },
          latitude: {
            required: true,
            type: 'Number',
          },
          scale: {
            defaultValue: 16,
            type: 'Number',
            required: false,
          },
          markers: {
            required: false,
            type: 'Array',
          },
          // don't support `covers`
          // 1. covers is deprecated
          // 2. covers cause map lost uncontrolled data
          polyline: {
            required: false,
            type: 'Array',
          },
          circles: {
            required: false,
            type: 'Array',
          },
          controls: {
            required: false,
            type: 'Array',
          },
          'include-points': {
            required: false,
            type: 'Array',
          },
          'show-location': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          polygons: {
            required: false,
            type: 'Array',
          },
          subkey: {
            required: false,
            type: 'String',
          },
          'layer-style': {
            defaultValue: 1,
            type: 'Number',
            required: false,
          },
          rotate: {
            defaultValue: 0,
            type: 'Number',
            required: false,
          },
          skew: {
            defaultValue: 0,
            type: 'Number',
            required: false,
          },
          'enable-3D': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'show-compass': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'show-scale': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'enable-overlooking': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'enable-zoom': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          'enable-scroll': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          'enable-rotate': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'enable-satellite': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'enable-traffic': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
          'enable-poi': {
            defaultValue: true,
            type: 'Boolean',
            required: false,
          },
          'enable-building': {
            required: false,
            type: 'Boolean',
          },
          // Disable <map>'s setting usage temporary
          // for more details see https://github.com/airbnb/goji-js/pull/103
          // setting: {
          //   required: false,
          //   type: 'Object',
          // },
        },
        events: [
          'markertap',
          'labeltap',
          'controltap',
          'callouttap',
          'updated',
          'regionchange',
          'poitap',
          'anchorpointtap',
        ],
        isLeaf: true,
      },
      // Canvas
      {
        name: 'canvas',
        props: {
          type: {
            required: false,
            type: 'String',
          },
          'canvas-id': {
            required: false,
            type: 'String',
          },
          'disable-scroll': {
            defaultValue: false,
            type: 'Boolean',
            required: false,
          },
        },
        events: ['error'],
        isLeaf: true,
      },
      // Open Capabilities
      {
        name: 'ad',
        props: {
          'unit-id': {
            required: true,
            type: 'String',
          },
          'ad-intervals': {
            required: false,
            type: 'Number',
          },
        },
        events: ['load', 'error', 'close'],
        isLeaf: true,
      },
      {
        name: 'official-account',
        props: {},
        events: ['load', 'error'],
        isLeaf: true,
      },
      {
        name: 'open-data',
        props: {
          type: {
            required: false,
            type: 'String',
          },
          'open-gid': {
            required: false,
            type: 'String',
          },
          lang: {
            defaultValue: 'en',
            type: 'String',
            required: false,
          },
          'default-text': {
            required: false,
            type: 'String',
          },
          'default-avatar': {
            required: false,
            type: 'String',
          },
        },
        events: ['error'],
        isLeaf: true,
      },
      {
        name: 'web-view',
        props: {
          src: {
            required: false,
            type: 'String',
          },
        },
        events: ['message', 'load', 'error'],
        isLeaf: true,
      },
    ]),
  );

// this function is used for generating a wrapped component list to calculate `getSubtreeId` in `@goji/core`
export const getWrappedComponents = (target: GojiTarget): Array<string> =>
  getBuiltInComponents(target)
    .filter(comp => comp.isWrapped)
    .map(comp => comp.name);
