'use client';

import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { searchMovies } from '@/app/actions/tmdb';
import { Search, Loader, Check, X, Star } from 'lucide-react';
import Image from 'next/image';

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

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<MovieResult[]>([]);

    // Selection State
    const [selectedMovie, setSelectedMovie] = useState<MovieResult | null>(null);

    // Form State
    const [blurb, setBlurb] = useState('');
    const [starRating, setStarRating] = useState(4); // Default 4 stars
    const [customPosterUrl, setCustomPosterUrl] = useState('');
    const [customLink, setCustomLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Search Effect (Debounced)
    useEffect(() => {
        if (!searchQuery) {
            setSearchResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsSearching(true);
            try {
                const results = await searchMovies(searchQuery);
                setSearchResults(results);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Handle Reset on Close or new Open
    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setSearchResults([]);
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

        if (blurb.length > 250) {
            setError("Review must be under 250 characters.");
            return;
        }

        setIsSubmitting(true);
        setError('');

        // If it's a manual entry (we assigned a large Date.now() timestamp), use custom inputs
        const isManualEntry = selectedMovie.id > 100000000;

        const posterUrl = isManualEntry
            ? customPosterUrl
            : selectedMovie.poster_path
                ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                : '';

        const link = isManualEntry ? customLink : `https://www.themoviedb.org/movie/${selectedMovie.id}`;

        try {
            await createRec({
                title: selectedMovie.title,
                genre: selectedMovie.genre,
                blurb,
                link,
                posterUrl,
                hypeScore: starRating * 2,
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to add recommendation.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-slate-200/50 shadow-2xl p-0 overflow-hidden gap-0 rounded-[10px]">
                <DialogHeader className="p-6 pb-4 bg-slate-50/50 border-b border-slate-100">
                    <DialogTitle className="text-2xl font-bold tracking-tight text-slate-800">
                        {selectedMovie ? "Hype this up" : "Drop a banger on the shelf"}
                    </DialogTitle>
                    {!selectedMovie && (
                        <p className="text-sm text-slate-500 font-medium">Find that movie you literally won't stop yapping about.</p>
                    )}
                </DialogHeader>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                            <X className="w-4 h-4" /> {error}
                        </div>
                    )}

                    {!selectedMovie ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search for a movie..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-11 pr-11 py-6 text-lg rounded-2xl bg-slate-50/50 border-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-slate-300 shadow-inner"
                                />
                                {isSearching && (
                                    <Loader className="absolute right-3.5 top-3.5 h-5 w-5 text-slate-900 animate-spin" />
                                )}
                            </div>

                            {searchResults.length > 0 && (
                                <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {searchResults.map((movie) => (
                                        <div
                                            key={movie.id}
                                            onClick={() => setSelectedMovie(movie)}
                                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-all duration-200 group"
                                        >
                                            <div className="relative w-12 h-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                                {movie.poster_path ? (
                                                    <Image
                                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                                        alt={movie.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-[10px] font-bold text-center leading-tight bg-slate-100 p-1">
                                                        No Poster
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{movie.title}</h4>
                                                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-1">
                                                    {movie.release_date?.substring(0, 4) || 'Unknown'} • {movie.genre}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {searchQuery.length > 2 && (
                                <button
                                    onClick={() => setSelectedMovie({
                                        id: Date.now(),
                                        title: searchQuery,
                                        release_date: '',
                                        poster_path: null,
                                        genre: 'Other'
                                    })}
                                    className="w-full text-center py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 rounded-xl transition-colors mt-4"
                                >
                                    Can't find it? Add "{searchQuery}" manually
                                </button>
                            )}
                        </div>
                    ) : (
                        <form id="add-rec-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex gap-5 items-start bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                <div className="relative w-20 h-28 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
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
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-white/50 text-xs font-bold text-center p-2 leading-tight">
                                            No Poster
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1 pt-1 justify-center h-full">
                                    <h3 className="font-bold text-xl text-slate-900 leading-tight">{selectedMovie.title}</h3>
                                    <span className="text-sm font-semibold text-slate-500">
                                        {selectedMovie.release_date?.substring(0, 4)} • {selectedMovie.genre}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedMovie(null)}
                                        className="text-emerald-600 text-xs font-bold uppercase tracking-wider mt-2 hover:text-emerald-700 w-fit"
                                    >
                                        Change Movie
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-slate-800">Your Review</label>
                                    <span className={`text-xs font-semibold ${blurb.length > 250 ? 'text-red-500' : 'text-slate-400'}`}>
                                        {blurb.length} / 250
                                    </span>
                                </div>
                                <Textarea
                                    required
                                    value={blurb}
                                    onChange={(e) => setBlurb(e.target.value)}
                                    placeholder="Why do you recommend this? Keep it short and snappy..."
                                    className={`resize-none h-28 text-base rounded-2xl p-4 bg-slate-50/50 shadow-inner focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-slate-300 ${blurb.length > 250 ? 'border-red-300' : ''}`}
                                />
                            </div>

                            {selectedMovie.id > 100000000 && (
                                <div className="space-y-3 pt-2">
                                    <label className="text-sm font-bold text-slate-800">Additional Details (Optional)</label>
                                    <Input
                                        type="url"
                                        placeholder="Poster Image URL (e.g. from IMDB)"
                                        value={customPosterUrl}
                                        onChange={(e) => setCustomPosterUrl(e.target.value)}
                                        className="rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-slate-300 shadow-inner"
                                    />
                                    <Input
                                        type="url"
                                        placeholder="Official Link (Website or IMDB)"
                                        value={customLink}
                                        onChange={(e) => setCustomLink(e.target.value)}
                                        className="rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-slate-300 shadow-inner"
                                    />
                                </div>
                            )}

                            <div className="space-y-4 pt-2 border-t border-slate-100">
                                <div className="flex justify-between items-center bg-orange-50/50 px-4 py-3 rounded-2xl border border-orange-100/50">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
                                        <label className="text-sm font-black text-slate-800">Your Hype Rating</label>
                                    </div>
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <div key={star} className="relative w-8 h-8 transition-transform hover:scale-110 active:scale-95">
                                                {/* Empty Outline Background */}
                                                <Star className="absolute inset-0 w-8 h-8 text-slate-200 fill-slate-200" />

                                                {/* Filled Foreground Content */}
                                                <div
                                                    className="absolute inset-y-0 left-0 overflow-hidden"
                                                    style={{ width: star <= Math.floor(starRating) ? '100%' : star - 0.5 === starRating ? '50%' : '0%' }}
                                                >
                                                    <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
                                                </div>

                                                {/* Hidden Click Targets */}
                                                <div className="absolute inset-0 flex z-10">
                                                    <div className="w-1/2 h-full" onClick={() => setStarRating(star - 0.5)} />
                                                    <div className="w-1/2 h-full" onClick={() => setStarRating(star)} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    className="rounded-full px-6 text-slate-500 hover:text-slate-800 font-bold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || blurb.length > 250}
                                    className="rounded-full px-8 bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 font-bold"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader className="w-4 h-4 mr-2 animate-spin text-slate-400" /> Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4 mr-2" /> Add to Shelf
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
