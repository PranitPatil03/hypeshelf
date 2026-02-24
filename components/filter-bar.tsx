'use client';

import Link from 'next/link';
import { MOVIE_GENRES } from '@/lib/constants';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface FilterBarProps {
    activeGenre: string;
    basePath: string;
    className?: string;
    showMyRecs?: boolean;
}

export default function FilterBar({ activeGenre, basePath, className = '', showMyRecs = false }: FilterBarProps) {
    const currentUser = useQuery(api.users.current);
    const isAdmin = currentUser?.role === 'admin';

    return (
        <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide ${className}`}>
            <Link
                href={basePath}
                scroll={false}
                className={`px-4 py-1.5 rounded text-sm font-normal shadow-sm whitespace-nowrap border border-slate-100 transition-colors ${activeGenre === 'All'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
            >
                All Movies
            </Link>
            {showMyRecs && (
                <Link
                    href={`${basePath}?genre=My Recs`}
                    scroll={false}
                    className={`px-4 py-1.5 rounded text-sm font-normal shadow-sm whitespace-nowrap border border-slate-100 transition-colors ${activeGenre === 'My Recs'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    My Recs
                </Link>
            )}
            {isAdmin && (
                <Link
                    href={`${basePath}?genre=Staff Picks`}
                    scroll={false}
                    className={`px-4 py-1.5 rounded text-sm font-normal shadow-sm whitespace-nowrap border border-slate-100 transition-colors ${activeGenre === 'Staff Picks'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    Staff Picks
                </Link>
            )}
            {MOVIE_GENRES.map((genre) => (
                <Link
                    key={genre}
                    href={`${basePath}?genre=${genre}`}
                    scroll={false}
                    className={`px-4 py-1.5 rounded text-sm font-normal shadow-sm whitespace-nowrap border border-slate-100 transition-colors ${activeGenre === genre
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    {genre}
                </Link>
            ))}
        </div>
    );
}
