import React, { useContext, useEffect, useState } from 'react';

import Image from 'next/image';

import { WalletCardsIcon, Loader2Icon } from 'lucide-react';

import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { AuthContext } from '@/context/AuthContext';

const PRO_PLAN_CREDITS = 10000;
const FREE_PLAN_CREDITS = 5000;

function UserProfile({
  openUserProfile,
  setOpenUserProfile,
}: {
  openUserProfile: boolean;
  setOpenUserProfile: (open: boolean) => void;
}) {
  const { user, setUser } = useContext(AuthContext);

  const userCredits = (user?.credits ?? 0) >= 0 ? (user?.credits ?? 0) : 0;

  const [userMaxToken, setUserMaxToken] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    setUserMaxToken(user?.orderId ? PRO_PLAN_CREDITS : FREE_PLAN_CREDITS);
  }, [user?.orderId]);

  const createCheckoutSession = async () => {
    if (!user) return;

    setIsLoading(true);
    
    // Mock checkout redirection
    setTimeout(() => {
        setIsLoading(false);
        // Redirect to success page directly for demo
        window.location.href = `${window.location.origin}/workspace/success`;
    }, 1000);
  };

  const cancelSubscription = async () => {
    if (!user) return;

    setIsCanceling(true);
    
    // Mock cancellation
    setTimeout(() => {
        setUser({
          ...user,
          orderId: undefined,
        });

        toast.success(
            'Subscription has been canceled (Mock)'
        );
        setIsCanceling(false);
    }, 1000);
  };

  return (
    <Dialog open={openUserProfile} onOpenChange={setOpenUserProfile}>
      <DialogContent>
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex gap-4 items-center">
            <Image
              src={user?.picture ?? ''}
              alt="user"
              width={60}
              height={60}
              className="w-[60px] h-[60px] rounded-full"
            />
            <div>
              <div className="font-bold text-lg">{user?.name}</div>
              <div className="text-gray-500">{user?.email}</div>
            </div>
          </div>

          <hr className="my-5"></hr>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <p className="font-bold">Token Usage</p>
              <p>
                {userCredits}/{userMaxToken}
              </p>
              <Progress value={(userCredits / userMaxToken) * 100} />
            </div>

            <div className="flex justify-between">
              <p className="font-semibold text-lg">Current Plan</p>
              <span className="p-1 bg-gray-100 rounded-md px-2 font-normal">
                {!user?.orderId ? 'Free Plan' : 'Pro Plan'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-3">
            {!user?.orderId ? (
              <div className="p-4 border rounded-xl mt-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-lg">Pro Plan</p>
                    <p>10,000 Tokens</p>
                  </div>
                  <p className="font-bold text-lg flex items-center justify-center">
                    $10/month
                  </p>
                </div>
                <hr className="my-3" />
                <Button
                  className="w-full"
                  disabled={isLoading}
                  onClick={createCheckoutSession}
                >
                  {isLoading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <WalletCardsIcon />
                  )}
                  Upgrade Plan
                </Button>
              </div>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="mt-4 w-full"
                    variant="secondary"
                    disabled={isCanceling}
                  >
                    {isCanceling ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      'Cancel Subscription'
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel your subscription? You'll
                      continue to have access to your Pro Plan features until
                      the end of your current billing period. After that, you'll
                      be downgraded to the Free Plan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction onClick={cancelSubscription}>
                      Cancel Subscription
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserProfile;
