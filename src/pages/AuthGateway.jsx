import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, LockKeyhole, MapPin, Sparkles, UserCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const tasteOptions = [
  'Comida local', 'Museos', 'Mercados', 'Artesanias',
  'Rutas cortas', 'Naturaleza', 'Cafes', 'Experiencias familiares',
];
const genderOptions = ['Mujer', 'Hombre', 'No binario', 'Prefiero no decirlo'];

const FloatingDot = ({ size, x, y, delay, color }) => (
  <motion.div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      left: x,
      top: y,
      pointerEvents: 'none',
    }}
    animate={{ y: [0, -18, 0], opacity: [0.5, 0.9, 0.5] }}
    transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

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
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 4, md: 6 },
      }}
    >
      {/* Decorative floating elements */}
      <FloatingDot size={180} x="5%" y="8%" delay={0} color="rgba(233,95,42,0.1)" />
      <FloatingDot size={120} x="78%" y="5%" delay={1.2} color="rgba(14,124,102,0.12)" />
      <FloatingDot size={220} x="60%" y="60%" delay={2} color="rgba(242,183,5,0.08)" />
      <FloatingDot size={90} x="15%" y="70%" delay={0.7} color="rgba(108,74,182,0.1)" />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 4, md: 6 }} alignItems="center">

          {/* ─── Left: Hero ─── */}
          <Box sx={{ flex: 1.1 }}>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    p: 1.6,
                    borderRadius: '20px',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <MapPin size={36} />
                </Box>
                <Box>
                  <Typography variant="h2" color="primary" sx={{ lineHeight: 1, mb: 0.3 }}>
                    Durango Local
                  </Typography>
                  <Chip label="Turismo + negocios" color="secondary" size="small" />
                </Box>
              </Stack>

              <Typography
                variant="h1"
                color="primary"
                sx={{ mb: 2.5, maxWidth: 520, lineHeight: 1.04 }}
              >
                Descubre Durango como si ya lo conocieras.
              </Typography>

              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ maxWidth: 500, mb: 4, lineHeight: 1.6 }}
              >
                Guia local de negocios, rutas accesibles y experiencias autenticas para turistas,
                familias y personas mayores.
              </Typography>

              <Stack spacing={1.5}>
                {[
                  { icon: <MapPin size={18} />, text: 'Mapa interactivo con 8+ negocios locales' },
                  { icon: <Sparkles size={18} />, text: 'Rutas personalizadas por tiempo y presupuesto' },
                  { icon: <BadgeCheck size={18} />, text: 'Interfaz accesible y facil de usar' },
                ].map(({ icon, text }) => (
                  <Stack key={text} direction="row" alignItems="center" spacing={1.2}>
                    <Box
                      sx={{
                        color: 'secondary.main',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {icon}
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {text}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </motion.div>
          </Box>

          {/* ─── Right: Auth card ─── */}
          <Box sx={{ flex: 1, width: '100%', maxWidth: { xs: '100%', md: 460 } }}>
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
                  <Card className="soft-panel" sx={{ borderRadius: '32px' }}>
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Typography variant="h2" sx={{ mb: 1 }}>
                        Como quieres entrar?
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3.5 }}>
                        Elige una opcion para comenzar a explorar Durango.
                      </Typography>

                      <Stack spacing={1.8}>
                        {/* Create account */}
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          startIcon={<UserPlus size={22} />}
                          onClick={() => setMode('create')}
                          sx={{ py: 2, fontSize: '1.1rem', borderRadius: '18px' }}
                        >
                          Crear cuenta
                        </Button>

                        {/* Google */}
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          onClick={loginWithGoogle}
                          sx={{
                            py: 1.8,
                            fontSize: '1.05rem',
                            borderRadius: '18px',
                            gap: 1.5,
                            borderWidth: 2,
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
                          <Typography variant="body2" color="text.secondary">
                            o
                          </Typography>
                        </Divider>

                        {/* Guest */}
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          startIcon={<UserCircle size={22} />}
                          onClick={loginAsGuest}
                          sx={{
                            py: 1.8,
                            fontSize: '1.05rem',
                            borderRadius: '18px',
                            borderStyle: 'dashed',
                          }}
                        >
                          Entrar como visitante
                        </Button>

                        {/* Guest disclaimer */}
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
                            <LockKeyhole size={18} color="#5B665F" style={{ flexShrink: 0, marginTop: 2 }} />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 800, mb: 0.3 }}>
                                Modo visitante limitado
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Podras explorar negocios y mapa, pero no usar rutas, como llegar ni calificar.
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
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
                  <Card className="soft-panel" sx={{ borderRadius: '32px' }}>
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="h2">Crea tu cuenta</Typography>
                        <Button
                          size="small"
                          onClick={() => setMode('choice')}
                          sx={{ borderRadius: '12px', minHeight: 36, color: 'text.secondary' }}
                        >
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
                              Que te interesa?
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
                            sx={{ borderRadius: '18px', py: 1.8 }}
                          >
                            Entrar con mi cuenta
                          </Button>
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default AuthGateway;
