/* eslint-disable no-await-in-loop */
import webpack from 'webpack';
import path from 'path';
import { unstable_SIMPLIFY_COMPONENTS as SIMPLIFY_COMPONENTS } from '@goji/core';
import { RawSource } from 'webpack-sources';
import deepmerge from 'deepmerge';
import { urlToRequest } from 'loader-utils';
import { getWhitelistedComponents, getRenderedComponents } from '../utils/components';
import { transformTemplate } from '../utils/render';
import { getRelativePathToBridge } from '../utils/path';
import { BRIDGE_OUTPUT_DIR } from '../constants/paths';
import { pathEntriesMap, appConfigMap, usedComponentsMap } from '../shared';
import { GojiBasedWebpackPlugin } from './based';
import { minimize } from '../utils/minimize';
import { getSubpackagesInfo, findBelongingSubPackage, MAIN_PACKAGE } from '../utils/config';
import { renderTemplate } from '../templates';
import { componentWxml } from '../templates/components/components.wxml';
import { childrenWxml } from '../templates/components/children.wxml';
import { leafComponentWxml } from '../templates/components/leaf-components.wxml';
import { itemWxml } from '../templates/components/item.wxml';
import { itemJson } from '../templates/components/item.json';
import { subtreeJs } from '../templates/components/subtree.js';
import { subtreeJson } from '../templates/components/subtree.json';
import { subtreeWxml } from '../templates/components/subtree.wxml';
import { wrappedJson } from '../templates/components/wrapped.json';
import { getFeatures } from '../constants/features';
import { wrappedWxml } from '../templates/components/wrapped.wxml';
import { wrappedJs } from '../templates/components/wrapped.js';

/**
 * render bridge files and page/components entry files
 */
export class GojiBridgeWebpackPlugin extends GojiBasedWebpackPlugin {
  private getWhitelistedComponents(compilation: webpack.compilation.Compilation) {
    if (!usedComponentsMap.has(compilation)) {
      throw new Error('`usedComponents` not found, This might be an internal error in GojiJS.');
    }
    const usedComponents = usedComponentsMap.get(compilation);
    return getWhitelistedComponents(this.options.target, usedComponents);
  }

  private getRenderedComponents(compilation: webpack.compilation.Compilation) {
    if (!usedComponentsMap.has(compilation)) {
      throw new Error('`usedComponents` not found, This might be an internal error in GojiJS.');
    }
    const usedComponents = usedComponentsMap.get(compilation);
    return getRenderedComponents(this.options.target, SIMPLIFY_COMPONENTS, usedComponents);
  }

  private async renderTemplateComponentToAsset(
    compilation: webpack.compilation.Compilation,
    assetPath: string,
    component: () => string,
    merge?: (newSource: string, oldSource: string) => string,
  ) {
    const formattedAssetPath = this.transformExtForPath(assetPath);
    let content = renderTemplate({ target: this.options.target }, component);
    const type = path.posix.extname(assetPath).replace(/^\./, '');
    content = await transformTemplate(content, this.options.target, type);
    if (!merge && compilation.assets[formattedAssetPath] !== undefined) {
      console.warn('skip existing asset', formattedAssetPath);
    }
    if (merge && compilation.assets[formattedAssetPath]) {
      content = merge(content, compilation.assets[formattedAssetPath].source());
    }
    if (this.options.minimize) {
      content = await minimize(content, path.posix.extname(assetPath));
    }
    compilation.assets[formattedAssetPath] = new RawSource(content);
  }

  private async renderSubtreeBridge(compilation: webpack.compilation.Compilation, basedir: string) {
    const components = this.getRenderedComponents(compilation);
    const { maxDepth } = this.options;
    for (let depth = 0; depth < maxDepth; depth += 1) {
      await this.renderTemplateComponentToAsset(
        compilation,
        path.posix.join(basedir, BRIDGE_OUTPUT_DIR, `children${depth}.wxml`),
        () =>
          childrenWxml({
            maxDepth,
            componentsDepth: depth + 1,
          }),
      );
      await this.renderTemplateComponentToAsset(
        compilation,
        path.posix.join(basedir, BRIDGE_OUTPUT_DIR, `components${depth}.wxml`),
        () =>
          componentWxml({
            depth,
            componentsDepth: depth + 1,
            components: components.filter(c => !c.isLeaf),
            useFlattenSwiper: getFeatures(this.options.target).useFlattenSwiper,
          }),
      );
    }
  }

  private async renderLeafTemplate(compilation: webpack.compilation.Compilation, basedir: string) {
    const components = this.getRenderedComponents(compilation);
    await this.renderTemplateComponentToAsset(
      compilation,
      path.posix.join(basedir, BRIDGE_OUTPUT_DIR, `leaf-components.wxml`),
      () =>
        leafComponentWxml({
          components: components.filter(c => c.isLeaf),
        }),
    );
  }

