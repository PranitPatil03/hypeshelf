'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/nextjs';
import { buttonVariants } from '@/components/ui/button';
import { LogOut, Settings, User, Loader, Menu, X } from 'lucide-react';
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (!transparentOnTop) return;

        const handleScroll = () => {
            const isMobile = window.innerWidth < 768;
            const threshold = isMobile ? 220 : window.innerHeight - 100;
            setHasPassedHero(window.scrollY > threshold);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [transparentOnTop]);

    const isSolid = !transparentOnTop || hasPassedHero;

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 py-2 transition-all duration-300",
                isSolid ? "bg-white" : "bg-transparent"
            )}
        >
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 container max-w-7xl mx-auto w-full">
                {transparentOnTop ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
                    >
                        <Link href="/" aria-label="hypeshelf Home" className="flex items-center gap-3">
                            <span className="text-2xl font-lora text-slate-900 tracking-tight drop-shadow-sm">hypeshelf</span>
                        </Link>
                    </motion.div>
                ) : (
                    <Link href="/" aria-label="hypeshelf Home" className="flex items-center gap-3">
                        <span className="text-2xl font-lora text-slate-900 tracking-tight drop-shadow-sm">hypeshelf</span>
                    </Link>
                )}

                <div className="flex items-center gap-3 md:hidden">
                    <SignedOut>
                        {isSolid && (
                            <Link
                                href="/sign-up"
                                className="font-medium text-slate-900 hover:text-slate-700 text-sm underline underline-offset-4 transition-colors"
                            >
                                + add your recs
                            </Link>
                        )}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-slate-900 hover:bg-slate-200 cursor-pointer"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
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

                <div className="hidden md:flex items-center gap-4">
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

            <div
                className={cn(
                    "fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300",
                    isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsMenuOpen(false)}
            />
            <div
                className={cn(
                    "fixed top-0 left-0 h-full w-72 bg-slate-50 z-50 md:hidden shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
                    <span className="text-2xl font-lora text-slate-900 tracking-tight drop-shadow-sm">hypeshelf</span>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-2 p-5 flex-1">
                    <SignedOut>
                        <Link
                            href="/sign-up"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors underline underline-offset-4"
                        >
                            + add your recs
                        </Link>
                        <Link
                            href="/sign-in"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors underline underline-offset-4"
                        >
                            login
                        </Link>
                        <Link
                            href="/sign-up"
                            onClick={() => setIsMenuOpen(false)}
                            className={cn(
                                buttonVariants({ size: 'sm' }),
                                'justify-center rounded-full shadow-md mt-2'
                            )}
                        >
                            Sign up
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <button
                            onClick={() => { setIsAddModalOpen(true); setIsMenuOpen(false); }}
                            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer underline underline-offset-4"
                        >
                            + add your recs
                        </button>
                        <div className="px-4 py-3">
                            <CustomProfileDropdown />
                        </div>
                    </SignedIn>
                </div>
            </div>

            <AddRecModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </header>
    );
}
