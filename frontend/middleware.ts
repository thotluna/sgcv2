import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/login'];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Check if the route is an auth route (login/register)
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If user is authenticated and trying to access auth routes (like /login)
  // redirect to dashboard
  if (token && isAuthRoute) {
    // If we are redirecting due to session expiration (401 from client), allow access to login
    // and clear the stale cookie
    if (request.nextUrl.searchParams.get('expired') === 'true') {
      const response = NextResponse.next();
      response.cookies.delete('auth-token');
      return response;
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not authenticated and trying to access protected routes
  // redirect to login
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes should be processed by this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
