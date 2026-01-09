'use client';

import React, { useContext, useEffect, useState } from 'react';

import Header from '@/app/(main)/_components/Header';
import { AssistantContext } from '@/context/AssistantContext';
import type { AiAssistant } from '@/app/(main)/types';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [assistant, setAssistant] = useState<AiAssistant | null>(null);

  // Auth check bypassed for Demo UI
  
  return (
    <div>
      <AssistantContext.Provider value={{ assistant, setAssistant }}>
        <Header />
        {children}
      </AssistantContext.Provider>
    </div>
  );
}

export default Provider;
