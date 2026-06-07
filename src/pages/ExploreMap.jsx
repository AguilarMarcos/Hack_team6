import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, LocateFixed, LockKeyhole, Navigation, Search, Star, X } from 'lucide-react';
import { businessCategories, businesses, routePlans } from '../data/durango';
import { useAuth } from '../context/useAuth';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const DURANGO_CENTER = [24.0277, -104.6531];

const destinationIcon = L.divIcon({
  className: 'durango-destination-marker',
  html: '<div class="durango-pin-red"></div>',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const makeRouteIcon = (index, color) => L.divIcon({
  className: 'durango-route-marker',
  html: `<div style="width:32px;height:32px;border-radius:14px;background:${color};color:white;display:grid;place-items:center;font-weight:900;border:3px solid white;box-shadow:0 8px 22px rgba(0,0,0,.24);font-family:Outfit,sans-serif;">${index}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18],
});

const getDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getUserLocation = () => new Promise((resolve) => {
  if (!navigator.geolocation) {
    resolve(DURANGO_CENTER);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => resolve([position.coords.latitude, position.coords.longitude]),
    () => resolve(DURANGO_CENTER),
    { timeout: 5000 }
  );
});

const MapController = ({ points }) => {
  const map = useMap();
  const key = points.map((point) => point.join(',')).join('|');

  useEffect(() => {
    const syncMapSize = () => map.invalidateSize({ animate: false });

    syncMapSize();
    const frame = requestAnimationFrame(syncMapSize);
    const timers = [150, 400, 800].map((delay) => setTimeout(syncMapSize, delay));
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(syncMapSize);

    resizeObserver?.observe(map.getContainer());

    if (points.length > 1) {
      map.fitBounds(points, { padding: [70, 70], maxZoom: 15 });
    } else if (points.length === 1) {
      map.flyTo(points[0], 14, { duration: 0.6 });
    }

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      resizeObserver?.disconnect();
    };
  }, [map, key, points]);

  return null;
};

const ExploreMap = () => {
  const { user } = useAuth();
  const isGuest = user?.role === 'guest';
  const { state } = useLocation();

  const initialRoute = state?.customRoute || routePlans.find((route) => route.id === state?.routeId) || null;
  const initialPlace = businesses.find((business) => String(business.id) === String(state?.placeId)) || null;

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(initialPlace || null);
  const [activeRoute, setActiveRoute] = useState(initialRoute);
  const [userLocation, setUserLocation] = useState(null);
  const [directionsTo, setDirectionsTo] = useState(initialPlace || null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const routeStops = useMemo(() => (
    activeRoute ? activeRoute.stops.map((stop) => businesses.find((business) => business.name === stop)).filter(Boolean) : []
  ), [activeRoute]);

  const visiblePlaces = useMemo(() => businesses.filter((place) => {
    const categoryMatch = selectedCategory === 'Todos' || place.category === selectedCategory;
    const queryMatch = !query || `${place.name} ${place.type} ${place.location} ${place.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase());
    return categoryMatch && queryMatch;
  }), [query, selectedCategory]);

  const focusPoints = useMemo(() => {
    if (directionsTo && userLocation) return [userLocation, directionsTo.pos];
    if (activeRoute && routeStops.length > 0) return routeStops.map((stop) => stop.pos);
    if (selectedPlace) return [selectedPlace.pos];
    if (userLocation) return [userLocation];
    return [DURANGO_CENTER];
  }, [activeRoute, directionsTo, routeStops, selectedPlace, userLocation]);

  useEffect(() => {
    if (!initialPlace || isGuest) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      setLoadingLocation(true);
      getUserLocation().then((location) => {
        if (cancelled) return;
        setUserLocation(location);
        setDirectionsTo(initialPlace);
        setLoadingLocation(false);
      });
    }, 0);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [initialPlace, isGuest]);

  const selectPlace = (place) => {
    setSelectedPlace(place);
    setActiveRoute(null);
    setNearbyPlaces([]);
  };

  const showDirections = async (place = selectedPlace) => {
    if (!place || isGuest) return;
    setLoadingLocation(true);
    const location = await getUserLocation();
    setUserLocation(location);
    setDirectionsTo(place);
    setSelectedPlace(place);
    setActiveRoute(null);
    setNearbyPlaces([]);
    setLoadingLocation(false);
  };

  const showNearby = async () => {
    if (isGuest) return;
    setLoadingLocation(true);
    const location = await getUserLocation();
    const sorted = [...businesses]
      .map((place) => ({ ...place, dist: getDistance(location[0], location[1], place.pos[0], place.pos[1]) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 5);

    setUserLocation(location);
    setNearbyPlaces(sorted);
    setActiveRoute(null);
    setDirectionsTo(null);
    setSelectedPlace(null);
    setLoadingLocation(false);
  };

  const clearMapMode = () => {
    setActiveRoute(null);
    setDirectionsTo(null);
    setNearbyPlaces([]);
    setSelectedPlace(null);
  };

  const destinationDistance = directionsTo && userLocation
    ? getDistance(userLocation[0], userLocation[1], directionsTo.pos[0], directionsTo.pos[1])
    : null;

  return (
    <Box sx={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', bgcolor: '#10241F' }}>
      <MapContainer key="durango-leaflet-map" center={DURANGO_CENTER} zoom={13} scrollWheelZoom zoomControl style={{ width: '100%', height: '100%', zIndex: 0 }}>
        <MapController points={focusPoints} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {activeRoute && routeStops.length > 1 && (
          <Polyline positions={routeStops.map((stop) => stop.pos)} pathOptions={{ color: activeRoute.color || '#E95F2A', weight: 5, opacity: 0.85 }} />
        )}

        {directionsTo && userLocation && (
          <Polyline positions={[userLocation, directionsTo.pos]} pathOptions={{ color: '#E53935', weight: 5, opacity: 0.9, dashArray: '8, 8' }} />
        )}

        {userLocation && (
          <CircleMarker center={userLocation} radius={10} pathOptions={{ color: '#fff', fillColor: '#1976D2', fillOpacity: 1, weight: 3 }}>
            <Popup><Typography variant="body2" sx={{ fontWeight: 800 }}>Tu ubicacion</Typography></Popup>
          </CircleMarker>
        )}

        {visiblePlaces.map((place) => {
          const routeIndex = activeRoute ? activeRoute.stops.indexOf(place.name) : -1;
          const isRouteStop = routeIndex >= 0;
          const isDestination = directionsTo?.id === place.id;
          const icon = isDestination ? destinationIcon : isRouteStop ? makeRouteIcon(routeIndex + 1, activeRoute.color || '#E95F2A') : undefined;
          const markerProps = icon ? { icon } : {};

          return (
            <Marker key={place.id} position={place.pos} {...markerProps} eventHandlers={{ click: () => selectPlace(place) }}>
              <Popup>
                <Box sx={{ minWidth: 180 }}>
                  {isDestination && <Chip label="Destino" color="error" size="small" sx={{ mb: 1 }} />}
                  {isRouteStop && <Chip label={`Parada ${routeIndex + 1}`} color="primary" size="small" sx={{ mb: 1 }} />}
                  <Typography variant="body1" sx={{ fontWeight: 900 }}>{place.name}</Typography>
                  <Typography variant="body2">{place.type}</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{place.rating} estrellas · {place.distance}</Typography>
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <style>{`.durango-pin-red{width:28px;height:28px;background:#E53935;border:4px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 8px 24px rgba(229,57,53,.45)}.durango-pin-red:after{content:"";position:absolute;width:8px;height:8px;background:#fff;border-radius:50%;left:6px;top:6px}`}</style>

      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(16,36,31,.18), transparent 28%, transparent 70%, rgba(16,36,31,.24))' }} />

      <Box sx={{ position: 'absolute', top: 18, left: 16, right: 16, zIndex: 500 }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          {(activeRoute || directionsTo || nearbyPlaces.length > 0) && (
            <IconButton onClick={clearMapMode} sx={{ bgcolor: 'background.paper', boxShadow: '0 8px 24px rgba(16,36,31,.16)' }} aria-label="limpiar mapa">
              <ArrowLeft size={21} />
            </IconButton>
          )}

          <AnimatePresence mode="wait" initial={false}>
            {searchOpen ? (
              <motion.div key="search" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }} style={{ flex: 1 }}>
                <Box className="glass-effect" sx={{ display: 'flex', alignItems: 'center', gap: 1, borderRadius: '999px', px: 2, py: 1.1, boxShadow: '0 14px 36px rgba(16,36,31,.16)' }}>
                  <Search size={20} />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca negocios en el mapa" style={{ flex: 1, border: 0, outline: 0, background: 'transparent', font: '700 1rem Outfit, sans-serif', minWidth: 0 }} />
                  <IconButton size="small" onClick={() => { setSearchOpen(false); setQuery(''); }}><X size={18} /></IconButton>
                </Box>
              </motion.div>
            ) : (
              <motion.div key="button" initial={{ opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.86 }}>
                <IconButton onClick={() => setSearchOpen(true)} sx={{ bgcolor: 'background.paper', boxShadow: '0 8px 24px rgba(16,36,31,.16)' }} aria-label="buscar">
                  <Search size={21} />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>

          {!searchOpen && (
            <Stack direction="row" spacing={0.8} sx={{ overflowX: 'auto', flex: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
              {businessCategories.map((category) => (
                <Chip key={category} label={category} onClick={() => setSelectedCategory(category)} color={selectedCategory === category ? 'primary' : 'default'} variant={selectedCategory === category ? 'filled' : 'outlined'} sx={{ flexShrink: 0, bgcolor: selectedCategory === category ? undefined : 'rgba(255,253,248,.9)' }} />
              ))}
            </Stack>
          )}
        </Stack>
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', left: 18, top: 86, bottom: 92, width: 360, zIndex: 500, overflowY: 'auto', pr: 0.5 }}>
        <Stack spacing={1.2}>
          {(activeRoute ? routeStops : nearbyPlaces.length ? nearbyPlaces : visiblePlaces).map((place, index) => (
            <Card key={place.id} onClick={() => selectPlace(place)} sx={{ display: 'flex', gap: 1.3, p: 1.2, borderRadius: '22px', cursor: 'pointer', bgcolor: selectedPlace?.id === place.id ? 'rgba(255,253,248,.98)' : 'rgba(255,253,248,.88)', backdropFilter: 'blur(14px)', border: '1px solid', borderColor: selectedPlace?.id === place.id ? 'secondary.main' : 'divider' }}>
              {activeRoute && <Box sx={{ width: 28, height: 28, borderRadius: '10px', bgcolor: activeRoute.color || 'secondary.main', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 900, flexShrink: 0 }}>{index + 1}</Box>}
              <CardMedia component="img" image={place.img} alt={place.name} sx={{ width: 72, height: 72, borderRadius: '16px', objectFit: 'cover', flexShrink: 0 }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 900, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{place.name}</Typography>
                <Typography variant="body2" sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{place.type}</Typography>
                <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 0.8 }}>
                  <Star size={14} fill="#F2B705" color="#F2B705" />
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{place.rating}</Typography>
                  {place.dist && <Chip label={`${place.dist.toFixed(1)} km`} size="small" color="secondary" />}
                </Stack>
              </Box>
            </Card>
          ))}
        </Stack>
      </Box>

      <AnimatePresence mode="wait">
        {(selectedPlace || activeRoute || nearbyPlaces.length > 0 || directionsTo) && (
          <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 28 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }} style={{ position: 'absolute', right: 18, top: 86, width: 390, maxWidth: 'calc(100% - 36px)', zIndex: 520 }}>
            <Card className="soft-panel" sx={{ borderRadius: '28px', overflow: 'hidden', maxHeight: 'calc(100vh - 180px)', overflowY: 'auto' }}>
              {selectedPlace && (
                <>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia component="img" image={selectedPlace.img} alt={selectedPlace.name} sx={{ height: 160, objectFit: 'cover' }} />
                    <Chip label={directionsTo?.id === selectedPlace.id ? 'Destino' : selectedPlace.category} color={directionsTo?.id === selectedPlace.id ? 'error' : 'secondary'} sx={{ position: 'absolute', left: 14, bottom: 14 }} />
                  </Box>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h3" sx={{ mb: 0.5 }}>{selectedPlace.name}</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>{selectedPlace.location} · {selectedPlace.price}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{selectedPlace.desc}</Typography>
                    {isGuest && (
                      <Stack direction="row" spacing={1} sx={{ mb: 2, p: 1.4, borderRadius: '16px', bgcolor: 'rgba(233,95,42,.08)' }}>
                        <LockKeyhole size={18} color="#E95F2A" />
                        <Typography variant="body2">Crea una cuenta para usar navegacion.</Typography>
                      </Stack>
                    )}
                    {directionsTo?.id === selectedPlace.id && destinationDistance && (
                      <Box sx={{ mb: 2, p: 1.6, borderRadius: '16px', bgcolor: 'rgba(229,57,53,.08)', border: '1px solid rgba(229,57,53,.22)' }}>
                        <Typography variant="body2" sx={{ fontWeight: 900 }}>Ruta activa</Typography>
                        <Typography variant="body2">Aprox. {destinationDistance.toFixed(1)} km desde tu ubicacion {userLocation?.[0] === DURANGO_CENTER[0] ? 'simulada' : 'actual'}.</Typography>
                      </Box>
                    )}
                    <Stack spacing={1}>
                      <Button variant="contained" color="secondary" disabled={isGuest || loadingLocation} startIcon={loadingLocation ? <CircularProgress size={16} color="inherit" /> : <Navigation size={17} />} onClick={() => showDirections(selectedPlace)} fullWidth>
                        Como llegar
                      </Button>
                      <Button variant="outlined" disabled={isGuest || loadingLocation} startIcon={loadingLocation ? <CircularProgress size={16} /> : <LocateFixed size={17} />} onClick={showNearby} fullWidth>
                        Cerca de mi
                      </Button>
                    </Stack>
                  </CardContent>
                </>
              )}

              {!selectedPlace && activeRoute && (
                <CardContent sx={{ p: 2.5 }}>
                  <Chip label="Ruta activa" color="primary" sx={{ mb: 1.5 }} />
                  <Typography variant="h3" sx={{ mb: 1 }}>{activeRoute.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{activeRoute.duration} · {routeStops.length} paradas</Typography>
                  <Stack spacing={1.2}>
                    {routeStops.map((stop, index) => (
                      <Stack key={stop.id} direction="row" spacing={1.2} alignItems="center" onClick={() => selectPlace(stop)} sx={{ cursor: 'pointer' }}>
                        <Box sx={{ width: 28, height: 28, borderRadius: '10px', bgcolor: activeRoute.color || 'primary.main', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 900 }}>{index + 1}</Box>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{stop.name}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              )}

              {!selectedPlace && nearbyPlaces.length > 0 && (
                <CardContent sx={{ p: 2.5 }}>
                  <Chip label="Cerca de mi" color="secondary" sx={{ mb: 1.5 }} />
                  <Typography variant="h3" sx={{ mb: 1 }}>Recomendaciones cercanas</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Usando ubicacion {userLocation?.[0] === DURANGO_CENTER[0] ? 'simulada en Durango' : 'real'}.</Typography>
                  <Stack spacing={1.2}>
                    {nearbyPlaces.map((place) => (
                      <Button key={place.id} variant="outlined" onClick={() => selectPlace(place)} sx={{ justifyContent: 'space-between' }}>
                        {place.name} · {place.dist.toFixed(1)} km
                      </Button>
                    ))}
                  </Stack>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ display: { xs: 'flex', md: 'none' }, position: 'absolute', bottom: 84, left: 12, right: 12, zIndex: 500, gap: 1, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {(activeRoute ? routeStops : nearbyPlaces.length ? nearbyPlaces : visiblePlaces).slice(0, 10).map((place) => (
          <Card key={place.id} onClick={() => selectPlace(place)} sx={{ flexShrink: 0, width: 190, borderRadius: '20px', overflow: 'hidden', cursor: 'pointer' }}>
            <CardMedia component="img" image={place.img} alt={place.name} sx={{ height: 86, objectFit: 'cover' }} />
            <Box sx={{ p: 1.2 }}>
              <Typography variant="body2" sx={{ fontWeight: 900, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{place.name}</Typography>
              <Typography variant="body2" color="text.secondary">{place.rating} estrellas</Typography>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ExploreMap;
