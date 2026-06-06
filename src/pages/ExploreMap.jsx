import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Accessibility,
  ArrowLeft,
  Clock,
  LocateFixed,
  LockKeyhole,
  Navigation,
  Route as RouteIcon,
  Search,
  Star,
  Wallet,
  X,
} from 'lucide-react';
import { businessCategories, businesses, routePlans, routeDescriptions } from '../data/durango';
import { useAuth } from '../context/useAuth';

const durangoCenter = [24.0277, -104.6531];

const ExploreMap = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isGuest = user?.role === 'guest';

  // Route from navigation state (from RoutesPage)
  const navRouteId = location.state?.routeId || null;
  const [activeRouteId, setActiveRouteId] = useState(navRouteId);
  const activeRoute = activeRouteId ? routePlans.find((r) => r.id === activeRouteId) : null;
  const routeStops = activeRoute
    ? activeRoute.stops.map((name) => businesses.find((b) => b.name === name)).filter(Boolean)
    : [];

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedPlace, setSelectedPlace] = useState(navRouteId ? null : businesses[0]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const inputRef = useRef(null);

  const visiblePlaces = businesses.filter((place) => {
    const matchesCategory = selectedCategory === 'Todos' || place.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 120);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setMobileDetailOpen(true);
    setActiveRouteId(null);
  };

  const clearRoute = () => {
    setActiveRouteId(null);
    setSelectedPlace(businesses[0]);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 'calc(100vh - 88px)', md: 'calc(100vh - 72px)' },
        mt: { xs: 1, md: 2 },
        overflow: 'hidden',
        bgcolor: '#10241F',
      }}
    >
      {/* Map */}
      <MapContainer
        center={activeRoute ? routeStops[0]?.pos || durangoCenter : durangoCenter}
        zoom={activeRoute ? 13 : 13}
        scrollWheelZoom
        zoomControl={false}
        style={{ height: '100%', width: '100%', zIndex: 0, filter: 'saturate(0.88) contrast(1.04)' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Route polyline */}
        {activeRoute && routeStops.length >= 2 && (
          <Polyline
            positions={routeStops.map((s) => s.pos)}
            pathOptions={{
              color: activeRoute.color,
              weight: 5,
              opacity: 0.9,
              dashArray: '12, 6',
            }}
          />
        )}

        {/* Markers */}
        {visiblePlaces.map((place) => {
          const isRouteStop = activeRoute
            ? activeRoute.stops.includes(place.name)
            : false;
          return (
            <Marker
              key={place.id}
              position={place.pos}
              eventHandlers={{ click: () => handleSelectPlace(place) }}
            >
              <Popup>
                <Box sx={{ minWidth: 200 }}>
                  {isRouteStop && activeRoute && (
                    <Chip
                      label={`Parada ${activeRoute.stops.indexOf(place.name) + 1}`}
                      size="small"
                      sx={{ mb: 0.5, bgcolor: activeRoute.color, color: 'white' }}
                    />
                  )}
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>
                    {place.name}
                  </Typography>
                  <Typography variant="body2">{place.type}</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                    <Star size={14} fill="#F2B705" color="#F2B705" />
                    <Typography variant="body2">
                      {place.rating} · {place.distance}
                    </Typography>
                  </Stack>
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Gradient vignette */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(16,36,31,0.2) 0%, transparent 18%, transparent 72%, rgba(16,36,31,0.3) 100%)',
        }}
      />

      {/* ─── Top bar: search + filters ─── */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 14, md: 20 },
          left: { xs: 12, md: 20 },
          right: { xs: 12, md: 20 },
          zIndex: 500,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.2}>
          {/* Back to routes button if coming from routes */}
          {activeRoute && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <IconButton
                onClick={clearRoute}
                sx={{
                  width: 46,
                  height: 46,
                  bgcolor: 'rgba(255,253,248,0.92)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid rgba(231,221,207,0.8)',
                  '&:hover': { bgcolor: 'white' },
                }}
                aria-label="volver"
              >
                <ArrowLeft size={20} color="#12312B" />
              </IconButton>
            </motion.div>
          )}

          {/* Search */}
          <AnimatePresence mode="wait" initial={false}>
            {searchOpen ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                style={{ flex: 1 }}
              >
                <Box
                  className="glass-effect"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '999px',
                    px: 2,
                    py: 1,
                    gap: 1,
                    boxShadow: '0 12px 36px rgba(16,36,31,0.18)',
                  }}
                >
                  <Search size={20} color="#5B665F" />
                  <input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) closeSearch(); }}
                    placeholder="Busca un lugar, tipo o etiqueta..."
                    style={{
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      flex: 1,
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#17211F',
                      fontFamily: 'Outfit, sans-serif',
                      minWidth: 0,
                    }}
                  />
                  <IconButton
                    onClick={closeSearch}
                    size="small"
                    sx={{ p: 0.5 }}
                    aria-label="cerrar busqueda"
                  >
                    <X size={18} />
                  </IconButton>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.16 }}
              >
                <IconButton
                  onClick={openSearch}
                  aria-label="abrir busqueda"
                  sx={{
                    width: 46,
                    height: 46,
                    bgcolor: 'rgba(255,253,248,0.92)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(231,221,207,0.8)',
                    boxShadow: '0 8px 22px rgba(16,36,31,0.14)',
                    '&:hover': { bgcolor: 'white', transform: 'scale(1.06)' },
                    transition: 'all 0.18s ease',
                  }}
                >
                  <Search size={21} color="#12312B" />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category chips */}
          <AnimatePresence>
            {!searchOpen && (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.22 }}
                style={{ flex: 1, overflow: 'hidden' }}
              >
                <Stack
                  direction="row"
                  spacing={0.8}
                  sx={{
                    overflowX: 'auto',
                    pb: 0.5,
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                  }}
                >
                  {businessCategories.map((cat) => (
                    <Chip
                      key={cat}
                      label={cat}
                      onClick={() => setSelectedCategory(cat)}
                      color={selectedCategory === cat ? 'primary' : 'default'}
                      variant={selectedCategory === cat ? 'filled' : 'outlined'}
                      sx={{
                        flexShrink: 0,
                        bgcolor: selectedCategory === cat ? undefined : 'rgba(255,253,248,0.88)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 4px 14px rgba(16,36,31,0.1)',
                      }}
                    />
                  ))}
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>
        </Stack>
      </Box>

      {/* ─── Route banner (when route is active) ─── */}
      <AnimatePresence>
        {activeRoute && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            style={{
              position: 'absolute',
              top: 76,
              left: 20,
              right: 20,
              zIndex: 501,
            }}
          >
            <Box
              className="glass-effect"
              sx={{
                borderRadius: '20px',
                px: 2,
                py: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                boxShadow: `0 8px 28px ${activeRoute.color}30`,
                borderColor: `${activeRoute.color}50`,
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  bgcolor: activeRoute.color,
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <RouteIcon size={16} color="white" />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeRoute.title}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                  {routeStops.length} paradas · {activeRoute.duration}
                </Typography>
              </Box>
              <IconButton size="small" onClick={clearRoute} sx={{ p: 0.5 }}>
                <X size={16} />
              </IconButton>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Desktop: vertical place list (left) ─── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          left: 20,
          bottom: 24,
          top: activeRoute ? 148 : 80,
          width: 370,
          zIndex: 500,
          pt: 1,
          transition: 'top 0.3s ease',
        }}
      >
        <Stack
          spacing={1.2}
          sx={{
            maxHeight: '100%',
            overflowY: 'auto',
            pr: 0.5,
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(18,49,43,0.22)', borderRadius: 2 },
          }}
        >
          {(activeRoute ? routeStops : visiblePlaces).map((place) => {
            const isActive = selectedPlace?.id === place.id;
            const stopIndex = activeRoute ? activeRoute.stops.indexOf(place.name) : -1;
            return (
              <motion.div key={place.id} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                <Card
                  onClick={() => handleSelectPlace(place)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.4,
                    p: 1.2,
                    cursor: 'pointer',
                    borderRadius: '22px',
                    border: '2px solid',
                    borderColor: isActive ? (activeRoute ? activeRoute.color : 'secondary.main') : 'rgba(231,221,207,0.65)',
                    bgcolor: isActive ? 'rgba(255,253,248,0.98)' : 'rgba(255,253,248,0.88)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: isActive ? '0 16px 40px rgba(16,36,31,0.18)' : '0 8px 22px rgba(16,36,31,0.1)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                >
                  {stopIndex >= 0 && (
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '8px',
                        bgcolor: activeRoute.color,
                        color: 'white',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        flexShrink: 0,
                      }}
                    >
                      {stopIndex + 1}
                    </Box>
                  )}
                  <CardMedia
                    component="img"
                    image={place.img}
                    alt={place.name}
                    sx={{ width: stopIndex >= 0 ? 68 : 76, height: stopIndex >= 0 ? 68 : 76, borderRadius: '16px', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                      <Typography variant="body1" sx={{ fontWeight: 900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.96rem' }}>
                        {place.name}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.3} sx={{ flexShrink: 0 }}>
                        <Star size={13} fill="#F2B705" color="#F2B705" />
                        <Typography variant="body2" sx={{ fontWeight: 900, fontSize: '0.86rem' }}>
                          {place.rating}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.86rem', mb: 0.5 }}>
                      {place.type}
                    </Typography>
                    <Stack direction="row" spacing={0.7} alignItems="center">
                      <Chip label={place.category} size="small" color={isActive ? 'secondary' : 'default'} sx={{ height: 22, fontSize: '0.76rem' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {place.distance}
                      </Typography>
                    </Stack>
                  </Box>
                </Card>
              </motion.div>
            );
          })}
        </Stack>
      </Box>

      {/* ─── Mobile: horizontal place strip (bottom) ─── */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 500,
          gap: 1.4,
          px: 2,
          pb: 2,
          pt: 1,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {(activeRoute ? routeStops : visiblePlaces).map((place, index) => {
          const isActive = selectedPlace?.id === place.id;
          const stopIndex = activeRoute ? index : -1;
          return (
            <Box
              key={place.id}
              onClick={() => handleSelectPlace(place)}
              sx={{
                flexShrink: 0,
                width: 200,
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '2px solid',
                borderColor: isActive ? (activeRoute ? activeRoute.color : 'secondary.main') : 'rgba(231,221,207,0.7)',
                bgcolor: 'rgba(255,253,248,0.94)',
                backdropFilter: 'blur(14px)',
                boxShadow: isActive ? '0 12px 30px rgba(16,36,31,0.22)' : '0 6px 18px rgba(16,36,31,0.12)',
                transition: 'all 0.2s ease',
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box component="img" src={place.img} alt={place.name} sx={{ width: '100%', height: 92, objectFit: 'cover', display: 'block' }} />
                {stopIndex >= 0 && (
                  <Box sx={{ position: 'absolute', top: 8, left: 8, width: 26, height: 26, borderRadius: '8px', bgcolor: activeRoute.color, color: 'white', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '0.84rem' }}>
                    {stopIndex + 1}
                  </Box>
                )}
              </Box>
              <Box sx={{ p: 1.3 }}>
                <Typography variant="body2" sx={{ fontWeight: 900, mb: 0.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.88rem' }}>
                  {place.name}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.4}>
                  <Star size={12} fill="#F2B705" color="#F2B705" />
                  <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.82rem' }}>{place.rating}</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>· {place.distance}</Typography>
                </Stack>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* ─── Desktop: selected place panel OR route detail (right) ─── */}
      <AnimatePresence mode="wait">
        {activeRoute && !selectedPlace ? (
          /* Route detail panel */
          <motion.div
            key="route-panel"
            initial={{ opacity: 0, x: 24, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{ position: 'absolute', right: 20, top: 80, width: 400, zIndex: 520 }}
          >
            <Card
              className="soft-panel"
              sx={{
                borderRadius: '28px',
                overflow: 'hidden',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                maxHeight: 'calc(100vh - 150px)',
              }}
            >
              <Box sx={{ height: 8, bgcolor: activeRoute.color }} />
              <CardContent sx={{ p: 2.5, overflowY: 'auto', flex: 1 }}>
                <Chip label="Ruta en el mapa" color="primary" size="small" sx={{ mb: 1.5 }} />
                <Typography variant="h3" sx={{ mb: 0.5, fontSize: '1.2rem' }}>
                  {activeRoute.title}
                </Typography>
                <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.6}>
                    <Clock size={14} color="#5B665F" />
                    <Typography variant="body2">{activeRoute.duration}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.6}>
                    <Wallet size={14} color="#5B665F" />
                    <Typography variant="body2">{activeRoute.budget}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.6}>
                    <Accessibility size={14} color="#5B665F" />
                    <Typography variant="body2">{activeRoute.accessibility}</Typography>
                  </Stack>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.65 }}>
                  {routeDescriptions[activeRouteId]}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, mb: 1.5 }}>
                  Paradas de la ruta:
                </Typography>
                <Stack spacing={1.5}>
                  {routeStops.map((stop, index) => (
                    <Stack
                      key={stop.id}
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                      onClick={() => handleSelectPlace(stop)}
                      sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                    >
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: '9px',
                          bgcolor: activeRoute.color,
                          color: 'white',
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                          {stop.name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
                          {stop.type} · {stop.hours}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ArrowLeft size={17} />}
                  onClick={() => navigate('/routes')}
                  sx={{ mt: 2.5, borderRadius: '14px' }}
                >
                  Volver a rutas
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : selectedPlace ? (
          /* Place detail panel */
          <motion.div
            key={`detail-${selectedPlace.id}`}
            initial={{ opacity: 0, x: 24, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{ position: 'absolute', right: 20, top: 80, width: 400, zIndex: 520 }}
          >
            <Card
              className="soft-panel"
              sx={{
                borderRadius: '28px',
                overflow: 'hidden',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                maxHeight: 'calc(100vh - 160px)',
              }}
            >
              <Box sx={{ position: 'relative', flexShrink: 0 }}>
                <CardMedia component="img" image={selectedPlace.img} alt={selectedPlace.name} sx={{ height: 168, objectFit: 'cover' }} />
                <Chip label={selectedPlace.category} color="secondary" sx={{ position: 'absolute', left: 14, bottom: 14 }} />
                <IconButton
                  onClick={() => setSelectedPlace(null)}
                  aria-label="cerrar detalle"
                  sx={{ position: 'absolute', right: 12, top: 12, bgcolor: 'rgba(255,255,255,0.9)', width: 36, height: 36, '&:hover': { bgcolor: 'white' } }}
                >
                  <X size={18} />
                </IconButton>
              </Box>
              <CardContent sx={{ p: 2.5, overflowY: 'auto', flex: 1 }}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} sx={{ mb: 1.2 }}>
                  <Box>
                    <Typography variant="h3" sx={{ mb: 0.4, fontSize: '1.18rem' }}>
                      {selectedPlace.name}
                    </Typography>
                    <Typography variant="body2">{selectedPlace.location} · {selectedPlace.price}</Typography>
                  </Box>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ bgcolor: 'rgba(242,183,5,0.14)', borderRadius: '999px', px: 1.2, py: 0.6, flexShrink: 0 }}>
                    <Star size={15} fill="#F2B705" color="#F2B705" />
                    <Typography variant="body2" sx={{ fontWeight: 900 }}>{selectedPlace.rating}</Typography>
                  </Stack>
                </Stack>
                <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.65, color: 'text.secondary' }}>
                  {selectedPlace.desc}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600 }}>
                  Horario: {selectedPlace.hours}
                </Typography>
                <Stack direction="row" spacing={0.8} useFlexGap flexWrap="wrap" sx={{ mb: 2 }}>
                  {selectedPlace.tags.map((tag) => (
                    <Chip key={tag} label={tag} variant="outlined" size="small" sx={{ height: 26, fontSize: '0.78rem' }} />
                  ))}
                </Stack>
                {isGuest && (
                  <Stack direction="row" spacing={1.2} sx={{ mb: 2, p: 1.6, borderRadius: '16px', bgcolor: 'rgba(233,95,42,0.08)', border: '1px solid rgba(233,95,42,0.22)' }}>
                    <LockKeyhole size={18} color="#E95F2A" style={{ flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.88rem' }}>
                      Crea una cuenta para usar rutas y ubicacion cercana.
                    </Typography>
                  </Stack>
                )}
                <Stack spacing={1}>
                  <Button variant="contained" color="secondary" startIcon={<Navigation size={17} />} disabled={isGuest} fullWidth size="small" sx={{ borderRadius: '14px' }}>
                    Como llegar
                  </Button>
                  <Button variant="outlined" startIcon={<LocateFixed size={17} />} disabled={isGuest} fullWidth size="small" sx={{ borderRadius: '14px' }}>
                    Cerca de mi
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ─── Mobile: bottom sheet for selected place ─── */}
      <AnimatePresence>
        {selectedPlace && mobileDetailOpen && (
          <motion.div
            key={`mobile-${selectedPlace.id}`}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 600 }}
          >
            <Box className="soft-panel" sx={{ display: { xs: 'block', md: 'none' }, borderRadius: '28px 28px 0 0', overflow: 'hidden', maxHeight: '55vh', overflowY: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.4, pb: 0.5 }}>
                <Box sx={{ width: 40, height: 4, borderRadius: 999, bgcolor: 'rgba(18,49,43,0.18)' }} />
              </Box>
              <Stack direction="row" alignItems="flex-start" sx={{ px: 2.5, pt: 1, pb: 0.5 }} justifyContent="space-between">
                <Box sx={{ flex: 1 }}>
                  <Chip label={selectedPlace.category} color="secondary" size="small" sx={{ mb: 0.8 }} />
                  <Typography variant="h3" sx={{ mb: 0.3, fontSize: '1.15rem' }}>{selectedPlace.name}</Typography>
                  <Typography variant="body2">{selectedPlace.location} · {selectedPlace.price}</Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ ml: 1 }}>
                  <Star size={14} fill="#F2B705" color="#F2B705" />
                  <Typography variant="body2" sx={{ fontWeight: 900 }}>{selectedPlace.rating}</Typography>
                  <IconButton onClick={() => setMobileDetailOpen(false)} size="small" sx={{ ml: 0.5, p: 0.5 }} aria-label="cerrar">
                    <X size={18} />
                  </IconButton>
                </Stack>
              </Stack>
              <Box sx={{ px: 2.5, pb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary', lineHeight: 1.6 }}>{selectedPlace.desc}</Typography>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>Horario: {selectedPlace.hours}</Typography>
                {isGuest && (
                  <Stack direction="row" spacing={1} sx={{ mb: 2, p: 1.4, borderRadius: '14px', bgcolor: 'rgba(233,95,42,0.08)' }}>
                    <LockKeyhole size={16} color="#E95F2A" style={{ flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.86rem' }}>Crea una cuenta para acceder a rutas y navegacion.</Typography>
                  </Stack>
                )}
                <Stack direction="row" spacing={1.2}>
                  <Button variant="contained" color="secondary" startIcon={<Navigation size={17} />} disabled={isGuest} fullWidth size="small" sx={{ borderRadius: '14px' }}>Como llegar</Button>
                  <Button variant="outlined" startIcon={<LocateFixed size={17} />} disabled={isGuest} fullWidth size="small" sx={{ borderRadius: '14px' }}>Cerca de mi</Button>
                </Stack>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ExploreMap;
