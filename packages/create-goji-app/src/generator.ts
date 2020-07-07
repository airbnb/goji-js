import mkdirp from 'mkdirp';
import globby from 'globby';
import path from 'path';
import ejs from 'ejs';
import fs from 'fs';
import { promisify } from 'util';

const renderTemplate = async (sourceFile: string, destFile: string, data: any = {}) => {
  const content = await promisify(fs.readFile)(sourceFile);
  const result = ejs.render(content.toString(), data, {
    filename: sourceFile,
  });
  await mkdirp(path.dirname(destFile));
  await promisify(fs.writeFile)(destFile, result);
};

export const generateProject = async (projectName, sourcePath: string, destPath: string) => {
  for await (const sourceFileBuf of globby.stream(path.join(sourcePath, '**'))) {
    const sourceFile = sourceFileBuf.toString();
    const relativePath = path.relative(sourcePath, sourceFile);
    const destFile = path.join(destPath, relativePath);
    await renderTemplate(sourceFile, destFile, {
      projectName,
    });
  }
};
