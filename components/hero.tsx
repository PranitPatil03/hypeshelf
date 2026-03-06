'use client';

import { motion, type MotionProps } from 'motion/react';
import Link from 'next/link';

const EASE_OUT: [number, number, number, number] = [0.32, 0.72, 0, 1];

const fadeInVariant: MotionProps = {
    initial: { opacity: 0, filter: 'blur(6px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
};

const getTransition = (delay: number) => ({
    duration: 0.5,
    ease: EASE_OUT,
    delay,
});

const HeroContent = () => (
    <div className='flex flex-col items-center text-center max-w-3xl'>
        <motion.h2
            className='text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-4 sm:mb-6 font-normal text-slate-900 drop-shadow-sm'
            {...fadeInVariant}
            transition={getTransition(0.2)}
        >
            Good taste deserves<br />
            a better home.
        </motion.h2>
        <motion.p
            className='text-slate-800 text-sm md:text-lg mb-5 leading-snug font-medium text-pretty max-w-sm md:max-w-xl drop-shadow-sm'
            {...fadeInVariant}
            transition={getTransition(0.3)}
        >
            Collect and share the movies you're hyped about.
            Drop your favorites and discover what others love.
        </motion.p>
        <motion.div
            {...fadeInVariant}
            transition={getTransition(0.4)}
        >
            <Link
                href="/sign-up"
                className="cursor-pointer w-full text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-linear-to-b from-slate-700 to-slate-900 border border-slate-900 shadow-[0_4px_10px_rgba(15,23,42,0.4)] inline-flex h-11 px-8 items-center justify-center"
            >
                sign up to add yours
            </Link>
        </motion.div>
    </div>
);

const Hero = () => (
    <section className='w-full px-4 sm:px-6 flex justify-center items-center py-8'>
        <div className='flex flex-col items-center gap-6 sm:gap-10 w-full max-w-7xl mx-auto'>
            <HeroContent />
        </div>
    </section>
);

export default Hero;
