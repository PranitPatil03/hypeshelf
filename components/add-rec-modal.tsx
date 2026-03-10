'use client';

import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, X, Loader } from 'lucide-react';
import Image from 'next/image';
import { recommendationSchema } from '@/lib/validation';
import { motion, AnimatePresence } from 'motion/react';
import { MovieSearch, type MovieResult } from '@/components/shared/movie-search';
import { StarRatingInput } from '@/components/shared/star-rating-input';

interface AddRecModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddRecModal({ isOpen, onClose }: AddRecModalProps) {
    const createRec = useMutation(api.recommendations.create);

    const [selectedMovie, setSelectedMovie] = useState<MovieResult | null>(null);
    const [blurb, setBlurb] = useState('');
    const [starRating, setStarRating] = useState(4);
    const [customPosterUrl, setCustomPosterUrl] = useState('');
    const [customLink, setCustomLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
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

        const isManualEntry = selectedMovie.isManual;

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
        } catch (err) {
            const error = err as { message?: string };
            setError(error.message || 'Failed to add recommendation.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <MovieSearch onSelect={setSelectedMovie} />
                    ) : (
                        <motion.form
                            id="add-rec-form"
                            onSubmit={handleSubmit}
                            className="space-y-5"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="flex items-start justify-between gap-4 p-4">
                                <div className="flex gap-4 items-start min-w-0">
                                    <div className="relative w-16 h-22.5 bg-slate-200 rounded-lg overflow-hidden shrink-0 shadow-sm">
                                        {selectedMovie.poster_path ? (
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`}
                                                alt={selectedMovie.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (selectedMovie.isManual && customPosterUrl) ? (
                                            <Image src={customPosterUrl} alt={selectedMovie.title} fill className="object-cover" />
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

                                <StarRatingInput value={starRating} onChange={setStarRating} />
                            </div>

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

                            {selectedMovie.isManual && (
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
