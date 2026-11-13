const GOJI_PREFIX = '_goji_';

export const BRIDGE_OUTPUT_DIR = `${GOJI_PREFIX}bridges`;

export const COMMON_CHUNK_NAME = `${GOJI_PREFIX}commons`;

export const RUNTIME_FILE_NAME = `${GOJI_PREFIX}runtime`;

export const NO_HOIST_PREFIX = `${GOJI_PREFIX}nohoist_`;

export const NO_HOIST_TEMP_DIR = `${GOJI_PREFIX}nohoist_temp`;

// WeChat requires the custom tabBar component to be located in this fixed folder
// https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html
export const CUSTOM_TAB_BAR_ENTRY = 'custom-tab-bar/index';
