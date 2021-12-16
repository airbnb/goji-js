import waitForExpect from 'wait-for-expect';
import { act } from '.';

export const waitFor = (callback = () => {}, { timeout = 4500, interval = 50 } = {}) =>
  act(async () => {
    await waitForExpect(callback, timeout, interval);
  });

export function waitForElement<T>(
  callback: (...args: any) => T,
  { interval = 50, timeout = 4500 } = {},
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (typeof callback !== 'function') {
      reject(new Error('waitForElement requires a callback as the first parameter'));
      return;
    }
    let timer: NodeJS.Timeout;
    let observer: NodeJS.Timeout;
    let lastError: Error;

    function onDone(error, result) {
      clearTimeout(timer);
      clearTimeout(observer);
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }

    function onMutation() {
      try {
        const result = callback();
        if (result) {
          onDone(null, result);
        }
      } catch (error: any) {
        lastError = error;
        observer = setTimeout(onMutation, interval);
      }
    }

    function onTimeout() {
      onDone(lastError || new Error('Timed out in waitForElement.'), null);
    }

    timer = setTimeout(onTimeout, timeout);
    observer = setTimeout(onMutation, interval);
  });
}
