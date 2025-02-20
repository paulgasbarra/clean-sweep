
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '../lib/firebaseConfig';
import { logout } from '../lib/auth';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Clean Sweep
        </Link>
        <div className="space-x-4 gap-x-8">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/report" 
                className={`hover:text-blue-200 ${isActive('/report') ? 'text-blue-200' : ''}`}
              >
                Report Site
              </Link>
              <Link 
                href="/dashboard" 
                className={`hover:text-blue-200 ${isActive('/dashboard') ? 'text-blue-200' : ''}`}
              >
                Browse Sites
              </Link>
              <Link 
                href="/profile" 
                className={`hover:text-blue-200 ${isActive('/profile') ? 'text-blue-200' : ''}`}
              >
                Profile
              </Link>
              <button 
                onClick={() => logout()}
                className="hover:text-blue-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/auth" 
              className={`hover:text-blue-200 ${isActive('/auth') ? 'text-blue-200' : ''}`}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
