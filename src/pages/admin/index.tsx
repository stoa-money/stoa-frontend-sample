import { SignedIn } from "@clerk/nextjs";
import { GetServerSidePropsContext } from "next";
import { getAuth, clerkClient } from "@clerk/nextjs/server";

export default function AdminDashboard() {
  return (
    <SignedIn>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Complete platform analytics and insights</p>
        </div>
      </div>
    </SignedIn>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { userId } = getAuth(context.req);
  if (!userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const userRole = (user.publicMetadata as { role?: string } | undefined)?.role;
  const systemAdmin = (user.privateMetadata as { systemAdmin?: string } | undefined)?.systemAdmin === "true";

  // Redirect non-admin users
  if (userRole !== 'admin') {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userRole,
      systemAdmin,
    },
  };
} 