import { createContext, withContext } from '../context';
import { t } from '../t';

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
