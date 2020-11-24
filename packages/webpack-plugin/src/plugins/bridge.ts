/* eslint-disable no-await-in-loop */
import webpack from 'webpack';
import path from 'path';
import { unstable_SIMPLIFY_COMPONENTS as SIMPLIFY_COMPONENTS } from '@goji/core';
import deepmerge from 'deepmerge';
import { urlToRequest } from 'loader-utils';
import { getWhitelistedComponents, getRenderedComponents } from '../utils/components';
import { renderTemplate } from '../utils/render';
import { getRelativePathToBridge } from '../utils/path';
import { TEMPLATES_DIR, BRIDGE_OUTPUT_PATH } from '../constants';
import { pathEntriesMap, appConfigMap, usedComponentsMap } from '../shared';
import { GojiBasedWebpackPlugin } from './based';
import { minimize } from '../utils/minimize';
import { getSubpackagesInfo, findBelongingSubPackage } from '../utils/config';

/**
 * render bridge files and page/components entry files
 */
export class GojiBridgeWebpackPlugin extends GojiBasedWebpackPlugin {
  private renderTemplate<T>(pathname: string, data?: T) {
    return renderTemplate(
      // use wechat for integration mode because `mina-webpack` would transform the code to different platforms
      this.options.unsafe_integrationMode ? 'wechat' : this.options.target,
      path.resolve(TEMPLATES_DIR, pathname),
      data,
    );
  }

  private getWhitelistedComponents(compilation: webpack.Compilation) {
    if (!usedComponentsMap.has(compilation)) {
      throw new Error('`usedComponents` not found, This might be an internal error in GojiJS.');
    }
    const usedComponents = usedComponentsMap.get(compilation);
    return getWhitelistedComponents(this.options.target, usedComponents);
  }

  private getRenderedComponents(compilation: webpack.Compilation) {
    if (!usedComponentsMap.has(compilation)) {
      throw new Error('`usedComponents` not found, This might be an internal error in GojiJS.');
    }
    const usedComponents = usedComponentsMap.get(compilation);
    return getRenderedComponents(this.options.target, SIMPLIFY_COMPONENTS, usedComponents);
  }

  private async renderTemplateToAsset<T>(
    compilation: webpack.Compilation,
    assetPath: string,
    templatePath: string,
    data: T,
    merge?: (newSource: string, oldSource: string) => string,
  ) {
    const formattedAssetPath = this.transformExtForPath(assetPath);
    let content: string = await this.renderTemplate(templatePath, data);
    if (!merge && compilation.assets[formattedAssetPath] !== undefined) {
      console.warn('skip existing asset', formattedAssetPath);
    }
    if (merge && compilation.assets[formattedAssetPath]) {
      content = merge(content, compilation.assets[formattedAssetPath].source().toString());
    }
    if (this.options.minimize) {
      content = await minimize(content, path.extname(assetPath));
    }
    // @ts-ignore
    compilation.assets[formattedAssetPath] = new webpack.sources.RawSource(content);
  }

  private shouldInlineChildrenRender() {
    const { target } = this.options;
    // alipay only support recursion dependency self to self so we have to inline the children.wxml
    // Success: A -> A -> A
    // Fail: A -> B -> A
    return target === 'alipay';
  }

  private shouldUseSubtree() {
    const { target } = this.options;
    return target === 'wechat' || target === 'qq';
  }

  // Baidu doesn't support `template` inside `text` so we need to flat text manually
  private useFlattenText() {
    const { target } = this.options;
    return target === 'baidu';
  }

  // Alipay has a bug that should use `swiper-item` directly inside `swiper`, no `template` is accepted
  private useFlattenSwiper() {
    const { target } = this.options;
    return target === 'alipay';
  }

  private async renderSubtreeBridge(compilation: webpack.Compilation, basedir: string) {
    const components = this.getRenderedComponents(compilation);
    const { maxDepth } = this.options;
    for (let depth = 0; depth < maxDepth; depth += 1) {
      await this.renderTemplateToAsset(
        compilation,
        path.join(basedir, `${BRIDGE_OUTPUT_PATH}/children${depth}.wxml`),
        'children.wxml.ejs',
        {
          depth,
          maxDepth,
          componentsDepth: depth + 1,
          fixBaiduTemplateBug: this.options.target === 'baidu',
        },
      );
      await this.renderTemplateToAsset(
        compilation,
        path.join(basedir, `${BRIDGE_OUTPUT_PATH}/components${depth}.wxml`),
        'components.wxml.ejs',
        {
          depth,
          maxDepth,
          componentsDepth: depth + 1,
          components: components.filter(c => !c.isLeaf),
          inlineChildrenRender: this.shouldInlineChildrenRender(),
          useFlattenText: this.useFlattenText(),
          useFlattenSwiper: this.useFlattenSwiper(),
        },
      );
    }
  }

