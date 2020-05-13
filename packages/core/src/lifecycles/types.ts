export type WechatLifecycleName =
  | 'onLoad'
  | 'onShow'
  | 'onReady'
  | 'onHide'
  | 'onUnload'
  | 'onUnload'
  | 'onPullDownRefresh'
  | 'onReachBottom'
  | 'onPageScroll'
  | 'onShareAppMessage'
  | 'onResize'
  | 'onTabItemTap';

export type AlipayLifecycleName =
  | WechatLifecycleName
  | 'onTitleClick'
  | 'onOptionMenuClick'
  | 'onPopMenuClick'
  | 'onPullIntercept';

export type InternalLifecycleName = 'internalComponentUpdate' | 'internalRendered';

export type LifecycleName = WechatLifecycleName | AlipayLifecycleName | InternalLifecycleName;

export type UniversalLifecycleName = 'loadOptions' | 'visibility' | 'renderedEffect';

export interface OnLoadOptions {
  [key: string]: string;
}

export interface OnScrollOptions {
  scrollTop: number;
}

export interface OnShareAppMessageOptions {
  from: 'button' | 'menu';
  target: object | undefined;
}

export interface OnResizeOptions {
  deviceOrientation: 'landscape' | 'portrait';
  size: {
    screenHeight: number;
    screenWidth: number;
    windowWidth: number;
    windowHeight: number;
  };
}

export type OnTabItemTapOptions = {
  index: string;
  pagePath: string;
  text: string;
};
