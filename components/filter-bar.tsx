'use client';

import Link from 'next/link';
import Image from 'next/image';
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
                <Image src="/icons/fire.png" alt="All" width={14} height={14} className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-125" />
                All Movies
            </Link>
            {showMyRecs && (
                <Link
                    href={`${basePath}?genre=${encodeURIComponent('My Recs')}`}
                    scroll={false}
                    className={`group flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-normal shadow-sm whitespace-nowrap border border-slate-100 transition-colors ${activeGenre === 'My Recs'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    <Image src="/icons/bookmark.png" alt="My Recs" width={14} height={14} className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-125" />
                    My Recs
                </Link>
            )}
            <Link
                href={`${basePath}?genre=${encodeURIComponent('Staff Picks')}`}
                scroll={false}
                className={`group flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-normal shadow-sm whitespace-nowrap border border-slate-100 transition-colors ${activeGenre === 'Staff Picks'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
            >
                <Image src="/icons/badge.png" alt="Staff Picks" width={14} height={14} className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-125" />
                Staff Picks
            </Link>
            {MOVIE_GENRES.map((genre) => {
                const iconSrc = GENRE_ICONS[genre];
                return (
                    <Link
                        key={genre}
                        href={`${basePath}?genre=${encodeURIComponent(genre)}`}
                        scroll={false}
                        className={`group flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-normal shadow-sm whitespace-nowrap border border-slate-100 transition-colors ${activeGenre === genre
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Image src={iconSrc} alt={genre} width={14} height={14} className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-125" />
                        {genre}
                    </Link>
                );
            })}
        </div>
    );
}
