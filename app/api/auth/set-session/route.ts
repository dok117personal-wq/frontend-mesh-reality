import { NextRequest, NextResponse } from 'next/server';

/**
 * Sets the backend session token as a cookie on the frontend origin.
 * When the browser sends requests to this app (e.g. POST /api/generate-model),
 * it will include this cookie, and serverBackendFetch can forward it to the backend.
 * Without this, the backend cookie is set for the backend origin only and is not
 * sent on same-origin requests to the frontend.
 */
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'session';
const MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = typeof body?.token === 'string' ? body.token.trim() : null;
    if (!token) {
      return NextResponse.json({ error: 'token required' }, { status: 400 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: MAX_AGE,
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
