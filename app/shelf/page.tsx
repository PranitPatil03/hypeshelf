import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Header from '@/components/header';
import RecGrid from '@/components/rec-grid';
import FilterBar from '@/components/filter-bar';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ genre?: string; tab?: string }> }) {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    const resolvedParams = await searchParams;
    const activeGenre = resolvedParams.genre || 'All';

    return (
        <div className="h-screen bg-white relative selection:bg-slate-200 flex flex-col overflow-hidden">
            <Header transparentOnTop={false} />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-0 w-full flex flex-col overflow-hidden">
                <div className="w-full shrink-0 flex flex-col gap-3 sm:gap-4 mb-2 pb-2">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="text-center sm:text-left">
                            <h1 className="text-xl sm:text-2xl font-light text-slate-900">
                                Discover the best movies recommended by the community.
                            </h1>
                        </div>
                    </div>

                    <div className="w-full">
                        <FilterBar activeGenre={activeGenre} basePath="/shelf" className="flex-1 w-full" showMyRecs={true} />
                    </div>
                </div>

                <div className="flex-1 w-full overflow-hidden pb-4 flex flex-col">
                    <RecGrid genre={activeGenre} mode="shelf" />
                </div>
            </main>
        </div>
    );
}
