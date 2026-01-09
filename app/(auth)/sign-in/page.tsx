'use client';

import React, { useContext } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { AuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { User } from '@/app/(main)/types';


function SignIn() {
  const { setUser } = useContext(AuthContext);
  const router = useRouter();

  const handleDemoLogin = () => {
      const mockUser = {
        _id: 'mock-id',
        name: 'Demo User',
        email: 'demo@example.com',
        picture: 'https://github.com/shadcn.png',
        credits: 1000,
        tier: 'Pro', 
        _creationTime: Date.now()
      } as unknown as User;

      setUser(mockUser);
      router.replace('/assistants');
  };

  return (
    <div className="flex items-center flex-col justify-center h-screen px-5">
      <div className="flex flex-col items-center gap-5 border rounded-2xl p-10 shadow-md w-full md:w-[400px]">
        <Image src={'/logo.svg'} alt="App Logo" width={50} height={50} />
        <h2 className="text-2xl">Sign In</h2>

        <Button
          onClick={handleDemoLogin}
          className="flex items-center gap-2"
        >
          Sign in as Demo User
        </Button>
      </div>
    </div>
  );
}

export default SignIn;
