import MunicipalLayout from '@/components/layout/MunicipalLayout';
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
  Clock,
  Info,
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
interface ApiNotification {
  id: number;
  createdAt: string;
  message: string;
  read: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  smartBin: SmartBinData | null;
}

// Interface for component usage
interface Notification {
  id: number;
  createdAt: Date;
  message: string;
  read: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  location: string | null;
  deviceId: string | null;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from API
  useEffect(() => {
    fetchNotifications();
  }, []);

  const mapApiResponse = (apiItem: ApiNotification): Notification => {
    return {
      id: apiItem.id,
      createdAt: new Date(apiItem.createdAt),
      message: apiItem.message,
      read: apiItem.read,
      severity: apiItem.severity,
      type: apiItem.type,
      location: apiItem.smartBin?.smartbin_location || null,
      deviceId: apiItem.smartBin?.device_id || null,
    };
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/notification/find');
      if (response.ok) {
        const data: ApiNotification[] = await response.json();
        console.log('Notifications API Response:', data);
        const mappedData = data.map(mapApiResponse);
        console.log('Mapped Notifications Data:', mappedData);
        setNotifications(mappedData);
      } else {
        toast.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const markNotificationRead = async (id: number) => {
    // Update local state for immediate UI feedback
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'overflow': return AlertTriangle;
      case 'battery': return Battery;
      case 'temperature': return Thermometer;
      case 'maintenance': return Wrench;
      case 'information': return Info;
      default: return Bell;
    }
  };

  const getIconStyles = (type: string, severity: string) => {
    // Information type gets a distinct blue/info style
    if (type === 'information') {
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    }
    // Other types based on severity
    if (severity === 'critical') return 'bg-destructive/10 text-destructive';
    if (severity === 'high') return 'bg-warning/10 text-warning';
    return 'bg-primary/10 text-primary';
  };

  const severityStyles: Record<string, string> = {
    critical: 'border-l-destructive bg-destructive/5',
    high: 'border-l-warning bg-warning/5',
    medium: 'border-l-primary bg-primary/5',
    low: 'border-l-muted bg-muted/20',
  };

  const severityBadgeStyles: Record<string, string> = {
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

        {/* Loading State */}
        {loading ? (
          <Card className="py-8">
            <CardContent className="text-center">
              <Loader2 className="h-10 w-10 mx-auto text-primary mb-3 animate-spin" />
              <p className="text-muted-foreground">Loading notifications...</p>
            </CardContent>
          </Card>
        ) : notifications.length > 0 ? (
          /* Notifications List */
          <div className="space-y-3">
            {sortedNotifications.map((notification) => {
              const Icon = getIcon(notification.type);

              return (
                <Card
                  key={notification.id}
                  className={cn(
                    "border-l-4 transition-all",
                    severityStyles[notification.severity] || severityStyles.medium,
                    notification.read && "opacity-60"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-2 rounded-lg",
                        getIconStyles(notification.type, notification.severity)
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Badge className={cn("text-xs", severityBadgeStyles[notification.severity] || severityBadgeStyles.medium)}>
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
                          {notification.location && (
                            <span>Location: {notification.location}</span>
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
        ) : (
          /* Empty State */
          <Card className="py-12">
            <CardContent className="text-center">
              <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit mb-4">
                <Inbox className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No Notification Present Yet</h3>
              <p className="text-muted-foreground">All systems are running smoothly</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MunicipalLayout>
  );
}
