import React from 'react';
import { View, Button, Text, Input } from '@goji/core';
import { fireEvent, render, waitFor } from '..';

const Example = () => {
  const [name, setUser] = React.useState('');
  const [show, setShow] = React.useState(false);

  return (
    <View>
      <Input value={name} onInput={e => setUser(e.detail.value)} testID="input" />
      <Button
        onTap={() => {
          // let's pretend this is making a server request, so it's async
          // (you'd want to mock this imaginary request in your unit tests)...
          setTimeout(() => {
            setShow(!show);
          }, Math.floor(Math.random() * 200));
        }}
      >
        Print Username
      </Button>
      {show && <Text testID="printed-username">{name}</Text>}
    </View>
  );
};

test('examples of some things', async () => {
  jest.setTimeout(10000);
  const { getByTestId, getByText, queryByTestId, findByTestId } = render(<Example />);
  const famousWomanInHistory = 'Ada Lovelace';

  const input = getByTestId('input');
  expect(input).toBeTruthy();
  fireEvent.input(input, famousWomanInHistory);

  const button = getByText('Print Username');
  expect(button).toBeTruthy();
  fireEvent.tap(button);

  await waitFor(() => expect(queryByTestId('printed-username')).toBeTruthy());
  expect(await findByTestId('printed-username')).toBeTruthy();

  expect(getByTestId('printed-username').props.children).toBe(famousWomanInHistory);
});
