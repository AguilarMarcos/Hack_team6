import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { LockKeyhole, MapPin, UserCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const tasteOptions = [
  'Comida local', 'Museos', 'Mercados', 'Artesanias',
  'Rutas cortas', 'Naturaleza', 'Cafes', 'Experiencias familiares',
];
const genderOptions = ['Mujer', 'Hombre', 'No binario', 'Prefiero no decirlo'];

const slideVariants = {
  enter: { opacity: 0, x: 30, scale: 0.97 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -30, scale: 0.97 },
};

const AuthGateway = () => {
  const { loginAsGuest, createAccount, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState('choice');
  const [form, setForm] = useState({ email: '', gender: '', username: '', interests: [] });
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setError('');
    setForm((c) => ({ ...c, [field]: value }));
  };

  const toggleTaste = (taste) => {
    setError('');
    setForm((c) => ({
      ...c,
      interests: c.interests.includes(taste)
        ? c.interests.filter((i) => i !== taste)
        : [...c.interests, taste],
    }));
  };

  const handleCreateAccount = (event) => {
    event.preventDefault();
    if (!form.username.trim() || !form.email.trim() || !form.gender || form.interests.length === 0) {
      setError('Completa correo, genero, nombre de usuario y al menos un gusto.');
      return;
    }
    createAccount({ username: form.username.trim(), email: form.email.trim(), gender: form.gender, interests: form.interests });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#0c1e1a',
      }}
    >
      {/* ─── Left hero panel ─── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1.1,
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          px: { md: 7, lg: 10 },
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background gradient */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #0c1e1a 0%, #12312B 55%, #1a4a3a 100%)',
          }}
        />
        {/* Decorative circles */}
        {[
          { size: 360, right: '-80px', top: '-100px', opacity: 0.07 },
          { size: 220, left: '60px', bottom: '80px', opacity: 0.06 },
          { size: 140, right: '120px', bottom: '200px', opacity: 0.09 },
        ].map((c, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: c.size,
              height: c.size,
              borderRadius: '50%',
              border: '1.5px solid rgba(233,95,42,0.4)',
              right: c.right,
              left: c.left,
              top: c.top,
              bottom: c.bottom,
              opacity: c.opacity * 10,
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 28 + i * 8, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        {/* Floating dots */}
        {[
          { size: 12, x: '20%', y: '25%', delay: 0 },
          { size: 8, x: '70%', y: '15%', delay: 1.2 },
          { size: 14, x: '15%', y: '65%', delay: 2 },
          { size: 9, x: '60%', y: '72%', delay: 0.6 },
          { size: 6, x: '45%', y: '40%', delay: 1.8 },
        ].map((d, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: d.size,
              height: d.size,
              borderRadius: '50%',
              background: 'rgba(233,95,42,0.65)',
              left: d.x,
              top: d.y,
            }}
            animate={{ y: [0, -14, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
          />
        ))}

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ position: 'relative', zIndex: 1, marginBottom: 48 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Box sx={{ bgcolor: 'secondary.main', color: 'white', p: 1.2, borderRadius: '14px', display: 'grid', placeItems: 'center' }}>
              <MapPin size={22} />
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.96rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Durango Local
            </Typography>
          </Stack>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Typography
            sx={{
              color: 'white',
              fontWeight: 900,
              fontSize: { md: '3.8rem', lg: '5rem' },
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              mb: 2.5,
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            Descubre<br />
            <Box component="span" sx={{ color: 'secondary.main' }}>Durango</Box>
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255,255,255,0.52)',
              fontSize: '1.12rem',
              lineHeight: 1.6,
              maxWidth: 380,
              fontWeight: 500,
            }}
          >
            Rutas, negocios, gastronomia y experiencias autenticas de la ciudad.
          </Typography>
        </motion.div>

        {/* Bottom tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ position: 'relative', zIndex: 1, marginTop: 'auto' }}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.82rem', mt: 6 }}>
            Hecho en Durango · Hackathon 2025
          </Typography>
        </motion.div>
      </Box>

      {/* ─── Right: Auth panel ─── */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.9 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#F8F3EA',
          px: { xs: 2, sm: 4, md: 5 },
          py: { xs: 4, md: 0 },
          minHeight: { xs: '100vh', md: 'auto' },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>

          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.2, mb: 4 }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1.1, borderRadius: '13px', display: 'grid', placeItems: 'center' }}>
              <MapPin size={20} />
            </Box>
            <Typography variant="h2" color="primary">Durango Local</Typography>
          </Box>

          <AnimatePresence mode="wait">
            {mode === 'choice' ? (
              <motion.div
                key="choice"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h1" color="primary" sx={{ mb: 0.8, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                    Bienvenido
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Elige como quieres comenzar a explorar.
                  </Typography>
                </Box>

                <Stack spacing={1.6}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<UserPlus size={20} />}
                    onClick={() => setMode('create')}
                    sx={{ py: 2, fontSize: '1.08rem', borderRadius: '18px', fontWeight: 800 }}
                  >
                    Crear cuenta
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={loginWithGoogle}
                    sx={{
                      py: 1.9,
                      fontSize: '1.05rem',
                      borderRadius: '18px',
                      gap: 1.5,
                      borderWidth: 2,
                      fontWeight: 700,
                      '&:hover': { borderWidth: 2 },
                    }}
                  >
                    <Box
                      component="img"
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      sx={{ width: 20, height: 20, borderRadius: '50%' }}
                    />
                    Continuar con Google
                  </Button>

                  <Divider sx={{ my: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">o</Typography>
                  </Divider>

                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<UserCircle size={20} />}
                    onClick={loginAsGuest}
                    sx={{
                      py: 1.9,
                      fontSize: '1.05rem',
                      borderRadius: '18px',
                      borderStyle: 'dashed',
                      fontWeight: 700,
                    }}
                  >
                    Entrar como visitante
                  </Button>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '16px',
                      bgcolor: 'rgba(18,49,43,0.05)',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Stack direction="row" spacing={1.2} alignItems="flex-start">
                      <LockKeyhole size={17} color="#5B665F" style={{ flexShrink: 0, marginTop: 2 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800, mb: 0.3 }}>
                          Modo visitante limitado
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Puedes explorar negocios y mapa, pero no usar rutas ni calificar.
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </motion.div>
            ) : (
              <motion.div
                key="create"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography variant="h2">Crea tu cuenta</Typography>
                  <Button size="small" onClick={() => setMode('choice')} sx={{ borderRadius: '12px', color: 'text.secondary' }}>
                    Volver
                  </Button>
                </Stack>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Esta informacion se guardara en tu perfil.
                </Typography>

                <Box component="form" onSubmit={handleCreateAccount}>
                  <Stack spacing={2.2}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        label="Nombre de usuario"
                        value={form.username}
                        onChange={(e) => updateField('username', e.target.value)}
                        required
                        fullWidth
                      />
                      <TextField
                        label="Correo electronico"
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        required
                        fullWidth
                      />
                    </Stack>

                    <TextField
                      select
                      label="Genero"
                      value={form.gender}
                      onChange={(e) => updateField('gender', e.target.value)}
                      required
                      fullWidth
                    >
                      {genderOptions.map((g) => (
                        <MenuItem key={g} value={g}>{g}</MenuItem>
                      ))}
                    </TextField>

                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 800, mb: 1 }}>
                        ¿Que te interesa?
                      </Typography>
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        {tasteOptions.map((taste) => (
                          <Chip
                            key={taste}
                            label={taste}
                            onClick={() => toggleTaste(taste)}
                            color={form.interests.includes(taste) ? 'secondary' : 'default'}
                            variant={form.interests.includes(taste) ? 'filled' : 'outlined'}
                          />
                        ))}
                      </Stack>
                    </Box>

                    {error && (
                      <Typography variant="body2" color="error" sx={{ fontWeight: 700 }}>
                        {error}
                      </Typography>
                    )}

                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      fullWidth
                      size="large"
                      sx={{ borderRadius: '18px', py: 1.8, fontWeight: 800 }}
                    >
                      Entrar con mi cuenta
                    </Button>
                  </Stack>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthGateway;
