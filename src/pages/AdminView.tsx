import { Routes, Route } from 'react-router-dom';
import { DataProvider } from '@/contexts/DataContext';
import Home from '@/pages/Home';
import ProductDetail from '@/pages/ProductDetail';
import TutorialViewer from '@/pages/TutorialViewer';
import VideoPlayer from '@/pages/VideoPlayer';
import AdminDashboard from '@/pages/AdminDashboard';
import NewLaunches from '@/pages/NewLaunches';
import Playlists from '@/pages/Playlists';
import PlaylistDetail from '@/pages/PlaylistDetail';
import NotFound from '@/pages/NotFound';

const AdminView = () => {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/product/:productId/tutorial/:videoId" element={<TutorialViewer />} />
        <Route path="/video/:productId/:videoId" element={<VideoPlayer />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/new-launches" element={<NewLaunches />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlists/:playlistId" element={<PlaylistDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DataProvider>
  );
};

export default AdminView;