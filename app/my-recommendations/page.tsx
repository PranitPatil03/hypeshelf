import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Header from '@/components/header';
import { DUMMY_RECOMMENDATIONS } from '@/lib/dummy-data';
import RecommendationCard from '@/components/recommendation-card';
import Link from 'next/link';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ genre?: string }> }) {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    const resolvedParams = await searchParams;
    const activeGenre = resolvedParams.genre || 'All';

    const filteredRecs = activeGenre === 'All'
        ? DUMMY_RECOMMENDATIONS
        : DUMMY_RECOMMENDATIONS.filter(rec => rec.genre === activeGenre);

    return (
        <div className="min-h-screen bg-slate-50 relative selection:bg-slate-200">
            {/* Darker aesthetic header for app shell vs landing page */}
            <header className="border-b bg-white border-slate-200 sticky top-0 z-40">
                <Header />
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Your Shelf
                        </h1>
                        <p className="text-slate-500 mt-2">
                            Manage and share your favorite movies.
                        </p>
                    </div>

                    <button className="h-10 px-4 flex items-center justify-center rounded-lg bg-[#0F172A] text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.1)] border border-slate-800 transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 cursor-pointer">
                        Add Recommendation
                    </button>
                </div>

                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    <Link
                        href="/my-recommendations"
                        scroll={false}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm whitespace-nowrap border transition-colors ${activeGenre === 'All' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                        All Movies
                    </Link>
                    {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller', 'Romance', 'Documentary'].map((genre) => (
                        <Link
                            key={genre}
                            href={`/my-recommendations?genre=${genre}`}
                            scroll={false}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm whitespace-nowrap border transition-colors ${activeGenre === genre ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                            {genre}
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRecs.map((rec) => (
                        <RecommendationCard key={rec.id} rec={rec} />
                    ))}
                    {filteredRecs.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
                            No recommendations found for this genre.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
