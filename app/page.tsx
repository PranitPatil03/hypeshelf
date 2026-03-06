import Image from 'next/image';
import Header from '@/components/header';
import Hero from '@/components/hero';
import FilterBar from '@/components/filter-bar';
import RecGrid from '@/components/rec-grid';

import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home({ searchParams }: { searchParams: Promise<{ genre?: string }> }) {
  const user = await currentUser();
  if (user) {
    redirect('/shelf');
  }

  const resolvedParams = await searchParams;
  const activeGenre = resolvedParams.genre || 'All';

  return (
    <div className="relative font-sans">
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/images/bg-banners/bg-image-white.png"
            alt="Page Background"
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        <Header transparentOnTop={true} />

        <main className="relative z-10 flex-1 flex flex-col justify-center items-center">
          <Hero />
        </main>
      </div>

      <section className="relative z-10 w-full bg-white py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center text-center mb-4 gap-4">
            <h2 className="md:text-5xl text-4xl font-medium text-slate-900 tracking-tight">Latest from the Shelf</h2>
            <p className="text-base md:text-lg text-slate-700 max-w-xl">Discover what the community has been loving recently. <br className='hidden md:block' /> Check out these popular movie recs.</p>
          </div>
        </div>

        <div className="sticky top-17 z-40 bg-white py-4 mb-8 w-full border-b border-transparent">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
            <FilterBar
              activeGenre={activeGenre}
              basePath="/"
              className="justify-start sm:justify-center"
            />
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <RecGrid genre={activeGenre} mode="landing" />
        </div>
      </section>
    </div>
  );
}
