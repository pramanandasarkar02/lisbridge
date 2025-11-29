'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  Plus,
  Search,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

// Types
type DeviceStatus = 'online' | 'offline';
type TestStatus = 'normal' | 'abnormal';

interface TestResult {
  timestamp: string;
  testType: string;
  value: number;
  unit: string;
  status: TestStatus;
}

interface Device {
  uuid: string;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  status: DeviceStatus;
  registeredAt: string;
}

// Form Schema
const deviceSchema = z.object({
  deviceId: z.string().min(3, 'Device ID must be at least 3 characters'),
  deviceName: z.string().min(2, 'Name is required'),
  deviceType: z.string().min(2, 'Type is required'),
  status: z.enum(['online', 'offline']),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

export default function DevicesDashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | DeviceStatus>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
  });

  // Apply filter whenever devices or filterStatus changes
  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredDevices(devices);
    } else {
      setFilteredDevices(devices.filter(device => device.status === filterStatus));
    }
  }, [devices, filterStatus]);

  // Fetch devices
  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/devices${filterStatus !== 'all' ? `?status=${filterStatus}` : ''}`);
      const data = await res.json();
      setDevices(data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load devices' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Load test results when device selected
  const loadTestResults = async (device: Device) => {
    try {
      const res = await fetch(`/api/devices/${device.uuid}/data`);
      const data = await res.json();
      setTestResults(data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load test results' });
    }
  };

  const onSubmit = async (data: DeviceFormData) => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/devices/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const newDevice = await res.json();
        // Add new device to the devices array
        setDevices(prev => [...prev, newDevice]);
        reset();
        setShowAddForm(false);
        setMessage({ type: 'success', text: 'Device registered successfully!' });
        
        // Auto-dismiss success message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to register device' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateDeviceStatus = async (uuid: string, status: DeviceStatus) => {
    try {
      await fetch(`/api/devices/${uuid}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      // Update device in local state instead of refetching
      setDevices(prev => 
        prev.map(device => 
          device.uuid === uuid ? { ...device, status } : device
        )
      );
      
      // Update selected device if it's the one being updated
      if (selectedDevice?.uuid === uuid) {
        setSelectedDevice(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">LISBridge Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your laboratory devices and test results.</p>
            <p className='text-red-400'>(If there have error when closing device details refresh it. it is client side err. short time to fix it :)</p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              {message.text}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between">
            <div className="flex gap-3">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All ({devices.length})
              </button>
              <button
                onClick={() => setFilterStatus('online')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  filterStatus === 'online'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Activity size={16} /> Online ({devices.filter(d => d.status === 'online').length})
              </button>
              <button
                onClick={() => setFilterStatus('offline')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === 'offline'
                    ? 'bg-gray-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Offline ({devices.filter(d => d.status === 'offline').length})
              </button>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 justify-center"
            >
              <Plus size={20} /> Add Device
            </button>
          </div>

          {/* Device Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Search size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">
                {devices.length === 0 ? 'No devices registered yet' : 'No devices match this filter'}
              </p>
              <p className="text-sm">
                {devices.length === 0 ? 'Click "Add Device" to get started.' : 'Try selecting a different filter.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDevices.map((device) => (
                <div
                  key={device.uuid}
                  onClick={() => {
                    setSelectedDevice(device);
                    loadTestResults(device);
                  }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{device.deviceName}</h3>
                      <p className="text-sm text-gray-500">{device.deviceType}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        device.status === 'online'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {device.status === 'online' ? (
                        <Activity size={14} className="text-green-600" />
                      ) : (
                        <Clock size={14} />
                      )}
                      {device.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-mono">ID: {device.deviceId}</p>
                    <p>Registered: {format(new Date(device.registeredAt), 'MMM d, yyyy')}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateDeviceStatus(device.uuid, device.status === 'online' ? 'offline' : 'online');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Toggle {device.status === 'online' ? 'Offline' : 'Online'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Device Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-6">Register New Device</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device ID</label>
                  <input
                    {...register('deviceId')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="DEV-001"
                  />
                  {errors.deviceId && <p className="text-red-500 text-sm mt-1">{errors.deviceId.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Name</label>
                  <input
                    {...register('deviceName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Blood Analyzer Pro"
                  />
                  {errors.deviceName && <p className="text-red-500 text-sm mt-1">{errors.deviceName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
                  <input
                    {...register('deviceType')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="analyzer"
                  />
                  {errors.deviceType && <p className="text-red-500 text-sm mt-1">{errors.deviceType.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="animate-spin" size={20} />}
                    Register Device
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      reset();
                      setMessage(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Device Details Modal with Chart */}
        {selectedDevice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedDevice.deviceName}</h2>
                    <p className="text-gray-600">{selectedDevice.deviceType} • {selectedDevice.deviceId}</p>
                  </div>
                  <button
                    onClick={() => setSelectedDevice(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Chart Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Test Results Trend (Last 10)</h3>
                  {testResults.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No data to display</p>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={[...testResults].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="timestamp" 
                            tickFormatter={(ts) => format(new Date(ts), 'HH:mm')}
                            fontSize={12}
                          />
                          <YAxis fontSize={12} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                            labelFormatter={(ts) => format(new Date(ts), 'MMM d, HH:mm')}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6', r: 4 }}
                            activeDot={{ r: 6 }}
                            name={`${testResults[0]?.testType || 'Value'} (${testResults[0]?.unit || ''})`}
                          />
                          {/* Optional: Status reference lines */}
                          {testResults.some(r => r.status === 'abnormal') && (
                            <ReferenceLine y={Math.max(...testResults.map(r => r.value)) * 0.8} stroke="red" strokeDasharray="5 5" />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Showing values over time. Red dashed line indicates potential abnormal threshold.
                      </p>
                    </div>
                  )}
                </div>

                {/* Test Results Table */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Test Results</h3>
                  {testResults.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No test results available</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Timestamp</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Test Type</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Value</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testResults.map((result, i) => (
                            <tr key={i} className="border-b border-gray-100">
                              <td className="py-3 px-4 text-sm">
                                {format(new Date(result.timestamp), 'MMM d, HH:mm')}
                              </td>
                              <td className="py-3 px-4 font-medium">{result.testType}</td>
                              <td className="py-3 px-4">
                                {result.value} {result.unit}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    result.status === 'normal'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {result.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}