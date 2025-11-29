// GET /api/devices/[uuid]/data/route.ts
import { NextResponse } from 'next/server';
import { getDeviceByUuid, generateMockTestResults } from '@/lib/devices';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> }  
) {
  const { uuid } = await params;

  const device = getDeviceByUuid(uuid);
  if (!device) {
    return NextResponse.json(
      { error: 'Device not found' },
      { status: 404 }
    );
  }

  const mockData = generateMockTestResults(device.deviceName);
  return NextResponse.json(mockData);
}
