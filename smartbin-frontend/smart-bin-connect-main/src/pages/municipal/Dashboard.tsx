import MunicipalLayout from '@/components/layout/MunicipalLayout';
import StatCard from '@/components/dashboard/StatCard';
import BinCard from '@/components/dashboard/BinCard';
import { useData } from '@/context/DataContext';
import { 
  Trash2, 
  AlertTriangle, 
  Battery, 
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function MunicipalDashboard() {
  const { bins, notifications, getImmediateActionBins } = useData();
  
  const activeBins = bins.filter(b => b.status === 'active').length;
  const immediateActionCount = getImmediateActionBins().length;
  const criticalAlerts = notifications.filter(n => n.severity === 'critical' && !n.read).length;
  const avgFillLevel = Math.round(bins.reduce((acc, b) => acc + b.percentFilled, 0) / bins.length);

  // Zone stats
  const zones = [...new Set(bins.map(b => b.zone))];
  const zoneStats = zones.map(zone => {
    const zoneBins = bins.filter(b => b.zone === zone);
    return {
      zone,
      count: zoneBins.length,
      avgFill: Math.round(zoneBins.reduce((acc, b) => acc + b.percentFilled, 0) / zoneBins.length),
    };
  });

  return (
    <MunicipalLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time overview of SmartBin network</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Bins"
            value={bins.length}
            icon={Trash2}
            description={`${activeBins} active`}
            variant="success"
          />
          <StatCard
            title="Avg Fill Level"
            value={`${avgFillLevel}%`}
            icon={TrendingUp}
            description="Across all bins"
          />
          <StatCard
            title="Immediate Action"
            value={immediateActionCount}
            icon={AlertTriangle}
            description="Bins need attention"
            variant={immediateActionCount > 0 ? 'warning' : 'default'}
          />
          <StatCard
            title="Critical Alerts"
            value={criticalAlerts}
            icon={Battery}
            description="Unread notifications"
            variant={criticalAlerts > 0 ? 'danger' : 'default'}
          />
        </div>

        {/* Zone Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Zone Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {zoneStats.map((stat) => (
                <div key={stat.zone} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{stat.zone}</span>
                    <span className="text-muted-foreground">{stat.count} bins • {stat.avgFill}% avg</span>
                  </div>
                  <Progress value={stat.avgFill} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Bins */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">All SmartBins</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bins.map((bin) => (
              <BinCard key={bin.id} bin={bin} />
            ))}
          </div>
        </div>
      </div>
    </MunicipalLayout>
  );
}
