import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, MessageCircle, MessagesSquare, Send, ShoppingBag, X } from 'lucide-react';
import { marketplaceCategories, mockListings } from '../data/marketplace';
import { useAuth } from '../context/useAuth';
import IntroModal from '../components/IntroModal';

const RECENT_CHATS_KEY = 'durango_recent_chats';

const loadRecentChats = () => {
  try { return JSON.parse(localStorage.getItem(RECENT_CHATS_KEY) || '[]'); }
  catch { return []; }
};

const saveRecentChats = (chats) => {
  try { localStorage.setItem(RECENT_CHATS_KEY, JSON.stringify(chats)); } catch { /* silent */ }
};

const Marketplace = () => {
  useAuth();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedListing, setSelectedListing] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatWith, setChatWith] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [chatInput, setChatInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [recentChats, setRecentChats] = useState(loadRecentChats);

  const visibleListings =
    selectedCategory === 'Todos'
      ? mockListings
      : mockListings.filter((l) => l.category === selectedCategory);

  const openDetail = (listing) => {
    setSelectedListing(listing);
    setChatOpen(false);
  };

  const persistRecentChat = (listing, latestMessage) => {
    setRecentChats((prev) => {
      const existing = prev.filter((c) => c.listingId !== listing.id);
      const updated = [
        {
          listingId: listing.id,
          user: listing.user,
          avatar: listing.avatar,
          title: listing.title,
          lastMessage: latestMessage,
          timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        },
        ...existing,
      ].slice(0, 5);
      saveRecentChats(updated);
      return updated;
    });
  };

  const openChat = (listing) => {
    setChatWith(listing);
    setChatOpen(true);
    setSelectedListing(null);
    if (!chatMessages[listing.id]) {
      const firstMsg = { id: 0, text: `Hola! Estoy interesado en "${listing.title}". ¿Sigue disponible?`, sender: 'me', time: 'Ahora' };
      setChatMessages((prev) => ({ ...prev, [listing.id]: [firstMsg] }));
      persistRecentChat(listing, firstMsg.text);
      setTimeout(() => {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          const reply = { id: 1, text: listing.autoResponse, sender: 'them', time: 'Ahora' };
          setChatMessages((prev) => ({ ...prev, [listing.id]: [...(prev[listing.id] || []), reply] }));
          persistRecentChat(listing, reply.text);
        }, 1400);
      }, 600);
    }
  };

  const openRecentChat = (recentChat) => {
    const listing = mockListings.find((l) => l.id === recentChat.listingId);
    if (!listing) return;
    setChatWith(listing);
    setChatOpen(true);
    setSelectedListing(null);
    if (!chatMessages[listing.id]) {
      const firstMsg = { id: 0, text: `Hola! Estoy interesado en "${listing.title}". ¿Sigue disponible?`, sender: 'me', time: 'Ahora' };
      const replyMsg = { id: 1, text: listing.autoResponse, sender: 'them', time: 'Ahora' };
      setChatMessages((prev) => ({ ...prev, [listing.id]: [firstMsg, replyMsg] }));
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim() || !chatWith) return;
    const key = chatWith.id;
    const newMsg = { id: Date.now(), text: chatInput.trim(), sender: 'me', time: 'Ahora' };
    setChatMessages((prev) => ({ ...prev, [key]: [...(prev[key] || []), newMsg] }));
    persistRecentChat(chatWith, newMsg.text);
    setChatInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const replies = [
        'Claro, con gusto te ayudo.',
        'Si, todavia lo tengo disponible.',
        'Puedes pasar a verlo cuando quieras.',
        'Tengo mas fotos si las necesitas.',
        'El precio es negociable si compras en efectivo.',
      ];
      const reply = { id: Date.now() + 1, text: replies[Math.floor(Math.random() * replies.length)], sender: 'them', time: 'Ahora' };
      setChatMessages((prev) => ({ ...prev, [key]: [...(prev[key] || []), reply] }));
      persistRecentChat(chatWith, reply.text);
    }, 1200);
  };

  const currentMessages = chatWith ? (chatMessages[chatWith.id] || []) : [];

  return (
    <Box sx={{ pt: { xs: 11, md: 13 }, pb: 4 }}>
      <IntroModal
        pageKey="marketplace"
        icon={<ShoppingBag size={42} />}
        title="Marketplace Durango"
        description="Compra y vende con personas reales de la ciudad. Filtra por categoria, contacta directamente al vendedor y guarda tus conversaciones."
        cta="Explorar Marketplace"
      />

      <Container>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <Box sx={{ mb: 4 }}>
            <Chip icon={<ShoppingBag size={18} />} label="Marketplace Durango" color="secondary" sx={{ mb: 2 }} />
            <Typography variant="h1" color="primary" sx={{ mb: 1 }}>
              Compra y vende en Durango.
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Publicaciones de personas reales de la ciudad. Filtra, explora y contacta directo.
            </Typography>
          </Box>
        </motion.div>

        {/* ─── Chats recientes ─── */}
        <AnimatePresence>
          {recentChats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.38 }}
            >
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                  <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 0.8, borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
                    <MessagesSquare size={18} />
                  </Box>
                  <Typography variant="h2">Chats recientes</Typography>
                  <Chip label={recentChats.length} color="primary" size="small" />
                </Stack>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1.6 }}>
                  {recentChats.map((chat, i) => {
                    const listing = mockListings.find((l) => l.id === chat.listingId);
                    return (
                      <motion.div
                        key={chat.listingId}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.36 }}
                        whileHover={{ y: -3 }}
                      >
                        <Card
                          onClick={() => openRecentChat(chat)}
                          sx={{
                            cursor: 'pointer',
                            borderRadius: '20px',
                            border: '1px solid',
                            borderColor: 'divider',
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            transition: 'box-shadow 0.2s',
                            '&:hover': { boxShadow: '0 8px 28px rgba(10,22,18,0.12)' },
                          }}
                          className="interactive-card"
                        >
                          <Box sx={{ position: 'relative', flexShrink: 0 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44, fontWeight: 900 }}>
                              {chat.avatar}
                            </Avatar>
                            <Box sx={{ position: 'absolute', bottom: 0, right: -2, width: 14, height: 14, borderRadius: '50%', bgcolor: 'success.main', border: '2px solid white' }} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Typography variant="body2" sx={{ fontWeight: 900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {chat.user}
                              </Typography>
                              <Stack direction="row" alignItems="center" spacing={0.4} sx={{ flexShrink: 0 }}>
                                <Clock size={11} color="#5B665F" />
                                <Typography variant="body2" sx={{ fontSize: '0.74rem', color: 'text.secondary' }}>{chat.timestamp}</Typography>
                              </Stack>
                            </Stack>
                            <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mb: 0.3 }}>
                              {chat.title}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: listing ? 'text.primary' : 'text.secondary', fontStyle: listing ? 'normal' : 'italic' }}>
                              {chat.lastMessage}
                            </Typography>
                          </Box>
                          <MessageCircle size={18} color="#12312B" style={{ flexShrink: 0 }} />
                        </Card>
                      </motion.div>
                    );
                  })}
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty chats state */}
        {recentChats.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Box sx={{ mb: 4, p: 2.5, borderRadius: '20px', bgcolor: 'rgba(18,49,43,0.04)', border: '1px dashed', borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ bgcolor: 'rgba(18,49,43,0.08)', borderRadius: '14px', p: 1.4, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <MessagesSquare size={28} color="#5B665F" />
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 800, mb: 0.3 }}>Sin chats recientes</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cuando contactes a un vendedor, el chat aparecera aqui para que puedas continuar la conversacion.
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </motion.div>
        )}

        {/* Category filters */}
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 4 }}>
          {marketplaceCategories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setSelectedCategory(cat)}
              color={selectedCategory === cat ? 'secondary' : 'default'}
              variant={selectedCategory === cat ? 'filled' : 'outlined'}
              sx={{ px: 1, fontSize: '1rem' }}
            />
          ))}
        </Stack>

        {/* Listings grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
          <AnimatePresence>
            {visibleListings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
              >
                <Card
                  onClick={() => openDetail(listing)}
                  sx={{ cursor: 'pointer', borderRadius: '22px', overflow: 'hidden', height: '100%' }}
                  className="interactive-card"
                >
                  <Box
                    component="img"
                    src={listing.img}
                    alt={listing.title}
                    sx={{ width: '100%', height: { xs: 130, sm: 170 }, objectFit: 'cover', display: 'block' }}
                  />
                  <CardContent sx={{ p: 1.8 }}>
                    <Chip label={listing.category} size="small" color="default" variant="outlined" sx={{ mb: 0.8, fontSize: '0.76rem' }} />
                    <Typography variant="body1" sx={{ fontWeight: 800, mb: 0.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.3 }}>
                      {listing.title}
                    </Typography>
                    <Typography variant="h3" color="secondary.main" sx={{ fontSize: '1.2rem', mb: 0.4 }}>
                      ${listing.price.toLocaleString()}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 22, height: 22, bgcolor: 'primary.main', fontSize: '0.72rem', fontWeight: 800 }}>
                        {listing.avatar}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>{listing.user}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      </Container>

      {/* ─── Detail modal ─── */}
      <AnimatePresence>
        {selectedListing && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
              onClick={() => setSelectedListing(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,18,0.72)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', zIndex: 1200 }}
            />
            <motion.div
              key="detail"
              initial={{ opacity: 0, scale: 0.94, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 14 }}
              transition={{ type: 'spring', stiffness: 360, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'fixed', inset: 0, zIndex: 1201, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px 48px' }}
            >
              <Box sx={{ width: '100%', maxWidth: 640, bgcolor: 'background.default', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(10,22,18,0.38)' }}>
                <Box sx={{ position: 'relative' }}>
                  <Box component="img" src={selectedListing.img} alt={selectedListing.title} sx={{ width: '100%', height: { xs: 240, md: 320 }, objectFit: 'cover', display: 'block' }} />
                  <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,18,0.5) 0%, transparent 55%)' }} />
                  <IconButton onClick={() => setSelectedListing(null)} sx={{ position: 'absolute', top: 16, left: 16, bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', width: 44, height: 44, '&:hover': { bgcolor: 'white' } }}>
                    <X size={22} />
                  </IconButton>
                  <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
                    <Chip label={selectedListing.category} color="secondary" />
                  </Box>
                </Box>

                <Box sx={{ p: { xs: 3, md: 4 } }}>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.36 }}>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} sx={{ mb: 1.5 }}>
                      <Typography variant="h2" sx={{ flex: 1 }}>{selectedListing.title}</Typography>
                      <Typography variant="h2" color="secondary.main" sx={{ flexShrink: 0 }}>
                        ${selectedListing.price.toLocaleString()}
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5, p: 2, borderRadius: '16px', bgcolor: 'rgba(18,49,43,0.05)', border: '1px solid', borderColor: 'divider' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 800 }}>{selectedListing.avatar}</Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 800 }}>{selectedListing.user}</Typography>
                        <Typography variant="body2" color="text.secondary">{selectedListing.location} · {selectedListing.date}</Typography>
                      </Box>
                    </Stack>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                      {selectedListing.desc}
                    </Typography>

                    <Stack direction="row" spacing={1.5}>
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        startIcon={<MessageCircle size={20} />}
                        onClick={() => { openChat(selectedListing); }}
                        sx={{ borderRadius: '18px', py: 1.8 }}
                      >
                        Enviar mensaje
                      </Button>
                    </Stack>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Chat panel ─── */}
      <AnimatePresence>
        {chatOpen && chatWith && (
          <>
            <motion.div
              key="chat-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setChatOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,18,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 1300 }}
            />
            <motion.div
              key="chat-panel"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'fixed', bottom: 80, right: 20, left: 20, maxWidth: 480, margin: '0 auto', zIndex: 1301 }}
            >
              <Card sx={{ borderRadius: '28px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(10,22,18,0.3)' }}>
                {/* Chat header */}
                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40, fontWeight: 800 }}>
                        {chatWith.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ color: 'white', fontWeight: 800 }}>{chatWith.user}</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                          {chatWith.title}
                        </Typography>
                      </Box>
                    </Stack>
                    <IconButton onClick={() => setChatOpen(false)} sx={{ color: 'white' }}>
                      <X size={20} />
                    </IconButton>
                  </Stack>
                </Box>

                {/* Messages */}
                <Box sx={{ p: 2, maxHeight: 280, overflowY: 'auto', bgcolor: 'rgba(248,243,234,0.6)', display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  {currentMessages.map((msg) => (
                    <Box key={msg.id} sx={{ alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                      <Box sx={{ p: 1.6, borderRadius: msg.sender === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', bgcolor: msg.sender === 'me' ? 'secondary.main' : 'white', color: msg.sender === 'me' ? 'white' : 'text.primary', border: '1px solid', borderColor: msg.sender === 'me' ? 'transparent' : 'divider', boxShadow: '0 4px 12px rgba(10,22,18,0.08)' }}>
                        <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 500 }}>{msg.text}</Typography>
                      </Box>
                    </Box>
                  ))}
                  {typing && (
                    <Box sx={{ alignSelf: 'flex-start' }}>
                      <Box sx={{ p: 1.4, borderRadius: '18px 18px 18px 4px', bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
                        <Stack direction="row" spacing={0.5}>
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ y: [0, -6, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                              style={{ width: 8, height: 8, borderRadius: '50%', background: '#5B665F' }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Input */}
                <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Escribe un mensaje..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    />
                    <Button variant="contained" color="secondary" onClick={sendMessage} disabled={!chatInput.trim()} sx={{ minWidth: 52, px: 1.5, borderRadius: '14px' }}>
                      <Send size={18} />
                    </Button>
                  </Stack>
                </Box>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Marketplace;
