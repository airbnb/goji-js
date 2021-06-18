import { t, createContext, withContext } from '../helper';

describe('template helper `t`', () => {
  test('should trim', () => {
    expect(t`  a\n  b\n  c`).toBe('a\nb\nc');
  });

  test('should support functions', () => {
    const f = () => ' and ';
    expect(t`a${f}b`).toBe('a and b');
  });

  test('should support nested function', () => {
    const f = () => () => () => () => ' and ';
    expect(t`a${f}b`).toBe('a and b');
  });

  test('should filter non-renderable values', () => {
    expect(t`${null}`).toBe('');
    expect(t`${undefined}`).toBe('');
    expect(t`${false}`).toBe('');
    expect(t`${true}`).toBe('');
  });
});

describe('template context', () => {
  const testContext = createContext<{ data: number }>();
  const render = () => t`
    "data": "${() => testContext.read().data}"
  `;

  test('should throw if not initialed', () => {
    expect(() => render()).toThrow();
  });

  test('should works', () => {
    expect(withContext(testContext, { data: 123 }, render)).toBe(t`
      "data": "123"
    `);

    const nestedRender = () => t`
      {
        "json": {
          ${render}
        }
      }`;
    expect(withContext(testContext, { data: 123 }, nestedRender)).toBe(t`
      {
        "json": {
          "data": "123"
        }
      }
    `);
  });
});
