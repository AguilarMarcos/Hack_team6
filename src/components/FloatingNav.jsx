import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import {
  MapPinned,
  Map as MapIcon,
  Route as RouteIcon,
  Store,
  ShoppingBag,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const navItems = [
  { id: '/', label: 'Descubre', icon: MapPinned },
  { id: '/map', label: 'Mapa', icon: MapIcon },
  { id: '/routes', label: 'Rutas', icon: RouteIcon },
  { id: '/business', label: 'Negocios', icon: Store },
  { id: '/marketplace', label: 'Market', icon: ShoppingBag },
];

const FloatingNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const visibleNavItems =
    user?.role === 'guest'
      ? navItems.filter((item) => item.id !== '/routes')
      : navItems;

  const activeTab =
    visibleNavItems.find((item) => {
      if (item.id === '/' && location.pathname === '/') return true;
      if (item.id !== '/' && location.pathname.startsWith(item.id)) return true;
      return false;
    })?.id || '/';

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 16, md: 26 },
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: { xs: 'calc(100% - 20px)', sm: 'auto' },
      }}
    >
      <Box
        className="glass-effect"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: '6px',
          borderRadius: '999px',
          boxShadow: '0 18px 48px rgba(49,35,20,0.16)',
          gap: { xs: '2px', sm: '4px' },
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {visibleNavItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <Box
              key={item.id}
              onClick={() => navigate(item.id)}
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: { xs: '10px 10px', sm: '11px 16px' },
                minHeight: 50,
                minWidth: 44,
                cursor: 'pointer',
                borderRadius: '999px',
                zIndex: 1,
                color: isActive ? 'white' : 'text.secondary',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: isActive ? 'white' : 'primary.main',
                },
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#12312B',
                    borderRadius: '999px',
                    zIndex: -1,
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                style={{ marginRight: isActive && window.innerWidth >= 600 ? 6 : 0, flexShrink: 0 }}
              />
              {isActive && (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '0.78rem', sm: '0.9rem' },
                    display: { xs: 'none', sm: 'block' },
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default FloatingNav;
