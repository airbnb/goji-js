import React, { forwardRef, createElement, CSSProperties } from 'react';
import { pascalCase } from '../utils/pascalCase';
import { PublicInstance } from '../reconciler/publicInstance';

// basic types
interface BaseProps {
  testID?: string;
  className?: string;
  style?: CSSProperties;
  onTouchstart?: (e: any) => void;
  onTouchmove?: (e: any) => void;
  onTouchcancel?: (e: any) => void;
  onTouchend?: (e: any) => void;
  onTap?: (e: any) => void;
  onLongpress?: (e: any) => void;
  onLongtap?: (e: any) => void;
  onTransitionend?: (e: any) => void;
  onAnimationstart?: (e: any) => void;
  onAnimationiteration?: (e: any) => void;
  onAnimationend?: (e: any) => void;
  onTouchforcechange?: (e: any) => void;
}

interface BasePropsWithChildren extends BaseProps {
  children?: React.ReactNode;
}

interface UnknownProps extends BasePropsWithChildren {}

// element types

interface ViewProps extends BasePropsWithChildren {}

interface ButtonProps extends BasePropsWithChildren {
  size?: 'default' | 'mini';
  type?: 'primary' | 'default' | 'warn';
  plain?: boolean;
  disabled?: boolean;
  loading?: boolean;
  formType?: 'submit' | 'reset';
  openType?:
    | 'contact'
    | 'share'
    | 'getPhoneNumber'
    | 'getUserInfo'
    | 'launchApp'
    | 'openSetting'
    | 'feedback';
  hoverClass?: string;
  hoverStopPropagation?: boolean;
  hoverStartTime?: number;
  hoverStayTime?: number;
  lang?: 'en' | 'zh_CN' | 'zh_TW';
  sessionFrom?: string;
  sendMessageTitle?: string;
  sendMessagePath?: string;
  sendMessageImg?: string;
  appParameter?: string;
  showMessageCard?: boolean;
  onGetuserinfo?: (e: any) => void;
  onContact?: (e: any) => void;
  onGetphonenumber?: (e: any) => void;
  onError?: (e: any) => void;
  onOpensetting?: (e: any) => void;
  onLaunchapp?: (e: any) => void;
}

interface RadioGroupProps extends BasePropsWithChildren {
  onChange?: (e: any) => void;
}

interface RadioProps extends BasePropsWithChildren {
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  color?: string;
}

interface LabelProps extends BasePropsWithChildren {
  // FIXME: use `htmlFor`
  for?: string;
}

interface ScrollViewProps extends BasePropsWithChildren {
  scrollX?: boolean;
  scrollY?: boolean;
  upperThreshold?: number | string;
  lowerThreshold?: number | string;
  scrollTop?: number | string;
  scrollLeft?: number | string;
  scrollIntoView?: string;
  scrollWithAnimation?: boolean;
  enableBackToTop?: boolean;
  enableFlex?: boolean;
  scrollAnchoring?: boolean;
  onScrolltoupper?: (e: any) => void;
  onScrolltolower?: (e: any) => void;
  onScroll?: (e: any) => void;
}

type InputType = 'text' | 'number' | 'idcard' | 'digit';
type InputConfirmType = 'send' | 'search' | 'next' | 'go' | 'done';

