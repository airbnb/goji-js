import { View, WebView } from '../factoryComponents';

describe('factoryComponent', () => {
  test('displat name', () => {
    expect(View.displayName).toBe('View');
    expect(WebView.displayName).toBe('WebView');
  });
});
