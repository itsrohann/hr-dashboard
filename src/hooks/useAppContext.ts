import { useContext } from 'react';
import { AppContext } from '../app/context/AppContext';

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