interface InputProps extends BaseProps {
  value: string;
  type?: InputType;
  password?: boolean;
  placeholder?: string;
  placeholderStyle?: CSSProperties;
  placeholderClass?: string;
  disabled?: boolean;
  maxlength?: number;
  cursorSpacing?: number;
  autoFocus?: boolean;
  focus?: boolean;
  confirmType?: InputConfirmType;
  confirmHold?: boolean;
  cursor?: number;
  selectionStart?: number;
  selectionEnd?: number;
  adjustPosition?: boolean;
  enableNative?: boolean;
  onInput?: (e: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  onConfirm?: (e: any) => void;
  onKeyboardheightchange?: (e: any) => void;
}

interface PickerBaseProps extends BasePropsWithChildren {
  disabled?: boolean;
  onCancel?: (e: any) => void;
}

interface PickerSelectorProps extends PickerBaseProps {
  mode: 'selector';
  range?: Array<any>;
  rangeKey?: string;
  value?: number;
  onChange?: (e: any) => void;
}

interface PickerMultiSelector extends PickerBaseProps {
  mode: 'multiSelector';
  range?: Array<any>;
  rangeKey?: string;
  value?: number;
  onChange?: (e: any) => void;
  onColumnchange?: (e: any) => void;
}

interface PickerTimeSelector extends PickerBaseProps {
  mode: 'time';
  value?: string;
  start?: string;
  end?: string;
  onChange?: (e: any) => void;
}

type PickerDateFields = 'year' | 'month' | 'day';

interface PickerDateSelector extends PickerBaseProps {
  mode: 'date';
  value?: string;
  start?: string;
  end?: string;
  fields?: PickerDateFields;
  onChange?: (e: any) => void;
}

interface PickerRegionSelector extends PickerBaseProps {
  value?: Array<any>;
  customItem?: string;
  onChange?: (e: any) => void;
}

type PickerProps =
  | PickerSelectorProps
  | PickerMultiSelector
  | PickerTimeSelector
  | PickerDateSelector
  | PickerRegionSelector;

type ImageMode =
  | 'scaleToFill'
  | 'aspectFit'
  | 'aspectFill'
  | 'widthFix'
  | 'top'
  | 'bottom'
  | 'center'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right';

interface ImageProps extends BaseProps {
  src?: string;
  mode?: ImageMode;
  lazyLoad?: boolean;
  showMenuByLongpress?: boolean;
  onError?: (e: any) => void;
  onLoad?: (e: any) => void;
}

interface SwiperProps extends BasePropsWithChildren {
  indicatorDots?: boolean;
  indicatorColor?: string;
  indicatorActiveColor?: string;
  autoplay?: boolean;
  current?: number;
  interval?: number;
  duration?: number;
  circular?: boolean;
  vertical?: boolean;
  previousMargin?: string;
  nextMargin?: string;
  displayMultipleItems?: number;
  skipHiddenItemLayout?: boolean;
  easingFunction?: string;
  onChange?: (e: any) => void;
  onTransition?: (e: any) => void;
  onAnimationfinish?: (e: any) => void;
}

interface SwiperItemProps extends BaseProps {
  itemId?: string;
  // doesn't support `ReactText = string | number` in `<SiperItem>` for Alipay
  children?:
    | React.ReactElement
    // because `type ReactFragment = {} | ReactNodeArray` the `{}` cause type check useless
    | React.ReactNodeArray
    | React.ReactPortal
    | boolean
    | null
    | undefined;
}

type TextSpace = 'ensp' | 'emsp' | 'nbsp';
interface TextProps extends BasePropsWithChildren {
  selectable?: boolean;
  space?: TextSpace;
  decode?: boolean;
}

type CameraMode = 'normal' | 'scanCode';
type CameraDevicePosition = 'front' | 'back';
type CameraFlash = 'auto' | 'on' | 'off' | 'torch';
type CameraFrameSize = 'small' | 'medium' | 'large';

interface CameraProps extends BaseProps {
  mode?: CameraMode;
  devicePosition?: CameraDevicePosition;
  flash?: CameraFlash;
  frameSize?: CameraFrameSize;
  onStop?: (e: any) => void;
  onError?: (e: any) => void;
  onInitdone?: (e: any) => void;
  onScancode?: (e: any) => void;
}

interface MapMarkerCallout {
  content?: string;
  color?: string;
  fontSize?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  bgColor?: string;
  padding?: number;
  display?: 'BYCLICK' | 'ALWAYS';
  textAlign?: 'left' | 'right' | 'center';
}
interface MapMarkerLabel {
  content?: string;
  color?: string;
  fontSize?: number;
  x?: number;
  y?: number;
  anchorX?: number;
  anchorY?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  bgColor?: string;
  padding?: number;
  textAlign?: string;
}
interface MapMarkerAnchor {}
interface MapMarker {
  id?: number;
  latitude: number;
  longitude: number;
  title?: string;
  zIndex?: number;
  iconPath: string;
  rotate?: number;
  alpha?: number;
  width?: number | string;
  height?: number | string;
  callout?: MapMarkerCallout;
  label?: MapMarkerLabel;
  anchor?: MapMarkerAnchor;
  ariaLabel?: string;
}
interface MapControlPosition {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}

interface MapPoint {
  latitude: 0;
  longitude: 0;
}
interface MapPolyline {
  points?: Array<{ MapPoint }>;
  color?: string;
  width?: number;
  dottedLine?: boolean;
  arrowLine?: boolean;
  arrowIconPath?: string;
  borderColor?: string;
  borderWidth?: number;
}
interface MapCircle {
  latitude: number;
  longitude: number;
  color?: string;
  fillColor?: string;
  radius: number;
  strokeWidth?: number;
}
interface MapControl {
  id?: number;
  position: MapControlPosition;
  iconPath: string;
  clickable?: boolean;
}
interface MapPolygon {
  points?: Array<{ MapPoint }>;
  strokeWidth?: number;
  strokeColor?: string;
  fillColor?: string;
  zIndex?: number;
}
interface MapSetting {
  skew?: number;
  rotate?: number;
  showLocation?: boolean;
  showScale?: boolean;
  subKey?: string;
  layerStyle?: number;
  enableZoom?: true;
  enableScroll?: true;
  enableRotate?: boolean;
  showCompass?: boolean;
  enable3D?: boolean;
  enableOverlooking?: boolean;
  enableSatellite?: boolean;
  enableTraffic?: boolean;
}

interface MapProps extends BaseProps {
  id?: string;
  longitude: number;
  latitude: number;
  scale?: number;
  markers?: Array<MapMarker>;
  polyline?: Array<MapPolyline>;
  circles?: Array<MapCircle>;
  controls?: Array<MapControl>;
  includePoints?: Array<MapPoint>;
  showLocation?: boolean;
  polygons?: Array<MapPolygon>;
  subkey?: string;
  layerStyle?: number;
  rotate?: number;
  skew?: number;
  // FIXME: how to handle `3D` ?
  enable3D?: boolean;
  showCompass?: boolean;
  showScale?: boolean;
  enableOverlooking?: boolean;
  enableZoom?: boolean;
  enableScroll?: boolean;
  enableRotate?: boolean;
  enableSatellite?: boolean;
  enableTraffic?: boolean;
  setting?: MapSetting;
  onMarkertap?: (e: any) => void;
  onLabeltap?: (e: any) => void;
  onControltap?: (e: any) => void;
  onCallouttap?: (e: any) => void;
  onUpdated?: (e: any) => void;
  onRegionchange?: (e: any) => void;
  onPoitap?: (e: any) => void;
}

interface NavigatorProps extends BasePropsWithChildren {
  target?: string;
  url?: string;
  openType?: string;
  delta?: number;
  appId?: string;
  path?: string;
  extraData?: object;
  version?: string;
  hoverClass?: string;
  hoverStopPropagation?: boolean;
  hoverStartTime?: number;
  hoverStayTime?: number;
  onSuccess?: (e: any) => void;
  onFail?: (e: any) => void;
  onComplete?: (e: any) => void;
}

interface TextareaProps extends BaseProps {
  value?: string;
  placeholder?: string;
  placeholderStyle?: CSSProperties;
  placeholderClass?: string;
  disabled?: boolean;
  maxlength?: number;
  autoFocus?: boolean;
  focus?: boolean;
  autoHeight?: boolean;
  fixed?: boolean;
  cursorSpacing?: number;
  cursor?: number;
  showConfirmBar?: boolean;
  selectionStart?: number;
  selectionEnd?: number;
  adjustPosition?: boolean;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  onLinechange?: (e: any) => void;
  onInput?: (e: any) => void;
  onConfirm?: (e: any) => void;
  onKeyboardheightchange?: (e: any) => void;
}

interface CanvasProps extends BaseProps {
  canvasId?: string;
  type?: '2d' | 'webgl';
  disableScroll?: boolean;
  onTouchstart?: (e: any) => void;
  onTouchmove?: (e: any) => void;
  onTouchend?: (e: any) => void;
  onTouchcancel?: (e: any) => void;
  onLongtap?: (e: any) => void;
  onError?: (e: any) => void;
}

interface WebViewProps extends BaseProps {
  src?: string;
}

interface CoverImageProps extends BaseProps {
  src?: string;
  onLoad?: (e: any) => void;
  onError?: (e: any) => void;
}

interface BuildInComponentsProps {
  view: ViewProps;
  'scroll-view': ScrollViewProps;
  'web-view': WebViewProps;
  swiper: SwiperProps;
  'swiper-item': SwiperItemProps;
  'movable-view': UnknownProps;
  'movable-area': UnknownProps;
  'cover-view': UnknownProps;
  'cover-image': CoverImageProps;
  icon: UnknownProps;
  text: TextProps;
  'rich-text': UnknownProps;
  progress: UnknownProps;
  button: ButtonProps;
  'checkbox-group': UnknownProps;
  checkbox: UnknownProps;
  form: UnknownProps;
  input: InputProps;
  label: LabelProps;
  picker: PickerProps;
  'picker-view': UnknownProps;
  'radio-group': RadioGroupProps;
  radio: RadioProps;
  slider: UnknownProps;
  switch: UnknownProps;
  textarea: TextareaProps;
  navigator: NavigatorProps;
  image: ImageProps;
  video: UnknownProps;
  camera: CameraProps;
  'live-player': UnknownProps;
  'live-pusher': UnknownProps;
  map: MapProps;
  canvas: CanvasProps;
  'open-data': UnknownProps;
  'official-account';
}

type BuildInComponents = keyof BuildInComponentsProps;

const factoryComponent = <T extends BuildInComponents, P extends BuildInComponentsProps[T]>(
  component: T,
) => {
  const displayName = pascalCase(component);
  // FIXME: Not all components have `children`. We should fix the type later.
  const comp = (props: P, ref: React.Ref<PublicInstance>) => {
    return createElement(component, { ...props, ref });
  };

  const compWithRef = forwardRef<PublicInstance, P>(comp);
  compWithRef.displayName = displayName;

  return compWithRef;
};

export const View = factoryComponent('view');
export const ScrollView = factoryComponent('scroll-view');
export const WebView = factoryComponent('web-view');
export const Swiper = factoryComponent('swiper');
export const SwiperItem = factoryComponent('swiper-item');
export const MovableView = factoryComponent('movable-view');
export const MovableArea = factoryComponent('movable-area');
export const CoverView = factoryComponent('cover-view');
export const CoverImage = factoryComponent('cover-image');
export const Icon = factoryComponent('icon');
export const Text = factoryComponent('text');
export const RichText = factoryComponent('rich-text');
export const Progress = factoryComponent('progress');
export const Button = factoryComponent('button');
export const CheckboxGroup = factoryComponent('checkbox-group');
export const Checkbox = factoryComponent('checkbox');
export const Form = factoryComponent('form');
export const Input = factoryComponent('input');
export const Label = factoryComponent('label');
export const Picker = factoryComponent('picker');
export const PickerView = factoryComponent('picker-view');
export const RadioGroup = factoryComponent('radio-group');
export const Radio = factoryComponent('radio');
export const Slider = factoryComponent('slider');
export const Switch = factoryComponent('switch');
export const Textarea = factoryComponent('textarea');
export const Navigator = factoryComponent('navigator');
export const Image = factoryComponent('image');
export const Video = factoryComponent('video');
export const Camera = factoryComponent('camera');
export const LivePlayer = factoryComponent('live-player');
export const LivePusher = factoryComponent('live-pusher');
export const Map = factoryComponent('map');
export const Canvas = factoryComponent('canvas');
export const OpenData = factoryComponent('open-data');
export const OfficialAccount = factoryComponent('official-account');
