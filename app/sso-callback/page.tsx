import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

export default function SSOCallback() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="text-slate-500 font-medium">Authenticating...</div>
            <AuthenticateWithRedirectCallback redirectUrl="/my-recommendations" />
        </div>
    )
}
