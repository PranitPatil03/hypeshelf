'use client';

import { useState, useEffect, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { searchMovies } from '@/app/actions/tmdb';
import { Search, Loader, Check, X } from 'lucide-react';
import Image from 'next/image';
import { recommendationSchema } from '@/lib/validation';
import { motion, AnimatePresence } from 'motion/react';

interface AddRecModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type MovieResult = {
    id: number;
    title: string;
    release_date: string;
    poster_path: string | null;
    genre: string;
};

export function AddRecModal({ isOpen, onClose }: AddRecModalProps) {
    const createRec = useMutation(api.recommendations.create);

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<MovieResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const [selectedMovie, setSelectedMovie] = useState<MovieResult | null>(null);

    const [blurb, setBlurb] = useState('');
    const [starRating, setStarRating] = useState(4);
    const [customPosterUrl, setCustomPosterUrl] = useState('');
    const [customLink, setCustomLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

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

    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setSearchResults([]);
            setHasSearched(false);
            setSelectedMovie(null);
            setBlurb('');
            setStarRating(4);
            setCustomPosterUrl('');
            setCustomLink('');
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMovie) return;

        setIsSubmitting(true);
        setError('');

        const isManualEntry = selectedMovie.id > 100000000;

        const posterUrl = isManualEntry
            ? customPosterUrl
            : selectedMovie.poster_path
                ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                : '';

        const link = isManualEntry ? customLink : `https://www.themoviedb.org/movie/${selectedMovie.id}`;

        const payload = {
            title: selectedMovie.title,
            genre: selectedMovie.genre,
            blurb,
            link,
            posterUrl,
            hypeScore: starRating * 2,
        };

        const validation = recommendationSchema.safeParse(payload);
        if (!validation.success) {
            const firstIssue = validation.error.issues?.[0];
            setError(firstIssue?.message || validation.error.message || 'Validation failed. Please check your inputs.');
            setIsSubmitting(false);
            return;
        }

        try {
            await createRec(validation.data);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to add recommendation.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-130 bg-white border border-slate-200 shadow-md p-0 gap-0 rounded-md max-h-[85vh] flex flex-col overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                        {selectedMovie ? "Hype this up" : "Drop a banger on the shelf"}
                    </DialogTitle>
                    {!selectedMovie && (
                        <p className="text-[13px] text-slate-400 font-medium">Find that movie you literally won&apos;t stop yapping about.</p>
                    )}
                </DialogHeader>

                <div className="px-6 pb-6 overflow-y-auto flex-1">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2"
                            >
                                <X className="w-4 h-4 shrink-0" /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!selectedMovie ? (
                        <div className="space-y-3">
                            {/* Animated Search Bar */}
                            <motion.div
                                className={`relative border rounded-md transition-shadow duration-300 shadow-sm`}
                                layout
                            >
                                <motion.div
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                                    animate={{
                                        scale: isSearchFocused ? 1.1 : 1,
                                        color: isSearchFocused ? '#334155' : '#94a3b8',
                                    }}
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

                            {/* Search Results */}
                            <AnimatePresence>
                                {searchResults.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.2 }}
                                        className="rounded-xl overflow-hidden "
                                    >
                                        <div className="max-h-65 overflow-y-auto divide-y divide-slate-100">
                                            {searchResults.map((movie, i) => (
                                                <motion.div
                                                    key={movie.id}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.04, duration: 0.2 }}
                                                    onClick={() => setSelectedMovie(movie)}
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

                                            {/* Add manually - at bottom of results */}
                                            {!isSearching && (
                                                <div
                                                    onClick={() => setSelectedMovie({
                                                        id: Date.now(),
                                                        title: searchQuery,
                                                        release_date: '',
                                                        poster_path: null,
                                                        genre: 'Other'
                                                    })}
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

                            {/* No results - add manually */}
                            <AnimatePresence>
                                {searchQuery.length > 2 && !isSearching && hasSearched && searchResults.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 4 }}
                                        onClick={() => setSelectedMovie({
                                            id: Date.now(),
                                            title: searchQuery,
                                            release_date: '',
                                            poster_path: null,
                                            genre: 'Other'
                                        })}
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
                    ) : (
                        <motion.form
                            id="add-rec-form"
                            onSubmit={handleSubmit}
                            className="space-y-5"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* Movie Info + Hype Rating side by side */}
                            <div className="flex items-start justify-between gap-4 p-4">
                                {/* Left: Movie Info */}
                                <div className="flex gap-4 items-start min-w-0">
                                    <div className="relative w-16 h-22.5 bg-slate-200 rounded-lg overflow-hidden shrink-0 shadow-sm">
                                        {selectedMovie.poster_path ? (
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`}
                                                alt={selectedMovie.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (selectedMovie.id > 100000000 && customPosterUrl) ? (
                                            <img src={customPosterUrl} alt={selectedMovie.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white/40 text-[10px] font-bold text-center p-1.5">
                                                No Poster
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-0.5 pt-0.5 min-w-0">
                                        <h3 className="font-bold text-base text-slate-900 leading-snug truncate">{selectedMovie.title}</h3>
                                        <span className="text-xs font-medium text-slate-400">
                                            {selectedMovie.release_date?.substring(0, 4)} · {selectedMovie.genre}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedMovie(null)}
                                            className="text-xs font-semibold mt-1.5 hover:text-slate-700 w-fit transition-colors underline underline-offset-3"
                                        >
                                            Change movie
                                        </button>
                                    </div>
                                </div>

                                {/* Right: Hype Rating */}
                                <div className="flex flex-col items-end gap-1.5 shrink-0 pt-0.5">
                                    <label className="text-xs font-bold text-slate-500">Hype Rating</label>
                                    <div className="flex items-center gap-0.5 cursor-pointer">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const isFull = star <= Math.floor(starRating);
                                            const isHalf = !isFull && star - 0.5 === starRating;
                                            return (
                                                <div key={star} className="relative w-7 h-7 transition-transform hover:scale-110 active:scale-95">
                                                    {/* Empty star bg */}
                                                    <img src="/icons/star.png" alt="" className="absolute inset-0 w-7 h-7 opacity-20" />
                                                    {/* Filled or half */}
                                                    {isFull && (
                                                        <img src="/icons/star.png" alt="" className="absolute inset-0 w-7 h-7" />
                                                    )}
                                                    {isHalf && (
                                                        <img src="/icons/star-half.png" alt="" className="absolute inset-y-0 left-0 w-3.5 h-7" />
                                                    )}
                                                    {/* Click targets */}
                                                    <div className="absolute inset-0 flex z-10">
                                                        <div className="w-1/2 h-full" onClick={() => setStarRating(star - 0.5)} />
                                                        <div className="w-1/2 h-full" onClick={() => setStarRating(star)} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Review */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-slate-700">Your Review</label>
                                    <span className={`text-xs font-medium ${blurb.length > 250 ? 'text-red-500' : 'text-slate-300'}`}>
                                        {blurb.length}/250
                                    </span>
                                </div>
                                <Textarea
                                    required
                                    value={blurb}
                                    maxLength={250}
                                    onChange={(e) => setBlurb(e.target.value.slice(0, 250))}
                                    placeholder="Why do you recommend this? Keep it short and snappy..."
                                    className={`outline-none resize-none h-24 text-sm rounded-sm p-3.5 transition-colors border border-gray-100 shadow-muted-foreground ${blurb.length > 250 ? 'border-red-300' : ''}`}
                                />
                            </div>

                            {/* Manual Entry Details */}
                            {selectedMovie.id > 100000000 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-2.5"
                                >
                                    <label className="text-sm font-semibold text-slate-700">Additional Details (Optional)</label>
                                    <Input
                                        type="url"
                                        placeholder="Poster Image URL (e.g. from IMDB)"
                                        value={customPosterUrl}
                                        onChange={(e) => setCustomPosterUrl(e.target.value)}
                                        className="rounded-md border-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-slate-300 focus-visible:bg-white text-sm h-10 transition-colors"
                                    />
                                    <Input
                                        type="url"
                                        placeholder="Official Link (Website or IMDB)"
                                        value={customLink}
                                        onChange={(e) => setCustomLink(e.target.value)}
                                        className="rounded-md border-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-slate-300 focus-visible:bg-white text-sm h-10 transition-colors"
                                    />
                                </motion.div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-2.5 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    className="rounded-xl px-5 h-10 text-slate-400 hover:text-slate-600 font-semibold text-sm"
                                >
                                    Cancel
                                </Button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || blurb.length > 250}
                                    className="text-white font-medium text-sm rounded-xl transition-all duration-200 cursor-pointer bg-linear-to-b from-slate-700 to-slate-900 border border-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_15px_rgba(15,23,42,0.5)] -translate-y-0.5 hover:scale-105 active:scale-100 inline-flex h-10 px-6 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader className="w-4 h-4 mr-2 animate-spin" /> Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4 mr-2" /> Add to Shelf
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
