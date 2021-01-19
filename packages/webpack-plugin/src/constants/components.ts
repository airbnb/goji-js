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

type PropDesc = {
  defaultValue?: any;
  required?: boolean;
};

export type ComponentDesc = {
  name: string;
  props: Array<string | [string, PropDesc]>;
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
        props: [
          ['direction', { defaultValue: 'none' }],
          ['inertia', { defaultValue: false }],
          ['out-of-bounds', { defaultValue: false }],
          'x',
          'y',
          ['damping', { defaultValue: 20 }],
          ['friction', { defaultValue: 2 }],
          ['disabled', { defaultValue: false }],
          ['scale', { defaultValue: false }],
          ['scale-min', { defaultValue: 0.5 }],
          ['scale-max', { defaultValue: 10 }],
          ['scale-value', { defaultValue: 1 }],
          ['animation', { defaultValue: true }],
        ],
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
        props: ['src'],
        events: ['load', 'error'],
      },
      {
        name: 'cover-view',
        props: ['scroll-top'],

        events: [],
      },
      {
        name: 'movable-area',
        props: [['scale-area', { defaultValue: false }]],
        events: [],
      },
      {
        name: 'scroll-view',
        isWrapped: ['wechat', 'qq'].includes(target),
        props: [
          ['scroll-x', { defaultValue: false }],
          ['scroll-y', { defaultValue: false }],
          ['upper-threshold', { defaultValue: 50 }],
          ['lower-threshold', { defaultValue: 50 }],
          'scroll-top',
          'scroll-left',
          'scroll-into-view',
          ['scroll-with-animation', { defaultValue: false }],
          ['enable-back-to-top', { defaultValue: false }],
          ['enable-flex', { defaultValue: false }],
          ['scroll-anchoring', { defaultValue: false }],
        ],
        events: ['scroll-to-upper', 'scroll-to-lower', 'scroll'],
      },
      {
        name: 'swiper',
        isWrapped: ['wechat', 'qq'].includes(target),
        props: [
          ['indicator-dots', { defaultValue: false }],
          ['indicator-color', { defaultValue: 'rgba(0,0,0,.3)' }],
          ['indicator-active-color', { defaultValue: '#000000' }],
          ['autoplay', { defaultValue: false }],
          ['current', { defaultValue: 0 }],
          ['interval', { defaultValue: 5000 }],
          ['duration', { defaultValue: 500 }],
          ['circular', { defaultValue: false }],
          ['vertical', { defaultValue: false }],
          ['previous-margin', { defaultValue: '0px' }],
          ['next-margin', { defaultValue: '0px' }],
          ['display-multiple-items', { defaultValue: 1 }],
          ['skip-hidden-item-layout', { defaultValue: false }],
          ['easing-function', { defaultValue: 'default' }],
        ],
        events: ['change', 'transition', 'animationfinish'],
      },
      {
        name: 'swiper-item',
        props: ['item-id'],
        events: [],
      },
      {
        name: 'text',
        props: [
          ['selectable', { defaultValue: false }],
          'space',
          ['decode', { defaultValue: false }],
        ],
        events: [],
      },
      // Basic Content
      {
        name: 'icon',
        props: [['type', { required: true }], ['size', { defaultValue: 23 }], 'color'],
        events: [],
        isLeaf: true,
      },
      {
        name: 'progress',
        props: [
          'percent',
          ['show-info', { defaultValue: false }],
          ['border-radius', { defaultValue: 0 }],
          ['font-size', { defaultValue: 16 }],
          ['stroke-width', { defaultValue: 6 }],
          ['color', { defaultValue: '#09BB07' }],
          ['activeColor', { defaultValue: '#09BB07' }],
          ['backgroundColor', { defaultValue: '#EBEBEB' }],
          ['active', { defaultValue: false }],
          ['active-mode', { defaultValue: 'backwards' }],
        ],
        events: ['activeend'],
        isLeaf: true,
      },
      {
        name: 'rich-text',
        props: [['nodes', { defaultValue: [] }], 'space'],
        events: [],
      },
      {
        name: 'view',
        props: [
          ['hover-class', { defaultValue: 'none' }],
          ['hover-stop-propagation', { defaultValue: false }],
          ['hover-start-time', { defaultValue: 50 }],
          ['hover-stay-time', { defaultValue: 400 }],
        ],
        events: [],
      },
      // Form
      {
        name: 'button',
        props: [
          ['size', { defaultValue: 'default' }],
          // the document said `type` defaults to `'default'` but `''` in fact otherwise the background-color won't work
          // doc: https://developers.weixin.qq.com/miniprogram/dev/component/button.html
          ['type', { defaultValue: '' }],
          ['plain', { defaultValue: false }],
          ['disabled', { defaultValue: false }],
          ['loading', { defaultValue: false }],
          'form-type',
          'open-type',
          ['hover-class', { defaultValue: 'button-hover' }],
          ['hover-stop-propagation', { defaultValue: 'false' }],
          ['hover-start-time', { defaultValue: 20 }],
          ['hover-stay-time', { defaultValue: 70 }],
          ['lang', { defaultValue: 'en' }],
          'session-from',
          'send-message-title',
          'send-message-path',
          'send-message-img',
          'app-parameter',
          ['show-message-card', { defaultValue: false }],
        ],
        events: ['getuserinfo', 'contact', 'getphonenumber', 'error', 'opensetting', 'launchapp'],
      },
      {
        name: 'checkbox',
        props: ['value', 'disabled', 'checked', ['color', { defaultValue: '#09BB07' }]],
        events: [],
      },
      {
        name: 'checkbox-group',
        props: [],
        events: ['change'],
      },
      {
        name: 'editor',
        props: [
          ['read-only', { defaultValue: false }],
          'placeholder',
          ['show-img-size', { defaultValue: false }],
          ['show-img-toolbar', { defaultValue: false }],
          ['show-img-resize', { defaultValue: false }],
        ],
        events: ['ready', 'focus', 'blur', 'input', 'statuschange'],
        isLeaf: true,
      },
      {
        name: 'form',
        props: [
          ['report-submit', { defaultValue: false }],
          ['report-submit-timeout', { defaultValue: 0 }],
        ],
        events: ['submit', 'reset'],
      },
      {
        name: 'input',
        isWrapped: ['wechat', 'qq'].includes(target),
        props: [
          ['value', { required: true }],
          ['type', { defaultValue: 'text' }],
          ['password', { defaultValue: false }],
          ['placeholder', { required: true }],
          ['placeholder-style', { required: true }],
          ['placeholder-class', { defaultValue: 'input-placeholder' }],
          ['disabled', { defaultValue: false }],
          ['maxlength', { defaultValue: 140 }],
          ['cursor-spacing', { defaultValue: 0 }],
          ['auto-focus', { defaultValue: false }],
          ['focus', { defaultValue: false }],
          ['confirm-type', { defaultValue: 'done' }],
          ['confirm-hold', { defaultValue: false }],
          ['cursor', { required: true }],
          ['selection-start', { defaultValue: -1 }],
          ['selection-end', { defaultValue: -1 }],
          ['adjust-position', { defaultValue: true }],
          // Alipay MiniProgram need this prop to fix position of input box is not correct bug.
          // https://opendocs.alipay.com/mini/component/input
          ['enableNative', { defaultValue: false }],
        ],
        events: ['input', 'focus', 'blur', 'confirm', 'keyboardheightchange'],
        isLeaf: true,
      },
      {
        name: 'label',
        props: ['for'],
        events: [],
      },
      {
        name: 'picker',
        props: [
          ['mode', { defaultValue: 'selector' }],
          ['disabled', { defaultValue: false }],
          ['range', { defaultValue: [] }],
          'range-key',
          ['value', { defaultValue: 0 }],
          'start',
          'end',
          ['fields', { defaultValue: 'day' }],
          'custom-item',
        ],
        events: ['cancel', 'change', 'columnchange'],
      },
      {
        name: 'picker-view',
        props: ['value', 'indicator-style', 'indicator-class', 'mask-style', 'mask-class'],
        events: ['change', 'pickstart', 'pickend'],
      },
      {
        name: 'picker-view-column',
        props: [],
        events: [],
      },
      {
        name: 'radio',
        props: [
          'value',
          ['checked', { defaultValue: false }],
          ['disabled', { defaultValue: false }],
          ['color', { defaultValue: '#09BB07' }],
        ],
        events: [],
      },
      {
        name: 'radio-group',
        props: [],
        events: ['change'],
      },
      {
        name: 'slider',
        props: [
          ['min', { defaultValue: 0 }],
          ['max', { defaultValue: 100 }],
          ['step', { defaultValue: 1 }],
          ['disabled', { defaultValue: false }],
          ['value', { defaultValue: 0 }],
          ['color', { defaultValue: '#e9e9e9' }],
          ['selected-color', { defaultValue: '#1aad19' }],
          ['activeColor', { defaultValue: '#1aad19' }],
          ['backgroundColor', { defaultValue: '#e9e9e9' }],
          ['block-size', { defaultValue: 28 }],
          ['block-color', { defaultValue: '#ffffff' }],
          ['show-value', { defaultValue: false }],
        ],
        events: ['change', 'changing'],
        isLeaf: true,
      },
      {
        name: 'switch',
        props: [
          ['checked', { defaultValue: false }],
          ['disabled', { defaultValue: false }],
          ['type', { defaultValue: 'switch' }],
          ['color', { defaultValue: '#04BE02' }],
        ],
        events: ['change'],
        isLeaf: true,
      },
      {
        name: 'textarea',
        isWrapped: ['wechat', 'qq'].includes(target),
        props: [
          'value',
          'placeholder',
          'placeholder-style',
          ['placeholder-class', { defaultValue: 'textarea-placeholder' }],
          ['disabled', { defaultValue: false }],
          ['maxlength', { defaultValue: 140 }],
          ['auto-focus', { defaultValue: false }],
          ['focus', { defaultValue: false }],
          ['auto-height', { defaultValue: false }],
          ['fixed', { defaultValue: false }],
          ['cursor-spacing', { defaultValue: 0 }],
          ['cursor', { defaultValue: -1 }],
          ['show-confirm-bar', { defaultValue: true }],
          ['selection-start', { defaultValue: -1 }],
          ['selection-end', { defaultValue: -1 }],
          ['adjust-position', { defaultValue: true }],
        ],
        events: ['focus', 'blur', 'linechange', 'input', 'confirm', 'keyboardheightchange'],
        isLeaf: true,
      },
      // Navigation
      {
        name: 'functional-page-navigator',
        props: [['version', { defaultValue: 'release' }], 'name', 'args'],
        events: ['success', 'fail'],
      },
      {
        name: 'navigator',
        props: [
          ['target', { defaultValue: 'self' }],
          'url',
          ['open-type', { defaultValue: 'navigate' }],
          ['delta', { defaultValue: 1 }],
          'app-id',
          'path',
          'extra-data',
          ['version', { defaultValue: 'release' }],
          ['hover-class', { defaultValue: 'navigator-hover' }],
          ['hover-stop-propagation', { defaultValue: false }],
          ['hover-start-time', { defaultValue: 50 }],
          ['hover-stay-time', { defaultValue: 600 }],
        ],
        events: ['success', 'fail', 'complete'],
      },
      // Multimedia
      {
        name: 'audio',
        props: [
          'id',
          'src',
          ['loop', { defaultValue: false }],
          ['controls', { defaultValue: false }],
          'poster',
          ['name', { defaultValue: '未知音频' }],
          ['author', { defaultValue: '未知作者' }],
        ],
        events: ['error', 'play', 'pause', 'timeupdate', 'ended'],
        isLeaf: true,
      },
      {
        name: 'camera',
        props: [
          ['mode', { defaultValue: 'normal' }],
          ['device-position', { defaultValue: 'back' }],
          ['flash', { defaultValue: 'auto' }],
          ['frame-size', { defaultValue: 'medium' }],
        ],
        events: ['stop', 'error', 'initdone', 'scancode'],
        isLeaf: true,
      },
      {
        name: 'image',
        props: [
          'src',
          ['mode', { defaultValue: 'scaleToFill' }],
          ['lazy-load', { defaultValue: false }],
          ['show-menu-by-longpress', { defaultValue: false }],
        ],
        events: ['error', 'load'],
        isLeaf: true,
      },
      {
        name: 'live-player',
        props: [
          'src',
          ['mode', { defaultValue: 'live' }],
          ['autoplay', { defaultValue: false }],
          ['muted', { defaultValue: false }],
          ['orientation', { defaultValue: 'vertical' }],
          ['object-fit', { defaultValue: 'contain' }],
          ['background-mute', { defaultValue: false }],
          ['min-cache', { defaultValue: 1 }],
          ['max-cache', { defaultValue: 3 }],
          ['sound-mode', { defaultValue: 'speaker' }],
          ['auto-pause-if-navigate', { defaultValue: true }],
          ['auto-pause-if-open-native', { defaultValue: true }],
        ],
        events: ['statechange', 'fullscreenchange', 'netstatus'],
        isLeaf: true,
      },
      {
        name: 'live-pusher',
        props: [
          'url',
          ['mode', { defaultValue: 'RTC' }],
          ['autopush', { defaultValue: false }],
          ['muted', { defaultValue: false }],
          ['enable-camera', { defaultValue: true }],
          ['auto-focus', { defaultValue: true }],
          ['orientation', { defaultValue: 'vertical' }],
          ['beauty', { defaultValue: 0 }],
          ['whiteness', { defaultValue: 0 }],
          ['aspect', { defaultValue: '9:16' }],
          ['min-bitrate', { defaultValue: 200 }],
          ['max-bitrate', { defaultValue: 1000 }],
          'waiting-image',
          'waiting-image-hash',
          ['zoom', { defaultValue: false }],
          ['device-position', { defaultValue: 'front' }],
          ['background-mute', { defaultValue: false }],
          ['mirror', { defaultValue: false }],
        ],
        events: ['statechange', 'netstatus', 'error', 'bgmstart', 'bgmprogress', 'bgmcomplete'],
        isLeaf: true,
      },
      {
        name: 'video',
        props: [
          ['src', { required: true }],
          'duration',
          ['controls', { defaultValue: true }],
          'danmu-list',
          ['danmu-btn', { defaultValue: false }],
          ['enable-danmu', { defaultValue: false }],
          ['autoplay', { defaultValue: false }],
          ['loop', { defaultValue: false }],
          ['muted', { defaultValue: false }],
          ['initial-time', { defaultValue: 0 }],
          ['page-gesture', { defaultValue: false }],
          'direction',
          ['show-progress', { defaultValue: true }],
          ['show-fullscreen-btn', { defaultValue: true }],
          ['show-play-btn', { defaultValue: true }],
          ['show-center-play-btn', { defaultValue: true }],
          ['enable-progress-gesture', { defaultValue: true }],
          ['object-fit', { defaultValue: 'contain' }],
          'poster',
          ['show-mute-btn', { defaultValue: false }],
          'title',
          ['play-btn-position', { defaultValue: 'bottom' }],
          ['enable-play-gesture', { defaultValue: false }],
          ['auto-pause-if-navigate', { defaultValue: true }],
          ['auto-pause-if-open-native', { defaultValue: true }],
          ['vslide-gesture', { defaultValue: false }],
          ['vslide-gesture-in-fullscreen', { defaultValue: true }],
        ],
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
        props: [
          ['longitude', { required: true }],
          ['latitude', { required: true }],
          ['scale', { defaultValue: 16 }],
          'markers',
          // don't support `covers`
          // 1. covers is deprecated
          // 2. covers cause map lost uncontrolled data
          'polyline',
          'circles',
          'controls',
          'include-points',
          ['show-location', { defaultValue: false }],
          'polygons',
          'subkey',
          ['layer-style', { defaultValue: 1 }],
          ['rotate', { defaultValue: 0 }],
          ['skew', { defaultValue: 0 }],
          ['enable-3D', { defaultValue: false }],
          ['show-compass', { defaultValue: false }],
          ['show-scale', { defaultValue: false }],
          ['enable-overlooking', { defaultValue: false }],
          ['enable-zoom', { defaultValue: true }],
          ['enable-scroll', { defaultValue: true }],
          ['enable-rotate', { defaultValue: false }],
          ['enable-satellite', { defaultValue: false }],
          ['enable-traffic', { defaultValue: false }],
        ],
        events: [
          'tap',
          'markertap',
          'controltap',
          'callouttap',
          'updated',
          'regionchange',
          'poitap',
        ],
        isLeaf: true,
      },
      // Canvas
      {
        name: 'canvas',
        props: ['type', 'canvas-id', ['disable-scroll', { defaultValue: false }]],
        events: ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'longtap', 'error'],
        isLeaf: true,
      },
      // Open Capabilities
      {
        name: 'ad',
        props: [['unit-id', { required: true }], 'ad-intervals'],
        events: ['load', 'error', 'close'],
        isLeaf: true,
      },
      {
        name: 'official-account',
        props: [],
        events: ['load', 'error'],
        isLeaf: true,
      },
      {
        name: 'open-data',
        props: [
          'type',
          'open-gid',
          ['lang', { defaultValue: 'en' }],
          'default-text',
          'default-avatar',
        ],
        events: ['error'],
        isLeaf: true,
      },
      {
        name: 'web-view',
        props: ['src'],
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