  private async renderLeafTemplate(compilation: webpack.Compilation, basedir: string) {
    const components = this.getRenderedComponents(compilation);
    await this.renderTemplateToAsset(
      compilation,
      path.join(basedir, `${BRIDGE_OUTPUT_PATH}/leaf-components.wxml`),
      `leaf-components.wxml.ejs`,
      {
        components: components.filter(c => c.isLeaf),
      },
    );
  }

  private async renderChildrenRenderComponent(compilation: webpack.Compilation, basedir: string) {
    await this.renderTemplateToAsset(
      compilation,
      path.join(basedir, `${BRIDGE_OUTPUT_PATH}/subtree.js`),
      'subtree.js.ejs',
      {},
    );
    await this.renderTemplateToAsset(
      compilation,
      path.join(basedir, `${BRIDGE_OUTPUT_PATH}/subtree.json`),
      'subtree.json.ejs',
      {
        relativePathToBridge: '.',
        components: this.getWhitelistedComponents(compilation),
      },
    );
    await this.renderTemplateToAsset(
      compilation,
      path.join(basedir, `${BRIDGE_OUTPUT_PATH}/subtree.wxml`),
      'subtree.wxml.ejs',
      {},
    );
  }

  private async renderComponentTemplate(
    compilation: webpack.Compilation,
    basedir: string,
    inlineChildrenRender: boolean,
  ) {
    const components = this.getRenderedComponents(compilation);
    await this.renderTemplateToAsset(
      compilation,
      path.join(basedir, `${BRIDGE_OUTPUT_PATH}/components0.wxml`),
      'components.wxml.ejs',
      {
        depth: 0,
        componentsDepth: 0,
        components: components.filter(c => !c.isLeaf),
        inlineChildrenRender,
        useFlattenText: this.useFlattenText(),
        useFlattenSwiper: this.useFlattenSwiper(),
      },
    );
  }

  private async renderChildrenTemplate(compilation: webpack.Compilation, basedir: string) {
    await this.renderTemplateToAsset(
      compilation,
      path.join(basedir, `${BRIDGE_OUTPUT_PATH}/children0.wxml`),
      'children.wxml.ejs',
      {
        depth: 0,
        maxDepth: Infinity,
        componentsDepth: 0,
        fixBaiduTemplateBug: this.options.target === 'baidu',
      },
    );
  }

  private async renderWrappedComponents(compilation: webpack.Compilation, basedir: string) {
    const components = this.getWhitelistedComponents(compilation);
    for (const component of components) {
      if (component.isWrapped) {
        await this.renderTemplateToAsset(
          compilation,
          path.join(basedir, `${BRIDGE_OUTPUT_PATH}/components/${component.name}.wxml`),
          `components/${component.name}.wxml.ejs`,
          {},
        );
        await this.renderTemplateToAsset(
          compilation,
          path.join(basedir, `${BRIDGE_OUTPUT_PATH}/components/${component.name}.json`),
          `components/${component.name}.json.ejs`,
          {
            relativePathToBridge: '.',
            components: this.getWhitelistedComponents(compilation),
          },
        );
        await this.renderTemplateToAsset(
          compilation,
          path.join(basedir, `${BRIDGE_OUTPUT_PATH}/components/${component.name}.js`),
          `components/${component.name}.js.ejs`,
          {},
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

        const useSubtree = this.shouldUseSubtree();

        for (const bridgeBasedirs of ['.', ...independentPaths]) {
          if (useSubtree) {
            // render componentX and childrenX
            await this.renderSubtreeBridge(compilation, bridgeBasedirs);
            // render subtree component
            await this.renderChildrenRenderComponent(compilation, bridgeBasedirs);
          } else if (this.shouldInlineChildrenRender()) {
            // render component0 with inlined children0
            await this.renderComponentTemplate(compilation, bridgeBasedirs, true);
          } else {
            // render component0
            await this.renderComponentTemplate(compilation, bridgeBasedirs, false);
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
          const bridgeBasedir = belongingIndependentPackage
            ? urlToRequest(belongingIndependentPackage)
            : '.';
          // generate entry wxml
          await this.renderTemplateToAsset(compilation, `${entrypoint}.wxml`, 'item.wxml.ejs', {
            useSubtree,
            relativePathToBridge: getRelativePathToBridge(entrypoint, bridgeBasedir),
            fixBaiduTemplateBug: this.options.target === 'baidu',
          });
          // generate entry json
          await this.renderTemplateToAsset(
            compilation,
            `${entrypoint}.json`,
            'item.json.ejs',
            {
              useSubtree,
              relativePathToBridge: getRelativePathToBridge(entrypoint, bridgeBasedir),
              components: this.getWhitelistedComponents(compilation),
            },
            (newSource, oldSource) =>
              JSON.stringify(deepmerge(JSON.parse(oldSource), JSON.parse(newSource)), null, 2),
          );
        }
      });
    });
  }
}
