interface RecAuthorBadgeProps {
    authorName: string;
    avatarUrl?: string;
    className?: string;
}

export function RecAuthorBadge({ authorName, avatarUrl, className = "" }: RecAuthorBadgeProps) {
    const imgSrc = avatarUrl || `https://api.dicebear.com/7.x/personas/svg?seed=${authorName}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
    return (
        <div className={`flex items-center gap-3 mt-2 border-white/10 pointer-events-auto ${className}`}>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 border border-white/20 shrink-0 shadow-sm">
                <img
                    src={imgSrc}
                    alt={authorName}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col leading-tight">
                <span className="text-[9px] text-white/50 uppercase font-black tracking-widest mb-0.5">Rec'd By</span>
                <span className="text-[13px] font-bold text-white/90 tracking-wide line-clamp-1">
                    {authorName}
                </span>
            </div>
        </div>
    );
}
