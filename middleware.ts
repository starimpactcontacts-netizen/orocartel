import { NextResponse, type NextRequest } from 'next/server'
import { site } from '@/lib/site'

// While the store is closed, every page renders the coming-soon screen.
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  if (!site.comingSoon || path === '/coming-soon' || path === '/brand') return NextResponse.next()
  return NextResponse.rewrite(new URL('/coming-soon', req.url))
}

export const config = {
  // skip API, Next assets, and files with an extension (images, icons, robots, sitemap)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
