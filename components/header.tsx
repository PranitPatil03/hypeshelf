'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { buttonVariants } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function Header({ transparentOnTop = false }: { transparentOnTop?: boolean }) {
    const [hasPassedHero, setHasPassedHero] = useState(false);

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
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 py-2 transition-colors duration-300",
                isSolid ? "bg-white" : "bg-transparent"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 container max-w-7xl mx-auto w-full">
                <Link href="/" aria-label="hypeshelf Home" className="flex items-center gap-3">
                    <span className="text-2xl font-lora text-slate-900 tracking-tight drop-shadow-sm">hypeshelf</span>
                </Link>

                <div className="flex items-center gap-4">
                    <SignedOut>
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
                        <Link
                            href="/my-recs"
                            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), "font-medium text-slate-800 hover:bg-slate-900/10 hover:text-slate-900")}
                        >
                            My Recs
                        </Link>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </motion.header>
    );
}
