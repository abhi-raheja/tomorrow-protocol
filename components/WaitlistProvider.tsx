'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { WaitlistModal } from './WaitlistModal';

const WaitlistContext = createContext<{ open: () => void }>({ open: () => {} });

export function useWaitlist() {
  return useContext(WaitlistContext);
}

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <WaitlistContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <WaitlistModal open={isOpen} onClose={() => setIsOpen(false)} />
    </WaitlistContext.Provider>
  );
}
