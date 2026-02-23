"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, useMutation, useConvexAuth } from "convex/react";
import { ReactNode, useEffect } from "react";
import { api } from "@/convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function ConvexSyncUser({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useConvexAuth();
    const storeUser = useMutation(api.users.store);

    useEffect(() => {
        if (isAuthenticated) {
            // Store or update the user in Convex upon login
            storeUser().catch(console.error);
        }
    }, [isAuthenticated, storeUser]);

    return <>{children}</>;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <ConvexSyncUser>
                    {children}
                </ConvexSyncUser>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
