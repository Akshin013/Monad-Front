import { NextResponse } from 'next/server';

export async function middleware(req) {
  const isAdmin = req.nextUrl.pathname.startsWith('/admin');
  if (isAdmin) return NextResponse.next();

  const res = await fetch('http://localhost:5000/api/maintenance/status');
  const { maintenance } = await res.json();

  if (maintenance) {
    return NextResponse.rewrite(new URL('/maintenance', req.url));
  }
}