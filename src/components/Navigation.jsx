import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Map, MapPinned, Route as RouteIcon } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const navItems = [
  { path: '/', label: 'Descubre', icon: <MapPinned size={24} /> },
  { path: '/map', label: 'Mapa', icon: <Map size={24} /> },
  { path: '/routes', label: 'Rutas', icon: <RouteIcon size={24} /> },
];

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const visibleItems = user?.role === 'guest' ? navItems.filter((item) => item.path !== '/routes') : navItems;

  const value = Math.max(0, visibleItems.findIndex((item) => item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)));

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3} className="glass-effect">
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          navigate(visibleItems[newValue]?.path || '/');
        }}
        sx={{ backgroundColor: 'transparent', height: 65 }}
      >
        {visibleItems.map((item) => <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />)}
      </BottomNavigation>
    </Paper>
  );
};

export default Navigation;
