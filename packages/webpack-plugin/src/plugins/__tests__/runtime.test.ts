import { generateDependenciesSource } from '../runtime';

const dependencies = ['commons', 'rumtime', '../../module'];

describe('generateDependenciesSource', () => {
  test('generate JS code', () => {
    const jsCode = generateDependenciesSource('.js', '.js', dependencies);
    expect(jsCode).toContain(`require('./commons')`);
    expect(jsCode).toContain(`require('./rumtime')`);
    expect(jsCode).toContain(`require('../../module')`);
  });

  test('generate Css code', () => {
    const cssCode = generateDependenciesSource('.wxss', '.acss', dependencies);
    expect(cssCode).toContain(`@import './commons.acss'`);
    expect(cssCode).toContain(`@import './rumtime.acss'`);
    expect(cssCode).toContain(`@import '../../module.acss'`);
  });

  test('check type', () => {
    // @ts-expect-error
    expect(() => generateDependenciesSource('md', '.md', dependencies)).toThrow();
  });
});
