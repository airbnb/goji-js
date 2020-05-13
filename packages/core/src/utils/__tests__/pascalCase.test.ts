import { pascalCase } from '../pascalCase';

describe('pascalCase', () => {
  test('works', () => {
    expect(pascalCase('hello')).toBe('Hello');
    expect(pascalCase('hello-world')).toBe('HelloWorld');
    expect(pascalCase('helloWorld')).toBe('HelloWorld');
  });
});
