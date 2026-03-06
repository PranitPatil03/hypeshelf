'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { searchMovies } from '@/app/actions/tmdb';

export type MovieResult = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  genre: string;
};

interface MovieSearchProps {
  onSelect: (movie: MovieResult) => void;
}

export function MovieSearch({ onSelect }: MovieSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<MovieResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(false);
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchMovies(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleManualAdd = () => {
    onSelect({
      id: Date.now(),
      title: searchQuery,
      release_date: '',
      poster_path: null,
      genre: 'Other',
    });
  };

  return (
    <div className="space-y-3">
      <motion.div className="relative border rounded-md transition-shadow duration-300 shadow-sm" layout>
        <motion.div
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          animate={{ scale: isSearchFocused ? 1.1 : 1, color: isSearchFocused ? '#334155' : '#94a3b8' }}
          transition={{ duration: 0.2 }}
        >
          <Search className="h-4 w-4" />
        </motion.div>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="w-full pl-10 pr-10 h-10 text-sm bg-transparent rounded-xl outline-none placeholder:text-slate-400 border-none"
        />
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2"
            >
              <Loader className="h-4 w-4 text-slate-500 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl overflow-hidden"
          >
            <div className="max-h-65 overflow-y-auto divide-y divide-slate-100">
              {searchResults.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  onClick={() => onSelect(movie)}
                  className="flex items-center gap-3.5 px-3.5 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors duration-150 group"
                >
                  <div className="relative w-10 h-14 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-[9px] font-bold text-center leading-tight p-1">
                        No Poster
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 group-hover:text-slate-700 transition-colors truncate">{movie.title}</h4>
                    <span className="text-xs text-slate-400 font-medium">
                      {movie.release_date?.substring(0, 4) || 'Unknown'} · {movie.genre}
                    </span>
                  </div>
                </motion.div>
              ))}

              {!isSearching && (
                <div
                  onClick={handleManualAdd}
                  className="flex items-center gap-3.5 px-3.5 py-3 hover:bg-slate-50 cursor-pointer transition-colors duration-150 text-slate-400 hover:text-slate-600"
                >
                  <div className="w-10 h-10 rounded-lg border border-dashed border-slate-200 flex items-center justify-center shrink-0">
                    <span className="text-lg leading-none">+</span>
                  </div>
                  <span className="text-sm font-medium">Can&apos;t find the right one? Add manually</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchQuery.length > 2 && !isSearching && hasSearched && searchResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            onClick={handleManualAdd}
            className="flex items-center gap-3.5 px-3.5 py-3 hover:bg-slate-50 cursor-pointer transition-colors duration-150 text-slate-400 hover:text-slate-600 rounded-xl"
          >
            <div className="w-10 h-10 rounded-lg border border-dashed border-slate-200 flex items-center justify-center shrink-0">
              <span className="text-lg leading-none">+</span>
            </div>
            <span className="text-sm font-medium">Can&apos;t find the right one? Add manually</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
