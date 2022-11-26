/* eslint-disable no-await-in-loop */
import webpack from 'webpack';
import path from 'path';
import { unstable_SIMPLIFY_COMPONENTS as SIMPLIFY_COMPONENTS } from '@goji/core';
import deepmerge from 'deepmerge';
import { urlToRequest } from 'loader-utils';
import { getUsedComponents, isWrapped, getSimplifiedComponents } from '../utils/components';
import { transformTemplate } from '../utils/render';
import { getRelativePathToBridge } from '../utils/path';
import { BRIDGE_OUTPUT_DIR } from '../constants/paths';
import { pathEntriesMap, appConfigMap, usedComponentsMap } from '../shared';
import { GojiBasedWebpackPlugin } from './based';
import { minimize } from '../utils/minimize';
import { getSubpackagesInfo, findBelongingSubPackage, MAIN_PACKAGE } from '../utils/config';
import { renderTemplate } from '../templates';
import { componentWxml, useSubtreeAsChildren } from '../templates/components/components.wxml';
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
import { getPluginComponents } from '../utils/pluginComponent';

/**
 * render bridge files and page/components entry files
 */
export class GojiBridgeWebpackPlugin extends GojiBasedWebpackPlugin {
  private getUsedComponents(compilation: webpack.Compilation) {
    if (!usedComponentsMap.has(compilation)) {
      throw new Error('`usedComponents` not found, This might be an internal error in GojiJS.');
    }
    const usedComponents = usedComponentsMap.get(compilation);
    return getUsedComponents(this.options.target, usedComponents);
  }

  private getSimplifiedComponents(compilation: webpack.Compilation) {
    const usedComponents = this.getUsedComponents(compilation);
    return getSimplifiedComponents(usedComponents, SIMPLIFY_COMPONENTS);
  }

  private async renderTemplateComponentToAsset(
    compilation: webpack.Compilation,
    assetPath: string,
    component: () => string,
    merge?: (newSource: string, oldSource: string) => string,
  ) {
    const formattedAssetPath = this.transformExtForPath(assetPath);
    let content = renderTemplate(
      { target: this.options.target, nodeEnv: this.options.nodeEnv },
      component,
    );
    const type = path.posix.extname(assetPath).replace(/^\./, '');
    content = await transformTemplate(content, this.options.target, type);
    if (!merge && compilation.assets[formattedAssetPath] !== undefined) {
      console.warn('skip existing asset', formattedAssetPath);
    }
    if (merge && compilation.assets[formattedAssetPath]) {
      content = merge(content, compilation.assets[formattedAssetPath].source().toString());
    }
    if (this.options.minimize) {
      content = await minimize(content, path.posix.extname(assetPath));
    }
    compilation.assets[formattedAssetPath] = new webpack.sources.RawSource(content);
  }

  private async renderSubtreeBridge(compilation: webpack.Compilation, basedir: string) {
    const components = this.getUsedComponents(compilation);
    const simplifiedComponents = this.getSimplifiedComponents(compilation);
    const pluginComponents = getPluginComponents();
    const { maxDepth } = this.options;
    for (let depth = 0; depth < maxDepth; depth += 1) {
      await this.renderTemplateComponentToAsset(
        compilation,
        path.posix.join(basedir, BRIDGE_OUTPUT_DIR, `children${depth}.wxml`),
        () =>
          childrenWxml({
            relativePathToBridge: '.',
            componentDepth: depth,
          }),
      );
      await this.renderTemplateComponentToAsset(
        compilation,
        path.posix.join(basedir, BRIDGE_OUTPUT_DIR, `components${depth}.wxml`),
        () =>
          componentWxml({
            componentDepth: depth,
            childrenDepth: depth + 1 === maxDepth ? useSubtreeAsChildren : depth + 1,
            components,
            simplifiedComponents,
            pluginComponents,
            useFlattenSwiper: getFeatures(this.options.target).useFlattenSwiper,
          }),
      );
    }
  }

  private async renderLeafTemplate(compilation: webpack.Compilation, basedir: string) {
    const components = this.getUsedComponents(compilation);
    const simplifiedComponents = this.getSimplifiedComponents(compilation);
    const pluginComponents = getPluginComponents();
    await this.renderTemplateComponentToAsset(
      compilation,
      path.posix.join(basedir, BRIDGE_OUTPUT_DIR, `leaf-components.wxml`),
      () =>
        leafComponentWxml({
          components,
          simplifiedComponents,
          pluginComponents,
        }),
    );
  }

  private async renderChildrenRenderComponent(compilation: webpack.Compilation, basedir: string) {
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
          components: this.getUsedComponents(compilation),
          pluginComponents: getPluginComponents(),
        }),
    );
    await this.renderTemplateComponentToAsset(
      compilation,
      path.posix.join(basedir, BRIDGE_OUTPUT_DIR, `subtree.wxml`),
      () => subtreeWxml(),
    );
  }

  private async renderComponentTemplate(compilation: webpack.Compilation, basedir: string) {
    const components = this.getUsedComponents(compilation);
    const simplifiedComponents = this.getSimplifiedComponents(compilation);
    const pluginComponents = getPluginComponents();
    await this.renderTemplateComponentToAsset(
      compilation,
      path.posix.join(basedir, BRIDGE_OUTPUT_DIR, `components0.wxml`),
      () =>
        componentWxml({
          componentDepth: 0,
          childrenDepth: 0,
          components,
          simplifiedComponents,
          pluginComponents,
          useFlattenSwiper: getFeatures(this.options.target).useFlattenSwiper,
        }),
    );
  }

  private async renderChildrenTemplate(compilation: webpack.Compilation, basedir: string) {
    await this.renderTemplateComponentToAsset(
      compilation,
      path.posix.join(basedir, BRIDGE_OUTPUT_DIR, `children0.wxml`),
      () =>
        childrenWxml({
          relativePathToBridge: '.',
          componentDepth: 0,
        }),
    );
  }

  private async renderWrappedComponents(compilation: webpack.Compilation, basedir: string) {
    const components = this.getUsedComponents(compilation);
    const pluginComponents = getPluginComponents();
    for (const component of [...components, ...pluginComponents]) {
      if (isWrapped(component)) {
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
              components,
              pluginComponents: getPluginComponents(),
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
    compiler.hooks.thisCompilation.tap('GojiBridgeWebpackPlugin', compilation => {
      compilation.hooks.processAssets.tapPromise('GojiBridgeWebpackPlugin', async () => {
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
            }),
          );
          // generate entry json
          await this.renderTemplateComponentToAsset(
            compilation,
            `${entrypoint}.json`,
            () =>
              itemJson({
                relativePathToBridge: getRelativePathToBridge(entrypoint, bridgeBasedir),
                components: this.getUsedComponents(compilation),
                pluginComponents: getPluginComponents(),
              }),
            (newSource, oldSource) =>
              JSON.stringify(deepmerge(JSON.parse(oldSource), JSON.parse(newSource)), null, 2),
          );
        }
      });
    });
  }
}
