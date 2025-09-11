import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import TutorialViewer from "./pages/TutorialViewer";
import VideoPlayer from "./pages/VideoPlayer";
import AdminDashboard from "./pages/AdminDashboard";
import NewLaunches from "./pages/NewLaunches";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import NotFound from "./pages/NotFound";
import AuthGate from "./pages/AuthGate";
import Auth from "./pages/Auth";
import AdminView from "./pages/AdminView";
import ViewerView from "./pages/ViewerView";
import DevModeToggle from "@/components/DevModeToggle";
import AdminPortalLayout from "./components/admin-portal/AdminPortalLayout";
import AdminPortalHome from "./pages/admin-portal/AdminPortalHome";
import AdminPortalProducts from "./pages/admin-portal/AdminPortalProducts";
import AdminPortalVideos from "./pages/admin-portal/AdminPortalVideos";
import AdminPortalUploads from "./pages/admin-portal/AdminPortalUploads";
import AdminPortalPlaylists from "./pages/admin-portal/AdminPortalPlaylists";
import AdminPortalNewLaunches from "./pages/admin-portal/AdminPortalNewLaunches";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/invite/:token" element={<AuthGate />} />
              <Route path="/" element={<Home />} />
              <Route path="/product/:productSlug" element={<ProductDetail />} />
              <Route path="/product/:productSlug/tutorial/:videoSlug" element={<TutorialViewer />} />
              <Route path="/product/:productSlug/video/:videoSlug" element={<VideoPlayer />} />
              
              {/* Legacy routes - redirect old format to new */}
              <Route path="/video/:productId/:videoId" element={<VideoPlayer />} />
              <Route path="/new-launches" element={<NewLaunches />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/playlists/:playlistId" element={<PlaylistDetail />} />
              
              {/* Admin and Viewer Routes */}
              <Route path="/admin/*" element={<AdminView />} />
              <Route path="/viewer/*" element={<ViewerView />} />
              
              {/* Admin Portal Routes */}
              <Route path="/admin-portal" element={<AdminPortalLayout />}>
                <Route index element={<AdminPortalHome />} />
                <Route path="products" element={<AdminPortalProducts />} />
                <Route path="videos" element={<AdminPortalVideos />} />
                <Route path="uploads" element={<AdminPortalUploads />} />
                <Route path="playlists" element={<AdminPortalPlaylists />} />
                <Route path="new-launches" element={<AdminPortalNewLaunches />} />
              </Route>
              
              {/* Redirect old studio routes to admin-portal */}
              <Route path="/studio/*" element={<Navigate to="/admin-portal" replace />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <DevModeToggle />
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;