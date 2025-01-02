import React from 'react';
import { StoreContext } from './store';

export function useStore() {
  const context = React.useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
