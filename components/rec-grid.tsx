"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import RecCard from "@/components/rec-card";
import { LayoutGrid, List, Loader } from "lucide-react";
import FilterBar from "@/components/filter-bar";

export default function RecGrid({ genre, mode }: { genre?: string, mode: 'landing' | 'shelf' }) {

    // If we're on the landing page and not filtering, use getLatest
    // Otherwise use getAll to get the whole list so we can filter.
    const isMyRecs = genre === 'My Recs';
    const isStaffPicks = genre === 'Staff Picks';
    const activeGenre = genre || 'All';
    const queryGenre = (activeGenre === 'All' || isMyRecs || isStaffPicks) ? undefined : activeGenre;

    const { results: recsQuery, status, loadMore } = usePaginatedQuery(
        api.recommendations.getAll,
        {
            genre: queryGenre,
            myRecs: isMyRecs ? true : undefined,
            staffPicks: isStaffPicks ? true : undefined,
        },
        { initialNumItems: 50 }
    );

    const currentUser = useQuery(api.users.current);

    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && status === "CanLoadMore") {
                    loadMore(25);
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [status, loadMore]);

    if (status === "LoadingFirstPage" || currentUser === undefined) {
        return (
            <div className={`flex flex-col gap-6 w-full ${mode === 'shelf' ? 'flex-1 overflow-hidden' : ''}`}>
                {mode === 'shelf' && (
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-2 shrink-0 opacity-50 pointer-events-none">
                        <FilterBar activeGenre={genre || 'All'} basePath="/shelf" className="flex-1 w-full" showMyRecs={true} />
                    </div>
                )}
                <div className={`${mode === 'shelf' ? 'flex-1 overflow-y-auto no-scrollbar pb-24' : 'pb-24 w-full'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 w-full">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="aspect-4/5 sm:aspect-2/3 w-full bg-slate-100 rounded-[2px] flex flex-col justify-end p-5 overflow-hidden animate-pulse">
                                <div className="h-6 bg-slate-200/50 w-3/4 rounded-md mb-3"></div>
                                <div className="flex gap-2 mb-4">
                                    <div className="h-4 bg-slate-200/50 w-24 rounded-md"></div>
                                    <div className="h-4 bg-slate-200/50 w-16 rounded-md"></div>
                                </div>
                                <div className="h-3 bg-slate-200/50 w-full rounded-md mb-2"></div>
                                <div className="h-3 bg-slate-200/50 w-full rounded-md mb-2"></div>
                                <div className="h-3 bg-slate-200/50 w-2/3 rounded-md"></div>
                                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200/50">
                                    <div className="w-8 h-8 bg-slate-200/50 rounded-full"></div>
                                    <div className="h-3 bg-slate-200/50 w-20 rounded-md"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    let displayRecs = recsQuery;
    if (mode === 'landing') {
        const activeGenre = genre || 'All';
        if (activeGenre !== 'All' && activeGenre !== 'My Recs' && activeGenre !== 'Staff Picks') {
            displayRecs = displayRecs.filter(r => r.genre === activeGenre);
        }
    }

    if (displayRecs.length === 0) {
        return (
            <div className={`flex flex-col gap-6 w-full ${mode === 'shelf' ? 'flex-1 overflow-hidden' : ''}`}>
                {mode === 'shelf' && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 shrink-0">
                        <FilterBar
                            activeGenre={genre || 'All'}
                            basePath="/shelf"
                            className="flex-1 w-full"
                            showMyRecs={true}
                        />
                    </div>
                )}
                <div className={`col-span-full py-20 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-[32px] border border-slate-200 border-dashed w-full ${mode === 'shelf' ? 'flex-1 overflow-y-auto no-scrollbar max-w-7xl mx-auto' : ''}`}>
                    <span className="text-slate-400 mb-3 text-3xl">🍿</span>
                    <h3 className="text-base font-bold text-slate-800 tracking-tight">Your shelf is empty</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">Start recommending some certified bangers.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-6 w-full ${mode === 'shelf' ? 'flex-1 overflow-hidden' : ''}`}>
            {mode === 'shelf' && (
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-2 shrink-0">
                    <FilterBar
                        activeGenre={genre || 'All'}
                        basePath="/shelf"
                        className="flex-1 w-full"
                        showMyRecs={true}
                    />
                </div>
            )}

            <div className={`${mode === 'shelf' ? 'flex-1 overflow-y-auto no-scrollbar pb-24' : 'pb-24 w-full'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 w-full">
                    {displayRecs.map((rec) => {
                        const formattedRec: any = {
                            ...rec,
                            id: rec._id,
                            createdAt: new Date(rec._creationTime).toISOString(),
                            authorName: rec.userName || "Unknown",
                        };

                        return (
                            <RecCard
                                key={rec._id}
                                rec={formattedRec}
                                currentUser={currentUser}
                            />
                        );
                    })}
                </div>

                {/* Infinite Scroll trigger target */}
                <div ref={loadMoreRef} className="w-full h-20 flex items-center justify-center col-span-full">
                    {status === "LoadingMore" && (
                        <Loader className="w-8 h-8 text-slate-900 animate-spin" />
                    )}
                </div>
            </div>
        </div>
    );
}
