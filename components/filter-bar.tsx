'use client';

import Link from 'next/link';
import { MOVIE_GENRES, type MovieGenre } from '@/lib/constants';
import {
    Film,
    Bookmark,
    Award,
    Swords,
    Laugh,
    Drama,
    Rocket,
    Skull,
    ShieldAlert,
    Heart,
    type LucideIcon,
} from 'lucide-react';

const GENRE_ICONS: Record<MovieGenre, LucideIcon> = {
    Action: Swords,
    Comedy: Laugh,
    Drama: Drama,
    'Sci-Fi': Rocket,
    Horror: Skull,
    Thriller: ShieldAlert,
    Romance: Heart,
};

const GENRE_HOVER_ANIM: Record<MovieGenre, string> = {
    Action: 'group-hover:-rotate-45',
    Comedy: 'group-hover:scale-125',
    Drama: 'group-hover:-translate-y-0.5',
    'Sci-Fi': 'group-hover:-translate-y-1 group-hover:rotate-12',
    Horror: 'group-hover:animate-pulse',
    Thriller: 'group-hover:scale-110 group-hover:rotate-6',
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
                <Film className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" />
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
                    <Bookmark className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
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
                <Award className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                Staff Picks
            </Link>
            {MOVIE_GENRES.map((genre) => {
                const Icon = GENRE_ICONS[genre];
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
                        <Icon className={`w-3.5 h-3.5 transition-transform duration-300 ${hoverAnim}`} />
                        {genre}
                    </Link>
                );
            })}
        </div>
    );
}
