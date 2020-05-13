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

const addCommonEvents = (components: ComponentDesc[]) => {
  for (const component of components) {
    component.events.push(
      'touch-start',
      'touch-move',
      'touch-cancel',
      'touch-end',
      'tap',
      'long-press',
      'long-tap',
      'transition-end',
      'animation-start',
      'animation-iteration',
      'animation-end',
      'touch-force-change',
    );
  }
  return components;
};

export enum propTypes {
  number = 'number',
  string = 'string',
  boolean = 'boolean',
  color = 'color',
  array = 'array',
  object = 'object',
}

type PropDesc = {
  type: propTypes[] | propTypes;
  value?: any;
  required?: boolean;
};

export type ComponentDesc = {
  name: string;
  props: {
    [key: string]: PropDesc;
  };
  events: string[];
  isLeaf?: boolean;
  isWrapped?: boolean;
};

// docs: https://developers.weixin.qq.com/miniprogram/en/dev/component/
export const BUILD_IN_COMPONENTS: ComponentDesc[] = sortComponents(
  addCommonEvents([
    // View Container
    {
      name: 'movable-view',
      props: {
        direction: {
          type: propTypes.string,
          value: 'none',
        },
        inertia: {
          type: propTypes.boolean,
          value: false,
        },
        'out-of-bounds': {
          type: propTypes.boolean,
          value: false,
        },
        x: {
          type: propTypes.number,
        },
        y: {
          type: propTypes.number,
        },
        damping: {
          type: propTypes.number,
          value: 20,
        },
        friction: {
          type: propTypes.number,
          value: 2,
        },
        disabled: {
          type: propTypes.boolean,
          value: false,
        },
        scale: {
          type: propTypes.boolean,
          value: false,
        },
        'scale-min': {
          type: propTypes.number,
          value: 0.5,
        },
        'scale-max': {
          type: propTypes.number,
          value: 10,
        },
        'scale-value': {
          type: propTypes.number,
          value: 1,
        },
        animation: {
          type: propTypes.boolean,
          value: true,
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
          type: propTypes.string,
        },
      },
      events: ['load', 'error'],
    },
    {
      name: 'cover-view',
      props: {
        'scroll-top': {
          type: [propTypes.string, propTypes.number],
        },
      },

      events: [],
    },
    {
      name: 'movable-area',
      props: {
        'scale-area': {
          type: propTypes.boolean,
          value: false,
        },
      },
      events: [],
    },
    {
      name: 'scroll-view',
      isWrapped: true,
      props: {
        'scroll-x': {
          type: propTypes.boolean,
          value: false,
        },
        'scroll-y': {
          type: propTypes.boolean,
          value: false,
        },
        'upper-threshold': {
          type: [propTypes.number, propTypes.string],
          value: 50,
        },
        'lower-threshold': {
          type: [propTypes.number, propTypes.string],
          value: 50,
        },
        'scroll-top': {
          type: [propTypes.number, propTypes.string],
        },
        'scroll-left': {
          type: [propTypes.number, propTypes.string],
        },
        'scroll-into-view': {
          type: propTypes.string,
        },
        'scroll-with-animation': {
          type: propTypes.boolean,
          value: false,
        },
        'enable-back-to-top': {
          type: propTypes.boolean,
          value: false,
        },
        'enable-flex': {
          type: propTypes.boolean,
          value: false,
        },
        'scroll-anchoring': {
          type: propTypes.boolean,
          value: false,
        },
      },
      events: ['scroll-to-upper', 'scroll-to-lower', 'scroll'],
    },
    {
      name: 'swiper',
      isWrapped: true,
      props: {
        'indicator-dots': {
          type: propTypes.boolean,
          value: false,
        },
        'indicator-color': {
          type: propTypes.color,
          value: 'rgba(0,0,0,.3)',
        },
        'indicator-active-color': {
          type: propTypes.color,
          value: '#000000',
        },
        autoplay: {
          type: propTypes.boolean,
          value: false,
        },
        current: {
          type: propTypes.number,
          value: 0,
        },
        interval: {
          type: propTypes.number,
          value: 5000,
        },
        duration: {
          type: propTypes.number,
          value: 500,
        },
        circular: {
          type: propTypes.boolean,
          value: false,
        },
        vertical: {
          type: propTypes.boolean,
          value: false,
        },
        'previous-margin': {
          type: propTypes.string,
          value: '0px',
        },
        'next-margin': {
          type: propTypes.string,
          value: '0px',
        },
        'display-multiple-items': {
          type: propTypes.number,
          value: 1,
        },
        'skip-hidden-item-layout': {
          type: propTypes.boolean,
          value: false,
        },
        'easing-function': {
          type: propTypes.string,
          value: 'default',
        },
      },
      events: ['change', 'transition', 'animationfinish'],
    },
    {
      name: 'swiper-item',
      props: {
        'item-id': {
          type: propTypes.string,
        },
      },
      events: [],
    },
    {
      name: 'text',
      props: {
        selectable: {
          type: propTypes.boolean,
          value: false,
        },
        space: {
          type: propTypes.string,
        },
        decode: {
          type: propTypes.boolean,
          value: false,
        },
      },
      events: [],
    },
    // Basic Content
    {
      name: 'icon',
      props: {
        type: {
          type: propTypes.string,
          required: true,
        },
        size: {
          type: [propTypes.number, propTypes.string],
          value: 23,
        },
        color: {
          type: propTypes.string,
        },
      },
      events: [],
      isLeaf: true,
    },
    {
      name: 'progress',
      props: {
        percent: {
          type: propTypes.number,
        },
        'show-info': {
          type: propTypes.boolean,
          value: false,
        },
        'border-radius': {
          type: [propTypes.number, propTypes.string],
          value: 0,
        },
        'font-size': {
          type: [propTypes.number, propTypes.string],
          value: 16,
        },
        'stroke-width': {
          type: [propTypes.number, propTypes.string],
          value: 6,
        },
        color: {
          type: propTypes.string,
          value: '#09BB07',
        },
        activeColor: {
          type: propTypes.string,
          value: '#09BB07',
        },
        backgroundColor: {
          type: propTypes.string,
          value: '#EBEBEB',
        },
        active: {
          type: propTypes.boolean,
          value: false,
        },
        'active-mode': {
          type: propTypes.string,
          value: 'backwards',
        },
      },
      events: ['activeend'],
      isLeaf: true,
    },
    {
      name: 'rich-text',
      props: {
        nodes: {
          type: [propTypes.string, propTypes.array],
          value: [],
        },
        space: {
          type: propTypes.string,
        },
      },
      events: [],
    },
    {
      name: 'view',
      props: {
        'hover-class': {
          type: propTypes.string,
          value: 'none',
        },
        'hover-stop-propagation': {
          type: propTypes.boolean,
          value: false,
        },
        'hover-start-time': {
          type: propTypes.number,
          value: 50,
        },
        'hover-stay-time': {
          type: propTypes.number,
          value: 400,
        },
      },
      events: [],
    },
    // Form
    {
      name: 'button',
      props: {
        size: {
          type: propTypes.string,
          value: 'default',
        },
        type: {
          type: propTypes.string,
          // the document said `type` defaults to `'default'` but `''` in fact otherwise the background-color won't work
          // doc: https://developers.weixin.qq.com/miniprogram/dev/component/button.html
          value: '',
        },
        plain: {
          type: propTypes.boolean,
          value: false,
        },
        disabled: {
          type: propTypes.boolean,
          value: false,
        },
        loading: {
          type: propTypes.boolean,
          value: false,
        },
        'form-type': {
          type: propTypes.string,
        },
        'open-type': {
          type: propTypes.string,
        },
        'hover-class': {
          type: propTypes.string,
          value: 'button-hover',
        },
        'hover-stop-propagation': {
          type: propTypes.boolean,
          value: 'false',
        },
        'hover-start-time': {
          type: propTypes.number,
          value: 20,
        },
        'hover-stay-time': {
          type: propTypes.number,
          value: 70,
        },
        lang: {
          type: propTypes.string,
          value: 'en',
        },
        'session-from': {
          type: propTypes.string,
        },
        'send-message-title': {
          type: propTypes.string,
        },
        'send-message-path': {
          type: propTypes.string,
        },
        'send-message-img': {
          type: propTypes.string,
        },
        'app-parameter': {
          type: propTypes.string,
        },
        'show-message-card': {
          type: propTypes.boolean,
          value: false,
        },
      },
      events: ['getuserinfo', 'contact', 'getphonenumber', 'error', 'opensetting', 'launchapp'],
    },
    {
      name: 'checkbox',
      props: {
        value: {
          type: propTypes.string,
        },
        disabled: {
          type: propTypes.boolean,
        },
        checked: {
          type: propTypes.boolean,
        },
        color: {
          type: propTypes.string,
          value: '#09BB07',
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
          type: propTypes.boolean,
          value: false,
        },
        placeholder: {
          type: propTypes.string,
        },
        'show-img-size': {
          type: propTypes.boolean,
          value: false,
        },
        'show-img-toolbar': {
          type: propTypes.boolean,
          value: false,
        },
        'show-img-resize': {
          type: propTypes.boolean,
          value: false,
        },
      },
      events: ['ready', 'focus', 'blur', 'input', 'statuschange'],
      isLeaf: true,
    },
    {
      name: 'form',
      props: {
        'report-submit': {
          type: propTypes.boolean,
          value: false,
        },
        'report-submit-timeout': {
          type: propTypes.number,
          value: 0,
        },
      },
      events: ['submit', 'reset'],
    },
    {
      name: 'input',
      isWrapped: true,
      props: {
        value: {
          type: propTypes.string,
          required: true,
        },
        type: {
          type: propTypes.string,
          value: 'text',
        },
        password: {
          type: propTypes.boolean,
          value: false,
        },
        placeholder: {
          type: propTypes.string,
          required: true,
        },
        'placeholder-style': {
          type: propTypes.string,
          required: true,
        },
        'placeholder-class': {
          type: propTypes.string,
          value: 'input-placeholder',
        },
        disabled: {
          type: propTypes.boolean,
          value: false,
        },
        maxlength: {
          type: propTypes.number,
          value: 140,
        },
        'cursor-spacing': {
          type: propTypes.number,
          value: 0,
        },
        'auto-focus': {
          type: propTypes.boolean,
          value: false,
        },
        focus: {
          type: propTypes.boolean,
          value: false,
        },
        'confirm-type': {
          type: propTypes.string,
          value: 'done',
        },
        'confirm-hold': {
          type: propTypes.boolean,
          value: false,
        },
        cursor: {
          type: propTypes.number,
          required: true,
        },
        'selection-start': {
          type: propTypes.number,
          value: -1,
        },
        'selection-end': {
          type: propTypes.number,
          value: -1,
        },
        'adjust-position': {
          type: propTypes.boolean,
          value: true,
        },
        // Alipay MiniProgram need this prop to fix position of input box is not correct bug.
        // https://opendocs.alipay.com/mini/component/input
        'enableNative': {
          type: propTypes.boolean,
          value: false,
        },
      },
      events: ['input', 'focus', 'blur', 'confirm', 'keyboardheightchange'],
      isLeaf: true,
    },
    {
      name: 'label',
      props: {
        for: {
          type: propTypes.string,
        },
      },
      events: [],
    },
    {
      name: 'picker',
      props: {
        mode: {
          type: propTypes.string,
          value: 'selector',
        },
        disabled: {
          type: propTypes.boolean,
          value: false,
        },
        range: {
          type: [propTypes.array, propTypes.object],
          value: [],
        },
        'range-key': {
          type: propTypes.string,
        },
        value: {
          type: propTypes.number,
          value: 0,
        },
        start: {
          type: propTypes.string,
        },
        end: {
          type: propTypes.string,
        },
        fields: {
          type: propTypes.string,
          value: 'day',
        },
        'custom-item': {
          type: propTypes.string,
        },
      },
      events: ['cancel', 'change', 'columnchange'],
    },
    {
      name: 'picker-view',
      props: {
        value: {
          type: propTypes.array,
        },
        'indicator-style': {
          type: propTypes.string,
        },
        'indicator-class': {
          type: propTypes.string,
        },
        'mask-style': {
          type: propTypes.string,
        },
        'mask-class': {
          type: propTypes.string,
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
          type: propTypes.string,
        },
        checked: {
          type: propTypes.boolean,
          value: false,
        },
        disabled: {
          type: propTypes.boolean,
          value: false,
        },
        color: {
          type: propTypes.string,
          value: '#09BB07',
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
          type: propTypes.number,
          value: 0,
        },
        max: {
          type: propTypes.number,
          value: 100,
        },
        step: {
          type: propTypes.number,
          value: 1,
        },
        disabled: {
          type: propTypes.boolean,
          value: false,
        },
        value: {
          type: propTypes.number,
          value: 0,
        },
        color: {
          type: propTypes.color,
          value: '#e9e9e9',
        },
        'selected-color': {
          type: propTypes.color,
          value: '#1aad19',
        },
        activeColor: {
          type: propTypes.color,
          value: '#1aad19',
        },
        backgroundColor: {
          type: propTypes.color,
          value: '#e9e9e9',
        },
        'block-size': {
          type: propTypes.number,
          value: 28,
        },
        'block-color': {
          type: propTypes.color,
          value: '#ffffff',
        },
        'show-value': {
          type: propTypes.boolean,
          value: false,
        },
      },
      events: ['change', 'changing'],
      isLeaf: true,
    },
    {
      name: 'switch',
      props: {
        checked: {
          type: propTypes.boolean,
          value: false,
        },
        disabled: {
          type: propTypes.boolean,
          value: false,
        },
        type: {
          type: propTypes.string,
          value: 'switch',
        },
        color: {
          type: propTypes.string,
          value: '#04BE02',
        },
      },
      events: ['change'],
      isLeaf: true,
    },
    {
      name: 'textarea',
      isWrapped: true,
      props: {
        value: {
          type: propTypes.string,
        },
        placeholder: {
          type: propTypes.string,
        },
        'placeholder-style': {
          type: propTypes.string,
        },
        'placeholder-class': {
          type: propTypes.string,
          value: 'textarea-placeholder',
        },
        disabled: {
          type: propTypes.boolean,
          value: false,
        },
        maxlength: {
          type: propTypes.number,
          value: 140,
        },
        'auto-focus': {
          type: propTypes.boolean,
          value: false,
        },
        focus: {
          type: propTypes.boolean,
          value: false,
        },
        'auto-height': {
          type: propTypes.boolean,
          value: false,
        },
        fixed: {
          type: propTypes.boolean,
          value: false,
        },
        'cursor-spacing': {
          type: propTypes.number,
          value: 0,
        },
        cursor: {
          type: propTypes.number,
          value: -1,
        },
        'show-confirm-bar': {
          type: propTypes.boolean,
          value: true,
        },
        'selection-start': {
          type: propTypes.number,
          value: -1,
        },
        'selection-end': {
          type: propTypes.number,
          value: -1,
        },
        'adjust-position': {
          type: propTypes.boolean,
          value: true,
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
          type: propTypes.string,
          value: 'release',
        },
        name: {
          type: propTypes.string,
        },
        args: {
          type: propTypes.object,
        },
      },
      events: ['success', 'fail'],
    },
    {
      name: 'navigator',
      props: {
        target: {
          type: propTypes.string,
          value: 'self',
        },
        url: {
          type: propTypes.string,
        },
        'open-type': {
          type: propTypes.string,
          value: 'navigate',
        },
        delta: {
          type: propTypes.number,
          value: 1,
        },
        'app-id': {
          type: propTypes.string,
        },
        path: {
          type: propTypes.string,
        },
        'extra-data': {
          type: propTypes.object,
        },
        version: {
          type: propTypes.string,
          value: 'release',
        },
        'hover-class': {
          type: propTypes.string,
          value: 'navigator-hover',
        },
        'hover-stop-propagation': {
          type: propTypes.boolean,
          value: false,
        },
        'hover-start-time': {
          type: propTypes.number,
          value: 50,
        },
        'hover-stay-time': {
          type: propTypes.number,
          value: 600,
        },
      },
      events: ['success', 'fail', 'complete'],
    },
    // Multimedia
    {
      name: 'audio',
      props: {
        id: {
          type: propTypes.string,
        },
        src: {
          type: propTypes.string,
        },
        loop: {
          type: propTypes.boolean,
          value: false,
        },
        controls: {
          type: propTypes.boolean,
          value: false,
        },
        poster: {
          type: propTypes.string,
        },
        name: {
          type: propTypes.string,
          value: '未知音频',
        },
        author: {
          type: propTypes.string,
          value: '未知作者',
        },
      },
      events: ['error', 'play', 'pause', 'timeupdate', 'ended'],
      isLeaf: true,
    },
    {
      name: 'camera',
      props: {
        mode: {
          type: propTypes.string,
          value: 'normal',
        },
        'device-position': {
          type: propTypes.string,
          value: 'back',
        },
        flash: {
          type: propTypes.string,
          value: 'auto',
        },
        'frame-size': {
          type: propTypes.string,
          value: 'medium',
        },
      },
      events: ['stop', 'error', 'initdone', 'scancode'],
      isLeaf: true,
    },
    {
      name: 'image',
      props: {
        src: {
          type: propTypes.string,
        },
        mode: {
          type: propTypes.string,
          value: 'scaleToFill',
        },
        'lazy-load': {
          type: propTypes.boolean,
          value: false,
        },
        'show-menu-by-longpress': {
          type: propTypes.boolean,
          value: false,
        },
      },
      events: ['error', 'load'],
      isLeaf: true,
    },
    {
      name: 'live-player',
      props: {
        src: {
          type: propTypes.string,
        },
        mode: {
          type: propTypes.string,
          value: 'live',
        },
        autoplay: {
          type: propTypes.boolean,
          value: false,
        },
        muted: {
          type: propTypes.boolean,
          value: false,
        },
        orientation: {
          type: propTypes.string,
          value: 'vertical',
        },
        'object-fit': {
          type: propTypes.string,
          value: 'contain',
        },
        'background-mute': {
          type: propTypes.boolean,
          value: false,
        },
        'min-cache': {
          type: propTypes.number,
          value: 1,
        },
        'max-cache': {
          type: propTypes.number,
          value: 3,
        },
        'sound-mode': {
          type: propTypes.string,
          value: 'speaker',
        },
        'auto-pause-if-navigate': {
          type: propTypes.boolean,
          value: true,
        },
        'auto-pause-if-open-native': {
          type: propTypes.boolean,
          value: true,
        },
      },
      events: ['statechange', 'fullscreenchange', 'netstatus'],
      isLeaf: true,
    },
    {
      name: 'live-pusher',
      props: {
        url: {
          type: propTypes.string,
        },
        mode: {
          type: propTypes.string,
          value: 'RTC',
        },
        autopush: {
          type: propTypes.boolean,
          value: false,
        },
        muted: {
          type: propTypes.boolean,
          value: false,
        },
        'enable-camera': {
          type: propTypes.boolean,
          value: true,
        },
        'auto-focus': {
          type: propTypes.boolean,
          value: true,
        },
        orientation: {
          type: propTypes.string,
          value: 'vertical',
        },
        beauty: {
          type: propTypes.number,
          value: 0,
        },
        whiteness: {
          type: propTypes.number,
          value: 0,
        },
        aspect: {
          type: propTypes.string,
          value: '9:16',
        },
        'min-bitrate': {
          type: propTypes.number,
          value: 200,
        },
        'max-bitrate': {
          type: propTypes.number,
          value: 1000,
        },
        'waiting-image': {
          type: propTypes.string,
        },
        'waiting-image-hash': {
          type: propTypes.string,
        },
        zoom: {
          type: propTypes.boolean,
          value: false,
        },
        'device-position': {
          type: propTypes.string,
          value: 'front',
        },
        'background-mute': {
          type: propTypes.boolean,
          value: false,
        },
        mirror: {
          type: propTypes.boolean,
          value: false,
        },
      },
      events: ['statechange', 'netstatus', 'error', 'bgmstart', 'bgmprogress', 'bgmcomplete'],
      isLeaf: true,
    },
    {
      name: 'video',
      props: {
        src: {
          type: propTypes.string,
          required: true,
        },
        duration: {
          type: propTypes.number,
        },
        controls: {
          type: propTypes.boolean,
          value: true,
        },
        'danmu-list': {
          type: propTypes.array,
        },
        'danmu-btn': {
          type: propTypes.boolean,
          value: false,
        },
        'enable-danmu': {
          type: propTypes.boolean,
          value: false,
        },
        autoplay: {
          type: propTypes.boolean,
          value: false,
        },
        loop: {
          type: propTypes.boolean,
          value: false,
        },
        muted: {
          type: propTypes.boolean,
          value: false,
        },
        'initial-time': {
          type: propTypes.number,
          value: 0,
        },
        'page-gesture': {
          type: propTypes.boolean,
          value: false,
        },
        direction: {
          type: propTypes.number,
        },
        'show-progress': {
          type: propTypes.boolean,
          value: true,
        },
        'show-fullscreen-btn': {
          type: propTypes.boolean,
          value: true,
        },
        'show-play-btn': {
          type: propTypes.boolean,
          value: true,
        },
        'show-center-play-btn': {
          type: propTypes.boolean,
          value: true,
        },
        'enable-progress-gesture': {
          type: propTypes.boolean,
          value: true,
        },
        'object-fit': {
          type: propTypes.string,
          value: 'contain',
        },
        poster: {
          type: propTypes.string,
        },
        'show-mute-btn': {
          type: propTypes.boolean,
          value: false,
        },
        title: {
          type: propTypes.string,
        },
        'play-btn-position': {
          type: propTypes.string,
          value: 'bottom',
        },
        'enable-play-gesture': {
          type: propTypes.boolean,
          value: false,
        },
        'auto-pause-if-navigate': {
          type: propTypes.boolean,
          value: true,
        },
        'auto-pause-if-open-native': {
          type: propTypes.boolean,
          value: true,
        },
        'vslide-gesture': {
          type: propTypes.boolean,
          value: false,
        },
        'vslide-gesture-in-fullscreen': {
          type: propTypes.boolean,
          value: true,
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
      isWrapped: true,
      props: {
        longitude: {
          type: propTypes.number,
          required: true,
        },
        latitude: {
          type: propTypes.number,
          required: true,
        },
        scale: {
          type: propTypes.number,
          value: 16,
        },
        markers: {
          type: propTypes.array,
        },
        // don't support `covers`
        // 1. covers is deprecated
        // 2. covers cause map lost uncontrolled data
        polyline: {
          type: propTypes.array,
        },
        circles: {
          type: propTypes.array,
        },
        controls: {
          type: propTypes.array,
        },
        'include-points': {
          type: propTypes.array,
        },
        'show-location': {
          type: propTypes.boolean,
          value: false,
        },
        polygons: {
          type: propTypes.array,
        },
        subkey: {
          type: propTypes.string,
        },
        'layer-style': {
          type: propTypes.number,
          value: 1,
        },
        rotate: {
          type: propTypes.number,
          value: 0,
        },
        skew: {
          type: propTypes.number,
          value: 0,
        },
        'enable-3D': {
          type: propTypes.boolean,
          value: false,
        },
        'show-compass': {
          type: propTypes.boolean,
          value: false,
        },
        'show-scale': {
          type: propTypes.boolean,
          value: false,
        },
        'enable-overlooking': {
          type: propTypes.boolean,
          value: false,
        },
        'enable-zoom': {
          type: propTypes.boolean,
          value: true,
        },
        'enable-scroll': {
          type: propTypes.boolean,
          value: true,
        },
        'enable-rotate': {
          type: propTypes.boolean,
          value: false,
        },
        'enable-satellite': {
          type: propTypes.boolean,
          value: false,
        },
        'enable-traffic': {
          type: propTypes.boolean,
          value: false,
        },
      },
      events: ['tap', 'markertap', 'controltap', 'callouttap', 'updated', 'regionchange', 'poitap'],
      isLeaf: true,
    },
    // Canvas
    {
      name: 'canvas',
      props: {
        type: {
          type: propTypes.string,
        },
        'canvas-id': {
          type: propTypes.string,
        },
        'disable-scroll': {
          type: propTypes.boolean,
          value: false,
        },
      },
      events: ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'longtap', 'error'],
      isLeaf: true,
    },
    // Open Capabilities
    {
      name: 'ad',
      props: {
        'unit-id': {
          type: propTypes.string,
          required: true,
        },
        'ad-intervals': {
          type: propTypes.number,
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
          type: propTypes.string,
        },
        'open-gid': {
          type: propTypes.string,
        },
        lang: {
          type: propTypes.string,
          value: 'en',
        },
        'default-text': {
          type: propTypes.string,
        },
        'default-avatar': {
          type: propTypes.string,
        },
      },
      events: ['error'],
      isLeaf: true,
    },
    {
      name: 'web-view',
      props: {
        src: {
          type: propTypes.string,
        },
      },
      events: ['message', 'load', 'error'],
      isLeaf: true,
    },
  ]),
);
