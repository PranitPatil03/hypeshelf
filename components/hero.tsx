'use client';

import { motion, type MotionProps } from 'motion/react';

const EASE_OUT: [number, number, number, number] = [0.32, 0.72, 0, 1];

const fadeInUpVariant: MotionProps = {
    initial: { opacity: 0, y: 10, filter: 'blur(6px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '0px' },
};

const getTransition = (delay: number) => ({
    duration: 0.5,
    ease: EASE_OUT,
    delay,
});

const HeroContent = () => (
    <div className='flex flex-col items-center text-center max-w-3xl'>
        <motion.h2
            className='text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-4 sm:mb-6 font-medium text-slate-900 drop-shadow-sm'
            {...fadeInUpVariant}
            transition={getTransition(0.2)}
        >
            Good taste deserves<br />
            a better home.
        </motion.h2>
        <motion.p
            className='text-slate-800 text-lg mb-8 sm:mb-10 leading-snug font-medium text-pretty max-w-xl drop-shadow-sm'
            {...fadeInUpVariant}
            transition={getTransition(0.3)}
        >
            Collect and share the movies you're hyped about.
            Drop your favorites and discover what others love.
        </motion.p>
    </div>
);

const Hero = () => (
    <section className='w-full px-4 sm:px-6 flex justify-center items-end pb-12 pt-40'>
        <div className='flex flex-col items-center gap-6 sm:gap-10 w-full max-w-7xl mx-auto'>
            <HeroContent />
        </div>
    </section>
);

export default Hero;
