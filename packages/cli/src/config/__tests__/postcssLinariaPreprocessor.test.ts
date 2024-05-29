import postcss from 'postcss';

const transform = async (css: string) => {
  // eslint-disable-next-line global-require
  const result = await postcss([require('../postcssLinariaPreprocessor')()]).process(css, {
    from: '/path/to/file.css',
  });
  return result.css;
};

describe('postcss-linaria-preprocessor', () => {
  test(':global() selector', () => {
    const css = `
      .a {
        color: red;
        :global() {
          page {
            width: 50vw;
          }
        }
      }
    `;
    expect(transform(css)).resolves.toMatchSnapshot();
  });

  test('keyframes rename', () => {
    const css = `
      .a {
        animation: 1s ease 1 backwards normal zoomIn;
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.94);
          }

          50% {
            opacity: var(--opacity);
          }

          to {
            transform: scale(var(--scale));
          }
        }
      }
    `;
    expect(transform(css)).resolves.toMatchSnapshot();
  });

  test('escape breaking control characters', () => {
    const css = `
      .a {
        content: '\feff';
      }
    `;
    expect(transform(css)).resolves.toMatchSnapshot();
  });
});
