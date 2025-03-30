'use client';

import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useRouter } from 'next/navigation';

import { useAuthStore } from "@/store/authStore";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { me, state, isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsClient(true);
    me(router);
  }, [me, router, isAuthenticated]);

  // Only show loading state on client-side to prevent hydration mismatch
  if (!isClient) {
    return <>{children}</>;
  }

  const isLoading = state.me.status === "LOADING";

  if (isLoading)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <ClipLoader />
      </div>
    )
  
  return children;
};

export default AuthWrapper;