import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import AdminView from "./pages/AdminView";
import ViewerView from "./pages/ViewerView";
import AuthGate from "./pages/AuthGate";
import Auth from "./pages/Auth";
import RoleToggle from "@/components/RoleToggle";
import { useUserRole } from "@/hooks/useUserRole";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAdmin } = useUserRole();

  const handleAuthSuccess = () => {
    // Redirect based on role after successful auth
    return isAdmin ? "/admin" : "/viewer";
  };

  return (
    <>
      <Routes>
        <Route path="/auth" element={<Auth onSuccess={handleAuthSuccess} />} />
        <Route path="/invite/:token" element={<AuthGate />} />
        <Route path="/" element={<Navigate to={isAdmin ? "/admin" : "/viewer"} replace />} />
        <Route path="/admin/*" element={<AdminView />} />
        <Route path="/viewer/*" element={<ViewerView />} />
      </Routes>
      <RoleToggle />
      <Toaster />
      <Sonner />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;