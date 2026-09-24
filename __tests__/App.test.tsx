import React from 'react';
import {act, render, screen} from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows the splash first, then the todo screen', async () => {
    render(<App />);
    expect(screen.getByTestId('splash-screen')).toBeTruthy();
    await act(async () => {
      jest.advanceTimersByTime(2500);
    });
    expect(screen.queryByTestId('splash-screen')).toBeNull();
    expect(screen.getByText('My Tasks')).toBeTruthy();
  });
});
