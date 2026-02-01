import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Building2, Recycle } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Recycle className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SmartBin</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Smart Waste Management
            <span className="block text-primary">Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time waste monitoring, intelligent routing, and proactive alerts 
            for cleaner cities and efficient waste collection operations.
          </p>
        </div>
      </section>

      {/* Portal Selection */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Municipal Authority Portal */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-4 bg-primary/10 rounded-2xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Municipal Authority</CardTitle>
              <CardDescription className="text-base">
                Access the comprehensive dashboard for monitoring and managing 
                all SmartBins across the city
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                  Real-time bin monitoring
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                  Alert & notification center
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                  Connection requests management
                </li>
              </ul>
              <Link to="/municipal/login" className="block">
                <Button className="w-full" size="lg">
                  Enter Portal
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* SmartBin Device Portal */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-4 bg-primary/10 rounded-2xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <Trash2 className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">SmartBin Device</CardTitle>
              <CardDescription className="text-base">
                Configure and manage your SmartBin device settings 
                and request onboarding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                  Device profile setup
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                  Location & status configuration
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full"></span>
                  Request to onboard
                </li>
              </ul>
              <Link to="/device/login" className="block">
                <Button className="w-full" size="lg" variant="outline">
                  Enter Portal
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            SmartBin Dashboard - College Project by Deoraj Sharma (202117B3832)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
