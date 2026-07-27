import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Route protection is handled client-side (`RequireAuth` / `PublicOnly`) because the
 * refresh token HttpOnly cookie is scoped to `/api/v1/auth` and is not sent on page
 * navigations such as `/account`. Server middleware cannot reliably gate sessions
 * from that cookie without widening cookie path (deferred to Epic 01 M5).
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*'],
};
