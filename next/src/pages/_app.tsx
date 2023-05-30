import {type AppType} from "next/app";
import {type Session} from "next-auth";
import {SessionProvider} from "next-auth/react";
import "../styles/globals.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const Liveal: AppType<{ session: Session | null }> = ({Component, pageProps: {session, ...pageProps}}) => {
    const queryClient: QueryClient = new QueryClient()

    return (
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                <div className="bg-color p-5 min-h-screen">
                    <Component {...pageProps} />
                </div>
            </QueryClientProvider>
        </SessionProvider>
    );
};

export default Liveal;
