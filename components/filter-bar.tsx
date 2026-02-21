import Link from 'next/link';
import { MOVIE_GENRES } from '@/lib/constants';

interface FilterBarProps {
    activeGenre: string;
    basePath: string;
    className?: string;
}

export default function FilterBar({ activeGenre, basePath, className = '' }: FilterBarProps) {
    return (
        <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide ${className}`}>
            <Link
                href={basePath}
                scroll={false}
                className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm whitespace-nowrap border transition-colors ${activeGenre === 'All'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
            >
                All Movies
            </Link>
            {MOVIE_GENRES.map((genre) => (
                <Link
                    key={genre}
                    href={`${basePath}?genre=${genre}`}
                    scroll={false}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm whitespace-nowrap border transition-colors ${activeGenre === genre
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                >
                    {genre}
                </Link>
            ))}
        </div>
    );
}
