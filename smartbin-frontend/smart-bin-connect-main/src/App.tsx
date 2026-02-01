import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Municipal Pages
import MunicipalLogin from "./pages/municipal/MunicipalLogin";
import MunicipalDashboard from "./pages/municipal/Dashboard";
import Notifications from "./pages/municipal/Notifications";
import ImmediateAction from "./pages/municipal/ImmediateAction";
import Connections from "./pages/municipal/Connections";

// Device Pages
import DeviceLogin from "./pages/device/DeviceLogin";
import DeviceProfile from "./pages/device/DeviceProfile";
import DevicePassword from "./pages/device/DevicePassword";

const queryClient = new QueryClient();

// Protected route wrapper for municipal portal
function MunicipalProtectedRoute({ children }: { children: React.ReactNode }) {
  const { municipalUser } = useAuth();
  if (!municipalUser) {
    return <Navigate to="/municipal/login" replace />;
  }
  return <>{children}</>;
}

// Protected route wrapper for device portal
function DeviceProtectedRoute({ children }: { children: React.ReactNode }) {
  const { deviceProfile } = useAuth();
  if (!deviceProfile) {
    return <Navigate to="/device/login" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Index />} />

      {/* Municipal Authority Routes */}
      <Route path="/municipal/login" element={<MunicipalLogin />} />
      <Route
        path="/municipal/dashboard"
        element={
          <MunicipalProtectedRoute>
            <MunicipalDashboard />
          </MunicipalProtectedRoute>
        }
      />
      <Route
        path="/municipal/notifications"
        element={
          <MunicipalProtectedRoute>
            <Notifications />
          </MunicipalProtectedRoute>
        }
      />
      <Route
        path="/municipal/immediate-action"
        element={
          <MunicipalProtectedRoute>
            <ImmediateAction />
          </MunicipalProtectedRoute>
        }
      />
      <Route
        path="/municipal/connections"
        element={
          <MunicipalProtectedRoute>
            <Connections />
          </MunicipalProtectedRoute>
        }
      />

      {/* SmartBin Device Routes */}
      <Route path="/device/login" element={<DeviceLogin />} />
      <Route
        path="/device/profile"
        element={
          <DeviceProtectedRoute>
            <DeviceProfile />
          </DeviceProtectedRoute>
        }
      />
      <Route
        path="/device/password"
        element={
          <DeviceProtectedRoute>
            <DevicePassword />
          </DeviceProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
