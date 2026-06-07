import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import FloatingNav from './components/FloatingNav';
import TopBar from './components/TopBar';
import ChatBubble from './components/ChatBubble';

// Pages
import AuthGateway from './pages/AuthGateway';
import Home from './pages/Home';
import ExploreMap from './pages/ExploreMap';
import RoutesPage from './pages/RoutesPage';
import Profile from './pages/Profile';
import BusinessPage from './pages/BusinessPage';
import Marketplace from './pages/Marketplace';

const MainLayout = () => {
  const location = useLocation();
  const isMap = location.pathname === '/map';

  return (
    <Box
      sx={{
        pb: isMap ? 0 : { xs: 13, md: 14 },
        pt: isMap ? 0 : 9,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {!isMap && <TopBar />}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>
      <FloatingNav />
      {!isMap && <ChatBubble />}
    </Box>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  const prevUserRef = useRef(null);

  // Reset URL to / whenever user transitions from null → authenticated
  useEffect(() => {
    if (user && !prevUserRef.current) {
      window.history.replaceState(null, '', '/');
    }
    prevUserRef.current = user;
  }, [user]);

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <motion.div
          key="gateway"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          style={{ minHeight: '100vh' }}
        >
          <AuthGateway />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          style={{ minHeight: '100vh' }}
        >
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="map" element={<ExploreMap />} />
                <Route path="routes" element={<RoutesPage />} />
                <Route path="profile" element={<Profile />} />
                <Route path="business" element={<BusinessPage />} />
                <Route path="marketplace" element={<Marketplace />} />
              </Route>
            </Routes>
          </Router>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
