import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MunicipalUser, DeviceProfile } from '@/types/smartbin';

interface AuthContextType {
  municipalUser: MunicipalUser | null;
  deviceProfile: DeviceProfile | null;
  loginMunicipal: (email: string, password: string) => boolean;
  loginDevice: (manufacturingId: string, password: string) => boolean;
  setDeviceProfileDirect: (manufacturingId: string) => void;
  logoutMunicipal: () => void;
  logoutDevice: () => void;
  updateDeviceProfile: (profile: Partial<DeviceProfile>) => void;
  changeDevicePassword: (oldPassword: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [municipalUser, setMunicipalUser] = useState<MunicipalUser | null>(null);
  const [deviceProfile, setDeviceProfile] = useState<DeviceProfile | null>(null);
  const [devicePassword, setDevicePassword] = useState<string>('default123');

  const loginMunicipal = (email: string, password: string): boolean => {
    // Demo login - accept any valid format
    if (email && password.length >= 4) {
      setMunicipalUser({
        id: '1',
        name: 'Municipal Admin',
        email,
        role: 'admin',
      });
      return true;
    }
    return false;
  };

  const loginDevice = (manufacturingId: string, password: string): boolean => {
    // Demo: accept format SB-XXXX with default password
    if (manufacturingId.match(/^SB-\d{4}$/) && password === devicePassword) {
      setDeviceProfile({
        manufacturingId,
        location: '',
        installationStatus: 'pending',
        status: 'inactive',
        percentFilled: 0,
        batteryStatus: 100,
        onboardRequested: false,
        onboarded: false,
      });
      return true;
    }
    return false;
  };

  // Direct profile setter for when API auth has already succeeded
  const setDeviceProfileDirect = (manufacturingId: string) => {
    setDeviceProfile({
      manufacturingId,
      location: '',
      installationStatus: 'pending',
      status: 'inactive',
      percentFilled: 0,
      batteryStatus: 100,
      onboardRequested: false,
      onboarded: false,
    });
  };

  const logoutMunicipal = () => setMunicipalUser(null);
  const logoutDevice = () => setDeviceProfile(null);

  const updateDeviceProfile = (profile: Partial<DeviceProfile>) => {
    if (deviceProfile) {
      setDeviceProfile({ ...deviceProfile, ...profile });
    }
  };

  const changeDevicePassword = (oldPassword: string, newPassword: string): boolean => {
    if (oldPassword === devicePassword && newPassword.length >= 6) {
      setDevicePassword(newPassword);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      municipalUser,
      deviceProfile,
      loginMunicipal,
      loginDevice,
      setDeviceProfileDirect,
      logoutMunicipal,
      logoutDevice,
      updateDeviceProfile,
      changeDevicePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
