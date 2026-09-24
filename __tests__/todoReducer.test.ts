import { todoReducer } from '../src/todoReducer';
import { Todo } from '../src/types';

const base: Todo[] = [
  { id: '1', title: 'Buy milk', completed: false, createdAt: 1 },
  { id: '2', title: 'Walk dog', completed: true, createdAt: 2 },
];

describe('todoReducer', () => {
  it('adds a trimmed todo at the top', () => {
    const next = todoReducer(base, {
      type: 'ADD',
      id: '3',
      title: '  Read  ',
      now: 3,
    });
    expect(next).toHaveLength(3);
    expect(next[0]).toEqual({
      id: '3',
      title: 'Read',
      completed: false,
      createdAt: 3,
    });
  });

  it('ignores empty titles on add', () => {
    expect(
      todoReducer(base, { type: 'ADD', id: '3', title: '   ', now: 3 }),
    ).toBe(base);
  });

  it('edits a todo title', () => {
    const next = todoReducer(base, {
      type: 'EDIT',
      id: '1',
      title: 'Buy bread',
    });
    expect(next.find(t => t.id === '1')?.title).toBe('Buy bread');
  });

  it('ignores empty titles on edit', () => {
    expect(todoReducer(base, { type: 'EDIT', id: '1', title: '' })).toBe(base);
  });

  it('toggles completion', () => {
    const next = todoReducer(base, { type: 'TOGGLE', id: '1' });
    expect(next.find(t => t.id === '1')?.completed).toBe(true);
    const back = todoReducer(next, { type: 'TOGGLE', id: '1' });
    expect(back.find(t => t.id === '1')?.completed).toBe(false);
  });

  it('deletes a todo', () => {
    const next = todoReducer(base, { type: 'DELETE', id: '1' });
    expect(next.map(t => t.id)).toEqual(['2']);
  });

  it('clears completed todos', () => {
    const next = todoReducer(base, { type: 'CLEAR_COMPLETED' });
    expect(next.map(t => t.id)).toEqual(['1']);
  });

  it('loads a saved list', () => {
    expect(todoReducer([], { type: 'LOAD', todos: base })).toEqual(base);
  });
});
