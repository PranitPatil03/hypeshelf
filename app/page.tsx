import Image from 'next/image';
import Header from '@/components/header';
import Hero from '@/components/hero';
import Link from 'next/link';
import { DUMMY_RECOMMENDATIONS } from '@/lib/dummy-data';
import RecommendationCard from '@/components/recommendation-card';
import { SignedOut } from '@clerk/nextjs';

export default async function Home({ searchParams }: { searchParams: Promise<{ genre?: string }> }) {
  const resolvedParams = await searchParams;
  const activeGenre = resolvedParams.genre || 'All';

  const filteredRecs = activeGenre === 'All'
    ? DUMMY_RECOMMENDATIONS
    : DUMMY_RECOMMENDATIONS.filter(rec => rec.genre === activeGenre);
  return (
    <div className="relative font-sans">
      <div className="relative min-h-screen flex flex-col overflow-hidden">
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

      <section className="relative z-10 w-full bg-white py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center text-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Latest from the Shelf</h2>
            <p className="text-base text-slate-500 max-w-xl">Discover what the community has been loving recently. Check out these popular movie recommendations.</p>

            <SignedOut>
              <Link
                href="/sign-up"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0F172A] px-6 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.1)] border border-slate-800 transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 mt-2"
              >
                Sign in to add yours
              </Link>
            </SignedOut>
          </div>

          <div className="flex items-center justify-start sm:justify-center gap-2 mb-12 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href="/"
              scroll={false}
              className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm whitespace-nowrap border transition-colors ${activeGenre === 'All' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              All Movies
            </Link>
            {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller', 'Romance', 'Documentary'].map((genre) => (
              <Link
                key={genre}
                href={`/?genre=${genre}`}
                scroll={false}
                className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm whitespace-nowrap border transition-colors ${activeGenre === genre ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                {genre}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRecs.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
            {filteredRecs.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
                No recommendations found for this genre.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
