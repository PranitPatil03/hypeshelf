'use client';

import * as React from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader } from 'lucide-react';

export default function SignUpPage() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [emailAddress, setEmailAddress] = React.useState('');
    const [fullName, setFullName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [pendingVerification, setPendingVerification] = React.useState(false);
    const [code, setCode] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;
        setIsLoading(true);

        try {
            const nameParts = fullName.trim().split(/\s+/);
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            await signUp.create({
                emailAddress,
                password,
                firstName,
                lastName,
            });

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err: any) {
            toast.error(err.errors?.[0]?.message || 'An error occurred during sign up');
        } finally {
            setIsLoading(false);
        }
    };

    const onPressVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;
        setIsLoading(true);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId });
                window.location.href = '/shelf';
            } else {
                toast.error('Verification failed. Please try again.');
            }
        } catch (err: any) {
            toast.error(err.errors?.[0]?.message || 'Invalid verification code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuth = (strategy: 'oauth_google' | 'oauth_x') => {
        if (!isLoaded) return;
        signUp.authenticateWithRedirect({
            strategy,
            redirectUrl: '/sso-callback',
            redirectUrlComplete: '/shelf',
        });
    };

    if (pendingVerification) {
        return (
            <div className="flex min-h-screen bg-white font-sans items-center justify-center">
                <div className="w-full px-4 sm:px-6 py-12 max-w-[420px]">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight mb-2">
                            Verify your email
                        </h1>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-sm">
                            We've sent a verification code to <span className="font-semibold text-slate-800">{emailAddress}</span>.
                        </p>
                    </div>

                    <form onSubmit={onPressVerify} className="space-y-4">
                        <div>
                            <input
                                id="code"
                                type="text"
                                required
                                placeholder="Enter verification code"
                                className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium tracking-widest text-lg"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isLoaded}
                            className="flex items-center justify-center cursor-pointer w-full h-12 text-white font-medium rounded-xl transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed bg-linear-to-b from-slate-700 to-slate-900 border border-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_10px_rgba(15,23,42,0.4)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_15px_rgba(15,23,42,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_5px_rgba(15,23,42,0.4)]"
                        >
                            {isLoading ? <><Loader className="w-5 h-5 mr-2 animate-spin" /> Verifying...</> : 'Verify Email'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-white font-sans items-center justify-center">
            <div className="w-full px-4 sm:px-6 py-12 max-w-[420px]">
                <div className="flex flex-col items-center text-center">
                    {/* Logo */}
                    <Link href="/" className="inline-flex items-center gap-1.5 mb-2">
                        <img src="/icons/sunflower.png" alt="hypeshelf" width={36} height={36} />
                        <span className="text-2xl font-lora text-slate-900 tracking-tight drop-shadow-sm">hypeshelf</span>
                    </Link>

                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight mb-2">
                        Create an Account
                    </h1>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-sm">
                        Sign up to access your meticulously organized shelf.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            id="fullName"
                            type="text"
                            required
                            placeholder="Full name"
                            className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div>
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="Create a password"
                            className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all pr-12"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !isLoaded}
                        className="flex items-center justify-center cursor-pointer w-full h-12 text-white font-medium rounded-xl transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed bg-linear-to-b from-slate-700 to-slate-900 border border-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_10px_rgba(15,23,42,0.4)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_15px_rgba(15,23,42,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_5px_rgba(15,23,42,0.4)]"
                    >
                        {isLoading ? <><Loader className="w-5 h-5 mr-2 animate-spin" /> Creating account...</> : 'Sign up'}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-slate-200"></div>
                    <span className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Or authorize with
                    </span>
                    <div className="flex-1 border-t border-slate-200"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleOAuth('oauth_google')}
                        type="button"
                        className="cursor-pointer flex items-center justify-center gap-2 h-11 px-4 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold transition-all duration-200 shadow-[inset_0_-1px_1px_rgba(0,0,0,0.03),0_4px_10px_rgba(15,23,42,0.08)] hover:bg-slate-50 active:shadow-[inset_0_1px_1px_rgba(0,0,0,0.03),0_2px_5px_rgba(15,23,42,0.08)]"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </button>
                    <button
                        onClick={() => handleOAuth('oauth_x')}
                        type="button"
                        className="cursor-pointer flex items-center justify-center gap-2 h-11 px-4 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold transition-all duration-200 shadow-[inset_0_-1px_1px_rgba(0,0,0,0.03),0_4px_10px_rgba(15,23,42,0.08)] hover:bg-slate-50 active:shadow-[inset_0_1px_1px_rgba(0,0,0,0.03),0_2px_5px_rgba(15,23,42,0.08)]"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-slate-900">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        X
                    </button>
                </div>

                <div className="mt-5 flex items-center justify-center text-sm">
                    <div className="text-slate-500">
                        Already have an account?{' '}
                        <Link href="/sign-in" className="text-slate-900 font-semibold hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
