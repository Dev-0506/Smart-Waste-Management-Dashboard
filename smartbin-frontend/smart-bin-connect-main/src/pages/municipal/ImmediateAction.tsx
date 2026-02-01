import MunicipalLayout from '@/components/layout/MunicipalLayout';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Battery, 
  Trash2, 
  MapPin,
  AlertCircle,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ImmediateAction() {
  const { getImmediateActionBins } = useData();
  const bins = getImmediateActionBins();

  const overflowBins = bins.filter(b => b.percentFilled >= 80);
  const lowBatteryBins = bins.filter(b => b.batteryStatus <= 20);
  const errorBins = bins.filter(b => b.status === 'error');

  const getPriorityColor = (bin: typeof bins[0]) => {
    if (bin.status === 'error') return 'destructive';
    if (bin.percentFilled >= 90 || bin.batteryStatus <= 10) return 'destructive';
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
        {bins.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Action Items</h2>
            <div className="space-y-3">
              {bins.map((bin) => {
                const priority = getPriorityColor(bin);
                const issues = [];
                if (bin.percentFilled >= 80) issues.push(`${bin.percentFilled}% full`);
                if (bin.batteryStatus <= 20) issues.push(`${bin.batteryStatus}% battery`);
                if (bin.status === 'error') issues.push('System error');

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
                              <span className="font-mono font-bold text-foreground">{bin.manufacturingId}</span>
                              <Badge variant={priority === 'destructive' ? 'destructive' : 'secondary'}>
                                {priority === 'destructive' ? 'Critical' : 'High'}
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

                        <div className="flex flex-wrap gap-1">
                          {issues.map((issue, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
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
                <AlertTriangle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground">All systems normal</h3>
              <p className="text-muted-foreground">No bins require immediate attention</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MunicipalLayout>
  );
}
