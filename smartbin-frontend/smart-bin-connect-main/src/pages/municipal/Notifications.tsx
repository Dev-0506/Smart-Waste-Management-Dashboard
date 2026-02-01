import MunicipalLayout from '@/components/layout/MunicipalLayout';
import { useData } from '@/context/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  AlertTriangle, 
  Battery, 
  Thermometer, 
  Wrench,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Notifications() {
  const { notifications, markNotificationRead, bins } = useData();

  const getIcon = (type: string) => {
    switch (type) {
      case 'overflow': return AlertTriangle;
      case 'battery': return Battery;
      case 'temperature': return Thermometer;
      case 'maintenance': return Wrench;
      default: return Bell;
    }
  };

  const severityStyles = {
    critical: 'border-l-destructive bg-destructive/5',
    high: 'border-l-warning bg-warning/5',
    medium: 'border-l-primary bg-primary/5',
    low: 'border-l-muted bg-muted/20',
  };

  const severityBadgeStyles = {
    critical: 'bg-destructive text-destructive-foreground',
    high: 'bg-warning text-warning-foreground',
    medium: 'bg-primary text-primary-foreground',
    low: 'bg-muted text-muted-foreground',
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const sortedNotifications = [...notifications].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <MunicipalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notification Center</h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount > 0 
                ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All notifications read'
              }
            </p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {sortedNotifications.map((notification) => {
            const Icon = getIcon(notification.type);
            const bin = bins.find(b => b.id === notification.binId);
            
            return (
              <Card 
                key={notification.id} 
                className={cn(
                  "border-l-4 transition-all",
                  severityStyles[notification.severity],
                  notification.read && "opacity-60"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-2 rounded-lg",
                      notification.severity === 'critical' ? 'bg-destructive/10 text-destructive' :
                      notification.severity === 'high' ? 'bg-warning/10 text-warning' :
                      'bg-primary/10 text-primary'
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge className={cn("text-xs", severityBadgeStyles[notification.severity])}>
                          {notification.severity}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                      
                      <p className="text-foreground font-medium">{notification.message}</p>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(notification.createdAt)}
                        </span>
                        {bin && (
                          <span>Location: {bin.location}</span>
                        )}
                      </div>
                    </div>

                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markNotificationRead(notification.id)}
                        className="shrink-0"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <Card className="py-12">
            <CardContent className="text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">No notifications</h3>
              <p className="text-muted-foreground">All systems are running smoothly</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MunicipalLayout>
  );
}
