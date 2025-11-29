// PATCH /api/devices/[uuid]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateDeviceStatus, getDeviceByUuid } from '@/lib/devices';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }  
) {
  const { uuid } = await params; 

  try {
    const { status } = await request.json();

    if (!['online', 'offline'].includes(status)) {
      return NextResponse.json(
        { error: "status must be 'online' or 'offline'" },
        { status: 400 }
      );
    }

    const updated = updateDeviceStatus(uuid, status as 'online' | 'offline');
    if (!updated) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }
}