'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AddRecModal } from './add-rec-modal';
import { ProfileDropdown } from './shared/profile-dropdown';

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
                        <Link href="/" aria-label="hypeshelf Home" className="flex items-center gap-1.5">
                            <Image src="/icons/sunflower.png" alt="hypeshelf" width={36} height={36} />
                            <span className="text-2xl font-lora text-slate-900 tracking-tight drop-shadow-sm">hypeshelf</span>
                        </Link>
                    </motion.div>
                ) : (
                    <Link href="/" aria-label="hypeshelf Home" className="flex items-center gap-1.5">
                        <Image src="/icons/sunflower.png" alt="hypeshelf" width={36} height={36} />
                        <span className="text-2xl font-lora text-slate-900 tracking-tight drop-shadow-sm">hypeshelf</span>
                    </Link>
                )}

                <div className="flex items-center gap-3 md:hidden">
                    <SignedOut>
                        {isSolid && (
                            <Link
                                href="/sign-up"
                                className="text-white font-medium text-sm rounded-xl transition-all duration-200 bg-linear-to-b from-slate-700 to-slate-900 border border-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_15px_rgba(15,23,42,0.5)] -translate-y-0.5 hover:scale-105 active:scale-100 inline-flex h-9 px-4 items-center justify-center"
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
                            className="text-white font-medium text-sm rounded-xl transition-all duration-200 cursor-pointer bg-linear-to-b from-slate-700 to-slate-900 border border-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_10px_rgba(15,23,42,0.4)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_15px_rgba(15,23,42,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_5px_rgba(15,23,42,0.4)] inline-flex h-9 px-4 items-center justify-center"
                        >
                            + add your recs
                        </button>
                        <ProfileDropdown />
                    </SignedIn>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <SignedOut>
                        <Link
                            href="/sign-in"
                            className="font-medium text-slate-900 hover:text-slate-700 text-sm underline underline-offset-4 transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/sign-up"
                            className="font-medium text-slate-900 hover:text-slate-700 text-sm underline underline-offset-4 transition-colors"
                        >
                            Sign up
                        </Link>
                        {isSolid && (
                            <Link
                                href="/sign-up"
                                className="text-white font-medium text-sm rounded-xl transition-all duration-200 cursor-pointer bg-linear-to-b from-slate-700 to-slate-900 border border-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_15px_rgba(15,23,42,0.5)] -translate-y-0.5 hover:scale-105 active:scale-100 inline-flex h-9 px-4 items-center justify-center ml-1"
                            >
                                + add your recs
                            </Link>
                        )}
                    </SignedOut>
                    <SignedIn>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="text-white font-medium text-sm rounded-xl transition-all duration-200 cursor-pointer bg-linear-to-b from-slate-700 to-slate-900 border border-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_15px_rgba(15,23,42,0.5)] -translate-y-0.5 hover:scale-105 active:scale-100 inline-flex h-9 px-4 items-center justify-center"
                        >
                            + add your recs
                        </button>
                        <ProfileDropdown />
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
                    <div className="flex items-center gap-1.5">
                        <Image src="/icons/sunflower.png" alt="hypeshelf" width={36} height={36} />
                        <span className="text-2xl font-lora text-slate-900 tracking-tight drop-shadow-sm">hypeshelf</span>
                    </div>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-2 p-5 flex-1">
                    <a
                        href="https://github.com/PranitPatil03/hypeshelf/tree/main/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors underline underline-offset-4"
                    >
                        Docs
                    </a>
                    <SignedOut>
                        <Link
                            href="/sign-in"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors underline underline-offset-4"
                        >
                            Login
                        </Link>
                        <Link
                            href="/sign-up"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors underline underline-offset-4"
                        >
                            Sign up
                        </Link>
                        <Link
                            href="/sign-up"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 bg-linear-to-b from-slate-700 to-slate-900 border border-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_15px_rgba(15,23,42,0.5)] mt-2"
                        >
                            + add your recs
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <button
                            onClick={() => { setIsAddModalOpen(true); setIsMenuOpen(false); }}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 text-left cursor-pointer bg-linear-to-b from-slate-700 to-slate-900 border border-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_15px_rgba(15,23,42,0.5)]"
                        >
                            + add your recs
                        </button>
                        <div className="px-4 py-3">
                            <ProfileDropdown />
                        </div>
                    </SignedIn>
                </div>
            </div>

            <AddRecModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </header>
    );
}
