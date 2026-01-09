'use client';
import React, { useState } from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { AuthContext } from '@/context/AuthContext';
import { User } from '@/app/(main)/types';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Mock user for UI demo
  const [user, setUser] = useState<User | null>({
    _id: 'mock-id',
    name: 'Demo User',
    email: 'demo@example.com',
    picture: 'https://github.com/shadcn.png',
    credits: 1000,
    tier: 'Pro', 
    _creationTime: Date.now()
  } as unknown as User);

  return (
        <AuthContext.Provider value={{ user, setUser }}>
          <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </NextThemesProvider>
        </AuthContext.Provider>
  );
}

export default Provider;
