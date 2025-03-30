'use client';

import React from 'react';
import { ArrowUpCircleIcon } from 'lucide-react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="grid min-h-svh lg:grid-cols-2">
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <a href="#" className="flex items-center">
            <ArrowUpCircleIcon className="h-5 w-5" />
            <span className="ml-2 text-base font-semibold">Spotter Dashboard</span>
        </a>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          {/* <LoginForm /> */}
          { children }
        </div>
      </div>
    </div>
    <div className="relative hidden bg-muted lg:block">
      <img
        src="/auth.jpg"
        alt="Image"
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </main>
);

export default AuthLayout;