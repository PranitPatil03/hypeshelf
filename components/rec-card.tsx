import { Recommendation } from '@/lib/dummy-data';
import { Settings, Clapperboard } from 'lucide-react';

export default function RecCard({ rec }: { rec: Recommendation }) {
    return (
        <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm p-4 h-full">
            <div className="mb-4 text-slate-400">
                <Clapperboard className="w-10 h-10" strokeWidth={1.5} />
            </div>

            <div className="mb-1">
                <span className="text-[11px] font-medium text-slate-500">
                    {rec.genre}
                </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-base font-semibold text-slate-900 tracking-tight leading-tight">
                    {rec.title}
                </h3>
                {rec.isStaffPick && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-semibold border border-emerald-100/50 whitespace-nowrap">
                        Staff Pick
                    </span>
                )}
            </div>

            <p className="text-[13px] text-slate-600 leading-relaxed mb-5 flex-1 wrap-break-word">
                {rec.blurb}
            </p>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 mb-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-slate-500 font-medium">Added by</span>
                    <span className="text-[13px] font-medium text-slate-900 flex items-center gap-2 truncate">
                        <img
                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${rec.authorName}`}
                            alt={rec.authorName}
                            className="w-4 h-4 rounded-full bg-slate-50"
                        />
                        <span className="truncate">{rec.authorName.split(' ')[0]}</span>
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-slate-500 font-medium">Date added</span>
                    <span className="text-[13px] font-medium text-slate-900 truncate">
                        {new Date(rec.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                    {rec.link && (
                        <a
                            href={rec.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold text-sky-600 bg-sky-50 transition-colors px-3 py-1.5 rounded-md border border-sky-100 hover:bg-sky-100"
                        >
                            View Link
                        </a>
                    )}
                </div>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                    <Settings className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
