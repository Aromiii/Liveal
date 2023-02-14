import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <div className="bg-gray-200 p-5 min-h-screen">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default MyApp;
