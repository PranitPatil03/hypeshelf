'use client';

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  return (
    <div className="flex flex-col items-end gap-1.5 shrink-0 pt-0.5">
      <label className="text-xs font-bold text-slate-500">Hype Rating</label>
      <div className="flex items-center gap-0.5 cursor-pointer">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = star <= Math.floor(value);
          const isHalf = !isFull && star - 0.5 === value;
          return (
            <div key={star} className="relative w-7 h-7 transition-transform hover:scale-110 active:scale-95">
              <img src="/icons/star.png" alt="" className="absolute inset-0 w-7 h-7 opacity-20" />
              {isFull && (
                <img src="/icons/star.png" alt="" className="absolute inset-0 w-7 h-7" />
              )}
              {isHalf && (
                <img src="/icons/star-half.png" alt="" className="absolute inset-y-0 left-0 w-3.5 h-7" />
              )}
              <div className="absolute inset-0 flex z-10">
                <div className="w-1/2 h-full" onClick={() => onChange(star - 0.5)} />
                <div className="w-1/2 h-full" onClick={() => onChange(star)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
