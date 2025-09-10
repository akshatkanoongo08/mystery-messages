import {NextRequest, NextResponse } from 'next/server'
import {getToken} from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const { pathname } = request.nextUrl

    const authPaths = ['/sign-in', '/sign-up', '/verify', '/']
    const isAuthPath = authPaths.includes(pathname)
    const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/home')

    // If already authenticated, keep them away from auth pages
    if (token && isAuthPath) {
        return NextResponse.redirect(new URL('/home', request.url))
    }

    // If not authenticated, protect private pages
    if (!token && isProtectedPath) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // Otherwise, allow request
    return NextResponse.next()
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*',
    '/home'
  ]
}