// GET /api/devices
import { NextRequest, NextResponse } from 'next/server';
import { getAllDevices } from '@/lib/devices';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as 'online' | 'offline' | null;

  if (status && !['online', 'offline'].includes(status)) {
    return NextResponse.json(
      { error: "status must be 'online' or 'offline'" },
      { status: 400 }
    );
  }

  const devices = getAllDevices(status || undefined);
  return NextResponse.json(devices);
}