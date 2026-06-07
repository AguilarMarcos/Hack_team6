import { useState } from 'react';
import {
  Avatar, Box, Button, Card, CardContent, Chip, Container, Divider,
  IconButton, Stack, Tab, Tabs, Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Accessibility, Clock, Footprints, LockKeyhole, Map as MapIcon,
  MapPinned, Plus, Route as RouteIcon, Send, Sparkles, Star, Trash2, Wallet,
} from 'lucide-react';
import { businesses, routePlans, routeReviews } from '../data/durango';
import { useAuth } from '../context/useAuth';
import { useSavedPlaces } from '../hooks/useSavedPlaces';
import IntroModal from '../components/IntroModal';

const routeModes = ['Tranquila', 'Familiar', 'Fotografica'];
const budgets = ['Economica', 'Media', 'Flexible'];

const StarRow = ({ rating, size = 14 }) => (
  <Stack direction="row" alignItems="center" spacing={0.3}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={size} fill={s <= Math.round(rating) ? '#F2B705' : 'transparent'} color={s <= Math.round(rating) ? '#F2B705' : '#D4C5A9'} />
    ))}
  </Stack>
);

const RouteCard = ({ route, isActive, onClick }) => {
  const heroImg = businesses.find((b) => b.name === route.stops[0])?.img;
  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
      <Card
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          borderRadius: '28px',
          overflow: 'hidden',
          border: '2px solid',
          borderColor: isActive ? route.color : 'rgba(231,221,207,0.7)',
          boxShadow: isActive
            ? `0 24px 56px ${route.color}38`
            : '0 8px 24px rgba(49,35,20,0.07)',
          transition: 'all 0.26s ease',
          height: '100%',
        }}
      >
        {heroImg && (
          <Box sx={{ position: 'relative', height: 160, overflow: 'hidden' }}>
            <Box
              component="img"
              src={heroImg}
              alt={route.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.45s ease', '&:hover': { transform: 'scale(1.06)' } }}
            />
            <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${route.color}d0 0%, transparent 50%)` }} />

            {/* Rating pill */}
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ position: 'absolute', bottom: 10, left: 12, bgcolor: 'rgba(255,255,255,0.95)', borderRadius: '999px', px: 1.2, py: 0.5 }}>
              <Star size={12} fill="#F2B705" color="#F2B705" />
              <Typography variant="body2" sx={{ fontWeight: 900, fontSize: '0.82rem' }}>{route.rating}</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.76rem', color: 'text.secondary' }}>({route.totalReviews})</Typography>
            </Stack>

            {isActive && (
              <Chip label="Seleccionada" size="small" sx={{ position: 'absolute', top: 10, right: 10, bgcolor: route.color, color: 'white', fontWeight: 800 }} />
            )}
          </Box>
        )}
        <CardContent sx={{ p: 2.2 }}>
          <Box sx={{ width: 36, height: 5, borderRadius: 999, bgcolor: route.color, mb: 1.4 }} />
          <Typography variant="h3" sx={{ mb: 1, fontSize: '1.08rem', fontWeight: 800 }}>{route.title}</Typography>
          <Stack spacing={0.7}>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <Clock size={13} color="#5B665F" />
              <Typography variant="body2">{route.duration}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <Wallet size={13} color="#5B665F" />
              <Typography variant="body2">{route.budget}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <Accessibility size={13} color="#5B665F" />
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{route.accessibility}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ReviewItem = ({ review }) => (
  <Box sx={{ p: 2, borderRadius: '18px', bgcolor: 'rgba(18,49,43,0.04)', border: '1px solid', borderColor: 'divider' }}>
    <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 0.8 }}>
      <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', fontSize: '0.88rem', fontWeight: 800 }}>{review.avatar}</Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 800 }}>{review.user}</Typography>
      </Box>
      <StarRow rating={review.rating} size={12} />
    </Stack>
    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{review.comment}</Typography>
  </Box>
);

const RoutesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isGuest = user?.role === 'guest';
  const { savedPlaces, removePlace } = useSavedPlaces();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedMode, setSelectedMode] = useState('Tranquila');
  const [selectedBudget, setSelectedBudget] = useState('Economica');
  const [activeRouteId, setActiveRouteId] = useState(routePlans[0].id);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [localRouteReviews, setLocalRouteReviews] = useState({});
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [customRouteOpen, setCustomRouteOpen] = useState(false);

  const activeRoute = routePlans.find((r) => r.id === activeRouteId) || routePlans[0];
  const stopDetails = activeRoute.stops.map((s) => businesses.find((b) => b.name === s)).filter(Boolean);
  const allRouteReviews = [...(routeReviews[activeRouteId] || []), ...(localRouteReviews[activeRouteId] || [])];

  const suggestRoute = () => {
    const match = routePlans.find((r) => r.mood === selectedMode && r.budget === selectedBudget)
      || routePlans.find((r) => r.mood === selectedMode)
      || routePlans[0];
    setActiveRouteId(match.id);
    setActiveTab(0);
  };

  const openInMap = () => navigate('/map', { state: { routeId: activeRoute.id } });

  const submitReview = () => {
    if (!reviewText.trim()) return;
    const id = activeRouteId.length * 100 + (localRouteReviews[activeRouteId]?.length || 0);
    const newReview = {
      id,
      user: user?.username || 'Tu',
      avatar: (user?.username || 'T').charAt(0).toUpperCase(),
      rating: reviewRating,
      comment: reviewText.trim(),
      date: 'Ahora',
    };
    setLocalRouteReviews((prev) => ({ ...prev, [activeRouteId]: [...(prev[activeRouteId] || []), newReview] }));
    setReviewSubmitted(true);
    setReviewFormOpen(false);
    setReviewText('');
  };

  const openCustomRouteInMap = () => {
    if (savedPlaces.length < 2) return;
    navigate('/map', {
      state: {
        routeId: 'custom',
        customRoute: {
          id: 'custom',
          title: 'Mi ruta personalizada',
          mood: 'Personalizada',
          duration: `~${savedPlaces.length * 45} min`,
          accessibility: 'A tu ritmo',
          budget: 'Variable',
          stops: savedPlaces.map((p) => p.name),
          color: '#6C4AB6',
        },
      },
    });
  };

  if (isGuest) {
    return (
      <Box sx={{ pt: { xs: 11, md: 13 }, pb: 4 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card sx={{ borderRadius: '32px', overflow: 'hidden' }}>
              <Box sx={{ height: 8, background: 'linear-gradient(90deg, #E95F2A, #F2B705)' }} />
              <CardContent sx={{ p: { xs: 3, md: 5 }, textAlign: 'center' }}>
                <Box sx={{ bgcolor: 'secondary.main', color: 'white', width: 76, height: 76, borderRadius: '24px', display: 'grid', placeItems: 'center', mx: 'auto', mb: 3 }}>
                  <LockKeyhole size={38} />
                </Box>
                <Typography variant="h1" color="primary" sx={{ fontSize: { xs: '2.2rem', md: '3rem' }, mb: 2 }}>
                  Rutas bloqueadas para visitantes
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                  Crea una cuenta completa para acceder a rutas, guardar lugares y crear recorridos personalizados.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: { xs: 11, md: 13 }, pb: 6 }}>
      <IntroModal
        pageKey="routes"
        icon={<RouteIcon size={42} />}
        title="Rutas de Durango"
        description="Elige una ruta popular, usa tus lugares guardados para crear la tuya propia, o genera una ruta segun tu ritmo y presupuesto."
        cta="Ver rutas"
      />

      <Container>
        {/* ─── Hero ─── */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box sx={{ mb: 4 }}>
            <Chip icon={<RouteIcon size={18} />} label="Rutas de Durango" color="secondary" sx={{ mb: 2 }} />
            <Typography variant="h1" color="primary" sx={{ mb: 1.5 }}>Elige tu ruta, elige tu ritmo.</Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600 }}>
              Rutas curadas para familias, adultos mayores y visitantes. Cada parada seleccionada para maximizar la experiencia.
            </Typography>
          </Box>
        </motion.div>

        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} alignItems="flex-start">

          {/* ─── Left column ─── */}
          <Box sx={{ flex: 1, minWidth: 0 }}>

            {/* ─── Tabs ─── */}
            <Box sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                sx={{
                  '& .MuiTabs-indicator': { height: 3, borderRadius: 2 },
                  '& .MuiTab-root': { fontWeight: 800, fontSize: '0.96rem', textTransform: 'none', minHeight: 48 },
                }}
              >
                <Tab label="Rutas populares" icon={<RouteIcon size={16} />} iconPosition="start" />
                <Tab
                  label={savedPlaces.length > 0 ? `Guardados (${savedPlaces.length})` : 'Mis lugares'}
                  icon={<MapPinned size={16} />}
                  iconPosition="start"
                />
                <Tab label="Generar" icon={<Sparkles size={16} />} iconPosition="start" />
              </Tabs>
              <Divider />
            </Box>

            {/* ─── Tab: Rutas populares ─── */}
            <AnimatePresence mode="wait">
              {activeTab === 0 && (
                <motion.div key="popular" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2.5 }}>
                    {routePlans.map((route, i) => (
                      <motion.div key={route.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.42 }}>
                        <RouteCard
                          route={route}
                          isActive={activeRouteId === route.id}
                          onClick={() => { setActiveRouteId(route.id); setReviewSubmitted(false); }}
                        />
                      </motion.div>
                    ))}
                  </Box>

                  {/* Quick action hint */}
                  <Box sx={{ mt: 3, p: 2.5, borderRadius: '22px', bgcolor: 'rgba(18,49,43,0.04)', border: '1px dashed', borderColor: 'divider', textAlign: 'center' }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
                      <MapIcon size={20} color="#5B665F" />
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        Toca una ruta para ver detalles y abrirla en el mapa
                      </Typography>
                    </Stack>
                  </Box>
                </motion.div>
              )}

              {/* ─── Tab: Mis lugares guardados ─── */}
              {activeTab === 1 && (
                <motion.div key="saved" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>

                  {/* Saved places header */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1.2}>
                      <Box sx={{ bgcolor: savedPlaces.length > 0 ? 'secondary.main' : 'rgba(18,49,43,0.15)', color: 'white', p: 0.8, borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
                        <MapPinned size={18} />
                      </Box>
                      <Box>
                        <Typography variant="h3">Lugares guardados</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {savedPlaces.length === 0 ? 'Agrega desde Descubrir' : `${savedPlaces.length} lugar${savedPlaces.length !== 1 ? 'es' : ''} guardado${savedPlaces.length !== 1 ? 's' : ''}`}
                        </Typography>
                      </Box>
                    </Stack>

                    {savedPlaces.length >= 2 && (
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Plus size={16} />}
                        onClick={() => setCustomRouteOpen((v) => !v)}
                        sx={{ borderRadius: '14px', minHeight: 40, fontWeight: 800 }}
                      >
                        Crear ruta
                      </Button>
                    )}
                  </Stack>

                  {/* Empty state */}
                  {savedPlaces.length === 0 ? (
                    <Box sx={{ p: 4, borderRadius: '24px', bgcolor: 'rgba(18,49,43,0.04)', border: '2px dashed', borderColor: 'divider', textAlign: 'center' }}>
                      <Box sx={{ bgcolor: 'rgba(18,49,43,0.08)', borderRadius: '20px', width: 68, height: 68, display: 'grid', placeItems: 'center', mx: 'auto', mb: 2.5 }}>
                        <MapPinned size={34} color="#5B665F" />
                      </Box>
                      <Typography variant="h3" sx={{ mb: 1 }}>Sin lugares guardados</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        En Descubrir, toca "A mi ruta" en cualquier lugar para guardarlo aquí.
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate('/')}
                        sx={{ borderRadius: '14px' }}
                      >
                        Ir a Descubrir
                      </Button>
                    </Box>
                  ) : (
                    <Stack spacing={1.4}>
                      {savedPlaces.map((place, i) => (
                        <motion.div key={place.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.36 }}>
                          <Card sx={{ display: 'flex', alignItems: 'center', gap: 1.8, p: 1.6, borderRadius: '22px', border: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ position: 'relative', flexShrink: 0 }}>
                              <Box component="img" src={place.img} alt={place.name} sx={{ width: 64, height: 64, borderRadius: '16px', objectFit: 'cover' }} />
                              <Box sx={{ position: 'absolute', top: -6, left: -6, width: 22, height: 22, borderRadius: '7px', bgcolor: 'secondary.main', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '0.75rem' }}>
                                {i + 1}
                              </Box>
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="body1" sx={{ fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.name}</Typography>
                              <Typography variant="body2" color="text.secondary">{place.category} · {place.distance}</Typography>
                              <Stack direction="row" alignItems="center" spacing={0.4} sx={{ mt: 0.4 }}>
                                <Star size={12} fill="#F2B705" color="#F2B705" />
                                <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.82rem' }}>{place.rating}</Typography>
                              </Stack>
                            </Box>
                            <IconButton size="small" onClick={() => removePlace(place.id)} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'rgba(211,47,47,0.08)' }, borderRadius: '10px' }} aria-label="quitar">
                              <Trash2 size={16} />
                            </IconButton>
                          </Card>
                        </motion.div>
                      ))}
                    </Stack>
                  )}

                  {/* Custom route panel */}
                  <AnimatePresence>
                    {customRouteOpen && savedPlaces.length >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <Box sx={{ mt: 2.5, p: 3, borderRadius: '28px', background: 'linear-gradient(135deg, rgba(108,74,182,0.1) 0%, rgba(108,74,182,0.04) 100%)', border: '1.5px solid rgba(108,74,182,0.35)' }}>
                          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                            <Box sx={{ bgcolor: '#6C4AB6', color: 'white', p: 1, borderRadius: '12px', display: 'grid', placeItems: 'center' }}>
                              <RouteIcon size={18} />
                            </Box>
                            <Box>
                              <Typography variant="h3" sx={{ color: '#6C4AB6' }}>Mi ruta con {savedPlaces.length} paradas</Typography>
                              <Typography variant="body2" color="text.secondary">Duracion estimada: ~{savedPlaces.length * 45} min · A tu ritmo</Typography>
                            </Box>
                          </Stack>
                          <Stack spacing={1} sx={{ mb: 2.5 }}>
                            {savedPlaces.map((p, i) => (
                              <Stack key={p.id} direction="row" alignItems="center" spacing={1.4}>
                                <Box sx={{ width: 26, height: 26, borderRadius: '8px', bgcolor: '#6C4AB6', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '0.8rem', flexShrink: 0 }}>{i + 1}</Box>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.name}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto', flexShrink: 0 }}>{p.distance}</Typography>
                              </Stack>
                            ))}
                          </Stack>
                          <Button
                            variant="contained"
                            fullWidth
                            startIcon={<MapIcon size={18} />}
                            onClick={openCustomRouteInMap}
                            sx={{ borderRadius: '16px', py: 1.6, bgcolor: '#6C4AB6', '&:hover': { bgcolor: '#5a3d9a' }, fontWeight: 800 }}
                          >
                            Ver mi ruta en el mapa
                          </Button>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* ─── Tab: Generador rápido ─── */}
              {activeTab === 2 && (
                <motion.div key="generator" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <Card sx={{ borderRadius: '28px', overflow: 'hidden' }}>
                    <Box sx={{ height: 6, background: 'linear-gradient(90deg, #E95F2A, #F2B705)' }} />
                    <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                        <Box sx={{ bgcolor: 'secondary.main', color: 'white', p: 1.2, borderRadius: '14px', display: 'grid', placeItems: 'center' }}>
                          <Sparkles size={22} />
                        </Box>
                        <Box>
                          <Typography variant="h3">Generador rapido</Typography>
                          <Typography variant="body2" color="text.secondary">Filtramos la ruta ideal segun tus preferencias</Typography>
                        </Box>
                      </Stack>

                      <Divider sx={{ mb: 3 }} />

                      <Stack spacing={3}>
                        {/* Ritmo */}
                        <Box>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                            <Box sx={{ bgcolor: 'rgba(18,49,43,0.08)', p: 0.7, borderRadius: '9px', display: 'grid', placeItems: 'center' }}>
                              <Footprints size={17} color="#12312B" />
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 800 }}>¿Cual es tu ritmo?</Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            {routeModes.map((mode) => (
                              <Chip
                                key={mode}
                                label={mode}
                                onClick={() => setSelectedMode(mode)}
                                color={selectedMode === mode ? 'primary' : 'default'}
                                variant={selectedMode === mode ? 'filled' : 'outlined'}
                                sx={{ fontWeight: 700, px: 0.5 }}
                              />
                            ))}
                          </Stack>
                        </Box>

                        {/* Presupuesto */}
                        <Box>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                            <Box sx={{ bgcolor: 'rgba(18,49,43,0.08)', p: 0.7, borderRadius: '9px', display: 'grid', placeItems: 'center' }}>
                              <Wallet size={17} color="#12312B" />
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 800 }}>¿Cuanto quieres gastar?</Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            {budgets.map((b) => (
                              <Chip
                                key={b}
                                label={b}
                                onClick={() => setSelectedBudget(b)}
                                color={selectedBudget === b ? 'secondary' : 'default'}
                                variant={selectedBudget === b ? 'filled' : 'outlined'}
                                sx={{ fontWeight: 700, px: 0.5 }}
                              />
                            ))}
                          </Stack>
                        </Box>

                        <Button
                          variant="contained"
                          color="secondary"
                          size="large"
                          startIcon={<Sparkles size={20} />}
                          onClick={suggestRoute}
                          sx={{ borderRadius: '18px', py: 1.8, fontWeight: 800, fontSize: '1.05rem' }}
                        >
                          Sugerir mi ruta ideal
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* ─── Right: Detail panel (minimalista) ─── */}
          <Box sx={{ width: { xs: '100%', lg: 380 }, position: { lg: 'sticky' }, top: 100 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRouteId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card sx={{ borderRadius: '28px', overflow: 'hidden', boxShadow: `0 16px 40px ${activeRoute.color}18` }}>
                  {/* Color bar + hero mini */}
                  <Box sx={{ height: 6, bgcolor: activeRoute.color }} />

                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    {/* Title + rating */}
                    <Typography variant="h3" sx={{ mb: 0.8, fontSize: '1.25rem', fontWeight: 900 }}>{activeRoute.title}</Typography>
                    <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mb: 2 }}>
                      <StarRow rating={activeRoute.rating} size={14} />
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{activeRoute.rating}</Typography>
                      <Typography variant="body2" color="text.secondary">· {activeRoute.totalReviews} resenas</Typography>
                    </Stack>

                    {/* Quick stats chips */}
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2.5 }}>
                      <Chip icon={<Clock size={13} />} label={activeRoute.duration} size="small" variant="outlined" />
                      <Chip icon={<Wallet size={13} />} label={activeRoute.budget} size="small" variant="outlined" />
                      <Chip icon={<Accessibility size={13} />} label={activeRoute.accessibility} size="small" variant="outlined" />
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    {/* Stops */}
                    <Typography variant="body2" sx={{ fontWeight: 800, mb: 1.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.78rem' }}>
                      {stopDetails.length} paradas
                    </Typography>
                    <Stack spacing={1.2} sx={{ mb: 2.5 }}>
                      {stopDetails.map((stop, i) => (
                        <Stack key={stop.id} direction="row" spacing={1.4} alignItems="center">
                          <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: activeRoute.color, color: 'white', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '0.86rem', flexShrink: 0 }}>{i + 1}</Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stop.name}</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{stop.type}</Typography>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>

                    {/* Action */}
                    <Button variant="contained" color="secondary" fullWidth startIcon={<MapIcon size={19} />} onClick={openInMap} sx={{ borderRadius: '18px', py: 1.7, fontWeight: 800, mb: 2 }}>
                      Ver en el mapa
                    </Button>

                    <Divider sx={{ mb: 2 }} />

                    {/* Reviews compact */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>Resenas ({allRouteReviews.length})</Typography>
                      <Button size="small" variant="outlined" startIcon={<Send size={13} />} onClick={() => setReviewFormOpen((v) => !v)} sx={{ borderRadius: '12px', minHeight: 32, py: 0.5, fontSize: '0.8rem' }}>
                        {reviewFormOpen ? 'Cancelar' : 'Resenar'}
                      </Button>
                    </Stack>

                    <AnimatePresence>
                      {reviewFormOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.26 }} style={{ overflow: 'hidden' }}>
                          <Box sx={{ p: 2, borderRadius: '18px', bgcolor: 'rgba(18,49,43,0.04)', mb: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.2 }}>
                              {[1, 2, 3, 4, 5].map((s) => (
                                <IconButton key={s} size="small" onClick={() => setReviewRating(s)} sx={{ p: 0.2 }}>
                                  <Star size={20} fill={s <= reviewRating ? '#F2B705' : 'transparent'} color={s <= reviewRating ? '#F2B705' : '#D4C5A9'} />
                                </IconButton>
                              ))}
                            </Stack>
                            <Box
                              component="textarea"
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              placeholder="Escribe tu experiencia..."
                              rows={3}
                              style={{ width: '100%', border: '1px solid #E7DDCF', borderRadius: 12, padding: '10px 12px', fontSize: '0.96rem', fontFamily: 'Outfit, sans-serif', fontWeight: 500, color: '#17211F', background: 'white', outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 10 }}
                            />
                            <Button variant="contained" color="secondary" size="small" endIcon={<Send size={14} />} onClick={submitReview} disabled={!reviewText.trim()} sx={{ borderRadius: '12px' }}>
                              Publicar
                            </Button>
                          </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {reviewSubmitted && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                          <Chip label="Resena publicada!" color="success" sx={{ width: '100%', borderRadius: '12px', py: 2, mb: 2, fontSize: '0.96rem' }} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Stack spacing={1.5}>
                      {allRouteReviews.map((review) => <ReviewItem key={review.id} review={review} />)}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default RoutesPage;
