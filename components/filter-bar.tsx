'use client';

import Link from 'next/link';
import { MOVIE_GENRES, type MovieGenre } from '@/lib/constants';

const GENRE_ICONS: Record<MovieGenre, string> = {
    Action: '/icons/action.png',
    Comedy: '/icons/comedy.png',
    Drama: '/icons/darma.png',
    'Sci-Fi': '/icons/alien.png',
    Horror: '/icons/ghost.png',
    Thriller: '/icons/thriller.png',
    Romance: '/icons/heart.png',
};

const GENRE_HOVER_ANIM: Record<MovieGenre, string> = {
    Action: 'group-hover:scale-125',
    Comedy: 'group-hover:scale-125',
    Drama: 'group-hover:scale-125',
    'Sci-Fi': 'group-hover:scale-125',
    Horror: 'group-hover:scale-125',
    Thriller: 'group-hover:scale-125',
    Romance: 'group-hover:scale-125',
};

interface FilterBarProps {
    activeGenre: string;
    basePath: string;
    className?: string;
    showMyRecs?: boolean;
}

export default function FilterBar({ activeGenre, basePath, className = '', showMyRecs = false }: FilterBarProps) {

    return (
        <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide ${className}`}>
            <Link
                href={basePath}
                scroll={false}
                className={`group flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-normal shadow-sm whitespace-nowrap border border-slate-100 transition-colors ${activeGenre === 'All'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
            >
                <img src="/icons/fire.png" alt="All" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-125" />
                All Movies
            </Link>
            {showMyRecs && (
                <Link
                    href={`${basePath}?genre=My Recs`}
                    scroll={false}
                    className={`group flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-normal shadow-sm whitespace-nowrap border border-slate-100 transition-colors ${activeGenre === 'My Recs'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    <img src="/icons/bookmark.png" alt="My Recs" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-125" />
                    My Recs
                </Link>
            )}
            <Link
                href={`${basePath}?genre=Staff Picks`}
                scroll={false}
                className={`group flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-normal shadow-sm whitespace-nowrap border border-slate-100 transition-colors ${activeGenre === 'Staff Picks'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
            >
                <img src="/icons/badge.png" alt="Staff Picks" className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-125" />
                Staff Picks
            </Link>
            {MOVIE_GENRES.map((genre) => {
                const iconSrc = GENRE_ICONS[genre];
                const hoverAnim = GENRE_HOVER_ANIM[genre];
                return (
                    <Link
                        key={genre}
                        href={`${basePath}?genre=${genre}`}
                        scroll={false}
                        className={`group flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-normal shadow-sm whitespace-nowrap border border-slate-100 transition-colors ${activeGenre === genre
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <img src={iconSrc} alt={genre} className={`w-3.5 h-3.5 transition-transform duration-300 ${hoverAnim}`} />
                        {genre}
                    </Link>
                );
            })}
        </div>
    );
}
