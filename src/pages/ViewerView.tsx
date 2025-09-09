import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import ProductDetail from '@/pages/ProductDetail';
import TutorialViewer from '@/pages/TutorialViewer';
import VideoPlayer from '@/pages/VideoPlayer';
import NewLaunches from '@/pages/NewLaunches';
import NotFound from '@/pages/NotFound';

const ViewerView: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/product/:productId/tutorial/:videoId" element={<TutorialViewer />} />
      <Route path="/video/:productId/:videoId" element={<VideoPlayer />} />
      <Route path="/new-launches" element={<NewLaunches />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ViewerView;