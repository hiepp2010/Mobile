import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSetIsOpen = (value: boolean) => {
    console.log('Setting sidebar state:', value);
    setIsOpen(value);
  };

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen: handleSetIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

