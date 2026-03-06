'use client';

import { MoreVertical, Trash2, Star as StarIcon } from 'lucide-react';
import Image from 'next/image';
import { MovieRatingStars } from './ui-custom/movie-rating-stars';
import { RecAuthorBadge } from './ui-custom/rec-author-badge';

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from './ui/button';

export default function RecCard({ rec, currentUser }: { rec: any, currentUser?: any }) {
    const deleteRec = useMutation(api.recommendations.remove);
    const toggleStaffPick = useMutation(api.recommendations.toggleStaffPick);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const isAuthor = currentUser?.clerkId === rec.userId;
    const isAdmin = currentUser?.role === 'admin';
    const canEdit = isAuthor || isAdmin;

    const handleDelete = async () => {
        await deleteRec({ id: rec.id as Id<"recommendations"> });
        setIsDeleteDialogOpen(false);
    };

    const handleToggleStaffPick = async () => {
        await toggleStaffPick({ id: rec.id as Id<"recommendations"> });
    };

    return (
        <div className="group relative flex flex-col cursor-pointer bg-[#09090b] rounded-[2px] overflow-hidden text-white transition-all duration-500 aspect-4/5 sm:aspect-2/3 w-full p-5 sm:p-6 shadow-md shadow-emerald-900/ border border-white/95 selection:bg-white/30 selection:text-white justify-end">
            <div className="absolute inset-0 block z-0">
                {rec.posterUrl ? (
                    <Image
                        src={rec.posterUrl}
                        alt={rec.title}
                        fill
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                        unoptimized
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-slate-900 flex items-center justify-center p-4">
                        <span className="text-white/50 text-center font-bold text-lg">{rec.title}</span>
                    </div>
                )}

                <div className="absolute inset-x-0 bottom-0 h-[90%] bg-linear-to-t from-[#09090b] via-[#09090b]/85 to-transparent transition-opacity duration-300 opacity-100" />
            </div>

            {rec.isStaffPick && (
                <div className="absolute top-3 right-3 z-20">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <img src="/icons/badge.png" alt="Staff Pick" className="w-10 h-10 drop-shadow-lg cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent side="left" className="text-xs font-semibold">
                            Staff Pick
                        </TooltipContent>
                    </Tooltip>
                </div>
            )}

            <div className="absolute top-4 left-4 right-4 z-20 flex items-start justify-between pointer-events-none">
                <div />

                {canEdit && (
                    <div className="relative pointer-events-auto">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setIsMenuOpen(!isMenuOpen)
                            }}
                            className="p-1 rounded text-white/80 hover:text-white cursor-pointer transition-all drop-shadow-md"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-44 bg-[#18181b]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    {isAdmin && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleToggleStaffPick();
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/10 flex items-center gap-2"
                                        >
                                            <StarIcon className="w-4 h-4 text-emerald-400" />
                                            {rec.isStaffPick ? 'Unmark Pick' : 'Staff Pick'}
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsDeleteDialogOpen(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/20 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="relative z-10 flex flex-col w-full pointer-events-none mt-auto">
                <a
                    href={rec.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit pointer-events-auto hover:text-emerald-400 transition-colors duration-200"
                >
                    <h3 className="font-medium leading-tight tracking-tight text-[20px] sm:text-[22px] md:text-[24px] drop-shadow-md mb-2">
                        {rec.title}
                    </h3>
                </a>

                <div className="flex flex-wrap items-center gap-3 mb-3 text-[11px] sm:text-[12px] text-white/70 font-normal tracking-wide">
                    <MovieRatingStars hypeScore={rec.hypeScore} />
                    <span className="line-clamp-1 font-semibold">{rec.genre}</span>
                </div>

                <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="cursor-pointer pointer-events-auto w-full"
                >
                    <p className={`text-[14px] sm:text-[16px] font-semibold text-white leading-relaxed drop-shadow-sm transition-all duration-300 ${isExpanded ? '' : 'line-clamp-3'}`}>
                        {rec.blurb}
                    </p>
                </div>

                <RecAuthorBadge authorName={rec.authorName} avatarUrl={rec.userAvatar} />
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-106.25">
                    <DialogHeader>
                        <DialogTitle>Delete Recommendation</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{rec.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-row justify-end space-x-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}


