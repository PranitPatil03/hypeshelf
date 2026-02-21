'use client';

import Image from 'next/image';
import Header from '@/components/header';
import Hero from '@/components/hero';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col font-sans overflow-hidden">
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/bg-image.png"
          alt="Page Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <Header />

      <main className="relative z-10 flex-1 flex flex-col justify-end items-center">
        <Hero />
      </main>
    </div>
  );
}
