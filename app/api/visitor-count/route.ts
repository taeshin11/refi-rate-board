import { NextResponse } from 'next/server';

let totalVisitors = 1247; // baseline
let lastReset = new Date().toDateString();

export async function GET() {
  const today = new Date().toDateString();
  if (today !== lastReset) {
    lastReset = today;
  }
  return NextResponse.json({ total: totalVisitors });
}

export async function POST() {
  totalVisitors++;
  return NextResponse.json({ total: totalVisitors });
}
