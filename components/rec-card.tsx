'use client';

import { MoreVertical, Check, X, Loader } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { MovieRatingStars } from './shared/movie-rating-stars';
import { RecAuthorBadge } from './shared/rec-author-badge';

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { StarRatingInput } from '@/components/shared/star-rating-input';
import { recommendationSchema } from '@/lib/validation';
import { ALLOWED_GENRES } from '@/lib/validation';

export default function RecCard({ rec, currentUser }: { rec: any, currentUser?: any }) {
    const deleteRec = useMutation(api.recommendations.remove);
    const toggleStaffPick = useMutation(api.recommendations.toggleStaffPick);
    const updateRec = useMutation(api.recommendations.update);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editBlurb, setEditBlurb] = useState('');
    const [editStarRating, setEditStarRating] = useState(4);
    const [editLink, setEditLink] = useState('');
    const [editPosterUrl, setEditPosterUrl] = useState('');
    const [editGenre, setEditGenre] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);
    const [editError, setEditError] = useState('');

    const isAuthor = currentUser?.clerkId === rec.userId;
    const isAdmin = currentUser?.role === 'admin';
    const canEdit = isAuthor || isAdmin;

    const handleDelete = async () => {
        try {
            await deleteRec({ id: rec.id as Id<"recommendations"> });
            setIsDeleteDialogOpen(false);
        } catch {
            toast.error("Failed to delete recommendation");
        }
    };

    const handleToggleStaffPick = async () => {
        try {
            await toggleStaffPick({ id: rec.id as Id<"recommendations"> });
        } catch {
            toast.error("Failed to toggle staff pick");
        }
    };

    const openEditDialog = () => {
        setEditTitle(rec.title);
        setEditBlurb(rec.blurb);
        setEditStarRating(rec.hypeScore / 2);
        setEditLink(rec.link || '');
        setEditPosterUrl(rec.posterUrl || '');
        setEditGenre(rec.genre);
        setEditError('');
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditSubmitting(true);
        setEditError('');

        const payload = {
            title: editTitle,
            genre: editGenre,
            blurb: editBlurb,
            link: editLink,
            posterUrl: editPosterUrl,
            hypeScore: editStarRating * 2,
        };

        const validation = recommendationSchema.safeParse(payload);
        if (!validation.success) {
            const firstIssue = validation.error.issues?.[0];
            setEditError(firstIssue?.message || 'Validation failed.');
            setIsEditSubmitting(false);
            return;
        }

        try {
            await updateRec({ id: rec.id as Id<"recommendations">, ...validation.data });
            setIsEditDialogOpen(false);
        } catch (err: any) {
            setEditError(err.message || 'Failed to update recommendation.');
        } finally {
            setIsEditSubmitting(false);
        }
    };

    return (
        <div className={`group relative flex flex-col cursor-pointer bg-[#09090b] rounded-[2px] text-white transition-all duration-500 aspect-4/5 sm:aspect-2/3 w-full p-5 sm:p-6 shadow-md shadow-emerald-900/ border border-white/95 selection:bg-white/30 selection:text-white justify-end ${isMenuOpen ? 'overflow-visible' : 'overflow-hidden'}`}>
            <div className="absolute inset-0 block z-0 overflow-hidden">
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

            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between pointer-events-none">
                <div />

                {canEdit && (
                    <div className="relative pointer-events-auto">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setIsMenuOpen(!isMenuOpen)
                            }}
                            className="p-1 rounded text-white/80 hover:text-white cursor-pointer transition-all duration-200 drop-shadow-md"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                                <div className="absolute left-full ml-2 bottom-0 w-44 bg-white rounded-sm shadow-xl border border-slate-100 z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-left-2">
                                    {isAdmin && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleToggleStaffPick();
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 flex items-center gap-2.5 transition-all group/item cursor-pointer"
                                        >
                                            <img src="/icons/badge.png" alt="" className="w-4 h-4 transition-transform duration-200 group-hover/item:scale-125" />
                                            {rec.isStaffPick ? 'Unmark Pick' : 'Staff Pick'}
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            openEditDialog();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 flex items-center gap-2.5 transition-all group/item cursor-pointer"
                                    >
                                        <img src="/icons/edit.png" alt="" className="w-4 h-4 transition-transform duration-200 group-hover/item:scale-125" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsDeleteDialogOpen(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 flex items-center gap-2.5 transition-all group/item cursor-pointer"
                                    >
                                        <img src="/icons/delete.png" alt="" className="w-4 h-4 transition-transform duration-200 group-hover/item:scale-125" />
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="relative z-10 flex flex-col w-full pointer-events-none mt-auto">
                {rec.link ? (
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
                ) : (
                    <h3 className="font-medium leading-tight tracking-tight text-[20px] sm:text-[22px] md:text-[24px] drop-shadow-md mb-2">
                        {rec.title}
                    </h3>
                )}

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

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-lg bg-white border border-slate-200 shadow-md p-0 gap-0 rounded-md max-h-[85vh] flex flex-col overflow-hidden">
                    <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                        <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">Edit Recommendation</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="px-6 pb-6 overflow-y-auto flex-1 space-y-4">
                        {editError && (
                            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                                <X className="w-4 h-4 shrink-0" /> {editError}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Title</label>
                            <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                maxLength={200}
                                className="rounded-sm border-gray-100 text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Genre</label>
                            <select
                                value={editGenre}
                                onChange={(e) => setEditGenre(e.target.value)}
                                className="w-full h-10 rounded-sm border border-gray-100 px-3 text-sm bg-white"
                            >
                                {ALLOWED_GENRES.map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-slate-700">Review</label>
                                <span className={`text-xs font-medium ${editBlurb.length > 250 ? 'text-red-500' : 'text-slate-300'}`}>
                                    {editBlurb.length}/250
                                </span>
                            </div>
                            <Textarea
                                value={editBlurb}
                                maxLength={250}
                                onChange={(e) => setEditBlurb(e.target.value.slice(0, 250))}
                                className="outline-none resize-none h-24 text-sm rounded-sm p-3.5 border border-gray-100"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Hype Rating</label>
                            <StarRatingInput value={editStarRating} onChange={setEditStarRating} />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Link (optional)</label>
                            <Input
                                type="url"
                                value={editLink}
                                onChange={(e) => setEditLink(e.target.value)}
                                placeholder="https://..."
                                className="rounded-sm border-gray-100 text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Poster URL (optional)</label>
                            <Input
                                type="url"
                                value={editPosterUrl}
                                onChange={(e) => setEditPosterUrl(e.target.value)}
                                placeholder="https://..."
                                className="rounded-sm border-gray-100 text-sm"
                            />
                        </div>

                        <div className="flex justify-end gap-2.5 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl px-5 h-10 text-slate-400 hover:text-slate-600 font-semibold text-sm">
                                Cancel
                            </Button>
                            <button
                                type="submit"
                                disabled={isEditSubmitting || editBlurb.length > 250}
                                className="text-white font-medium text-sm rounded-xl transition-all duration-200 cursor-pointer bg-linear-to-b from-slate-700 to-slate-900 border border-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_15px_rgba(15,23,42,0.5)] -translate-y-0.5 hover:scale-105 active:scale-100 inline-flex h-10 px-6 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isEditSubmitting ? (
                                    <><Loader className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                                ) : (
                                    <><Check className="w-4 h-4 mr-2" /> Save Changes</>
                                )}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}


