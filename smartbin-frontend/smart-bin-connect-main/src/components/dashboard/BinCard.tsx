import { SmartBin } from '@/types/smartbin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Battery, MapPin, Thermometer, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BinCardProps {
  bin: SmartBin;
  compact?: boolean;
}

export default function BinCard({ bin, compact = false }: BinCardProps) {
  const fillColor = bin.percentFilled >= 80 
    ? 'text-destructive' 
    : bin.percentFilled >= 60 
      ? 'text-warning' 
      : 'text-primary';

  const statusColor = {
    active: 'bg-primary/10 text-primary border-primary/20',
    inactive: 'bg-muted text-muted-foreground border-muted',
    error: 'bg-destructive/10 text-destructive border-destructive/20',
  }[bin.status];

  const batteryColor = bin.batteryStatus <= 20 
    ? 'text-destructive' 
    : bin.batteryStatus <= 40 
      ? 'text-warning' 
      : 'text-primary';

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-foreground">{bin.manufacturingId}</span>
              <Badge variant="outline" className={cn("text-xs", statusColor)}>
                {bin.status}
              </Badge>
            </div>
            <span className={cn("text-2xl font-bold", fillColor)}>{bin.percentFilled}%</span>
          </div>
          <Progress value={bin.percentFilled} className="h-2 mb-3" />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{bin.location}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-mono text-lg">{bin.manufacturingId}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{bin.zone}</p>
          </div>
          <Badge variant="outline" className={cn("capitalize", statusColor)}>
            {bin.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fill Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Fill Level</span>
            <span className={cn("text-xl font-bold", fillColor)}>{bin.percentFilled}%</span>
          </div>
          <Progress value={bin.percentFilled} className="h-3" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-lg">
            <Battery className={cn("h-4 w-4", batteryColor)} />
            <div>
              <p className="text-xs text-muted-foreground">Battery</p>
              <p className={cn("font-medium", batteryColor)}>{bin.batteryStatus}%</p>
            </div>
          </div>
          {bin.temperature && (
            <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-lg">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Temp</p>
                <p className="font-medium text-foreground">{bin.temperature}°C</p>
              </div>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <span className="text-foreground">{bin.location}</span>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Updated {formatTime(bin.lastUpdated)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
