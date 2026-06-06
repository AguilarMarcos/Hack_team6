import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Heart, LockKeyhole, Mail, Pencil, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const tasteOptions = [
  'Comida local', 'Museos', 'Mercados', 'Artesanias',
  'Rutas cortas', 'Naturaleza', 'Cafes', 'Experiencias familiares',
];
const genderOptions = ['Mujer', 'Hombre', 'No binario', 'Prefiero no decirlo'];

const InfoRow = ({ label, value }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: '16px',
      bgcolor: 'rgba(18,49,43,0.04)',
      border: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem', mb: 0.3 }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ fontWeight: 700 }}>
      {value || '—'}
    </Typography>
  </Box>
);

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const isGuest = user?.role === 'guest';
  const [editing, setEditing] = useState(false);
  const [largeText, setLargeText] = useState(true);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || user?.name || '',
    email: user?.email || '',
    gender: user?.gender || '',
    interests: user?.interests || [],
  });

  const updateField = (field, value) => {
    setSaved(false);
    setForm((c) => ({ ...c, [field]: value }));
  };

  const toggleInterest = (interest) => {
    setSaved(false);
    setForm((c) => ({
      ...c,
      interests: c.interests.includes(interest)
        ? c.interests.filter((i) => i !== interest)
        : [...c.interests, interest],
    }));
  };

  const saveProfile = () => {
    updateUser(form);
    setSaved(true);
    setEditing(false);
  };

  const cancelEdit = () => {
    setForm({
      username: user?.username || user?.name || '',
      email: user?.email || '',
      gender: user?.gender || '',
      interests: user?.interests || [],
    });
    setEditing(false);
    setSaved(false);
  };

  return (
    <Box sx={{ pt: { xs: 11, md: 13 }, pb: 8 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h1" color="primary" sx={{ mb: 0.5 }}>
            Perfil
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isGuest
              ? 'Modo visitante — crea una cuenta para personalizar tu experiencia.'
              : 'Tu informacion guardada y preferencias de la aplicacion.'}
          </Typography>
        </Box>

        <Stack spacing={3}>
          {/* ─── Avatar + status card ─── */}
          <Card className="soft-panel" sx={{ borderRadius: '28px' }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'center', sm: 'center' }}
                spacing={3}
              >
                <Avatar
                  sx={{
                    width: 88,
                    height: 88,
                    bgcolor: isGuest ? 'text.secondary' : 'primary.main',
                    fontSize: '2.4rem',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {(form.username || 'U').charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="h2" sx={{ mb: 0.4 }}>
                    {form.username || 'Visitante'}
                  </Typography>
                  {form.email && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.8}
                      sx={{ mb: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}
                    >
                      <Mail size={15} color="#5B665F" />
                      <Typography variant="body2">{form.email}</Typography>
                    </Stack>
                  )}
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}
                  >
                    <Chip
                      icon={
                        isGuest ? (
                          <LockKeyhole size={14} />
                        ) : (
                          <ShieldCheck size={14} />
                        )
                      }
                      label={isGuest ? 'Visitante' : 'Cuenta completa'}
                      color={isGuest ? 'default' : 'success'}
                      variant="outlined"
                      size="small"
                    />
                    {!isGuest && form.interests.length > 0 && (
                      <Chip
                        icon={<Heart size={14} />}
                        label={`${form.interests.length} gustos`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Box>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={logout}
                  sx={{ flexShrink: 0, borderRadius: '14px' }}
                >
                  Cerrar sesion
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* ─── Guest limitations ─── */}
          {isGuest && (
            <Card sx={{ borderRadius: '28px', borderColor: 'rgba(233,95,42,0.4)', bgcolor: 'rgba(233,95,42,0.04)' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      bgcolor: 'secondary.main',
                      color: 'white',
                      p: 1.2,
                      borderRadius: '14px',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <LockKeyhole size={20} />
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ mb: 0.5 }}>
                      Funciones limitadas en modo visitante
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
                      Crea una cuenta para desbloquear rutas, navegacion y calificaciones.
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {(user?.limitations || []).map((l) => (
                        <Chip key={l} label={l} color="secondary" variant="outlined" size="small" />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* ─── Account info ─── */}
          <Card sx={{ borderRadius: '28px' }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
                <Typography variant="h3">Informacion de cuenta</Typography>
                {!isGuest && !editing && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Pencil size={15} />}
                    onClick={() => setEditing(true)}
                    sx={{ borderRadius: '12px', minHeight: 36 }}
                  >
                    Editar
                  </Button>
                )}
              </Stack>

              <AnimatePresence mode="wait">
                {!editing ? (
                  /* View mode */
                  <motion.div
                    key="view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 1.5,
                      }}
                    >
                      <InfoRow label="Nombre de usuario" value={form.username} />
                      <InfoRow label="Correo electronico" value={form.email} />
                      <InfoRow label="Genero" value={form.gender} />
                      <InfoRow
                        label="Tipo de acceso"
                        value={isGuest ? 'Visitante / Guest' : 'Cuenta completa'}
                      />
                    </Box>
                  </motion.div>
                ) : (
                  /* Edit mode */
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                  >
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 2,
                        mb: 2.5,
                      }}
                    >
                      <TextField
                        label="Nombre de usuario"
                        value={form.username}
                        onChange={(e) => updateField('username', e.target.value)}
                        fullWidth
                      />
                      <TextField
                        label="Correo electronico"
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        InputProps={{
                          startAdornment: <Mail size={17} style={{ marginRight: 8, color: '#5B665F' }} />,
                        }}
                        fullWidth
                      />
                      <TextField
                        select
                        label="Genero"
                        value={form.gender}
                        onChange={(e) => updateField('gender', e.target.value)}
                        fullWidth
                      >
                        {genderOptions.map((g) => (
                          <MenuItem key={g} value={g}>{g}</MenuItem>
                        ))}
                      </TextField>
                      <TextField label="Tipo de acceso" value="Cuenta completa" disabled fullWidth />
                    </Box>

                    <Stack direction="row" spacing={1.5}>
                      <Button
                        variant="outlined"
                        startIcon={<X size={16} />}
                        onClick={cancelEdit}
                        fullWidth
                        sx={{ borderRadius: '14px' }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<CheckCircle size={16} />}
                        onClick={saveProfile}
                        fullWidth
                        sx={{ borderRadius: '14px' }}
                      >
                        Guardar cambios
                      </Button>
                    </Stack>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* ─── Save confirmation ─── */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22 }}
              >
                <Chip
                  icon={<CheckCircle size={18} />}
                  label="Informacion guardada correctamente"
                  color="success"
                  sx={{ width: '100%', borderRadius: '14px', py: 2.6, fontSize: '1rem', fontWeight: 700 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Interests ─── */}
          <Card sx={{ borderRadius: '28px' }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 2 }}>
                <Heart size={22} color="#E95F2A" />
                <Typography variant="h3">Gustos y preferencias</Typography>
              </Stack>

              {isGuest ? (
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: '18px',
                    bgcolor: 'rgba(18,49,43,0.04)',
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center',
                  }}
                >
                  <LockKeyhole size={24} color="#5B665F" style={{ marginBottom: 8 }} />
                  <Typography variant="body1" color="text.secondary">
                    Los gustos estan disponibles con cuenta completa.
                  </Typography>
                </Box>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Toca para activar o desactivar. Se usan para personalizar tus recomendaciones.
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {tasteOptions.map((interest) => (
                      <Chip
                        key={interest}
                        label={interest}
                        onClick={() => toggleInterest(interest)}
                        color={form.interests.includes(interest) ? 'secondary' : 'default'}
                        variant={form.interests.includes(interest) ? 'filled' : 'outlined'}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Stack>
                  {form.interests.length > 0 && !editing && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={saveProfile}
                        sx={{ borderRadius: '12px' }}
                      >
                        Guardar gustos
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* ─── Accessibility ─── */}
          <Card sx={{ borderRadius: '28px' }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography variant="h3" sx={{ mb: 2 }}>
                Accesibilidad
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ p: 2, borderRadius: '16px', bgcolor: 'rgba(18,49,43,0.04)', border: '1px solid', borderColor: 'divider' }}
              >
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>
                    Texto grande y botones amplios
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recomendado para lectura comoda.
                  </Typography>
                </Box>
                <Switch
                  checked={largeText}
                  onChange={(e) => setLargeText(e.target.checked)}
                  color="secondary"
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
};

export default Profile;
