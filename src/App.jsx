import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

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
import RegisterBusiness from './pages/RegisterBusiness';

const MainLayout = () => {
  return (
    <Box sx={{ pb: { xs: 13, md: 14 }, pt: 9, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>
      <FloatingNav />
      <ChatBubble />
    </Box>
  );
};

const AppContent = () => {
  const { user } = useAuth();

  // Si no hay usuario en sesión, mostrar el Gateway
  if (!user) {
    return <AuthGateway />;
  }

  // De lo contrario, mostrar la app principal
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="map" element={<ExploreMap />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="register-business" element={<RegisterBusiness />} />
        </Route>
      </Routes>
    </Router>
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
