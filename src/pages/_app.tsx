import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import Layout from "@/components/Layout";
import { GeistSans } from "geist/font/sans";
import { SignalRProvider } from "@/contexts/SignalRContext";

export default function App({ Component, pageProps }: AppProps) {
  // Extract userRole from pageProps if it exists
  const { userRole, userBankAccount, systemAdmin, ...restPageProps } = pageProps;

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <div className={`${GeistSans.variable} font-sans`}>
        <SignedIn>
          <SignalRProvider>
            <Layout userRole={userRole} userBankAccount={userBankAccount} systemAdmin={systemAdmin}>
              <Component {...restPageProps} />
            </Layout>
          </SignalRProvider>
        </SignedIn>
        <SignedOut>
          <div className="flex items-center justify-center min-h-screen">
            <SignIn routing="hash" />
          </div>
        </SignedOut>
      </div>
    </ClerkProvider>
  );
}
