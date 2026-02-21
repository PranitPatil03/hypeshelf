import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p>You have successfully signed in.</p>
            <UserButton />
        </div>
    );
}
