import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin', '/admin/:path*']);

const isPublicRoute = createRouteMatcher(['/']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.nextUrl.pathname });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId as string);

  const role = (user?.publicMetadata as { role?: string } | undefined)?.role;

  if (isPublicRoute(req) && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  if (isAdminRoute(req)) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:[a-z0-9]+)$).*)',
    '/(api|trpc)(.*)',
    '/.well-known/:path*',
  ],
};