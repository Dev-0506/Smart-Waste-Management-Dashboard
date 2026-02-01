import MunicipalLayout from '@/components/layout/MunicipalLayout';
import { useData } from '@/context/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Link2, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Inbox
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Connections() {
  const { onboardRequests, acceptOnboardRequest } = useData();

  const pendingRequests = onboardRequests.filter(r => r.status === 'pending');
  const acceptedRequests = onboardRequests.filter(r => r.status === 'accepted');

  const handleAccept = (id: string, manufacturingId: string) => {
    acceptOnboardRequest(id);
    toast.success(`SmartBin ${manufacturingId} has been onboarded successfully!`);
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <MunicipalLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Link2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Connection Requests</h1>
            <p className="text-muted-foreground mt-1">
              Manage SmartBin onboarding requests
            </p>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Pending Requests</h2>
            <Badge variant="secondary" className="text-sm">
              {pendingRequests.length} pending
            </Badge>
          </div>

          {pendingRequests.length > 0 ? (
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono font-bold text-lg text-foreground">
                            {request.manufacturingId}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            New Device
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {request.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Requested {formatTime(request.requestedAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleAccept(request.id, request.manufacturingId)}
                          className="gap-2"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Accept
                        </Button>
                        <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="py-8">
              <CardContent className="text-center">
                <Inbox className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No pending requests</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recently Accepted */}
        {acceptedRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Recently Onboarded</h2>
            <div className="space-y-3">
              {acceptedRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-primary/30 opacity-80">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-foreground">
                            {request.manufacturingId}
                          </span>
                          <Badge className="bg-primary/10 text-primary border-0">
                            Onboarded
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{request.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </MunicipalLayout>
  );
}
