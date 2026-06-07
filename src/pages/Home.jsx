import { useState } from 'react';
import {
  Avatar, Box, Button, Card, CardContent, CardMedia, Chip,
  Container, IconButton, Stack, TextField, Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookmarkPlus, CheckCircle, Heart, LockKeyhole,
  MapPin, MapPinned, Navigation, Phone, Send, Star, X,
} from 'lucide-react';
import { businessCategories, businesses, businessReviews } from '../data/durango';
import { useAuth } from '../context/useAuth';
import { useSavedPlaces } from '../hooks/useSavedPlaces';
import IntroModal from '../components/IntroModal';

const StarRow = ({ rating, size = 18 }) => (
  <Stack direction="row" alignItems="center" spacing={0.5}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={size} fill={s <= Math.round(rating) ? '#F2B705' : 'transparent'} color={s <= Math.round(rating) ? '#F2B705' : '#D4C5A9'} />
    ))}
  </Stack>
);

const ReviewCard = ({ review }) => (
  <Box sx={{ p: 2, borderRadius: '18px', bgcolor: 'rgba(18,49,43,0.04)', border: '1px solid', borderColor: 'divider' }}>
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
      <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.95rem', fontWeight: 800 }}>{review.avatar}</Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 800 }}>{review.user}</Typography>
        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{review.date}</Typography>
      </Box>
      <StarRow rating={review.rating} size={13} />
    </Stack>
    <Typography variant="body2" sx={{ lineHeight: 1.65 }}>{review.comment}</Typography>
  </Box>
);

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isGuest = user?.role === 'guest';
  const { savedPlaces, addPlace } = useSavedPlaces();

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [favorites, setFavorites] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [localReviews, setLocalReviews] = useState({});
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [activeAction, setActiveAction] = useState(null); // 'phone' | 'review' | null

  const visiblePlaces = selectedCategory === 'Todos'
    ? businesses
    : businesses.filter((p) => p.category === selectedCategory);

  const toggleFavorite = (placeId) => {
    setFavorites((curr) => curr.includes(placeId) ? curr.filter((id) => id !== placeId) : [...curr, placeId]);
  };

  const openPlace = (place) => {
    setSelectedPlace(place);
    setReviewSubmitted(false);
    setReviewText('');
    setReviewRating(5);
    setSavedFeedback(false);
    setActiveAction(null);
  };

  const submitReview = () => {
    if (!reviewText.trim()) return;
    const newReview = {
      id: selectedPlace.id * 1000 + (localReviews[selectedPlace.id]?.length || 0),
      user: user?.username || 'Tu',
      avatar: (user?.username || 'T').charAt(0).toUpperCase(),
      rating: reviewRating,
      comment: reviewText.trim(),
      date: 'Ahora',
    };
    setLocalReviews((prev) => ({ ...prev, [selectedPlace.id]: [...(prev[selectedPlace.id] || []), newReview] }));
    setReviewSubmitted(true);
    setActiveAction(null);
    setReviewText('');
  };

  const toggleAction = (action) => setActiveAction((curr) => (curr === action ? null : action));

  const handleAddToRoute = () => {
    if (!selectedPlace || isGuest) return;
    addPlace(selectedPlace);
    setSavedFeedback(true);
  };

  const handleHowToGet = () => {
    if (!selectedPlace) return;
    navigate('/map', { state: { placeId: selectedPlace.id } });
  };

  const placeReviews = selectedPlace
    ? [...(businessReviews[selectedPlace.id] || []), ...(localReviews[selectedPlace.id] || [])]
    : [];

  const isAlreadySaved = selectedPlace ? savedPlaces.some((p) => p.id === selectedPlace.id) : false;

  return (
    <Box sx={{ pt: { xs: 11, md: 13 }, pb: 4 }}>
      <IntroModal
        pageKey="discover"
        icon={<MapPinned size={42} />}
        title="Bienvenido a Descubrir"
        description="Explora negocios, restaurantes y experiencias autenticas de Durango. Filtra por categoria y toca cualquier tarjeta para ver detalles, llamar o guardar lugares en tus rutas."
        cta="Explorar Durango"
      />

      <Container>
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h1" color="primary" sx={{ maxWidth: 860, mb: 0 }}>
              Descubre Durango como si ya lo conocieras.
            </Typography>
          </Box>
        </motion.div>

        {/* Category filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.45 }}>
          <Stack direction="row" spacing={1.2} useFlexGap flexWrap="wrap" sx={{ mb: 4 }}>
            {businessCategories.map((cat) => (
              <Chip key={cat} label={cat} onClick={() => setSelectedCategory(cat)} color={selectedCategory === cat ? 'primary' : 'default'} variant={selectedCategory === cat ? 'filled' : 'outlined'} sx={{ px: 1, fontSize: '1rem' }} />
            ))}
          </Stack>
        </motion.div>

        {/* Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          {visiblePlaces.map((place, index) => {
            const isFav = favorites.includes(place.id);
            return (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Card className="interactive-card" onClick={() => openPlace(place)} sx={{ height: '100%', overflow: 'hidden', cursor: 'pointer' }}>
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia component="img" height="230" image={place.img} alt={place.name} sx={{ objectFit: 'cover', transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.05)' } }} />
                    <IconButton aria-label="guardar favorito" onClick={(e) => { e.stopPropagation(); toggleFavorite(place.id); }} sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.92)', '&:hover': { bgcolor: 'white' } }}>
                      <Heart size={22} fill={isFav ? '#E95F2A' : 'transparent'} color={isFav ? '#E95F2A' : '#12312B'} />
                    </IconButton>
                    <Chip label={place.category} color="secondary" sx={{ position: 'absolute', left: 12, bottom: 12 }} />
                  </Box>
                  <CardContent sx={{ p: 2.4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} sx={{ mb: 0.8 }}>
                      <Typography variant="h3">{place.name}</Typography>
                      <Stack direction="row" alignItems="center" spacing={0.4}>
                        <Star size={16} fill="#F2B705" color="#F2B705" />
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{place.rating}</Typography>
                      </Stack>
                    </Stack>
                    <Typography variant="body2" sx={{ mb: 1 }}>{place.type} · {place.price}</Typography>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'text.secondary', mb: 1.5 }}>
                      <MapPin size={16} />
                      <Typography variant="body2">{place.location} · {place.distance}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {place.tags.slice(0, 2).map((tag) => <Chip key={tag} label={tag} size="small" variant="outlined" />)}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </Box>
      </Container>

      {/* ─── Detail modal ─── */}
      <AnimatePresence>
        {selectedPlace && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.26 }} onClick={() => setSelectedPlace(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,18,0.72)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', zIndex: 1200 }} />
            <motion.div key="panel" initial={{ opacity: 0, scale: 0.94, y: 32 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} transition={{ type: 'spring', stiffness: 360, damping: 32 }} onClick={(e) => e.stopPropagation()} style={{ position: 'fixed', inset: 0, zIndex: 1201, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px 48px' }}>
              <Box sx={{ width: '100%', maxWidth: 700, bgcolor: 'background.default', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(10,22,18,0.38)' }}>
                {/* Image */}
                <Box sx={{ position: 'relative', height: { xs: 240, md: 320 }, overflow: 'hidden' }}>
                  <motion.img src={selectedPlace.img} alt={selectedPlace.name} initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,18,0.6) 0%, transparent 55%)' }} />
                  <IconButton onClick={() => setSelectedPlace(null)} aria-label="cerrar" sx={{ position: 'absolute', top: 16, left: 16, bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', width: 44, height: 44, '&:hover': { bgcolor: 'white' } }}>
                    <X size={22} />
                  </IconButton>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                    <Chip label={selectedPlace.category} color="secondary" />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, bgcolor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: '999px', px: 1.4, py: 0.6 }}>
                      <Star size={16} fill="#F2B705" color="#F2B705" />
                      <Typography variant="body2" sx={{ fontWeight: 900 }}>{selectedPlace.rating}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>({selectedPlace.reviews})</Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Content */}
                <Box sx={{ p: { xs: 3, md: 4 } }}>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
                    <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, mb: 0.5 }}>{selectedPlace.name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>{selectedPlace.type} en {selectedPlace.location}</Typography>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 3 }}>
                      {selectedPlace.tags.map((tag) => <Chip key={tag} label={tag} color="primary" variant="outlined" />)}
                    </Stack>

                    <Card sx={{ p: { xs: 2.5, md: 3 }, mb: 3, borderRadius: '22px' }}>
                      <Typography variant="h3" sx={{ mb: 1.5 }}>Acerca de este lugar</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{selectedPlace.desc}</Typography>
                      <Stack spacing={0.8}>
                        <Typography variant="body1"><strong>Horario:</strong> {selectedPlace.hours}</Typography>
                        <Typography variant="body1"><strong>Ubicacion:</strong> {selectedPlace.location} · {selectedPlace.distance}</Typography>
                        <Typography variant="body1"><strong>Precio:</strong> {selectedPlace.price}</Typography>
                      </Stack>
                    </Card>

                    {isGuest && (
                      <Box sx={{ p: 2.5, mb: 3, borderRadius: '20px', bgcolor: 'rgba(233,95,42,0.08)', border: '1px solid rgba(233,95,42,0.28)' }}>
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <LockKeyhole size={22} color="#E95F2A" style={{ flexShrink: 0 }} />
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 800, mb: 0.3 }}>Acciones limitadas</Typography>
                            <Typography variant="body2">Como visitante no puedes guardar lugares, calificar ni agregar a rutas.</Typography>
                          </Box>
                        </Stack>
                      </Box>
                    )}

                    {/* ─── Action buttons (minimalistas) ─── */}
                    <Stack direction="row" spacing={1.2} sx={{ mb: 2.5, flexWrap: 'wrap', gap: 1.2 }}>
                      {/* Cómo llegar */}
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Navigation size={17} />}
                        onClick={handleHowToGet}
                        sx={{ borderRadius: '999px', py: 1.2, px: 2.4, fontSize: '0.9rem', fontWeight: 700, boxShadow: '0 6px 18px rgba(233,95,42,0.28)', flexShrink: 0 }}
                      >
                        Como llegar
                      </Button>

                      {/* Llamar */}
                      <Button
                        variant={activeAction === 'phone' ? 'contained' : 'outlined'}
                        color={activeAction === 'phone' ? 'success' : 'primary'}
                        startIcon={<Phone size={17} />}
                        onClick={() => toggleAction('phone')}
                        sx={{ borderRadius: '999px', py: 1.2, px: 2.4, fontSize: '0.9rem', fontWeight: 700, flexShrink: 0 }}
                      >
                        Llamar
                      </Button>

                      {/* Añadir a ruta */}
                      <Button
                        variant={isAlreadySaved ? 'contained' : 'outlined'}
                        color={isAlreadySaved ? 'success' : 'primary'}
                        startIcon={isAlreadySaved ? <CheckCircle size={17} /> : <BookmarkPlus size={17} />}
                        disabled={isGuest}
                        onClick={handleAddToRoute}
                        sx={{ borderRadius: '999px', py: 1.2, px: 2.4, fontSize: '0.9rem', fontWeight: 700, flexShrink: 0 }}
                      >
                        {isAlreadySaved ? 'Guardado' : 'A mi ruta'}
                      </Button>

                      {/* Reseña */}
                      {!isGuest && (
                        <Button
                          variant={activeAction === 'review' ? 'contained' : 'outlined'}
                          color="primary"
                          startIcon={<Star size={17} />}
                          onClick={() => toggleAction('review')}
                          sx={{ borderRadius: '999px', py: 1.2, px: 2.4, fontSize: '0.9rem', fontWeight: 700, flexShrink: 0 }}
                        >
                          Resenar
                        </Button>
                      )}
                    </Stack>

                    {/* ─── Expanded panels (solo uno activo a la vez) ─── */}
                    <AnimatePresence mode="wait">
                      {activeAction === 'phone' && (
                        <motion.div key="phone-panel" initial={{ opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -8 }} transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden' }}>
                          <Box sx={{ mb: 2.5, p: 2.5, borderRadius: '22px', bgcolor: 'rgba(14,124,102,0.08)', border: '1.5px solid rgba(14,124,102,0.28)' }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5 }}>Telefono del negocio</Typography>
                                <Typography variant="h3" sx={{ color: 'success.main', fontSize: '1.4rem' }}>
                                  {selectedPlace.phone || 'No disponible'}
                                </Typography>
                              </Box>
                              <Stack direction="row" spacing={1}>
                                {selectedPlace.phone && (
                                  <Button component="a" href={`tel:${selectedPlace.phone}`} variant="contained" color="success" startIcon={<Phone size={16} />} sx={{ borderRadius: '14px' }}>
                                    Marcar
                                  </Button>
                                )}
                                <IconButton onClick={() => setActiveAction(null)} size="small" sx={{ bgcolor: 'rgba(14,124,102,0.12)', '&:hover': { bgcolor: 'rgba(14,124,102,0.2)' } }}>
                                  <X size={16} />
                                </IconButton>
                              </Stack>
                            </Stack>
                          </Box>
                        </motion.div>
                      )}

                      {activeAction === 'review' && !isGuest && (
                        <motion.div key="review-panel" initial={{ opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -8 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden' }}>
                          <Card sx={{ p: 2.5, mb: 2.5, borderRadius: '22px', bgcolor: 'rgba(18,49,43,0.04)', border: '1px solid', borderColor: 'divider' }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                              <Typography variant="h3">Deja tu resena</Typography>
                              <IconButton onClick={() => setActiveAction(null)} size="small"><X size={16} /></IconButton>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, mr: 0.5 }}>Calificacion:</Typography>
                              {[1, 2, 3, 4, 5].map((s) => (
                                <IconButton key={s} size="small" onClick={() => setReviewRating(s)} sx={{ p: 0.3 }}>
                                  <Star size={24} fill={s <= reviewRating ? '#F2B705' : 'transparent'} color={s <= reviewRating ? '#F2B705' : '#D4C5A9'} />
                                </IconButton>
                              ))}
                            </Stack>
                            <TextField multiline rows={3} fullWidth placeholder="Escribe tu experiencia..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} sx={{ mb: 2 }} />
                            <Button variant="contained" color="secondary" endIcon={<Send size={16} />} onClick={submitReview} disabled={!reviewText.trim()} sx={{ borderRadius: '14px' }}>
                              Publicar resena
                            </Button>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Saved feedback */}
                    <AnimatePresence>
                      {savedFeedback && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
                          <Chip icon={<CheckCircle size={16} />} label={`${selectedPlace.name} guardado en tus rutas`} color="success" sx={{ width: '100%', borderRadius: '14px', py: 2.2, fontSize: '0.96rem', mb: 2 }} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Review submitted */}
                    <AnimatePresence>
                      {reviewSubmitted && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
                          <Chip label="Resena publicada. Gracias!" color="success" sx={{ width: '100%', borderRadius: '14px', py: 2.2, fontSize: '1rem', mb: 2 }} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {placeReviews.length > 0 && (
                      <Box>
                        <Typography variant="h3" sx={{ mb: 2 }}>Resenas ({placeReviews.length})</Typography>
                        <Stack spacing={1.5}>
                          {placeReviews.map((review) => <ReviewCard key={review.id} review={review} />)}
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
