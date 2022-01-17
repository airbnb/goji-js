import { CSSProperties } from 'react';
import { SetDifference } from 'utility-types';

// basic types

interface BaseProps {
  testID?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  onTouchstart?: (e: any) => void;
  onTouchmove?: (e: any) => void;
  onTouchcancel?: (e: any) => void;
  onTouchend?: (e: any) => void;
  onTap?: (e: any) => void;
  onLongpress?: (e: any) => void;
  onTransitionend?: (e: any) => void;
  onAnimationstart?: (e: any) => void;
  onAnimationiteration?: (e: any) => void;
  onAnimationend?: (e: any) => void;
  onTouchforcechange?: (e: any) => void;
}

interface BasePropsWithChildren extends BaseProps {
  children?: React.ReactNode;
}

// element types

export interface ViewProps extends BasePropsWithChildren {}

export interface ButtonProps extends BasePropsWithChildren {
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

export interface CheckboxGroupProps extends BasePropsWithChildren {
  onChange?: (e: any) => void;
}

export interface CheckboxProps extends BaseProps {
  value?: string;
  disabled?: boolean;
  checked?: boolean;
  color?: string;
}

export interface FormProps extends BasePropsWithChildren {
  reportSubmit?: boolean;
  reportSubmitTimeout?: number;
  onSubmit?: (e: any) => void;
  onReset?: (e: any) => void;
}

export interface RadioGroupProps extends BasePropsWithChildren {
  onChange?: (e: any) => void;
}

export interface RadioProps extends BasePropsWithChildren {
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  color?: string;
}

export interface SliderProps extends BaseProps {
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  value?: number;
  color?: string;
  selectedColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  blockSize?: number;
  blockColor?: string;
  showValue?: boolean;
  onChange?: (e: any) => void;
  onChanging?: (e: any) => void;
}

export interface SwitchProps extends BaseProps {
  checked?: boolean;
  disabled?: boolean;
  type?: string;
  color?: string;
  onChange?: (e: any) => void;
}

export interface LabelProps extends BasePropsWithChildren {
  // FIXME: use `htmlFor`
  for?: string;
}

export interface ScrollViewProps extends BasePropsWithChildren {
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

export interface InputProps extends BaseProps {
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

export interface PickerSelectorProps extends PickerBaseProps {
  mode: 'selector';
  range?: Array<any>;
  rangeKey?: string;
  value?: number;
  onChange?: (e: any) => void;
}

export interface PickerMultiSelector extends PickerBaseProps {
  mode: 'multiSelector';
  range?: Array<any>;
  rangeKey?: string;
  value?: number;
  onChange?: (e: any) => void;
  onColumnchange?: (e: any) => void;
}

export interface PickerTimeSelector extends PickerBaseProps {
  mode: 'time';
  value?: string;
  start?: string;
  end?: string;
  onChange?: (e: any) => void;
}

type PickerDateFields = 'year' | 'month' | 'day';

export interface PickerDateSelector extends PickerBaseProps {
  mode: 'date';
  value?: string;
  start?: string;
  end?: string;
  fields?: PickerDateFields;
  onChange?: (e: any) => void;
}

export interface PickerRegionSelector extends PickerBaseProps {
  value?: Array<any>;
  customItem?: string;
  onChange?: (e: any) => void;
}

export type PickerProps =
  | PickerSelectorProps
  | PickerMultiSelector
  | PickerTimeSelector
  | PickerDateSelector
  | PickerRegionSelector;

export interface PickerViewProps extends BaseProps {
  value?: Array<number>;
  indicatorStyle?: string;
  indicatorClass?: string;
  maskStyle?: string;
  maskClass?: string;
  onChange?: (e: any) => void;
  onPickstart?: (e: any) => void;
  onPickend?: (e: any) => void;
}

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

export interface ImageProps extends BaseProps {
  src?: string;
  mode?: ImageMode;
  lazyLoad?: boolean;
  showMenuByLongpress?: boolean;
  onError?: (e: any) => void;
  onLoad?: (e: any) => void;
}

export interface VideoProps extends BaseProps {
  src: string;
  duration?: number;
  controls?: boolean;
  danmuList?: Array<any>;
  danmuBtn?: boolean;
  enableDanmu?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  initialTime?: number;
  pageGesture?: boolean;
  direction?: 0 | 90 | -90;
  showProgress?: boolean;
  showFullscreenBtn?: boolean;
  showPlayBtn?: boolean;
  showCenterPlayBtn?: boolean;
  enableProgressGesture?: boolean;
  objectFit?: 'contain' | 'fill' | 'cover';
  poster?: string;
  showMuteBtn?: boolean;
  title?: string;
  playBtnPosition?: 'bottom' | 'center';
  enablePlayGesture?: string;
  autoPauseIfNavigate?: boolean;
  autoPauseIfOpenNative?: boolean;
  vslideGesture?: boolean;
  vslideGestureInFullscreen?: boolean;
  adUnitId: string;
  posterForCrawler: string;
  showCastingButton?: boolean;
  pictureInPictureMode?: 'push' | 'pop' | Array<'push' | 'pop'>;
  pictureInPictureShowProgress?: boolean;
  enableAutoRotation?: boolean;
  showScreenLockButton?: boolean;
  showSnapshotButton?: boolean;
  onPlay?: (e: any) => void;
  onPause?: (e: any) => void;
  onEnded?: (e: any) => void;
  onTimeupdate?: (e: any) => void;
  onFullscreenchange?: (e: any) => void;
  onWaiting?: (e: any) => void;
  onError?: (e: any) => void;
  onProgress?: (e: any) => void;
  onLoadedmetadata?: (e: any) => void;
  onControlstoggle?: (e: any) => void;
  onEnterpictureinpicture?: (e: any) => void;
  onLeavepictureinpicture?: (e: any) => void;
  onSeekcomplete?: (e: any) => void;
}

export interface SwiperProps extends BasePropsWithChildren {
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

export interface SwiperItemProps extends BaseProps {
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

export interface MovableViewProps extends BasePropsWithChildren {
  direction?: string;
  inertia?: boolean;
  outOfBounds?: boolean;
  x?: number;
  y?: number;
  damping?: number;
  friction?: number;
  disabled?: boolean;
  scale?: boolean;
  scaleMin?: number;
  scaleMax?: number;
  scaleValue?: number;
  animation?: boolean;
  onChange?: (e: any) => void;
  onScale?: (e: any) => void;
  // FIXME: don't support htouchmove and vtouchmove
}

export interface MovableAreaProps extends BasePropsWithChildren {
  scaleArea?: boolean;
}

export interface CoverViewProps extends BasePropsWithChildren {
  scrollTop?: number | string;
}

type TextSpace = 'ensp' | 'emsp' | 'nbsp';
export interface TextProps extends BasePropsWithChildren {
  selectable?: boolean;
  space?: TextSpace;
  decode?: boolean;
}

type RichTextElementName =
  | 'a'
  | 'abbr'
  | 'address'
  | 'article'
  | 'aside'
  | 'b'
  | 'bdi'
  | 'bdo'
  | 'big'
  | 'blockquote'
  | 'br'
  | 'caption'
  | 'center'
  | 'cite'
  | 'code'
  | 'col'
  | 'colgroup'
  | 'dd'
  | 'del'
  | 'div'
  | 'dl'
  | 'dt'
  | 'em'
  | 'fieldset'
  | 'font'
  | 'footer'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'header'
  | 'hr'
  | 'i'
  | 'img'
  | 'ins'
  | 'label'
  | 'legend'
  | 'li'
  | 'mark'
  | 'nav'
  | 'ol'
  | 'p'
  | 'pre'
  | 'q'
  | 'rt'
  | 'ruby'
  | 's'
  | 'section'
  | 'small'
  | 'span'
  | 'strong'
  | 'sub'
  | 'sup'
  | 'table'
  | 'tbody'
  | 'td'
  | 'tfoot'
  | 'th'
  | 'thead'
  | 'tr'
  | 'tt'
  | 'u'
  | 'ul';

interface RichTextElementWithAttr {
  bdo: 'dir';
  col: 'span' | 'width';
  colgroup: 'span' | 'width';
  img: 'alt' | 'src' | 'height' | 'width';
  ol: 'start' | 'type';
  table: 'width';
  td: 'colspan' | 'height' | 'rowspan' | 'width';
  th: 'colspan' | 'height' | 'rowspan' | 'width';
  tr: 'colspan' | 'height' | 'rowspan' | 'width';
}

type RichTextElementAttrMap = {
  [T in SetDifference<RichTextElementName, keyof RichTextElementWithAttr>]: never;
} & RichTextElementWithAttr;

interface EmptyObject extends Object {}

type RichTextAttrs<T extends string> = T extends never
  ? EmptyObject
  : { class?: string; style?: string } & { [P in T]?: any };

type RichTextElementNode = {
  [Name in keyof RichTextElementAttrMap]: {
    name: Name;
    attrs?: RichTextAttrs<RichTextElementAttrMap[Name]>;
    type?: 'node';
    children?: RichTextNodes;
  };
}[keyof RichTextElementAttrMap];

interface RichTextTextNode {
  type: 'text';
  text: string;
}

type RichTextNode = RichTextElementNode | RichTextTextNode;

type RichTextNodes = Array<RichTextNode>;

type RichTextSpace = 'ensp' | 'emsp' | 'nbsp';

export interface RichTextProps extends BaseProps {
  nodes?: RichTextNodes | string;
  space?: RichTextSpace;
}

export interface ProgressProps extends BaseProps {
  percent?: number;
  showInfo?: boolean;
  borderRadius?: number | string;
  fontSize?: number | string;
  strokeWidth?: number | string;
  color?: string;
  activeColor?: string;
  backgroundColor?: string;
  active?: boolean;
  activeMode?: 'backwards' | 'forwards';
  duration?: number;
  onActiveend?: (e: any) => void;
}

type CameraMode = 'normal' | 'scanCode';
type CameraDevicePosition = 'front' | 'back';
type CameraFlash = 'auto' | 'on' | 'off' | 'torch';
type CameraFrameSize = 'small' | 'medium' | 'large';

export interface CameraProps extends BaseProps {
  mode?: CameraMode;
  devicePosition?: CameraDevicePosition;
  flash?: CameraFlash;
  frameSize?: CameraFrameSize;
  onStop?: (e: any) => void;
  onError?: (e: any) => void;
  onInitdone?: (e: any) => void;
  onScancode?: (e: any) => void;
}

export interface LivePlayerProps extends BaseProps {
  src?: string;
  mode?: 'live' | 'RTC';
  autoplay?: boolean;
  muted?: boolean;
  orientation?: 'vertical' | 'horizontal';
  objectFit?: 'contain' | 'fillCrop';
  backgroundMute?: boolean;
  minCache?: number;
  maxCache?: number;
  soundMode?: 'speaker' | 'ear';
  autoPauseIfNavigate?: boolean;
  autoPauseIfOpenNative?: boolean;
  pictureInPictureMode?: 'push' | 'pop' | Array<'push' | 'pop'>;
  onStatechange?: (e: any) => void;
  onFullscreenchange?: (e: any) => void;
  onNetstatus?: (e: any) => void;
  onAudiovolumenotify?: (e: any) => void;
  onEnterpictureinpicture?: (e: any) => void;
  onLeavepictureinpicture?: (e: any) => void;
}

export interface LivePusherProps extends BaseProps {
  url?: string;
  mode?: 'SD' | 'HD' | 'FHD' | 'RTC';
  autopush?: boolean;
  muted?: boolean;
  enableCamera?: boolean;
  autoFocus?: boolean;
  orientation?: 'vertical' | 'horizontal';
  beauty?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  whiteness?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  aspect?: '3:4' | '9:16';
  minBitrate?: number;
  maxBitrate?: number;
  audioQuality?: 'high' | 'low';
  waitingImage?: string;
  waitingImageHash?: string;
  zoom?: boolean;
  devicePosition?: 'front' | 'back';
  backgroundMute?: boolean;
  mirror?: boolean;
  remoteMirror?: boolean;
  localMirror?: 'auto' | 'enable' | 'disable';
  audioReverbType?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  enableMic?: boolean;
  enableAgc?: boolean;
  enableAns?: boolean;
  audioVolumeType?: 'auto' | 'media' | 'voicecall';
  videoWidth?: number;
  videoHeight?: number;
  beautyStyle?: 'smooth' | 'nature';
  filter?:
    | 'standard'
    | 'pink'
    | 'nostalgia'
    | 'blues'
    | 'romantic'
    | 'cool'
    | 'fresher'
    | 'solor'
    | 'aestheticism'
    | 'whitening'
    | 'cerisered';
  onStatechange?: (e: any) => void;
  onNetstatus?: (e: any) => void;
  onError?: (e: any) => void;
  onBgmstart?: (e: any) => void;
  onBgmprogress?: (e: any) => void;
  onBgmcomplete?: (e: any) => void;
  onAudiovolumenotify?: (e: any) => void;
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

export interface MapProps extends BaseProps {
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
  enablePoi?: boolean;
  enableBuilding?: boolean;
  setting?: MapSetting;
  onMarkertap?: (e: any) => void;
  onLabeltap?: (e: any) => void;
  onControltap?: (e: any) => void;
  onCallouttap?: (e: any) => void;
  onUpdated?: (e: any) => void;
  onRegionchange?: (e: any) => void;
  onPoitap?: (e: any) => void;
}

export interface NavigatorProps extends BasePropsWithChildren {
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

export interface TextareaProps extends BaseProps {
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
  holdKeyboard?: boolean;
  disableDefaultPadding?: boolean;
  confirmType?: string;
  confirmHold?: boolean;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  onLinechange?: (e: any) => void;
  onInput?: (e: any) => void;
  onConfirm?: (e: any) => void;
  onKeyboardheightchange?: (e: any) => void;
}

export interface CanvasProps extends BaseProps {
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

export interface OpenDataProps extends BaseProps {
  type?:
    | 'groupName'
    | 'userNickName'
    | 'userAvatarUrl'
    | 'userGender'
    | 'userCity'
    | 'userProvince'
    | 'userCountry'
    | 'userLanguage';
  openGid?: string;
  lang?: 'en' | 'zh_CN' | 'zh_TW';
  defaultText?: string;
  defaultAvatar?: string;
  onError?: (e: any) => void;
}

export interface OfficialAccountProps extends BaseProps {
  onLoad?: (e: any) => void;
  onError?: (e: any) => void;
}

export interface WebViewProps extends BaseProps {
  src?: string;
  onMessage?: (e: any) => void;
  onLoad?: (e: any) => void;
  onError?: (e: any) => void;
}

export interface CoverImageProps extends BaseProps {
  src?: string;
  onLoad?: (e: any) => void;
  onError?: (e: any) => void;
}

export interface IconProps extends BaseProps {
  type: string;
  size?: number | string;
  color?: string;
}

export interface BuildInComponentsProps {
  view: ViewProps;
  'scroll-view': ScrollViewProps;
  'web-view': WebViewProps;
  swiper: SwiperProps;
  'swiper-item': SwiperItemProps;
  'movable-view': MovableViewProps;
  'movable-area': MovableAreaProps;
  'cover-view': CoverViewProps;
  'cover-image': CoverImageProps;
  icon: IconProps;
  text: TextProps;
  'rich-text': RichTextProps;
  progress: ProgressProps;
  button: ButtonProps;
  'checkbox-group': CheckboxGroupProps;
  checkbox: CheckboxProps;
  form: FormProps;
  input: InputProps;
  label: LabelProps;
  picker: PickerProps;
  'picker-view': PickerViewProps;
  'radio-group': RadioGroupProps;
  radio: RadioProps;
  slider: SliderProps;
  switch: SwitchProps;
  textarea: TextareaProps;
  navigator: NavigatorProps;
  image: ImageProps;
  video: VideoProps;
  camera: CameraProps;
  'live-player': LivePlayerProps;
  'live-pusher': LivePusherProps;
  map: MapProps;
  canvas: CanvasProps;
  'open-data': OpenDataProps;
  'official-account': OfficialAccountProps;
}
