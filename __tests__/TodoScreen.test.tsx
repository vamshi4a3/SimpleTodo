import React from 'react';
import { Alert } from 'react-native';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TodoScreen from '../src/screens/TodoScreen';
import { STORAGE_KEY } from '../src/storage';

const renderScreen = async () => {
  render(<TodoScreen />);
  await waitFor(() => expect(screen.getByTestId('empty-text')).toBeTruthy());
};

const addTodo = (title: string) => {
  fireEvent.changeText(screen.getByTestId('todo-input'), title);
  fireEvent.press(screen.getByTestId('submit-button'));
};

describe('TodoScreen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  it('shows empty state', async () => {
    await renderScreen();
    expect(screen.getByText(/No tasks yet/)).toBeTruthy();
  });

  it('adds a todo and clears the input', async () => {
    await renderScreen();
    addTodo('Buy milk');
    expect(screen.getByText('Buy milk')).toBeTruthy();
    expect(screen.getByTestId('todo-input').props.value).toBe('');
    expect(screen.getByTestId('remaining-count')).toHaveTextContent(
      '1 remaining',
    );
  });

  it('does not add an empty todo', async () => {
    await renderScreen();
    addTodo('   ');
    expect(screen.getByTestId('empty-text')).toBeTruthy();
  });

  it('edits a todo', async () => {
    await renderScreen();
    addTodo('Buy milk');
    fireEvent.press(screen.getByText('Edit'));
    expect(screen.getByTestId('todo-input').props.value).toBe('Buy milk');
    fireEvent.changeText(screen.getByTestId('todo-input'), 'Buy bread');
    fireEvent.press(screen.getByTestId('submit-button'));
    expect(screen.getByText('Buy bread')).toBeTruthy();
    expect(screen.queryByText('Buy milk')).toBeNull();
  });

  it('toggles a todo as completed', async () => {
    await renderScreen();
    addTodo('Buy milk');
    fireEvent.press(screen.getByRole('checkbox'));
    expect(screen.getByTestId('remaining-count')).toHaveTextContent(
      '0 remaining',
    );
    expect(screen.getByTestId('clear-completed')).toBeTruthy();
  });

  it('deletes a todo after confirming', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    await renderScreen();
    addTodo('Buy milk');
    fireEvent.press(screen.getByText('Delete'));
    expect(alertSpy).toHaveBeenCalled();
    const buttons = alertSpy.mock.calls[0][2]!;
    buttons.find(b => b.text === 'Delete')!.onPress!();
    await waitFor(() => expect(screen.queryByText('Buy milk')).toBeNull());
  });

  it('persists todos to storage', async () => {
    await renderScreen();
    addTodo('Buy milk');
    await waitFor(async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      expect(raw).toContain('Buy milk');
    });
  });

  it('loads saved todos on start', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: 'a', title: 'Saved task', completed: false, createdAt: 1 },
      ]),
    );
    render(<TodoScreen />);
    await waitFor(() => expect(screen.getByText('Saved task')).toBeTruthy());
  });
});
