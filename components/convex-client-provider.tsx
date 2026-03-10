"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, useMutation, useConvexAuth } from "convex/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";

function ConvexSyncUser({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useConvexAuth();
    const storeUser = useMutation(api.users.store);
    const hasStoredUser = useRef(false);
    const isStoringUser = useRef(false);

    useEffect(() => {
        if (!isAuthenticated) {
            hasStoredUser.current = false;
        }

        if (isAuthenticated && !hasStoredUser.current && !isStoringUser.current) {
            isStoringUser.current = true;
            storeUser()
                .then(() => {
                    hasStoredUser.current = true;
                })
                .catch((err) => {
                    console.error("Failed to sync user:", err);
                    hasStoredUser.current = false;
                })
                .finally(() => {
                    isStoringUser.current = false;
                });
        }
    }, [isAuthenticated, storeUser]);

    return <>{children}</>;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    const [convex] = useState(() => {
        const url = process.env.NEXT_PUBLIC_CONVEX_URL;
        if (!url) throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
        return new ConvexReactClient(url);
    });

    return (
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <ConvexSyncUser>
                {children}
            </ConvexSyncUser>
        </ConvexProviderWithClerk>
    );
}
