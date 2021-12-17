/* eslint-disable import/no-import-module-exports */
import React from 'react';
import { GojiTarget } from '@goji/core';
import { createMacro } from 'babel-plugin-macros';
import { PropDesc } from '@goji/webpack-plugin/dist/cjs/constants/components';
import { processRegisterPluginComponent } from './registerPluginComponent';

const macro = createMacro(
  ({ references, config }) => {
    processRegisterPluginComponent(config, references.registerPluginComponent);
  },
  { configName: 'gojiMacro' },
);

module.exports = macro;

export declare function registerPluginComponent(
  target: GojiTarget,
  name: string,
  path: string,
  props: Array<string | [string, PropDesc]>,
): React.FunctionComponent<any>;
