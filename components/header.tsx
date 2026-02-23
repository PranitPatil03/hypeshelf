'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/nextjs';
import { buttonVariants } from '@/components/ui/button';
import { LogOut, Settings, User, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { AddRecModal } from './add-rec-modal';

function CustomProfileDropdown() {
    const { user } = useUser();
    const { signOut, openUserProfile } = useClerk();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
                <img src={user.imageUrl} alt={user.fullName || "User"} className="w-full h-full object-cover" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
                    <div className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm shrink-0">
                                <img src={user.imageUrl} alt={user.fullName || "User"} className="w-full h-full object-cover" />
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
                    <div className="p-2">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                openUserProfile();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <Settings className="w-4 h-4 text-slate-500" />
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
                                <LogOut className="w-4 h-4 text-slate-500" />
                            )}
                            {isSigningOut ? 'Signing out...' : 'Sign out'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Header({ transparentOnTop = false }: { transparentOnTop?: boolean }) {
    const [hasPassedHero, setHasPassedHero] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        if (!transparentOnTop) return;

        const handleScroll = () => {
            setHasPassedHero(window.scrollY > window.innerHeight - 100);
        };
        window.addEventListener('scroll', handleScroll);
        // check immediately
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [transparentOnTop]);

    const isSolid = !transparentOnTop || hasPassedHero;

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 py-2 transition-all duration-300",
                isSolid ? "bg-white backdrop-blur-md" : "bg-transparent"
            )}
        >
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 container max-w-7xl mx-auto w-full">
                <Link href="/" aria-label="hypeshelf Home" className="flex items-center gap-3">
                    <span className="text-2xl font-lora text-slate-900 tracking-tight drop-shadow-sm">hypeshelf</span>
                </Link>

                <div className="flex items-center gap-4">
                    <SignedOut>
                        {isSolid && (
                            <Link
                                href="/sign-up"
                                className="font-medium text-slate-900 hover:text-slate-700 text-sm underline underline-offset-4 transition-colors cursor-pointer"
                            >
                                + add your recs
                            </Link>
                        )}
                        <Link
                            href="/sign-in"
                            className="font-medium text-slate-900 hover:text-slate-700 text-sm underline underline-offset-4 transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/sign-up"
                            className={cn(buttonVariants({ size: 'sm' }), 'group rounded-full overflow-hidden shadow-md')}
                        >
                            Sign up
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="font-medium text-slate-900 hover:text-slate-700 text-sm underline underline-offset-4 transition-colors cursor-pointer"
                        >
                            + add your recs
                        </button>
                        <CustomProfileDropdown />
                    </SignedIn>
                </div>
            </div>

            <AddRecModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </header>
    );
}
