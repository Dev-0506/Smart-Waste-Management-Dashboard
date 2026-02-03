import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeviceLayout from '@/components/layout/DeviceLayout';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Settings,
  Battery,
  Trash2,
  Send,
  CheckCircle2,
  Clock,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

export default function DeviceProfile() {
  const navigate = useNavigate();
  const { deviceProfile, updateDeviceProfile } = useAuth();
  const { addOnboardRequest } = useData();

  const [location, setLocation] = useState(deviceProfile?.location || '');
  const [region, setRegion] = useState('');
  const [installationStatus, setInstallationStatus] = useState<string>(deviceProfile?.installationStatus || 'pending');
  const [status, setStatus] = useState<string>(deviceProfile?.status || 'inactive');
  const [percentFilled, setPercentFilled] = useState<number>(deviceProfile?.percentFilled || 0);
  const [batteryStatus, setBatteryStatus] = useState<number>(deviceProfile?.batteryStatus || 100);
  const [saving, setSaving] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [requestingOnboard, setRequestingOnboard] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    const requestBody = {
      device_id: deviceProfile?.manufacturingId || '',
      smartbin_location: location,
      installationStatus: installationStatus,
      smartbin_status: status,
      smartbin_batteryStatus: batteryStatus,
      percent_filled: percentFilled,
      region: region,
    };

    try {
      const response = await fetch('http://localhost:8080/smartbin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        updateDeviceProfile({
          location,
          installationStatus: installationStatus as 'pending' | 'installed' | 'maintenance',
          status: status as 'active' | 'inactive' | 'error',
          percentFilled,
          batteryStatus,
        });

        toast.success('Profile saved successfully!');
        setIsProfileSaved(true);
      } else {
        toast.error('Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleRequestOnboard = async () => {
    if (!location) {
      toast.error('Please set a location before requesting onboard');
      return;
    }

    setRequestingOnboard(true);

    const requestBody = {
      device_id: deviceProfile?.manufacturingId || '',
      deviceOnBoardStatus: 'Requested',
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:8080/deviceOnboardRequest/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        if (deviceProfile?.manufacturingId) {
          addOnboardRequest(deviceProfile.manufacturingId, location);
          updateDeviceProfile({ onboardRequested: true });
        }
        toast.success('Onboard request sent to Municipal Authority!');
        navigate('/');
      } else {
        toast.error('Failed to submit onboard request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting onboard request:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setRequestingOnboard(false);
    }
  };

  const isProfileComplete = location && installationStatus === 'installed' && status === 'active';

  return (
    <DeviceLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile Setup</h1>
            <p className="text-muted-foreground">Configure your SmartBin device</p>
          </div>
        </div>

        {/* Status Banner */}
        {deviceProfile?.onboardRequested ? (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="p-4 flex items-center gap-3">
              {deviceProfile.onboarded ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">Device is onboarded and active</span>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">Onboard request pending approval</span>
                </>
              )}
            </CardContent>
          </Card>
        ) : null}

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Device Configuration</CardTitle>
            <CardDescription>Set up your SmartBin location and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                SmartBin Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., Sector 15, Block A, Near Community Park"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isProfileSaved}
              />
              <p className="text-xs text-muted-foreground">
                Provide a detailed address for easy identification
              </p>
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label htmlFor="region" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Region
              </Label>
              <Input
                id="region"
                placeholder="e.g., North Zone, District 5"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                disabled={isProfileSaved}
              />
              <p className="text-xs text-muted-foreground">
                Enter the region for this SmartBin
              </p>
            </div>

            {/* Installation Status */}
            <div className="space-y-2">
              <Label>Installation Status</Label>
              <Select value={installationStatus} onValueChange={setInstallationStatus} disabled={isProfileSaved}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending Installation</SelectItem>
                  <SelectItem value="installed">Installed</SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Device Status */}
            <div className="space-y-2">
              <Label>SmartBin Status</Label>
              <Select value={status} onValueChange={setStatus} disabled={isProfileSaved}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fill Level Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Fill Level (%)
                </Label>
                <Badge variant="outline">{percentFilled}%</Badge>
              </div>
              <Slider
                value={[percentFilled]}
                onValueChange={(v) => setPercentFilled(v[0])}
                max={100}
                step={1}
                className="w-full"
                disabled={isProfileSaved}
              />
            </div>

            {/* Battery Status Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Battery className="h-4 w-4" />
                  Battery Status (%)
                </Label>
                <Badge variant="outline">{batteryStatus}%</Badge>
              </div>
              <Slider
                value={[batteryStatus]}
                onValueChange={(v) => setBatteryStatus(v[0])}
                max={100}
                step={1}
                className="w-full"
                disabled={isProfileSaved}
              />
            </div>

            <Button onClick={handleSave} className="w-full" disabled={saving || isProfileSaved}>
              {saving ? 'Saving...' : isProfileSaved ? 'Profile Saved' : 'Save Profile'}
            </Button>
          </CardContent>
        </Card>

        {/* Request to Onboard */}
        <Card className={!isProfileSaved ? 'opacity-60' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Request to Onboard
            </CardTitle>
            <CardDescription>
              Submit this device to the Municipal Authority for onboarding
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isProfileSaved ? (
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Save your profile first to enable onboarding request.
                  <br />
                  Complete and save your device configuration above.
                </p>
              </div>
            ) : deviceProfile?.onboardRequested ? (
              <div className="p-4 bg-primary/10 rounded-lg text-center">
                <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-foreground font-medium">Request Submitted</p>
                <p className="text-sm text-muted-foreground">
                  Waiting for Municipal Authority approval
                </p>
              </div>
            ) : (
              <Button
                onClick={handleRequestOnboard}
                className="w-full gap-2"
                size="lg"
                disabled={requestingOnboard}
              >
                <Send className="h-4 w-4" />
                {requestingOnboard ? 'Submitting...' : 'Request to Onboard'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </DeviceLayout>
  );
}
