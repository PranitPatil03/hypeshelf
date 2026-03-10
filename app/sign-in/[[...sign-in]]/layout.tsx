import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign In — hypeshelf',
    description: 'Sign in to your hypeshelf account',
};

export default function SignInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
