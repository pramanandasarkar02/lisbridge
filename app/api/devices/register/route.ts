// POST /api/devices/register
import { NextRequest, NextResponse } from 'next/server';
import { registerDevice } from '@/lib/devices';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, deviceName, deviceType, status } = body;

    if (!deviceId || !deviceName || !deviceType || !['online', 'offline'].includes(status)) {
      return NextResponse.json(
        { error: 'Missing or invalid fields' },
        { status: 400 }
      );
    }

    const device = registerDevice({
      deviceId,
      deviceName,
      deviceType,
      status: status as 'online' | 'offline',
    });

    return NextResponse.json(device, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    );
  }
}