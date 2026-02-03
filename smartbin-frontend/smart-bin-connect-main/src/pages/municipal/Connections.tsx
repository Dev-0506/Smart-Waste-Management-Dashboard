import MunicipalLayout from '@/components/layout/MunicipalLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Link2,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Inbox,
  Globe,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

// Interface for nested smartBin object in API response
interface SmartBinData {
  device_id: string;
  smartbin_location: string;
  region: string;
  smartbin_status: string;
}

// Interface for API response
interface ApiOnboardRequest {
  id: number;
  createdAt: string;
  deviceOnBoardStatus: string;
  smartBin: SmartBinData;
}

// Interface for component usage
interface OnboardRequest {
  id: string;
  deviceId: string;
  manufacturingId: string;
  location: string;
  region: string;
  requestedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export default function Connections() {
  const [pendingRequests, setPendingRequests] = useState<OnboardRequest[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<OnboardRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  // Fetch pending requests from API
  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const mapApiResponse = (apiRequest: ApiOnboardRequest): OnboardRequest => {
    // Map API status to component status
    // API returns "Requested" for pending and "Completed" for onboarded
    const statusMap: Record<string, 'pending' | 'accepted' | 'rejected'> = {
      'Requested': 'pending',
      'requested': 'pending',
      'Completed': 'accepted',
      'completed': 'accepted',
      'Rejected': 'rejected',
      'rejected': 'rejected',
    };

    // Extract data from nested smartBin object
    const smartBin = apiRequest.smartBin;

    return {
      id: String(apiRequest.id),
      deviceId: smartBin?.device_id || 'Unknown Device',
      manufacturingId: smartBin?.device_id || 'Unknown Device',
      location: smartBin?.smartbin_location || 'Unknown Location',
      region: smartBin?.region || 'Unknown Region',
      requestedAt: apiRequest.createdAt,
      status: statusMap[apiRequest.deviceOnBoardStatus] || 'pending',
    };
  };

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/deviceOnboardRequest/find');
      if (response.ok) {
        const data: ApiOnboardRequest[] = await response.json();
        console.log('API Response:', data);
        console.log('First item deviceOnBoardStatus:', data[0]?.deviceOnBoardStatus);
        // Map API response to component format
        const mappedData = data.map(mapApiResponse);
        console.log('Mapped Data:', mappedData);
        // Filter pending and accepted requests
        const pending = mappedData.filter(r => r.status === 'pending');
        const accepted = mappedData.filter(r => r.status === 'accepted');
        console.log('Pending:', pending);
        console.log('Accepted:', accepted);
        setPendingRequests(pending);
        setAcceptedRequests(accepted);
      } else {
        toast.error('Failed to fetch onboard requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (request: OnboardRequest) => {
    try {
      setAcceptingId(request.id);
      const response = await fetch(
        `http://localhost:8080/deviceOnboardRequest/accept/${request.deviceId}`,
        { method: 'PUT' }
      );

      if (response.ok) {
        const responseText = await response.text();

        if (responseText === 'ACCEPTED') {
          toast.success(`SmartBin ${request.manufacturingId} has been onboarded successfully!`);
          // Move to accepted list
          setPendingRequests(prev => prev.filter(r => r.id !== request.id));
          setAcceptedRequests(prev => [...prev, { ...request, status: 'accepted' }]);
        } else if (responseText === 'FAILED') {
          toast.error(`Failed to onboard SmartBin ${request.manufacturingId}. Please try again.`);
        } else {
          toast.error(`Unexpected response while onboarding SmartBin ${request.manufacturingId}`);
        }
      } else {
        toast.error(`Failed to accept request. Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Error connecting to server. Please try again.');
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (request: OnboardRequest) => {
    try {
      setRejectingId(request.id);
      const response = await fetch(
        `http://localhost:8080/deviceOnboardRequest/reject/${request.deviceId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        const responseText = await response.text();

        if (responseText === 'ACCEPTED') {
          toast.success(`SmartBin ${request.manufacturingId} request has been rejected.`);
          // Refresh the list after successful rejection
          await fetchPendingRequests();
        } else {
          toast.error(`Failed to reject SmartBin ${request.manufacturingId}. Please try again.`);
        }
      } else {
        toast.error(`Failed to reject request. Server returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Error connecting to server. Please try again.');
    } finally {
      setRejectingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
              {pendingRequests.length} Requested
            </Badge>
          </div>

          {loading ? (
            <Card className="py-8">
              <CardContent className="text-center">
                <Loader2 className="h-10 w-10 mx-auto text-primary mb-3 animate-spin" />
                <p className="text-muted-foreground">Loading requests...</p>
              </CardContent>
            </Card>
          ) : pendingRequests.length > 0 ? (
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
                            <Globe className="h-4 w-4" />
                            {request.region}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Requested {formatDate(request.requestedAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAccept(request)}
                          className="gap-2"
                          disabled={acceptingId === request.id}
                        >
                          {acceptingId === request.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          className="gap-2 text-destructive hover:text-destructive"
                          onClick={() => handleReject(request)}
                          disabled={rejectingId === request.id}
                        >
                          {rejectingId === request.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
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

        {/* Recently Onboarded */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Recently Onboarded</h2>

          {acceptedRequests.length > 0 ? (
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
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {request.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            {request.region}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="py-8">
              <CardContent className="text-center">
                <CheckCircle2 className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No recently onboarded devices</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MunicipalLayout>
  );
}
