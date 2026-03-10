'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center w-full">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Something went wrong!</h2>
            <p className="text-slate-500 mb-6">We encountered an error loading the recommendations.</p>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
                Try again
            </button>
        </div>
    );
}
