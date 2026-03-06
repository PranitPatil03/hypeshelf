'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function ProfileDropdown() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarUrl = user?.hasImage
    ? user.imageUrl
    : `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.fullName || user?.primaryEmailAddress?.emailAddress || 'user'}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full overflow-hidden border shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-transform active:scale-95 cursor-pointer"
      >
        <img src={avatarUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-sm shadow-xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm shrink-0">
                <img src={avatarUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-slate-900 truncate">
                  {user.fullName || "User"}
                </span>
                <span className="text-xs text-slate-500 truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100" />
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                openUserProfile();
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <img src="/icons/setting.png" alt="" className="w-4 h-4" />
              Manage account
            </button>
            <button
              onClick={async () => {
                setIsSigningOut(true);
                await signOut({ redirectUrl: '/' });
              }}
              disabled={isSigningOut}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningOut ? (
                <Loader className="w-4 h-4 text-slate-500 animate-spin" />
              ) : (
                <img src="/icons/logout.png" alt="" className="w-4 h-4" />
              )}
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
