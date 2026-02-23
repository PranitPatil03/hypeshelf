import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'
import { Loader } from 'lucide-react'

export default function SSOCallback() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="flex items-center text-slate-500 font-medium">
                <Loader className="w-5 h-5 animate-spin mr-3 text-slate-900" />
                Authenticating...
            </div>
            <AuthenticateWithRedirectCallback redirectUrl="/shelf" />
        </div>
    )
}
