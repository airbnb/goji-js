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
  webViewUrl?: string;
}

export interface OnShareAppMessageReturn {
  title?: string;
  imageUrl?: string;
  path?: string;
  promise?: Promise<{
    title?: string;
    imageUrl?: string;
    path?: string;
  }>;
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
