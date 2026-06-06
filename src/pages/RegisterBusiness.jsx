import { useState } from 'react';
import { Box, Button, Card, CardContent, Checkbox, Chip, Container, FormControlLabel, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { BadgeCheck, ImagePlus, LockKeyhole, Megaphone, Send, Store } from 'lucide-react';
import { businessCategories } from '../data/durango';
import { useAuth } from '../context/useAuth';

const promotionIdeas = ['2x1 entre semana', 'Descuento a estudiantes', 'Menu para familias', 'Acceso para adultos mayores'];

const RegisterBusiness = () => {
  const { user, logout } = useAuth();
  const isGuest = user?.role === 'guest';
  const [form, setForm] = useState({
    name: 'Mi negocio duranguense',
    category: 'Comida',
    address: 'Centro Historico, Durango',
    schedule: '9:00 AM - 8:00 PM',
    description: 'Describe que hace especial a tu negocio y por que deberian visitarlo.',
    promotion: 'Menu para familias',
    accessible: true,
  });
  const [published, setPublished] = useState(false);

  const updateField = (field, value) => {
    setPublished(false);
    setForm((current) => ({ ...current, [field]: value }));
  };

  if (isGuest) {
    return (
      <Box sx={{ pt: { xs: 11, md: 13 }, pb: 4 }}>
        <Container maxWidth="md">
          <Card className="soft-panel" sx={{ borderRadius: '32px' }}>
            <CardContent sx={{ p: { xs: 3, md: 5 }, textAlign: 'center' }}>
              <Box sx={{ bgcolor: 'secondary.main', color: 'white', width: 76, height: 76, borderRadius: '24px', display: 'grid', placeItems: 'center', mx: 'auto', mb: 3 }}>
                <LockKeyhole size={38} />
              </Box>
              <Typography variant="h1" color="primary" sx={{ fontSize: { xs: '2.3rem', md: '3.4rem' }, mb: 2 }}>
                Alta de negocio bloqueada
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                Para publicar o administrar negocios necesitas crear una cuenta completa.
              </Typography>
              <Button variant="contained" color="secondary" onClick={logout}>
                Crear cuenta ahora
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: { xs: 11, md: 13 }, pb: 4 }}>
      <Container>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Chip icon={<Store size={18} />} label="Alta de negocio" color="secondary" sx={{ mb: 2 }} />
            <Typography variant="h1" color="primary" sx={{ mb: 2 }}>
              Haz que turistas y locales encuentren tu comercio.
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 760, mb: 4 }}>
              Este prototipo simula la creacion de una ficha clara, accesible y atractiva para promocionar negocios duranguenses.
            </Typography>

            <Card className="soft-panel" sx={{ borderRadius: '32px' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={3}>
                  <TextField label="Nombre del negocio" value={form.name} onChange={(event) => updateField('name', event.target.value)} fullWidth />
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField select label="Categoria" value={form.category} onChange={(event) => updateField('category', event.target.value)} fullWidth>
                      {businessCategories.filter((category) => category !== 'Todos').map((category) => <MenuItem key={category} value={category}>{category}</MenuItem>)}
                    </TextField>
                    <TextField label="Horario" value={form.schedule} onChange={(event) => updateField('schedule', event.target.value)} fullWidth />
                  </Stack>
                  <TextField label="Direccion o zona" value={form.address} onChange={(event) => updateField('address', event.target.value)} fullWidth />
                  <TextField label="Descripcion" value={form.description} onChange={(event) => updateField('description', event.target.value)} multiline rows={4} fullWidth />

                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Megaphone size={22} />
                      <Typography variant="body1" sx={{ fontWeight: 800 }}>Promocion destacada</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {promotionIdeas.map((idea) => (
                        <Chip key={idea} label={idea} onClick={() => updateField('promotion', idea)} color={form.promotion === idea ? 'secondary' : 'default'} variant={form.promotion === idea ? 'filled' : 'outlined'} />
                      ))}
                    </Stack>
                  </Box>

                  <FormControlLabel
                    control={<Checkbox checked={form.accessible} onChange={(event) => updateField('accessible', event.target.checked)} />}
                    label="Cuenta con atencion o facilidades para personas mayores"
                  />

                  <Button variant="contained" color="secondary" startIcon={<Send size={20} />} onClick={() => setPublished(true)}>
                    Publicar ficha simulada
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ width: { xs: '100%', lg: 420 }, position: { lg: 'sticky' }, top: 120 }}>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="interactive-card" sx={{ borderRadius: '32px', overflow: 'hidden' }}>
                <Box sx={{ height: 210, bgcolor: 'primary.main', color: 'white', display: 'grid', placeItems: 'center' }}>
                  <Stack alignItems="center" spacing={1}>
                    <ImagePlus size={52} />
                    <Typography variant="body1" sx={{ fontWeight: 800 }}>Foto principal</Typography>
                  </Stack>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Chip label={form.category} color="secondary" />
                    {form.accessible && <Chip icon={<BadgeCheck size={16} />} label="Accesible" color="success" />}
                  </Stack>
                  <Typography variant="h2" sx={{ mb: 1 }}>{form.name}</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>{form.address} · {form.schedule}</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{form.description}</Typography>
                  <Box sx={{ p: 2, borderRadius: '18px', bgcolor: 'rgba(233,95,42,0.1)', border: '1px solid rgba(233,95,42,0.22)' }}>
                    <Typography variant="body1" sx={{ fontWeight: 800 }}>Promocion: {form.promotion}</Typography>
                  </Box>
                  {published && (
                    <Chip label="Ficha lista para aparecer en Descubre y Mapa" color="success" sx={{ mt: 2, width: '100%' }} />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default RegisterBusiness;
