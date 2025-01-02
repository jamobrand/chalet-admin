import React from 'react';
import { User } from '../types';

interface AppState {
  userInfo: User | null;
}

type Action = { type: 'USER_SIGNIN'; payload: User } | { type: 'USER_SIGNOUT' };

const initialState: AppState = {
  userInfo: null,
};

function initializeState(): AppState {
  const storedUserInfo = localStorage.getItem('chaletInfo');
  return {
    userInfo: storedUserInfo ? JSON.parse(storedUserInfo) : null,
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return { ...state, userInfo: null };
    default:
      return state;
  }
}

export const StoreContext = React.createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export function StoreProvider({ children }: React.PropsWithChildren<object>) {
  const [state, dispatch] = React.useReducer(reducer, initialState, initializeState);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}
