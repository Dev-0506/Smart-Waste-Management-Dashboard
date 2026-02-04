import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Recycle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function DeviceLogin() {
  const [manufacturingId, setManufacturingId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setDeviceProfileDirect } = useAuth();
  const navigate = useNavigate();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   // await new Promise(resolve => setTimeout(resolve, 500));

  //   setErrorMessage("");

  //   if (!manufacturingId || !password) {
  //     setErrorMessage(
  //       "Manufacturing ID and Default Password are required."
  //     );
  //     return;
  //   }

  //   const apiUrl = `http://localhost:8080/masterbins/authenticate/${manufacturingId}/${password}`;

  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "GET",
  //     });

  //     // ❌ Non-200 response
  //     if (!response.ok) {
  //       setErrorMessage(
  //         "Authentication service error. Please try again."
  //       );
  //       return;
  //     }

  //     // Backend returns true / false
  //     const result = await response.json();

  //     if (result === true || result === "true") {
  //       // ✅ Authentication successful
  //       console.log("Device authentication successful");
  //       toast.success('Device authenticated successfully!');
  //       navigate('/device/profile');

  //     } else {
  //       // ❌ Authentication failed
  //       setErrorMessage(
  //         "Invalid Manufacturing ID or Password. Please try again."
  //       );
  //       toast.error('Invalid Manufacturing ID or Password. Format: SB-XXXX');
  //     }
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error("Authentication error:", error);
  //     setErrorMessage(
  //       "Unable to connect to authentication service."
  //     );
  //   }


  //   // const success = loginDevice(manufacturingId, password);
  //   // if (success) {
  //   //   toast.success('Device authenticated successfully!');
  //   //   navigate('/device/profile');
  //   // } else {
  //   //   toast.error('Invalid Manufacturing ID or Password. Format: SB-XXXX');
  //   // }

  //   // setIsLoading(false);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (!manufacturingId || !password) {
      setErrorMessage("Manufacturing ID and Default Password are required.");
      setIsLoading(false);
      return;
    }

    const apiUrl = `http://localhost:8080/masterbins/authenticate/${manufacturingId}/${password}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
      });

      if (!response.ok) {
        setErrorMessage("Authentication service error. Please try again.");
        return;
      }

      const result = await response.json();

      if (result === true || result === "true") {
        console.log("Device authentication successful");
        toast.success("Device authenticated successfully!");

        // ✅ Set the device profile in auth context before navigating
        setDeviceProfileDirect(manufacturingId);
        navigate("/device/profile");

      } else {
        setErrorMessage("Invalid Manufacturing ID or Password. Please try again.");
        toast.error("Invalid Manufacturing ID or Password. Format: SB-XXXX");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setErrorMessage("Unable to connect to authentication service.");
    } finally {
      // ✅ ALWAYS reset loading state
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="border-2">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto p-4 bg-primary/10 rounded-2xl w-fit">
              <Trash2 className="h-10 w-10 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">SmartBin Device Login</CardTitle>
              <CardDescription>
                Enter your device credentials to configure
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturingId">Manufacturing ID</Label>
                <Input
                  id="manufacturingId"
                  type="text"
                  placeholder=""
                  value={manufacturingId}
                  onChange={(e) => setManufacturingId(e.target.value.toUpperCase())}
                  required
                />
                <p className="text-xs text-muted-foreground">Format: SB-XXXX (e.g., SB-1234)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Default Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Authenticating...' : 'Authenticate Device'}
              </Button>
              {errorMessage && (
                <p style={{ color: "red" }}>{errorMessage}</p>
              )}
            </form>

            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Note:</strong> If you are unware of your credentials, please connect to the Smart Bin Device Administrator.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Recycle className="h-4 w-4" />
          SmartBin Dashboard
        </div>
      </div>
    </div>
  );
}
