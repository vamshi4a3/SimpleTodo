import {Todo} from './types';

export type Action =
  | {type: 'LOAD'; todos: Todo[]}
  | {type: 'ADD'; id: string; title: string; now: number}
  | {type: 'EDIT'; id: string; title: string}
  | {type: 'TOGGLE'; id: string}
  | {type: 'DELETE'; id: string}
  | {type: 'CLEAR_COMPLETED'};

export function todoReducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'LOAD':
      return action.todos;
    case 'ADD': {
      const title = action.title.trim();
      if (!title) {
        return state;
      }
      return [
        {id: action.id, title, completed: false, createdAt: action.now},
        ...state,
      ];
    }
    case 'EDIT': {
      const title = action.title.trim();
      if (!title) {
        return state;
      }
      return state.map(t => (t.id === action.id ? {...t, title} : t));
    }
    case 'TOGGLE':
      return state.map(t =>
        t.id === action.id ? {...t, completed: !t.completed} : t,
      );
    case 'DELETE':
      return state.filter(t => t.id !== action.id);
    case 'CLEAR_COMPLETED':
      return state.filter(t => !t.completed);
    default:
      return state;
  }
}

export const makeId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
