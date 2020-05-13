import { createAdaptor } from '..';
import { WeChatAdaptor } from '../wechat';

describe('createAdaptor', () => {
  test('return wechat adaptor', () => {
    expect(createAdaptor('page', 'wechat', {}, false)).toBeInstanceOf(WeChatAdaptor);
  });

  test.todo('return alipay adaptor');
});
