export interface SmartBin {
  id: string;
  manufacturingId: string;
  location: string;
  zone: string;
  installationStatus: 'pending' | 'installed' | 'maintenance';
  status: 'active' | 'inactive' | 'error';
  percentFilled: number;
  batteryStatus: number;
  lastUpdated: Date;
  temperature?: number;
  onboarded: boolean;
}

export interface OnboardRequest {
  id: string;
  deviceId: string;
  manufacturingId: string;
  location: string;
  region: string;
  requestedAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Notification {
  id: string;
  binId: string;
  type: 'overflow' | 'battery' | 'maintenance' | 'temperature';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  read: boolean;
}

export interface MunicipalUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator';
}

export interface DeviceProfile {
  manufacturingId: string;
  location: string;
  installationStatus: 'pending' | 'installed' | 'maintenance';
  status: 'active' | 'inactive' | 'error';
  percentFilled: number;
  batteryStatus: number;
  onboardRequested: boolean;
  onboarded: boolean;
}
