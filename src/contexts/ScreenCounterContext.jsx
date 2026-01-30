import { createContext, useContext, useState } from 'react';

const ScreenCounterContext = createContext();

export function ScreenCounterProvider({ children }) {
  const [screenNumber, setScreenNumber] = useState(1);

  return (
    <ScreenCounterContext.Provider value={{ screenNumber, setScreenNumber }}>
      {children}
    </ScreenCounterContext.Provider>
  );
}

export function useScreenCounter() {
  const context = useContext(ScreenCounterContext);
  if (!context) {
    throw new Error('useScreenCounter must be used within a ScreenCounterProvider');
  }
  return context;
}
