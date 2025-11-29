// lib/devices.ts
import { v4 as uuidv4 } from 'uuid';

export type DeviceStatus = 'online' | 'offline';
export type TestStatus = 'normal' | 'abnormal';

export interface TestResult {
  timestamp: string; // ISO string
  testType: string;
  value: number;
  unit: string;
  status: TestStatus;
}

export interface Device {
  uuid: string;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  status: DeviceStatus;
  registeredAt: string;
}

let devices: Device[] = [];

// Helper to get device by UUID
export const getDeviceByUuid = (uuid: string): Device | undefined => {
  return devices.find(d => d.uuid === uuid);
};

// Register new device
export const registerDevice = (data: {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  status: DeviceStatus;
}): Device => {
  const newDevice: Device = {
    uuid: uuidv4(),
    ...data,
    registeredAt: new Date().toISOString(),
  };
  devices.push(newDevice);
  return newDevice;
};

// Get all devices (with optional status filter)
export const getAllDevices = (status?: DeviceStatus): Device[] => {
  if (!status) return [...devices];
  return devices.filter(d => d.status === status);
};

// Update device status
export const updateDeviceStatus = (uuid: string, status: DeviceStatus): Device | null => {
  const device = getDeviceByUuid(uuid);
  if (!device) return null;
  device.status = status;
  return device;
};

// Mock lab test data generator
export const generateMockTestResults = (deviceName: string): TestResult[] => {
  const testTypes = [
    'Glucose', 'Hemoglobin A1c', 'Cholesterol', 'Blood Pressure', 
    'CRP', 'Sodium', 'Potassium', 'Creatinine', 'ALT', 'AST'
  ];

  const results: TestResult[] = [];
  const now = Date.now();

  for (let i = 0; i < Math.floor(Math.random() * 6) + 5; i++) {
    const testType = testTypes[Math.floor(Math.random() * testTypes.length)];
    const baseValue = Math.random() * 100 + 20;
    const isAbnormal = Math.random() < 0.3;

    let value = baseValue;
    let unit = 'mg/dL';
    let status: TestStatus = isAbnormal ? 'abnormal' : 'normal';

    // Customize per test type
    switch (testType) {
      case 'Blood Pressure':
        value = Math.round(90 + Math.random() * 70);
        unit = 'mmHg';
        status = value > 140 || value < 90 ? 'abnormal' : 'normal';
        break;
      case 'Glucose':
        status = value > 140 ? 'abnormal' : 'normal';
        break;
      case 'Hemoglobin A1c':
        value = parseFloat((5 + Math.random() * 7).toFixed(1));
        unit = '%';
        status = value > 7 ? 'abnormal' : 'normal';
        break;
    }

    results.push({
      timestamp: new Date(now - i * 3600000).toISOString(),
      testType,
      value: parseFloat(value.toFixed(2)),
      unit,
      status,
    });
  }

  return results.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
};