  private async renderChildrenRenderComponent(
    compilation: webpack.compilation.Compilation,
    basedir: string,
  ) {
    await this.renderTemplateComponentToAsset(
      compilation,
      path.posix.join(basedir, BRIDGE_OUTPUT_DIR, `subtree.js`),
      () => subtreeJs(),
    );
    await this.renderTemplateComponentToAsset(
      compilation,
      path.posix.join(basedir, BRIDGE_OUTPUT_DIR, `subtree.json`),
      () =>
        subtreeJson({
          relativePathToBridge: '.',
          components: this.getWhitelistedComponents(compilation),
        }),
    );
    await this.renderTemplateComponentToAsset(
      compilation,
      path.posix.join(basedir, BRIDGE_OUTPUT_DIR, `subtree.wxml`),
      () => subtreeWxml(),
    );
  }

  private async renderComponentTemplate(
    compilation: webpack.compilation.Compilation,
    basedir: string,
  ) {
    const components = this.getRenderedComponents(compilation);
    await this.renderTemplateComponentToAsset(
      compilation,
      path.posix.join(basedir, BRIDGE_OUTPUT_DIR, `components0.wxml`),
      () =>
        componentWxml({
          depth: 0,
          componentsDepth: 0,
          components: components.filter(c => !c.isLeaf),
          useFlattenSwiper: getFeatures(this.options.target).useFlattenSwiper,
        }),
    );
  }

  private async renderChildrenTemplate(
    compilation: webpack.compilation.Compilation,
    basedir: string,
  ) {
    await this.renderTemplateComponentToAsset(
      compilation,
      path.posix.join(basedir, BRIDGE_OUTPUT_DIR, `children0.wxml`),
      () =>
        childrenWxml({
          maxDepth: Infinity,
          componentsDepth: 0,
        }),
    );
  }

  private async renderWrappedComponents(
    compilation: webpack.compilation.Compilation,
    basedir: string,
  ) {
    const components = this.getWhitelistedComponents(compilation);
    for (const component of components) {
      if (component.isWrapped) {
        await this.renderTemplateComponentToAsset(
          compilation,
          path.posix.join(basedir, BRIDGE_OUTPUT_DIR, 'components', `${component.name}.wxml`),
          () => wrappedWxml({ component }),
        );
        await this.renderTemplateComponentToAsset(
          compilation,
          path.posix.join(basedir, BRIDGE_OUTPUT_DIR, 'components', `${component.name}.json`),
          () =>
            wrappedJson({
              relativePathToBridge: '..',
              component,
              components: this.getWhitelistedComponents(compilation),
            }),
        );
        await this.renderTemplateComponentToAsset(
          compilation,
          path.posix.join(basedir, BRIDGE_OUTPUT_DIR, 'components', `${component.name}.js`),
          () =>
            wrappedJs({
              component,
            }),
        );
      }
    }
  }

  public apply(compiler: webpack.Compiler) {
    compiler.hooks.emit.tapPromise('GojiBridgeWebpackPlugin', async compilation => {
      const appConfig = appConfigMap.get(compiler);
      if (!appConfig) {
        throw new Error('`appConfig` not found. This might be an internal error in GojiJS.');
      }
      const [, independents] = getSubpackagesInfo(appConfig);
      const independentRoots = independents.map(independent => independent.root!);
      const independentPaths = independentRoots.map(root => urlToRequest(root));

      const { useSubtree } = getFeatures(this.options.target);

      for (const bridgeBasedirs of ['.', ...independentPaths]) {
        if (useSubtree) {
          // render componentX and childrenX
          await this.renderSubtreeBridge(compilation, bridgeBasedirs);
          // render subtree component
          await this.renderChildrenRenderComponent(compilation, bridgeBasedirs);
        } else if (getFeatures(this.options.target).useInlineChildren) {
          // render component0 with inlined children0
          await this.renderComponentTemplate(compilation, bridgeBasedirs);
        } else {
          // render component0
          await this.renderComponentTemplate(compilation, bridgeBasedirs);
          // render children0
          await this.renderChildrenTemplate(compilation, bridgeBasedirs);
        }

        // render leaf-components
        await this.renderLeafTemplate(compilation, bridgeBasedirs);
        // render wrapped components
        await this.renderWrappedComponents(compilation, bridgeBasedirs);
      }

      const pathEntries = pathEntriesMap.get(compiler);
      if (!pathEntries) {
        throw new Error('pathEntries not found');
      }
      for (const entrypoint of pathEntries) {
        const belongingIndependentPackage = findBelongingSubPackage(entrypoint, independentRoots);
        const bridgeBasedir =
          belongingIndependentPackage === MAIN_PACKAGE
            ? '.'
            : urlToRequest(belongingIndependentPackage);
        // generate entry wxml
        await this.renderTemplateComponentToAsset(compilation, `${entrypoint}.wxml`, () =>
          itemWxml({
            relativePathToBridge: getRelativePathToBridge(entrypoint, bridgeBasedir),
            fixBaiduTemplateBug: this.options.target === 'baidu',
          }),
        );
        // generate entry json
        await this.renderTemplateComponentToAsset(
          compilation,
          `${entrypoint}.json`,
          () =>
            itemJson({
              relativePathToBridge: getRelativePathToBridge(entrypoint, bridgeBasedir),
              components: this.getWhitelistedComponents(compilation),
            }),
          (newSource, oldSource) =>
            JSON.stringify(deepmerge(JSON.parse(oldSource), JSON.parse(newSource)), null, 2),
        );
      }
    });
  }
}
