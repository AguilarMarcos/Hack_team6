import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarPlus,
  Heart,
  LockKeyhole,
  MapPin,
  Navigation,
  Phone,
  Send,
  Star,
  X,
} from 'lucide-react';
import { businessCategories, businesses, businessReviews, routePlans } from '../data/durango';
import { useAuth } from '../context/useAuth';

const StarRow = ({ rating, size = 18 }) => (
  <Stack direction="row" alignItems="center" spacing={0.5}>
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

const ReviewCard = ({ review }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: '18px',
      bgcolor: 'rgba(18,49,43,0.04)',
      border: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
      <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '1rem', fontWeight: 800 }}>
        {review.avatar}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          {review.user}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
          {review.date}
        </Typography>
      </Box>
      <StarRow rating={review.rating} size={14} />
    </Stack>
    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
      {review.comment}
    </Typography>
  </Box>
);

const Home = () => {
  const { user, logout } = useAuth();
  const isGuest = user?.role === 'guest';
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [favorites, setFavorites] = useState([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [localReviews, setLocalReviews] = useState({});
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const visiblePlaces =
    selectedCategory === 'Todos'
      ? businesses
      : businesses.filter((p) => p.category === selectedCategory);

  const toggleFavorite = (placeId) => {
    setFavorites((curr) =>
      curr.includes(placeId) ? curr.filter((id) => id !== placeId) : [...curr, placeId]
    );
  };

  const openPlace = (place) => {
    setSelectedPlace(place);
    setReviewOpen(false);
    setReviewSubmitted(false);
    setReviewText('');
    setReviewRating(5);
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
    setLocalReviews((prev) => ({
      ...prev,
      [selectedPlace.id]: [...(prev[selectedPlace.id] || []), newReview],
    }));
    setReviewSubmitted(true);
    setReviewOpen(false);
    setReviewText('');
  };

  const placeReviews = selectedPlace
    ? [...(businessReviews[selectedPlace.id] || []), ...(localReviews[selectedPlace.id] || [])]
    : [];

  return (
    <Box sx={{ pt: { xs: 11, md: 13 }, pb: 4 }}>
      <Container>
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Box sx={{ mb: 5 }}>
            <Chip label="Guia local de Durango" color="secondary" sx={{ mb: 2 }} />
            <Typography variant="h1" color="primary" sx={{ maxWidth: 980, mb: 2 }}>
              Descubre lugares reales para comer, comprar y pasear con confianza.
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 760 }}>
              Tarjetas grandes, filtros simples y rutas listas para que turistas, familias y
              personas mayores encuentren opciones sin complicaciones.
            </Typography>
          </Box>
        </motion.div>

        {/* Category filters */}
        <Stack direction="row" spacing={1.2} useFlexGap flexWrap="wrap" sx={{ mb: 4 }}>
          {businessCategories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setSelectedCategory(cat)}
              color={selectedCategory === cat ? 'primary' : 'default'}
              variant={selectedCategory === cat ? 'filled' : 'outlined'}
              sx={{ px: 1, fontSize: '1rem' }}
            />
          ))}
        </Stack>

        {/* Business grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 6,
          }}
        >
          {visiblePlaces.map((place, index) => {
            const isFav = favorites.includes(place.id);
            return (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.22 } }}
              >
                <Card
                  className="interactive-card"
                  onClick={() => openPlace(place)}
                  sx={{ height: '100%', overflow: 'hidden', cursor: 'pointer' }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="240"
                      image={place.img}
                      alt={place.name}
                      sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        '&:hover': { transform: 'scale(1.04)' },
                      }}
                    />
                    <IconButton
                      aria-label="guardar favorito"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(place.id);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'rgba(255,255,255,0.92)',
                        '&:hover': { bgcolor: 'white' },
                      }}
                    >
                      <Heart
                        size={22}
                        fill={isFav ? '#E95F2A' : 'transparent'}
                        color={isFav ? '#E95F2A' : '#12312B'}
                      />
                    </IconButton>
                    <Chip
                      label={place.category}
                      color="secondary"
                      sx={{ position: 'absolute', left: 12, bottom: 12 }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2.4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} sx={{ mb: 0.8 }}>
                      <Typography variant="h3">{place.name}</Typography>
                      <Stack direction="row" alignItems="center" spacing={0.4}>
                        <Star size={16} fill="#F2B705" color="#F2B705" />
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                          {place.rating}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {place.type} · {place.price}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'text.secondary', mb: 1.5 }}>
                      <MapPin size={16} />
                      <Typography variant="body2">
                        {place.location} · {place.distance}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {place.tags.slice(0, 2).map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </Box>

        {/* Routes section */}
        <Box className="soft-panel" sx={{ borderRadius: '32px', p: { xs: 3, md: 4 }, mb: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3} sx={{ mb: 3 }}>
            <Box>
              <Typography variant="h2" color="primary">
                Rutas sugeridas para hoy
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {isGuest
                  ? 'Las rutas estan disponibles solo con cuenta completa.'
                  : 'Opciones con tiempos, presupuesto y paradas claras.'}
              </Typography>
            </Box>
            {isGuest ? (
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<LockKeyhole size={20} />}
                onClick={logout}
              >
                Crear cuenta para desbloquear
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                endIcon={<Navigation size={20} />}
                href="/routes"
              >
                Ver menu de rutas
              </Button>
            )}
          </Stack>

          {isGuest ? (
            <Card sx={{ p: 3, bgcolor: 'rgba(233,95,42,0.08)', borderColor: 'rgba(233,95,42,0.28)' }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <LockKeyhole size={28} color="#E95F2A" />
                <Box>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    Funcion bloqueada para visitante
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Crea una cuenta para generar rutas, agregar paradas y abrir recorridos en el mapa.
                  </Typography>
                </Box>
              </Stack>
            </Card>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 2,
              }}
            >
              {routePlans.map((route) => (
                <Card key={route.id} className="interactive-card" sx={{ p: 2.5 }}>
                  <Box sx={{ width: 54, height: 8, borderRadius: 999, bgcolor: route.color, mb: 2 }} />
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {route.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {route.duration} · {route.budget} · {route.accessibility}
                  </Typography>
                  <Stack spacing={1}>
                    {route.stops.slice(0, 3).map((stop) => (
                      <Chip key={stop} label={stop} variant="outlined" />
                    ))}
                  </Stack>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Container>

      {/* ─── Detail modal ─── */}
      <AnimatePresence>
        {selectedPlace && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={() => setSelectedPlace(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(10,22,18,0.72)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                zIndex: 1200,
              }}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.94, y: 32 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 360, damping: 32 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1201,
                overflowY: 'auto',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: '24px 16px 48px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 700,
                  bgcolor: 'background.default',
                  borderRadius: '32px',
                  overflow: 'hidden',
                  boxShadow: '0 40px 100px rgba(10,22,18,0.38)',
                }}
              >
                {/* Image */}
                <Box sx={{ position: 'relative', height: { xs: 240, md: 320 }, overflow: 'hidden' }}>
                  <motion.img
                    src={selectedPlace.img}
                    alt={selectedPlace.name}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(10,22,18,0.6) 0%, transparent 55%)',
                    }}
                  />
                  {/* Close */}
                  <IconButton
                    onClick={() => setSelectedPlace(null)}
                    aria-label="cerrar"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(8px)',
                      width: 44,
                      height: 44,
                      '&:hover': { bgcolor: 'white' },
                    }}
                  >
                    <X size={22} />
                  </IconButton>
                  {/* Category + rating overlay */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}
                  >
                    <Chip label={selectedPlace.category} color="secondary" />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.6,
                        bgcolor: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '999px',
                        px: 1.4,
                        py: 0.6,
                      }}
                    >
                      <Star size={16} fill="#F2B705" color="#F2B705" />
                      <Typography variant="body2" sx={{ fontWeight: 900 }}>
                        {selectedPlace.rating}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                        ({selectedPlace.reviews})
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Content */}
                <Box sx={{ p: { xs: 3, md: 4 } }}>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, mb: 0.5 }}>
                      {selectedPlace.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                      {selectedPlace.type} en {selectedPlace.location}
                    </Typography>

                    {/* Tags */}
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 3 }}>
                      {selectedPlace.tags.map((tag) => (
                        <Chip key={tag} label={tag} color="primary" variant="outlined" />
                      ))}
                    </Stack>

                    {/* Info card */}
                    <Card sx={{ p: { xs: 2.5, md: 3 }, mb: 3, borderRadius: '22px' }}>
                      <Typography variant="h3" sx={{ mb: 1.5 }}>
                        Acerca de este lugar
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {selectedPlace.desc}
                      </Typography>
                      <Stack spacing={0.8}>
                        <Typography variant="body1">
                          <strong>Horario:</strong> {selectedPlace.hours}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Ubicacion:</strong> {selectedPlace.location} · {selectedPlace.distance}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Precio:</strong> {selectedPlace.price}
                        </Typography>
                      </Stack>
                    </Card>

                    {/* Guest restriction */}
                    {isGuest && (
                      <Box
                        sx={{
                          p: 2.5,
                          mb: 3,
                          borderRadius: '20px',
                          bgcolor: 'rgba(233,95,42,0.08)',
                          border: '1px solid rgba(233,95,42,0.28)',
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <LockKeyhole size={22} color="#E95F2A" style={{ flexShrink: 0 }} />
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 800, mb: 0.3 }}>
                              Acciones limitadas
                            </Typography>
                            <Typography variant="body2">
                              Como visitante no puedes usar como llegar, calificar ni agregar a una ruta.
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    )}

                    {/* Action buttons */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
                        gap: 1.5,
                        mb: 3,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Navigation size={18} />}
                        disabled={isGuest}
                        sx={{ borderRadius: '16px', flexDirection: 'column', gap: 0.3, py: 1.8, fontSize: '0.9rem' }}
                      >
                        Como llegar
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Phone size={18} />}
                        sx={{ borderRadius: '16px', flexDirection: 'column', gap: 0.3, py: 1.8, fontSize: '0.9rem' }}
                      >
                        Llamar
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CalendarPlus size={18} />}
                        disabled={isGuest}
                        sx={{ borderRadius: '16px', flexDirection: 'column', gap: 0.3, py: 1.8, fontSize: '0.9rem' }}
                      >
                        A mi ruta
                      </Button>
                      <Button
                        variant={isGuest ? 'outlined' : 'contained'}
                        color="primary"
                        startIcon={<Star size={18} />}
                        disabled={isGuest}
                        onClick={() => setReviewOpen((v) => !v)}
                        sx={{ borderRadius: '16px', flexDirection: 'column', gap: 0.3, py: 1.8, fontSize: '0.9rem' }}
                      >
                        {isGuest ? 'Resenas' : 'Resenar'}
                      </Button>
                    </Box>

                    {/* Review form */}
                    <AnimatePresence>
                      {reviewOpen && !isGuest && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <Card sx={{ p: 2.5, mb: 3, borderRadius: '22px', bgcolor: 'rgba(18,49,43,0.04)' }}>
                            <Typography variant="h3" sx={{ mb: 2 }}>
                              Deja tu resena
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                Calificacion:
                              </Typography>
                              {[1, 2, 3, 4, 5].map((s) => (
                                <IconButton
                                  key={s}
                                  size="small"
                                  onClick={() => setReviewRating(s)}
                                  sx={{ p: 0.3 }}
                                >
                                  <Star
                                    size={26}
                                    fill={s <= reviewRating ? '#F2B705' : 'transparent'}
                                    color={s <= reviewRating ? '#F2B705' : '#D4C5A9'}
                                  />
                                </IconButton>
                              ))}
                            </Stack>
                            <TextField
                              multiline
                              rows={3}
                              fullWidth
                              placeholder="Escribe tu experiencia..."
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              sx={{ mb: 2 }}
                            />
                            <Stack direction="row" spacing={1.5}>
                              <Button
                                variant="outlined"
                                onClick={() => setReviewOpen(false)}
                                sx={{ borderRadius: '14px' }}
                              >
                                Cancelar
                              </Button>
                              <Button
                                variant="contained"
                                color="secondary"
                                endIcon={<Send size={16} />}
                                onClick={submitReview}
                                disabled={!reviewText.trim()}
                                sx={{ borderRadius: '14px' }}
                              >
                                Publicar resena
                              </Button>
                            </Stack>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Review submitted confirmation */}
                    <AnimatePresence>
                      {reviewSubmitted && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.22 }}
                        >
                          <Chip
                            label="Resena publicada. Gracias por tu aporte!"
                            color="success"
                            sx={{ width: '100%', borderRadius: '14px', py: 2.2, fontSize: '1rem', mb: 2 }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Reviews */}
                    {placeReviews.length > 0 && (
                      <Box>
                        <Typography variant="h3" sx={{ mb: 2 }}>
                          Resenas ({placeReviews.length})
                        </Typography>
                        <Stack spacing={1.5}>
                          {placeReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Home;
