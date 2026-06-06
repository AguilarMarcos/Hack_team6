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
  Stack,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Accessibility,
  Clock,
  Footprints,
  LockKeyhole,
  MapPinned,
  Map as MapIcon,
  Route as RouteIcon,
  Send,
  Sparkles,
  Star,
  Wallet,
} from 'lucide-react';
import { businesses, routePlans, routeDescriptions, routeReviews } from '../data/durango';
import { useAuth } from '../context/useAuth';

const routeModes = ['Tranquila', 'Familiar', 'Fotografica'];
const budgets = ['Economica', 'Media', 'Flexible'];

const StarRow = ({ rating, size = 15 }) => (
  <Stack direction="row" alignItems="center" spacing={0.4}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        fill={s <= Math.round(rating) ? '#F2B705' : 'transparent'}
        color={s <= Math.round(rating) ? '#F2B705' : '#D4C5A9'}
      />
    ))}
  </Stack>
);

const RouteCard = ({ route, isActive, onClick }) => {
  const heroImg = businesses.find((b) => b.name === route.stops[0])?.img;
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '2px solid',
          borderColor: isActive ? route.color : 'divider',
          boxShadow: isActive
            ? `0 20px 48px ${route.color}30`
            : '0 8px 24px rgba(49,35,20,0.08)',
          transition: 'all 0.22s ease',
        }}
      >
        {heroImg && (
          <Box sx={{ position: 'relative', height: 140, overflow: 'hidden' }}>
            <Box
              component="img"
              src={heroImg}
              alt={route.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to top, ${route.color}cc 0%, transparent 60%)`,
              }}
            />
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 14,
                bgcolor: 'rgba(255,255,255,0.92)',
                borderRadius: '999px',
                px: 1.2,
                py: 0.5,
              }}
            >
              <Star size={13} fill="#F2B705" color="#F2B705" />
              <Typography variant="body2" sx={{ fontWeight: 900, fontSize: '0.84rem' }}>
                {route.rating}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                ({route.totalReviews})
              </Typography>
            </Stack>
          </Box>
        )}
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ width: 48, height: 6, borderRadius: 999, bgcolor: route.color, mb: 1.5 }} />
          <Typography variant="h3" sx={{ mb: 1, fontSize: '1.1rem' }}>
            {route.title}
          </Typography>
          <Stack spacing={0.8} sx={{ color: 'text.secondary' }}>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <Clock size={15} />
              <Typography variant="body2">{route.duration}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <Wallet size={15} />
              <Typography variant="body2">{route.budget}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <Accessibility size={15} />
              <Typography variant="body2">{route.accessibility}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const RoutesPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isGuest = user?.role === 'guest';
  const [selectedMode, setSelectedMode] = useState('Tranquila');
  const [selectedBudget, setSelectedBudget] = useState('Economica');
  const [activeRouteId, setActiveRouteId] = useState(routePlans[0].id);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [localRouteReviews, setLocalRouteReviews] = useState({});
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const activeRoute = routePlans.find((r) => r.id === activeRouteId) || routePlans[0];
  const stopDetails = activeRoute.stops
    .map((stop) => businesses.find((b) => b.name === stop))
    .filter(Boolean);

  const allRouteReviews = [
    ...(routeReviews[activeRouteId] || []),
    ...(localRouteReviews[activeRouteId] || []),
  ];

  const suggestRoute = () => {
    const match =
      routePlans.find((r) => r.mood === selectedMode && r.budget === selectedBudget) ||
      routePlans.find((r) => r.mood === selectedMode) ||
      routePlans[0];
    setActiveRouteId(match.id);
  };

  const openInMap = () => {
    navigate('/map', { state: { routeId: activeRouteId } });
  };

  const submitReview = () => {
    if (!reviewText.trim()) return;
    const newReview = {
      id: Date.now(),
      user: user?.username || 'Tu',
      avatar: (user?.username || 'T').charAt(0).toUpperCase(),
      rating: reviewRating,
      comment: reviewText.trim(),
      date: 'Ahora',
    };
    setLocalRouteReviews((prev) => ({
      ...prev,
      [activeRouteId]: [...(prev[activeRouteId] || []), newReview],
    }));
    setReviewSubmitted(true);
    setReviewFormOpen(false);
    setReviewText('');
  };

  if (isGuest) {
    return (
      <Box sx={{ pt: { xs: 11, md: 13 }, pb: 4 }}>
        <Container maxWidth="md">
          <Card className="soft-panel" sx={{ borderRadius: '32px' }}>
            <CardContent sx={{ p: { xs: 3, md: 5 }, textAlign: 'center' }}>
              <Box
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'white',
                  width: 76,
                  height: 76,
                  borderRadius: '24px',
                  display: 'grid',
                  placeItems: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <LockKeyhole size={38} />
              </Box>
              <Typography variant="h1" color="primary" sx={{ fontSize: { xs: '2.3rem', md: '3rem' }, mb: 2 }}>
                Rutas bloqueadas para visitantes
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                Para generar rutas, guardar paradas y abrir recorridos en el mapa necesitas una cuenta completa.
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
    <Box sx={{ pt: { xs: 11, md: 13 }, pb: 6 }}>
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Box sx={{ mb: 5 }}>
            <Chip icon={<RouteIcon size={18} />} label="Rutas de Durango" color="secondary" sx={{ mb: 2 }} />
            <Typography variant="h1" color="primary" sx={{ mb: 2 }}>
              Elige tu ruta, elige tu ritmo.
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 680 }}>
              Rutas curadas para familias, adultos mayores y visitantes. Cada parada seleccionada
              para maximizar la experiencia con el minimo esfuerzo.
            </Typography>
          </Box>
        </motion.div>

        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} alignItems="flex-start">
          {/* Left: route list + generator */}
          <Box sx={{ flex: 1 }}>
            {/* Popular routes */}
            <Typography variant="h2" sx={{ mb: 2.5 }}>
              Rutas populares
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: 2,
                mb: 4,
              }}
            >
              {routePlans.map((route, i) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.42 }}
                >
                  <RouteCard
                    route={route}
                    isActive={activeRouteId === route.id}
                    onClick={() => {
                      setActiveRouteId(route.id);
                      setReviewSubmitted(false);
                    }}
                  />
                </motion.div>
              ))}
            </Box>

            {/* Custom route generator */}
            <Card className="soft-panel" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: '28px' }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                <Box
                  sx={{
                    bgcolor: 'secondary.main',
                    color: 'white',
                    p: 1,
                    borderRadius: '14px',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Sparkles size={20} />
                </Box>
                <Typography variant="h3">Generador de ruta personalizada</Typography>
              </Stack>

              <Stack spacing={2.5}>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.2 }}>
                    <Footprints size={20} />
                    <Typography variant="body1" sx={{ fontWeight: 800 }}>
                      Ritmo de la ruta
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {routeModes.map((mode) => (
                      <Chip
                        key={mode}
                        label={mode}
                        onClick={() => setSelectedMode(mode)}
                        color={selectedMode === mode ? 'primary' : 'default'}
                        variant={selectedMode === mode ? 'filled' : 'outlined'}
                      />
                    ))}
                  </Stack>
                </Box>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.2 }}>
                    <Wallet size={20} />
                    <Typography variant="body1" sx={{ fontWeight: 800 }}>
                      Presupuesto
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {budgets.map((b) => (
                      <Chip
                        key={b}
                        label={b}
                        onClick={() => setSelectedBudget(b)}
                        color={selectedBudget === b ? 'secondary' : 'default'}
                        variant={selectedBudget === b ? 'filled' : 'outlined'}
                      />
                    ))}
                  </Stack>
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<Sparkles size={20} />}
                  onClick={suggestRoute}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Sugerir mi ruta
                </Button>
              </Stack>
            </Card>
          </Box>

          {/* Right: sticky detail panel */}
          <Box
            sx={{
              width: { xs: '100%', lg: 440 },
              position: { lg: 'sticky' },
              top: 100,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRouteId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card className="soft-panel" sx={{ borderRadius: '32px', overflow: 'hidden' }}>
                  {/* Hero image */}
                  {businesses.find((b) => b.name === activeRoute.stops[0])?.img && (
                    <Box sx={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                      <Box
                        component="img"
                        src={businesses.find((b) => b.name === activeRoute.stops[0]).img}
                        alt={activeRoute.title}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: `linear-gradient(to top, ${activeRoute.color}dd 0%, transparent 55%)`,
                        }}
                      />
                      <Box sx={{ position: 'absolute', bottom: 14, left: 16 }}>
                        <Chip label="Ruta activa" color="primary" size="small" />
                      </Box>
                    </Box>
                  )}

                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    {/* Title + meta */}
                    <Box sx={{ width: 48, height: 6, borderRadius: 999, bgcolor: activeRoute.color, mb: 1.5 }} />
                    <Typography variant="h2" sx={{ mb: 0.5 }}>
                      {activeRoute.title}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mb: 2 }}>
                      <StarRow rating={activeRoute.rating} />
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {activeRoute.rating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({activeRoute.totalReviews} resenas)
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ mb: 2.5 }}>
                      <Stack direction="row" alignItems="center" spacing={0.8}>
                        <Clock size={16} color="#5B665F" />
                        <Typography variant="body2">{activeRoute.duration}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.8}>
                        <Wallet size={16} color="#5B665F" />
                        <Typography variant="body2">{activeRoute.budget}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.8}>
                        <Accessibility size={16} color="#5B665F" />
                        <Typography variant="body2">{activeRoute.accessibility}</Typography>
                      </Stack>
                    </Stack>

                    {/* Description */}
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.7 }}>
                      {routeDescriptions[activeRouteId]}
                    </Typography>

                    <Divider sx={{ mb: 2.5 }} />

                    {/* Stops */}
                    <Typography variant="h3" sx={{ mb: 2 }}>
                      Paradas incluidas
                    </Typography>
                    <Stack spacing={2} sx={{ mb: 3 }}>
                      {stopDetails.map((stop, index) => (
                        <Stack key={stop.id} direction="row" spacing={2} alignItems="flex-start">
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: '12px',
                              bgcolor: activeRoute.color,
                              color: 'white',
                              display: 'grid',
                              placeItems: 'center',
                              fontWeight: 800,
                              fontSize: '1.05rem',
                              flexShrink: 0,
                            }}
                          >
                            {index + 1}
                          </Box>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 800 }}>
                              {stop.name}
                            </Typography>
                            <Typography variant="body2">
                              {stop.type} · {stop.distance}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {stop.hours}
                            </Typography>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>

                    {/* View on map */}
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      startIcon={<MapIcon size={20} />}
                      onClick={openInMap}
                      sx={{ mb: 1.5, borderRadius: '18px', py: 1.8 }}
                    >
                      Ver en el mapa
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<MapPinned size={20} />}
                      sx={{ mb: 3, borderRadius: '18px' }}
                    >
                      Guardar ruta
                    </Button>

                    <Divider sx={{ mb: 2.5 }} />

                    {/* Reviews */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                      <Typography variant="h3">
                        Resenas ({allRouteReviews.length})
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Send size={14} />}
                        onClick={() => setReviewFormOpen((v) => !v)}
                        sx={{ borderRadius: '12px', minHeight: 34 }}
                      >
                        {reviewFormOpen ? 'Cancelar' : 'Resenar'}
                      </Button>
                    </Stack>

                    {/* Review form */}
                    <AnimatePresence>
                      {reviewFormOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.26 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: '18px',
                              bgcolor: 'rgba(18,49,43,0.04)',
                              mb: 2,
                            }}
                          >
                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, mr: 0.5 }}>
                                Tu calificacion:
                              </Typography>
                              {[1, 2, 3, 4, 5].map((s) => (
                                <IconButton
                                  key={s}
                                  size="small"
                                  onClick={() => setReviewRating(s)}
                                  sx={{ p: 0.2 }}
                                >
                                  <Star
                                    size={22}
                                    fill={s <= reviewRating ? '#F2B705' : 'transparent'}
                                    color={s <= reviewRating ? '#F2B705' : '#D4C5A9'}
                                  />
                                </IconButton>
                              ))}
                            </Stack>
                            <Box
                              component="textarea"
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              placeholder="Escribe tu experiencia en esta ruta..."
                              rows={3}
                              style={{
                                width: '100%',
                                border: '1px solid #E7DDCF',
                                borderRadius: 14,
                                padding: '12px 14px',
                                fontSize: '1rem',
                                fontFamily: 'Outfit, sans-serif',
                                fontWeight: 500,
                                color: '#17211F',
                                background: 'white',
                                outline: 'none',
                                resize: 'vertical',
                                boxSizing: 'border-box',
                                marginBottom: 12,
                              }}
                            />
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              endIcon={<Send size={15} />}
                              onClick={submitReview}
                              disabled={!reviewText.trim()}
                              sx={{ borderRadius: '12px' }}
                            >
                              Publicar
                            </Button>
                          </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {reviewSubmitted && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <Chip
                            label="Resena publicada!"
                            color="success"
                            sx={{ width: '100%', borderRadius: '12px', py: 2, mb: 2, fontSize: '0.96rem' }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Stack spacing={1.5}>
                      {allRouteReviews.map((review) => (
                        <Box
                          key={review.id}
                          sx={{
                            p: 2,
                            borderRadius: '18px',
                            bgcolor: 'rgba(18,49,43,0.04)',
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 0.8 }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'primary.main',
                                fontSize: '0.9rem',
                                fontWeight: 800,
                              }}
                            >
                              {review.avatar}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                {review.user}
                              </Typography>
                            </Box>
                            <StarRow rating={review.rating} size={13} />
                          </Stack>
                          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                            {review.comment}
                          </Typography>
                        </Box>
                      ))}
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
