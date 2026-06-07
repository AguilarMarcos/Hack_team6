import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { getSessionKey } from '../context/sessionKey';

const IntroModal = ({ pageKey, icon, title, description, cta = 'Entendido' }) => {
  const { user } = useAuth();
  const sessionKey = getSessionKey(user);
  const storageKey = `durango_intro_${pageKey}_${sessionKey}`;

  const [open, setOpen] = useState(() => {
    try { return !localStorage.getItem(storageKey); }
    catch { return false; }
  });

  const handleClose = () => {
    try { localStorage.setItem(storageKey, '1'); } catch { /* silent */ }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="intro-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10,22,18,0.84)',
              backdropFilter: 'blur(48px)',
              WebkitBackdropFilter: 'blur(48px)',
              zIndex: 2000,
              cursor: 'default',
            }}
          />
          <motion.div
            key="intro-panel"
            initial={{ opacity: 0, scale: 0.86, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 14 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 16px',
              pointerEvents: 'none',
            }}
          >
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                width: '100%',
                maxWidth: 460,
                bgcolor: 'background.paper',
                borderRadius: '32px',
                p: { xs: 3.5, md: 4.5 },
                boxShadow: '0 40px 100px rgba(10,22,18,0.48)',
                pointerEvents: 'all',
                textAlign: 'center',
              }}
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 360, damping: 24 }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    bgcolor: 'primary.main',
                    color: 'white',
                    p: 2.4,
                    borderRadius: '26px',
                    mb: 3,
                    boxShadow: '0 12px 32px rgba(18,49,43,0.28)',
                  }}
                >
                  {icon}
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.38 }}
              >
                <Typography variant="h2" color="primary" sx={{ mb: 1.5 }}>
                  {title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                  {description}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleClose}
                  fullWidth
                  sx={{ borderRadius: '18px', py: 1.8, fontSize: '1.1rem', fontWeight: 800 }}
                >
                  {cta}
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default IntroModal;
