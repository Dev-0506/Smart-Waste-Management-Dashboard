import { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

export default function DeviceProfile() {
  const { deviceProfile, updateDeviceProfile } = useAuth();
  const { addOnboardRequest } = useData();

  const [location, setLocation] = useState(deviceProfile?.location || '');
  const [installationStatus, setInstallationStatus] = useState<string>(deviceProfile?.installationStatus || 'pending');
  const [status, setStatus] = useState<string>(deviceProfile?.status || 'inactive');
  const [percentFilled, setPercentFilled] = useState<number>(deviceProfile?.percentFilled || 0);
  const [batteryStatus, setBatteryStatus] = useState<number>(deviceProfile?.batteryStatus || 100);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    updateDeviceProfile({
      location,
      installationStatus: installationStatus as 'pending' | 'installed' | 'maintenance',
      status: status as 'active' | 'inactive' | 'error',
      percentFilled,
      batteryStatus,
    });

    toast.success('Profile updated successfully!');
    setSaving(false);
  };

  const handleRequestOnboard = () => {
    if (!location) {
      toast.error('Please set a location before requesting onboard');
      return;
    }
    if (deviceProfile?.manufacturingId) {
      addOnboardRequest(deviceProfile.manufacturingId, location);
      updateDeviceProfile({ onboardRequested: true });
      toast.success('Onboard request sent to Municipal Authority!');
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
              />
              <p className="text-xs text-muted-foreground">
                Provide a detailed address for easy identification
              </p>
            </div>

            {/* Installation Status */}
            <div className="space-y-2">
              <Label>Installation Status</Label>
              <Select value={installationStatus} onValueChange={setInstallationStatus}>
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
              <Select value={status} onValueChange={setStatus}>
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
              />
            </div>

            <Button onClick={handleSave} className="w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </CardContent>
        </Card>

        {/* Request to Onboard */}
        <Card className={!isProfileComplete ? 'opacity-60' : ''}>
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
            {!isProfileComplete ? (
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Complete your profile setup to enable onboarding request.
                  <br />
                  Required: Location, Installation Status (Installed), Status (Active)
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
              >
                <Send className="h-4 w-4" />
                Request to Onboard
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </DeviceLayout>
  );
}
