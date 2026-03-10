import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Up — hypeshelf',
    description: 'Create your hypeshelf account',
};

export default function SignUpLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
