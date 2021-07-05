import { renderTemplate } from '../..';
import { ComponentDesc } from '../../../constants/components';
import { nativeComponentJson } from '../nativeComponentJson';

describe('nativeComponentJson', () => {
  const components: ComponentDesc[] = [
    {
      name: 'view',
      props: {
        x: {
          type: 'Number',
        },
        y: {
          type: 'Number',
        },
      },
      events: ['change', 'input'],
      isWrapped: true,
    },
  ];

  test('leaf component', () => {
    const json = JSON.parse(
      renderTemplate({ target: 'wechat' }, () =>
        nativeComponentJson({ isLeaf: true, relativePathToBridge: '.', components }),
      ),
    );
    expect(json.usingComponents).toEqual({});
    // expect(json.usingComponents['goji-view']).toBeTruthy();
  });

  test('non-leaf component', () => {
    const json = JSON.parse(
      renderTemplate({ target: 'wechat' }, () =>
        nativeComponentJson({ isLeaf: false, relativePathToBridge: '.', components }),
      ),
    );
    expect(json.usingComponents).not.toEqual({});
    expect(json.usingComponents['goji-view']).toBe('./components/view');
    expect(json.usingComponents['goji-subtree']).toBe('./subtree');
  });

  // FIXME: support plugin in subtree/wrapped
  test.skip('plugin native path', () => {});
});
