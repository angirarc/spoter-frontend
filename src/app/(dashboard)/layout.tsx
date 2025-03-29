'use client';

import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

import AppSidebar from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { useAuthStore } from "@/store/authStore";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);
  const { state } = useAuthStore();
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }
  
  const isNotReady = state.me.status === "ERROR" || state.me.status === "INITIAL" || state.me.status === "LOADING";

  if (isNotReady)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <ClipLoader />
      </div>
    )

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default AppLayout;