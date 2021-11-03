import path from 'path';
import { AppConfig, AppSubpackage } from '../types';

export const readPathsFromAppConfig = (config: AppConfig): Array<string> => {
  const paths = config.pages || [];
  const subPackages = [...(config.subpackages || []), ...(config.subPackages || [])];
  for (const subPackage of subPackages) {
    if (!subPackage.root) {
      throw new Error(
        `field \`root\` not found in sub package config ${JSON.stringify(subPackage)}`,
      );
    }
    if (subPackage.root && subPackage.pages) {
      for (const subPage of subPackage.pages) {
        paths.push(path.posix.join(subPackage.root, subPage));
      }
    }
  }

  return paths;
};

export const getSubpackagesInfo = (config: AppConfig) => {
  const all = config.subPackages ?? [];
  const independents: Array<AppSubpackage> = [];
  const dependents: Array<AppSubpackage> = [];
  for (const item of all) {
    if (item.independent) {
      independents.push(item);
    } else {
      dependents.push(item);
    }
  }
  return [all, independents, dependents] as const;
};

export const isBelongsTo = (pagePath: string, subPackage: string) =>
  pagePath.startsWith(`${subPackage}/`);

// TODO: how to improve this performance
export const findBelongingSubPackage = (pagePath: string, subPackages: Array<string>) =>
  subPackages.find(subPackage => isBelongsTo(pagePath, subPackage));
