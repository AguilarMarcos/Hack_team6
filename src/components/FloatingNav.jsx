import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { MapPinned, Map as MapIcon, Route as RouteIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const navItems = [
  { id: '/', label: 'Descubre', icon: MapPinned },
  { id: '/map', label: 'Mapa', icon: MapIcon },
  { id: '/routes', label: 'Rutas', icon: RouteIcon },
];

const FloatingNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const visibleNavItems = user?.role === 'guest' ? navItems.filter((item) => item.id !== '/routes') : navItems;

  // Basic matching to get root paths
  const activeTab = visibleNavItems.find(item => {
    if (item.id === '/' && location.pathname === '/') return true;
    if (item.id !== '/' && location.pathname.startsWith(item.id)) return true;
    return false;
  })?.id || '/';

  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: { xs: 16, md: 26 }, 
      left: '50%', 
      transform: 'translateX(-50%)', 
      zIndex: 1000,
      width: { xs: 'calc(100% - 24px)', sm: 'auto' },
    }}>
      <Box className="glass-effect" sx={{
        display: 'flex',
        justifyContent: 'center',
        padding: '8px',
        borderRadius: '999px',
        boxShadow: '0 18px 48px rgba(49,35,20,0.16)',
        gap: { xs: '2px', sm: '6px' },
        overflowX: 'auto',
      }}>
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
                padding: { xs: '11px 12px', sm: '12px 18px' },
                minHeight: 52,
                cursor: 'pointer',
                borderRadius: '999px',
                zIndex: 1,
                color: isActive ? 'white' : 'text.secondary',
                transition: 'color 0.3s ease, transform 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)', color: isActive ? 'white' : 'primary.main' },
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
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={22} style={{ marginRight: isActive ? '8px' : '0' }} />
              {isActive && (
                <Typography variant="body2" sx={{ fontWeight: 800, display: { xs: activeTab === item.id ? 'block' : 'none', sm: 'block' } }}>
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
