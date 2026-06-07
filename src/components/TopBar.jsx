import { useRef, useState } from 'react';
import { Avatar, Box, IconButton, InputBase, Paper, Typography } from '@mui/material';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const TopBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const prevY = useRef(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const direction = latest > prevY.current;
    if (direction && latest > 72) setHidden(true);
    else if (!direction) setHidden(false);
    prevY.current = latest;
  });

  return (
    <motion.header
      variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: '-115%', opacity: 0 } }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.42, ease: [0.32, 0, 0.16, 1] }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 14,
        background: 'rgba(248,243,234,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(231,221,207,0.7)',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1320, px: { xs: 2, md: 3 }, display: 'flex', alignItems: 'center', gap: { xs: 1.2, md: 2 } }}>
        <Paper
          elevation={0}
          className="glass-effect"
          sx={{ flex: 1, p: { xs: '6px 10px', md: '8px 14px' }, display: 'flex', alignItems: 'center', borderRadius: '999px', boxShadow: '0 8px 28px rgba(49,35,20,0.09)', maxWidth: 900, mx: 'auto' }}
        >
          <IconButton sx={{ p: 1 }} aria-label="buscar lugares">
            <Search size={21} color="#12312B" />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1, fontWeight: 700, fontSize: { xs: '1rem', md: '1.05rem' } }}
            placeholder="Busca comida, museos, mercados, artesanias..."
          />
        </Paper>

        <Box
          onClick={() => navigate('/profile')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', bgcolor: 'background.paper', borderRadius: '999px', p: 0.7, border: '1px solid', borderColor: 'divider', boxShadow: '0 6px 20px rgba(49,35,20,0.08)', flexShrink: 0, transition: 'box-shadow 0.2s ease', '&:hover': { boxShadow: '0 10px 28px rgba(49,35,20,0.13)' } }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
            <User size={18} />
          </Avatar>
          <Typography variant="body2" sx={{ pr: 1.2, fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
            {user?.name || 'Invitado'}
          </Typography>
        </Box>
      </Box>
    </motion.header>
  );
};

export default TopBar;
