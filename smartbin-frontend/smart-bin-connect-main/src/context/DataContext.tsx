import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SmartBin, Notification, OnboardRequest } from '@/types/smartbin';

// Mock data
const initialBins: SmartBin[] = [
  {
    id: '1',
    manufacturingId: 'SB-0001',
    location: 'Sector 15, Block A',
    zone: 'North Zone',
    installationStatus: 'installed',
    status: 'active',
    percentFilled: 87,
    batteryStatus: 45,
    lastUpdated: new Date(),
    temperature: 32,
    onboarded: true,
  },
  {
    id: '2',
    manufacturingId: 'SB-0002',
    location: 'Sector 22, Main Market',
    zone: 'Central Zone',
    installationStatus: 'installed',
    status: 'active',
    percentFilled: 92,
    batteryStatus: 78,
    lastUpdated: new Date(),
    temperature: 35,
    onboarded: true,
  },
  {
    id: '3',
    manufacturingId: 'SB-0003',
    location: 'Industrial Area, Phase 1',
    zone: 'East Zone',
    installationStatus: 'installed',
    status: 'active',
    percentFilled: 45,
    batteryStatus: 92,
    lastUpdated: new Date(),
    temperature: 28,
    onboarded: true,
  },
  {
    id: '4',
    manufacturingId: 'SB-0004',
    location: 'Residential Colony, Block B',
    zone: 'South Zone',
    installationStatus: 'installed',
    status: 'error',
    percentFilled: 15,
    batteryStatus: 12,
    lastUpdated: new Date(),
    temperature: 30,
    onboarded: true,
  },
  {
    id: '5',
    manufacturingId: 'SB-0005',
    location: 'City Center Mall',
    zone: 'Central Zone',
    installationStatus: 'installed',
    status: 'active',
    percentFilled: 68,
    batteryStatus: 65,
    lastUpdated: new Date(),
    temperature: 24,
    onboarded: true,
  },
];

const initialNotifications: Notification[] = [
  {
    id: '1',
    binId: '2',
    type: 'overflow',
    message: 'Bin SB-0002 at Sector 22 is 92% full - Immediate collection required',
    severity: 'critical',
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
  },
  {
    id: '2',
    binId: '1',
    type: 'overflow',
    message: 'Bin SB-0001 at Sector 15 is 87% full - Schedule pickup soon',
    severity: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
  },
  {
    id: '3',
    binId: '4',
    type: 'battery',
    message: 'Bin SB-0004 battery critically low at 12%',
    severity: 'critical',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: '4',
    binId: '4',
    type: 'maintenance',
    message: 'Bin SB-0004 reporting sensor error - Maintenance required',
    severity: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    read: true,
  },
  {
    id: '5',
    binId: '2',
    type: 'temperature',
    message: 'High temperature alert: Bin SB-0002 at 35°C',
    severity: 'medium',
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
  },
];

const initialRequests: OnboardRequest[] = [
  {
    id: '1',
    manufacturingId: 'SB-1001',
    location: 'New Residential Block, Phase 3',
    requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'pending',
  },
  {
    id: '2',
    manufacturingId: 'SB-1002',
    location: 'Tech Park, Building C',
    requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    status: 'pending',
  },
  {
    id: '3',
    manufacturingId: 'SB-1003',
    location: 'University Campus, Gate 2',
    requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    status: 'pending',
  },
];

interface DataContextType {
  bins: SmartBin[];
  notifications: Notification[];
  onboardRequests: OnboardRequest[];
  markNotificationRead: (id: string) => void;
  acceptOnboardRequest: (id: string) => void;
  addOnboardRequest: (manufacturingId: string, location: string) => void;
  getImmediateActionBins: () => SmartBin[];
  getUnreadNotificationsCount: () => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [bins, setBins] = useState<SmartBin[]>(initialBins);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [onboardRequests, setOnboardRequests] = useState<OnboardRequest[]>(initialRequests);

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const acceptOnboardRequest = (id: string) => {
    const request = onboardRequests.find(r => r.id === id);
    if (request) {
      // Update request status
      setOnboardRequests(prev =>
        prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r)
      );
      
      // Add new bin to the system
      const newBin: SmartBin = {
        id: `new-${Date.now()}`,
        manufacturingId: request.manufacturingId,
        location: request.location,
        zone: 'Newly Added',
        installationStatus: 'installed',
        status: 'active',
        percentFilled: 0,
        batteryStatus: 100,
        lastUpdated: new Date(),
        onboarded: true,
      };
      setBins(prev => [...prev, newBin]);
    }
  };

  const addOnboardRequest = (manufacturingId: string, location: string) => {
    const newRequest: OnboardRequest = {
      id: `req-${Date.now()}`,
      manufacturingId,
      location,
      requestedAt: new Date(),
      status: 'pending',
    };
    setOnboardRequests(prev => [...prev, newRequest]);
  };

  const getImmediateActionBins = (): SmartBin[] => {
    return bins.filter(bin => 
      bin.percentFilled >= 80 || 
      bin.batteryStatus <= 20 || 
      bin.status === 'error'
    );
  };

  const getUnreadNotificationsCount = (): number => {
    return notifications.filter(n => !n.read).length;
  };

  return (
    <DataContext.Provider value={{
      bins,
      notifications,
      onboardRequests,
      markNotificationRead,
      acceptOnboardRequest,
      addOnboardRequest,
      getImmediateActionBins,
      getUnreadNotificationsCount,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
