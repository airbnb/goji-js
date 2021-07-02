import { t, createContext, withContext } from '../helper';

describe('template helper `t`', () => {
  test('should trim', () => {
    expect(t`aa\n`).toBe('aa');
    expect(t`aa\n\n`).toBe('aa');
    expect(t`aa\n\n  `).toBe('aa');
    expect(t`  a\n  b\n  c`).toBe('a\nb\nc');
  });

  test('should support functions', () => {
    const f = () => ' and ';
    expect(t`a${f}b`).toBe('a and b');
    expect(t`
      a
      ${f}
      b
    `).toBe('a\n and\nb');
  });

  test('should support nested function', () => {
    const f = () => () => () => () => ' and ';
    expect(t`a${f}b`).toBe('a and b');
  });

  test('should filter non-printing values', () => {
    expect(t`${null}`).toBe('');
    expect(t`${undefined}`).toBe('');
    expect(t`${false}`).toBe('');
    expect(t`${true}`).toBe('');
  });

  test('should join array', () => {
    expect(t`1 ${[2, 3, 4]}`).toBe('1 2 3 4');
    expect(t`
      1
      ${[2, 3, 4]}
    `).toBe('1\n2\n3\n4');
    // FIXME: refactor `inlineArrayTransformer`
    // expect(t`1\n${[2, 3, 4]}`).toBe('1\n2\n3\n4');
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
    expect(withContext(testContext, { data: 123 }, render)).toBe('"data": "123"');

    const nestedRender = () => t`
      {
        "json": {
          ${render}
        }
      }`;
    expect(withContext(testContext, { data: 123 }, nestedRender)).toBe(
      JSON.stringify(
        {
          json: {
            data: '123',
          },
        },
        null,
        2,
      ),
    );
  });
});
