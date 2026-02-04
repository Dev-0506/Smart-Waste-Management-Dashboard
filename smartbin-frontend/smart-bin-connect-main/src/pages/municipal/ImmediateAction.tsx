import MunicipalLayout from '@/components/layout/MunicipalLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  Battery,
  Trash2,
  MapPin,
  AlertCircle,
  Zap,
  Loader2,
  Inbox
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Interface for nested smartBin object in API response
interface SmartBinData {
  device_id: string;
  id: number;
  installationStatus: string;
  is_smartbin_Onboarded: boolean;
  percent_filled: number;
  region: string;
  smartbin_batteryStatus: string;
  smartbin_location: string;
  smartbin_status: string;
}

// Interface for API response
interface ApiImmediateActionBin {
  id: number;
  immediateAction_status: string;
  smartBin: SmartBinData;
}

// Interface for component usage
interface ImmediateActionBin {
  id: number;
  deviceId: string;
  status: string;
  percentFilled: number;
  batteryStatus: number;
  location: string;
  region: string;
  smartbinStatus: string;
}

export default function ImmediateAction() {
  const [bins, setBins] = useState<ImmediateActionBin[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch immediate action bins from API
  useEffect(() => {
    fetchImmediateActionBins();
  }, []);

  const mapApiResponse = (apiItem: ApiImmediateActionBin): ImmediateActionBin => {
    const smartBin = apiItem.smartBin;
    return {
      id: apiItem.id,
      deviceId: smartBin?.device_id || 'Unknown Device',
      status: apiItem.immediateAction_status || 'Unknown',
      percentFilled: smartBin?.percent_filled || 0,
      batteryStatus: parseInt(smartBin?.smartbin_batteryStatus || '0', 10),
      location: smartBin?.smartbin_location || 'Unknown Location',
      region: smartBin?.region || 'Unknown Region',
      smartbinStatus: smartBin?.smartbin_status || 'unknown',
    };
  };

  const fetchImmediateActionBins = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/immediateActionBin/find');
      if (response.ok) {
        const data: ApiImmediateActionBin[] = await response.json();
        console.log('Immediate Action API Response:', data);
        const mappedData = data.map(mapApiResponse);
        console.log('Mapped Immediate Action Data:', mappedData);
        setBins(mappedData);
      } else {
        toast.error('Failed to fetch immediate action bins');
      }
    } catch (error) {
      console.error('Error fetching immediate action bins:', error);
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary counts based on API data
  const overflowBins = bins.filter(b => b.percentFilled >= 80);
  const lowBatteryBins = bins.filter(b => b.batteryStatus <= 20);
  const errorBins = bins.filter(b => b.smartbinStatus === 'error');

  const getPriorityColor = (bin: ImmediateActionBin) => {
    if (bin.status === 'Critical') return 'destructive';
    return 'warning';
  };

  return (
    <MunicipalLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-destructive/10 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Immediate Action Required</h1>
            <p className="text-muted-foreground mt-1">
              {bins.length} bin{bins.length !== 1 ? 's' : ''} need{bins.length === 1 ? 's' : ''} urgent attention
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className={cn(
            "border-2",
            overflowBins.length > 0 ? "border-warning/50 bg-warning/5" : "border-border"
          )}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Trash2 className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{overflowBins.length}</p>
                <p className="text-sm text-muted-foreground">Overflow Risk</p>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            "border-2",
            lowBatteryBins.length > 0 ? "border-destructive/50 bg-destructive/5" : "border-border"
          )}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <Battery className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{lowBatteryBins.length}</p>
                <p className="text-sm text-muted-foreground">Low Battery</p>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            "border-2",
            errorBins.length > 0 ? "border-destructive/50 bg-destructive/5" : "border-border"
          )}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{errorBins.length}</p>
                <p className="text-sm text-muted-foreground">System Errors</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bins List */}
        {loading ? (
          <Card className="py-8">
            <CardContent className="text-center">
              <Loader2 className="h-10 w-10 mx-auto text-primary mb-3 animate-spin" />
              <p className="text-muted-foreground">Loading immediate action bins...</p>
            </CardContent>
          </Card>
        ) : bins.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Action Items</h2>
            <div className="space-y-3">
              {bins.map((bin) => {
                const priority = getPriorityColor(bin);

                return (
                  <Card
                    key={bin.id}
                    className={cn(
                      "border-l-4",
                      priority === 'destructive'
                        ? "border-l-destructive bg-destructive/5"
                        : "border-l-warning bg-warning/5"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={cn(
                            "p-3 rounded-lg",
                            priority === 'destructive'
                              ? "bg-destructive/10 text-destructive"
                              : "bg-warning/10 text-warning"
                          )}>
                            <Zap className="h-5 w-5" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono font-bold text-foreground">{bin.deviceId}</span>
                              <Badge variant={priority === 'destructive' ? 'destructive' : 'secondary'}>
                                {bin.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {bin.location}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 lg:w-1/2">
                          {/* Fill Level */}
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Fill Level</span>
                              <span className={cn(
                                "font-medium",
                                bin.percentFilled >= 80 ? "text-destructive" : "text-foreground"
                              )}>
                                {bin.percentFilled}%
                              </span>
                            </div>
                            <Progress value={bin.percentFilled} className="h-2" />
                          </div>

                          {/* Battery */}
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Battery</span>
                              <span className={cn(
                                "font-medium",
                                bin.batteryStatus <= 20 ? "text-destructive" : "text-foreground"
                              )}>
                                {bin.batteryStatus}%
                              </span>
                            </div>
                            <Progress value={bin.batteryStatus} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <Card className="py-12">
            <CardContent className="text-center">
              <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit mb-4">
                <Inbox className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No Immediate Smart Bin Action Pending</h3>
              <p className="text-muted-foreground">All SmartBins are operating normally</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MunicipalLayout>
  );
}
