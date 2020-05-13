import { merge } from '../merge';

describe('mergeDiff', () => {
  it('simple merge', () => {
    const diff = {
      a: 'a',
    };
    const existing = {
      b: 'b',
    };

    expect(merge(existing, diff)).toEqual({
      a: 'a',
      b: 'b',
    });
  });

  it('override merge', () => {
    const diff = {
      a: 'a',
    };
    const existing = {
      b: 'b',
      a: 'b',
    };

    expect(merge(existing, diff)).toEqual({
      a: 'a',
      b: 'b',
    });
  });

  it('deep path override', () => {
    const diff = {
      'children[0].text': '233',
      'children[0].style': { display: 'none' },
    };
    const existing = {
      children: [{ text: 'bula' }],
    };

    expect(merge(existing, diff)).toEqual({
      children: [{ text: '233', style: { display: 'none' } }],
    });
  });

  it('new subtree override', () => {
    const diff = {
      'children[0]': { text: '233', style: { display: 'none' } },
    };
    const existing = {
      'children[0].text': 'bula',
      'children[0].style': { display: 'block' },
    };

    expect(merge(existing, diff)).toEqual({
      'children[0]': { text: '233', style: { display: 'none' } },
    });
  });

  it('subtree removed', () => {
    const existing = {
      'children[0].text': 'bula',
      'children[0].style': { display: 'block' },
    };
    const diff1 = {
      'children[0]': { text: '233', style: { display: 'none' } },
    };
    const diff2 = {
      children: [],
    };

    const merged1 = merge(existing, diff1);
    expect(merged1).toEqual({
      'children[0]': { text: '233', style: { display: 'none' } },
    });

    const merged2 = merge(merged1, diff2);
    expect(merged2).toEqual({
      children: [],
    });
  });
});
