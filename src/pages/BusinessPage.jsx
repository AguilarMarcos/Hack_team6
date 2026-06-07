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
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  Briefcase,
  CheckCircle,
  Heart,
  ImagePlus,
  LockKeyhole,
  Megaphone,
  MessageSquare,
  Pencil,
  Plus,
  Send,
  Star,
  Store,
  ThumbsUp,
} from 'lucide-react';
import { businessCategories } from '../data/durango';
import { useAuth } from '../context/useAuth';
import IntroModal from '../components/IntroModal';

const promotionIdeas = ['2x1 entre semana', 'Descuento a estudiantes', 'Menu para familias', 'Acceso para adultos mayores'];

const mockReviews = [
  { id: 1, user: 'Ana R.', avatar: 'A', rating: 5, comment: 'Excelente servicio, los volvere a visitar pronto.', date: 'Mayo 2025' },
  { id: 2, user: 'Miguel T.', avatar: 'M', rating: 4, comment: 'Muy buena experiencia. El producto es de alta calidad.', date: 'Abril 2025' },
  { id: 3, user: 'Laura G.', avatar: 'L', rating: 5, comment: 'Lo recomiendo ampliamente, todo perfecto.', date: 'Abril 2025' },
];

const StarRow = ({ rating, size = 15 }) => (
  <Stack direction="row" alignItems="center" spacing={0.3}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={size} fill={s <= Math.round(rating) ? '#F2B705' : 'transparent'} color={s <= Math.round(rating) ? '#F2B705' : '#D4C5A9'} />
    ))}
  </Stack>
);

const tabs = ['Info', 'Publicaciones', 'Resenas'];

