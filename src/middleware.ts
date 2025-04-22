import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Retrieve the token from cookies
  const token = request.cookies.get('token')?.value

  // Define the paths for which the middleware should redirect
  const loginPath = '/login'
  const homePath = '/'
  const signupPath = '/signup' // Define the signup path to exclude

  // If a token is present, redirect to the home page
  if (token && request.nextUrl.pathname === loginPath) {
    return NextResponse.redirect(new URL(homePath, request.url))
  }

  // If no token is present, redirect to the login page for protected routes, excluding signup page
  if (
    !token &&
    request.nextUrl.pathname !== loginPath &&
    request.nextUrl.pathname !== signupPath &&
    !request.nextUrl.pathname.includes('/_next/')
  ) {
    return NextResponse.redirect(new URL(loginPath, request.url))
  }

  // Allow the request if no redirection is needed
  return NextResponse.next()
}
    