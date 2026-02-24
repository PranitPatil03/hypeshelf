import { Star as StarIcon } from 'lucide-react';

interface MovieRatingStarsProps {
    hypeScore: number;
    className?: string;
    starClassName?: string;
}

export function MovieRatingStars({ hypeScore, className = "", starClassName = "" }: MovieRatingStarsProps) {
    const starCount = Math.round((hypeScore || 9) / 2);

    return (
        <div className={`flex items-center gap-0.5 ${className}`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                    key={i}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${i < starCount ? 'text-amber-400 fill-amber-400' : 'text-white/20'
                        } ${starClassName}`}
                />
            ))}
        </div>
    );
}
