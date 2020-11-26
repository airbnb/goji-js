import React from 'react';
import { render, fireEvent } from '@goji/testing-library';
import { TodoTextInput } from '../TodoTextInput';

describe('TodoTextInput', () => {
  it('works', () => {
    const onSave = jest.fn();
    const wrapper = render(<TodoTextInput onSave={onSave} placeholder="" />);
    const input = wrapper.getByTestId('todo-text-input');
    expect(input).toBeTruthy();

    // input
    fireEvent.input(input, 'hi');
    expect(input.props.value).toBe('hi');

    // confirm and then cleanup
    fireEvent.confirm(input);
    expect(onSave).toBeCalledTimes(1);
    expect(onSave).toBeCalledWith('hi');
    expect(input.props.value).toBe('');
  });
});
