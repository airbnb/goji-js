import { parseSync } from '@babel/core';
import * as t from '@babel/types';
import { transformObjectASTToObject } from '../transformObjectASTToObject';

describe('parseObjectASTToObject', () => {
  const parseObjectCode = (code: string) => {
    const program = parseSync(`a = ${code}`, { filename: 'unknown' }) as t.File;
    return ((program.program.body[0] as t.ExpressionStatement).expression as t.AssignmentExpression)
      .right as t.Node;
  };

  it('should parse literal', () => {
    expect(transformObjectASTToObject(parseObjectCode('123'))).toBe(123);
    expect(transformObjectASTToObject(parseObjectCode('1.3'))).toBe(1.3);
    expect(transformObjectASTToObject(parseObjectCode('true'))).toBe(true);
    expect(transformObjectASTToObject(parseObjectCode(`'abc'`))).toBe('abc');
    expect(transformObjectASTToObject(parseObjectCode('null'))).toBe(null);
    expect(transformObjectASTToObject(parseObjectCode('undefined'))).toBe(undefined);
  });

  it('should parse array', () => {
    expect(transformObjectASTToObject(parseObjectCode('[1, 2, 3]'))).toEqual([1, 2, 3]);
    expect(transformObjectASTToObject(parseObjectCode(`[[1], 2, 'c']`))).toEqual([[1], 2, 'c']);
  });

  it('should parse object', () => {
    expect(
      transformObjectASTToObject(parseObjectCode(`{ a: 1, b: { d: { e: 'f'} }, c: 'c' }`)),
    ).toEqual({ a: 1, b: { d: { e: 'f' } }, c: 'c' });
    expect(
      transformObjectASTToObject(parseObjectCode('{ a: [1, 2, 3], b: null, c: { d: 1 } }')),
    ).toEqual({
      a: [1, 2, 3],
      b: null,
      c: { d: 1 },
    });
  });

  it('should throw for invalid types', () => {
    expect(() => transformObjectASTToObject(parseObjectCode(`valueA`))).toThrow();
    expect(() => transformObjectASTToObject(parseObjectCode(`1 + 1`))).toThrow();
    expect(() => transformObjectASTToObject(parseObjectCode(`f()`))).toThrow();
    expect(() => transformObjectASTToObject(parseObjectCode(`{ [a]: 1 }`))).toThrow();
    expect(() => transformObjectASTToObject(parseObjectCode(`{ a: b }`))).toThrow();
    expect(() => transformObjectASTToObject(parseObjectCode(`{ ...a }`))).toThrow();
    expect(() => transformObjectASTToObject(parseObjectCode(`{ a }`))).toThrow();
  });
});
