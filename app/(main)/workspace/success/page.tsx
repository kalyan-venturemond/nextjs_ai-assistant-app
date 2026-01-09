'use client';

import { useContext, useEffect, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { toast } from 'sonner';

function SuccessPageContent() {
  const router = useRouter();
  const { user, setUser } = useContext(AuthContext);
  // Mock data for UI demo - no backend calls
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simulate payment verification delay
    const timer = setTimeout(() => {
      if (user) {
        setUser({
          ...user,
          credits: (user.credits || 0) + 10000,
        });
        toast.success('Payment successful! Your credits have been updated (Mock).');
      }
      setIsChecking(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [user, setUser]);

  useEffect(() => {
    if (!isChecking) {
      // Redirect back to workspace after checking is complete
      const timer = setTimeout(() => {
        router.push('/workspace');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isChecking, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your credits have been updated.
        </p>
        {isChecking && (
          <p className="text-sm text-gray-500 mb-4">
            Verifying your payment...
          </p>
        )}
        <p className="text-sm text-gray-500">
          Redirecting you back to the workspace...
        </p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Payment...</h1>
        <p className="text-gray-600 mb-4">
          Please wait while we verify your payment.
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessPageContent />
    </Suspense>
  );
}
