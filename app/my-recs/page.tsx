import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Header from '@/components/header';
import { DUMMY_RECOMMENDATIONS } from '@/lib/dummy-data';
import RecCard from '@/components/rec-card';
import Link from 'next/link';
import FilterBar from '@/components/filter-bar';

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
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 pt-28">
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
                        Add Rec
                    </button>
                </div>

                <FilterBar
                    activeGenre={activeGenre}
                    basePath="/my-recs"
                    className="mb-8"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRecs.map((rec) => (
                        <RecCard key={rec.id} rec={rec} />
                    ))}
                    {filteredRecs.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
                            No recs found for this genre.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