const BusinessPage = () => {
  const { user, logout } = useAuth();
  const isGuest = user?.role === 'guest';

  const [business, setBusiness] = useState(() => {
    try {
      const stored = localStorage.getItem('durangoLocalBusiness');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('Info');
  const [form, setForm] = useState({
    name: '',
    category: 'Comida',
    address: '',
    schedule: '9:00 AM - 8:00 PM',
    description: '',
    promotion: 'Menu para familias',
    accessible: true,
  });
  const [posts, setPosts] = useState([
    { id: 1, text: 'Hoy tenemos oferta especial! 2x1 en todos los platillos hasta las 6 PM.', date: 'Hace 1 hora', likes: 14 },
    { id: 2, text: 'Gracias a todos nuestros clientes por su visita esta semana. Su apoyo nos impulsa.', date: 'Hace 2 dias', likes: 22 },
  ]);
  const [newPost, setNewPost] = useState('');
  const [postAdded, setPostAdded] = useState(false);

  const updateField = (field, value) => setForm((c) => ({ ...c, [field]: value }));

  const saveBusiness = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim() || !form.description.trim()) return;
    const newBusiness = { ...form, id: Date.now(), createdAt: new Date().toISOString() };
    setBusiness(newBusiness);
    localStorage.setItem('durangoLocalBusiness', JSON.stringify(newBusiness));
    setCreating(false);
  };

  const addPost = () => {
    if (!newPost.trim()) return;
    setPosts((prev) => [{ id: Date.now(), text: newPost.trim(), date: 'Ahora', likes: 0 }, ...prev]);
    setNewPost('');
    setPostAdded(true);
    setTimeout(() => setPostAdded(false), 2500);
  };

  const likePost = (id) => {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  // Guest guard
  if (isGuest) {
    return (
      <Box sx={{ pt: { xs: 11, md: 13 }, pb: 4 }}>
        <Container maxWidth="md">
          <Card className="soft-panel" sx={{ borderRadius: '32px' }}>
            <CardContent sx={{ p: { xs: 3, md: 5 }, textAlign: 'center' }}>
              <Box sx={{ bgcolor: 'secondary.main', color: 'white', width: 76, height: 76, borderRadius: '24px', display: 'grid', placeItems: 'center', mx: 'auto', mb: 3 }}>
                <LockKeyhole size={38} />
              </Box>
              <Typography variant="h1" color="primary" sx={{ fontSize: { xs: '2.3rem', md: '3rem' }, mb: 2 }}>
                Negocios bloqueado para visitantes
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                Crea una cuenta completa para registrar y administrar tu negocio en Durango Local.
              </Typography>
              <Button variant="contained" color="secondary" onClick={logout}>Crear cuenta ahora</Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // No business yet — CTA
  if (!business && !creating) {
    return (
      <Box sx={{ pt: { xs: 11, md: 13 }, pb: 4 }}>
        <IntroModal
          pageKey="business"
          icon={<Store size={42} />}
          title="Pagina de Negocio"
          description="Aqui puedes registrar y administrar tu negocio en Durango Local. Publica promociones, recibe calificaciones y haz que turistas y locales te encuentren."
          cta="Gestionar mi negocio"
        />
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <Card className="soft-panel" sx={{ borderRadius: '32px', overflow: 'hidden' }}>
              <Box sx={{ height: 8, background: 'linear-gradient(90deg, #12312B, #0E7C66)' }} />
              <CardContent sx={{ p: { xs: 3, md: 5 }, textAlign: 'center' }}>
                <Box sx={{ bgcolor: 'primary.main', color: 'white', width: 88, height: 88, borderRadius: '28px', display: 'grid', placeItems: 'center', mx: 'auto', mb: 3 }}>
                  <Store size={44} />
                </Box>
                <Typography variant="h1" color="primary" sx={{ fontSize: { xs: '2.3rem', md: '3rem' }, mb: 2 }}>
                  Crea tu pagina de negocio
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4, maxWidth: 540, mx: 'auto' }}>
                  Haz que turistas y locales te encuentren facilmente. Publica promociones, recibe calificaciones y gestiona tu presencia digital en Durango.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                  {[
                    { icon: <Megaphone size={18} />, text: 'Publica promociones' },
                    { icon: <Star size={18} />, text: 'Recibe calificaciones' },
                    { icon: <BadgeCheck size={18} />, text: 'Perfil verificado' },
                  ].map(({ icon, text }) => (
                    <Stack key={text} direction="row" alignItems="center" spacing={1} sx={{ bgcolor: 'rgba(18,49,43,0.06)', borderRadius: '999px', px: 2.5, py: 1.2 }}>
                      <Box sx={{ color: 'secondary.main' }}>{icon}</Box>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>{text}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<Plus size={22} />}
                  onClick={() => setCreating(true)}
                  sx={{ borderRadius: '20px', py: 2, px: 5, fontSize: '1.1rem' }}
                >
                  Crear mi pagina de negocio
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </Box>
    );
  }

  // Creation form
  if (creating) {
    return (
      <Box sx={{ pt: { xs: 11, md: 13 }, pb: 4 }}>
        <Container>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} alignItems="flex-start">
              <Box sx={{ flex: 1 }}>
                <Chip icon={<Store size={18} />} label="Alta de negocio" color="secondary" sx={{ mb: 2 }} />
                <Typography variant="h1" color="primary" sx={{ mb: 2 }}>
                  Haz que turistas y locales encuentren tu comercio.
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 760, mb: 4 }}>
                  Rellena la informacion de tu negocio. Podras editarla despues desde tu panel.
                </Typography>

                <Card className="soft-panel" sx={{ borderRadius: '32px' }}>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Box component="form" onSubmit={saveBusiness}>
                      <Stack spacing={3}>
                        <TextField label="Nombre del negocio" value={form.name} onChange={(e) => updateField('name', e.target.value)} required fullWidth />
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                          <TextField select label="Categoria" value={form.category} onChange={(e) => updateField('category', e.target.value)} fullWidth>
                            {businessCategories.filter((c) => c !== 'Todos').map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                          </TextField>
                          <TextField label="Horario" value={form.schedule} onChange={(e) => updateField('schedule', e.target.value)} fullWidth />
                        </Stack>
                        <TextField label="Direccion o zona" value={form.address} onChange={(e) => updateField('address', e.target.value)} required fullWidth />
                        <TextField label="Descripcion" value={form.description} onChange={(e) => updateField('description', e.target.value)} multiline rows={4} required fullWidth />
                        <Box>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <Megaphone size={20} />
                            <Typography variant="body1" sx={{ fontWeight: 800 }}>Promocion destacada</Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            {promotionIdeas.map((idea) => (
                              <Chip key={idea} label={idea} onClick={() => updateField('promotion', idea)} color={form.promotion === idea ? 'secondary' : 'default'} variant={form.promotion === idea ? 'filled' : 'outlined'} />
                            ))}
                          </Stack>
                        </Box>
                        <Stack direction="row" spacing={2}>
                          <Button variant="outlined" onClick={() => setCreating(false)} sx={{ borderRadius: '16px' }}>Cancelar</Button>
                          <Button type="submit" variant="contained" color="secondary" startIcon={<CheckCircle size={20} />} sx={{ borderRadius: '16px', flex: 1 }}>
                            Publicar mi negocio
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Preview */}
              <Box sx={{ width: { xs: '100%', lg: 400 }, position: { lg: 'sticky' }, top: 120 }}>
                <Card className="interactive-card" sx={{ borderRadius: '32px', overflow: 'hidden' }}>
                  <Box sx={{ height: 200, bgcolor: 'primary.main', color: 'white', display: 'grid', placeItems: 'center' }}>
                    <Stack alignItems="center" spacing={1}>
                      <ImagePlus size={48} />
                      <Typography variant="body1" sx={{ fontWeight: 800 }}>Foto principal</Typography>
                    </Stack>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Chip label={form.category} color="secondary" />
                      {form.accessible && <Chip icon={<BadgeCheck size={16} />} label="Accesible" color="success" />}
                    </Stack>
                    <Typography variant="h2" sx={{ mb: 0.5 }}>{form.name || 'Nombre de tu negocio'}</Typography>
                    <Typography variant="body2" sx={{ mb: 1.5 }}>{form.address || 'Direccion'} · {form.schedule}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{form.description || 'Descripcion de tu negocio'}</Typography>
                    {form.promotion && (
                      <Box sx={{ p: 2, borderRadius: '16px', bgcolor: 'rgba(233,95,42,0.1)', border: '1px solid rgba(233,95,42,0.22)' }}>
                        <Typography variant="body1" sx={{ fontWeight: 800 }}>Promocion: {form.promotion}</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    );
  }

  // Business hub
  const avgRating = mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length;

  return (
    <Box sx={{ pt: { xs: 11, md: 13 }, pb: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="soft-panel" sx={{ borderRadius: '28px', mb: 3, overflow: 'hidden' }}>
            <Box sx={{ height: 8, bgcolor: 'primary.main' }} />
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1.4, borderRadius: '18px', display: 'grid', placeItems: 'center' }}>
                    <Store size={28} />
                  </Box>
                  <Box>
                    <Typography variant="h2" sx={{ mb: 0.2 }}>{business.name}</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip label={business.category} color="secondary" size="small" />
                      <Chip icon={<BadgeCheck size={14} />} label="Publicado" color="success" size="small" />
                    </Stack>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.5}>
                  <Stack alignItems="center" sx={{ p: 1.5, borderRadius: '16px', bgcolor: 'rgba(242,183,5,0.12)', border: '1px solid rgba(242,183,5,0.3)', minWidth: 72 }}>
                    <Typography variant="h3" sx={{ color: '#B8860B', mb: 0.2 }}>{avgRating.toFixed(1)}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>Calif.</Typography>
                  </Stack>
                  <Stack alignItems="center" sx={{ p: 1.5, borderRadius: '16px', bgcolor: 'rgba(18,49,43,0.06)', border: '1px solid', borderColor: 'divider', minWidth: 72 }}>
                    <Typography variant="h3" sx={{ mb: 0.2 }}>{mockReviews.length}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>Resenas</Typography>
                  </Stack>
                  <Stack alignItems="center" sx={{ p: 1.5, borderRadius: '16px', bgcolor: 'rgba(18,49,43,0.06)', border: '1px solid', borderColor: 'divider', minWidth: 72 }}>
                    <Typography variant="h3" sx={{ mb: 0.2 }}>234</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>Vistas</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          {tabs.map((tab) => (
            <Chip
              key={tab}
              label={tab}
              onClick={() => setActiveTab(tab)}
              color={activeTab === tab ? 'primary' : 'default'}
              variant={activeTab === tab ? 'filled' : 'outlined'}
              sx={{ px: 1.5, fontSize: '1rem', cursor: 'pointer' }}
            />
          ))}
        </Stack>

        <AnimatePresence mode="wait">
          {activeTab === 'Info' && (
            <motion.div key="info" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
              <Stack spacing={2.5}>
                <Card sx={{ borderRadius: '24px' }}>
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={1.2}>
                        <Briefcase size={22} />
                        <Typography variant="h3">Informacion del negocio</Typography>
                      </Stack>
                      <Button size="small" variant="outlined" startIcon={<Pencil size={14} />} sx={{ borderRadius: '12px', minHeight: 34 }}>
                        Editar
                      </Button>
                    </Stack>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                      {[
                        { label: 'Nombre', value: business.name },
                        { label: 'Categoria', value: business.category },
                        { label: 'Direccion', value: business.address },
                        { label: 'Horario', value: business.schedule },
                      ].map(({ label, value }) => (
                        <Box key={label} sx={{ p: 2, borderRadius: '16px', bgcolor: 'rgba(18,49,43,0.04)', border: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem', mb: 0.3 }}>{label}</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>{value}</Typography>
                        </Box>
                      ))}
                    </Box>
                    {business.description && (
                      <Box sx={{ mt: 2, p: 2, borderRadius: '16px', bgcolor: 'rgba(18,49,43,0.04)', border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem', mb: 0.3 }}>Descripcion</Typography>
                        <Typography variant="body1">{business.description}</Typography>
                      </Box>
                    )}
                    {business.promotion && (
                      <Box sx={{ mt: 2, p: 2, borderRadius: '16px', bgcolor: 'rgba(233,95,42,0.08)', border: '1px solid rgba(233,95,42,0.25)' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Megaphone size={18} color="#E95F2A" />
                          <Typography variant="body1" sx={{ fontWeight: 800 }}>Promocion activa: {business.promotion}</Typography>
                        </Stack>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </motion.div>
          )}

          {activeTab === 'Publicaciones' && (
            <motion.div key="posts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
              <Stack spacing={2.5}>
                {/* New post form */}
                <Card sx={{ borderRadius: '24px' }}>
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Typography variant="h3" sx={{ mb: 2 }}>Nueva publicacion</Typography>
                    <TextField
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="Escribe una promocion, novedad o mensaje para tus clientes..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      {postAdded && (
                        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                          <Chip label="Publicado!" color="success" size="small" />
                        </motion.div>
                      )}
                      <Box sx={{ ml: 'auto' }}>
                        <Button variant="contained" color="secondary" endIcon={<Send size={18} />} onClick={addPost} disabled={!newPost.trim()} sx={{ borderRadius: '14px' }}>
                          Publicar
                        </Button>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Posts list */}
                {posts.map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Card sx={{ borderRadius: '24px' }}>
                      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                        <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ mb: 1.5 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontWeight: 800 }}>
                            {(business.name || 'N').charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 800 }}>{business.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{post.date}</Typography>
                          </Box>
                        </Stack>
                        <Typography variant="body1" sx={{ mb: 2 }}>{post.text}</Typography>
                        <Divider sx={{ mb: 1.5 }} />
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconButton size="small" onClick={() => likePost(post.id)} sx={{ color: 'text.secondary' }}>
                            <ThumbsUp size={18} />
                          </IconButton>
                          <Typography variant="body2">{post.likes} me gusta</Typography>
                          <IconButton size="small" sx={{ color: 'text.secondary', ml: 1 }}>
                            <MessageSquare size={18} />
                          </IconButton>
                          <Typography variant="body2">Comentar</Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Stack>
            </motion.div>
          )}

          {activeTab === 'Resenas' && (
            <motion.div key="reviews" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
              <Card sx={{ borderRadius: '24px', mb: 3 }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={3}>
                    <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                      <Typography variant="h1" color="primary" sx={{ fontSize: '3.5rem', mb: 0.5 }}>{avgRating.toFixed(1)}</Typography>
                      <StarRow rating={avgRating} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{mockReviews.length} resenas</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = mockReviews.filter((r) => r.rating === star).length;
                        return (
                          <Stack key={star} direction="row" alignItems="center" spacing={1.2} sx={{ mb: 0.8 }}>
                            <Stack direction="row" alignItems="center" spacing={0.4}>
                              <Star size={13} fill="#F2B705" color="#F2B705" />
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>{star}</Typography>
                            </Stack>
                            <Box sx={{ flex: 1, height: 8, borderRadius: 999, bgcolor: 'rgba(18,49,43,0.08)', overflow: 'hidden' }}>
                              <Box sx={{ width: `${(count / mockReviews.length) * 100}%`, height: '100%', bgcolor: '#F2B705', borderRadius: 999 }} />
                            </Box>
                            <Typography variant="body2" sx={{ width: 18, textAlign: 'right' }}>{count}</Typography>
                          </Stack>
                        );
                      })}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Stack spacing={2}>
                {mockReviews.map((review, i) => (
                  <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                    <Card sx={{ borderRadius: '22px' }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                          <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.main', fontWeight: 800 }}>{review.avatar}</Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 800 }}>{review.user}</Typography>
                            <Typography variant="body2" color="text.secondary">{review.date}</Typography>
                          </Box>
                          <StarRow rating={review.rating} />
                        </Stack>
                        <Typography variant="body1" color="text.secondary">{review.comment}</Typography>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.5 }}>
                          <IconButton size="small" sx={{ color: 'text.secondary' }}>
                            <Heart size={16} />
                          </IconButton>
                          <Typography variant="body2" color="text.secondary">Responder</Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default BusinessPage;
