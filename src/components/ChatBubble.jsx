import { useEffect, useRef, useState } from 'react';
import { Box, Button, Chip, IconButton, Stack, TextField, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { businesses, routePlans } from '../data/durango';
import { useAuth } from '../context/useAuth';

const prompts = ['Comer barato', 'Plan familiar', 'Cafe tranquilo', 'Comprar artesanias', 'Ruta corta'];

const getFallbackResponse = (query, isGuest, businesses, routePlans) => {
  const idx = Math.floor(query.length * 31) % businesses.length;
  const place = businesses.find((b) =>
    `${b.name} ${b.category} ${b.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase().split(' ')[0])
  ) || businesses[idx];
  const route = routePlans[query.length % routePlans.length];

  return isGuest
    ? `Te recomiendo explorar ${place.name} en ${place.location}. Como visitante puedes ver informacion, pero necesitas cuenta para rutas y navegacion.`
    : `Te recomiendo ${place.name} en ${place.location}. Combina esta parada con la ruta "${route.title}" de ${route.duration} para una experiencia completa.`;
};

const ChatBubble = () => {
  const { user } = useAuth();
  const isGuest = user?.role === 'guest';
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [answers, setAnswers] = useState([
    { id: 0, text: 'Hola! Soy tu asistente de Durango. Preguntame por comida, museos, tiendas o experiencias cercanas.', sender: 'bot' },
  ]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const msgId = useRef(10);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [answers, typing]);

  const sendMessage = async (text) => {
    const query = (text || message).trim();
    if (!query || typing) return;

    const uid = (msgId.current += 1);
    const botId = (msgId.current += 1);
    setAnswers((prev) => [...prev, { id: uid, text: query, sender: 'user' }]);
    setMessage('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const fallback = getFallbackResponse(query, isGuest, businesses, routePlans);
      setAnswers((prev) => [...prev, { id: botId, text: fallback, sender: 'bot' }]);
    }, 650);
  };

  return (
    <>
      {/* ─── Backdrop bloqueante ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              background: 'rgba(10,22,18,0.42)',
              zIndex: 1298,
              cursor: 'default',
            }}
          />
        )}
      </AnimatePresence>

      {/* ─── Fixed wrapper — botón siempre en la misma posición ─── */}
      <Box
        sx={{
          position: 'fixed',
          right: { xs: 16, md: 28 },
          bottom: { xs: 94, md: 108 },
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 2,
          pointerEvents: 'none',
        }}
      >
        {/* Panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 28, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 22, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              style={{ pointerEvents: 'all' }}
            >
              <Box
                onClick={(e) => e.stopPropagation()}
                className="soft-panel"
                sx={{
                  width: { xs: 'calc(100vw - 32px)', sm: 440 },
                  maxHeight: { xs: '72vh', sm: 580 },
                  borderRadius: '30px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 32px 80px rgba(10,22,18,0.28)',
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: 'primary.main',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.07)', right: -60, top: -80 }} />
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ position: 'relative' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ width: 46, height: 46, borderRadius: '16px', bgcolor: 'secondary.main', display: 'grid', placeItems: 'center', boxShadow: '0 8px 20px rgba(233,95,42,0.4)' }}>
                        <Sparkles size={22} />
                      </Box>
                      <Box>
                        <Typography variant="h3" sx={{ color: 'white', fontSize: '1.15rem' }}>Asistente Durango</Typography>
                        <Stack direction="row" alignItems="center" spacing={0.6}>
                          <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#4ade80' }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>
                            {isGuest ? 'Modo visitante' : 'Asistente local'}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                    <IconButton
                      onClick={() => setOpen(false)}
                      aria-label="cerrar chat"
                      sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}
                    >
                      <X size={22} />
                    </IconButton>
                  </Stack>
                </Box>

                {/* Quick prompts */}
                <Box sx={{ px: 2, pt: 1.8, pb: 0, flexShrink: 0 }}>
                  <Stack direction="row" spacing={0.8} sx={{ overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }, pb: 0.5 }}>
                    {prompts
                      .filter((p) => !isGuest || !p.toLowerCase().includes('ruta'))
                      .map((prompt) => (
                        <Chip
                          key={prompt}
                          label={prompt}
                          onClick={() => sendMessage(prompt)}
                          color="default"
                          variant="outlined"
                          sx={{ flexShrink: 0, cursor: 'pointer', fontSize: '0.84rem' }}
                        />
                      ))}
                  </Stack>
                </Box>

                {/* Messages */}
                <Box
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.4,
                    scrollbarWidth: 'thin',
                    '&::-webkit-scrollbar': { width: 4 },
                    '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(18,49,43,0.18)', borderRadius: 2 },
                  }}
                >
                  {answers.map((msg) => (
                    <Box key={msg.id} sx={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
                      <Box
                        sx={{
                          p: 1.8,
                          borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                          bgcolor: msg.sender === 'user' ? 'secondary.main' : 'rgba(18,49,43,0.07)',
                          color: msg.sender === 'user' ? 'white' : 'text.primary',
                          border: '1px solid',
                          borderColor: msg.sender === 'user' ? 'transparent' : 'divider',
                        }}
                      >
                        {msg.sender === 'bot' && (
                          <Stack direction="row" spacing={1} alignItems="flex-start">
                              <Box sx={{ bgcolor: 'secondary.main', color: 'white', borderRadius: '8px', p: 0.6, flexShrink: 0, display: 'grid', placeItems: 'center', mt: 0.2 }}>
                              <Sparkles size={13} />
                            </Box>
                            <Typography variant="body2" sx={{ lineHeight: 1.65 }}>{msg.text}</Typography>
                          </Stack>
                        )}
                        {msg.sender === 'user' && (
                          <Typography variant="body2" sx={{ color: 'white', lineHeight: 1.65 }}>{msg.text}</Typography>
                        )}
                      </Box>
                    </Box>
                  ))}

                  {typing && (
                    <Box sx={{ alignSelf: 'flex-start' }}>
                      <Box sx={{ p: 1.6, borderRadius: '20px 20px 20px 4px', bgcolor: 'rgba(18,49,43,0.07)', border: '1px solid', borderColor: 'divider', display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main', animation: 'fadeIn 0.6s ease-in-out infinite alternate' }} />
                        <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>Pensando...</Typography>
                      </Box>
                    </Box>
                  )}

                  <div ref={messagesEndRef} />
                </Box>

                {/* Input */}
                <Box sx={{ p: 1.8, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0 }}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Escribe tu pregunta..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      disabled={typing}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => sendMessage()}
                      disabled={!message.trim() || typing}
                      sx={{ minWidth: 52, px: 1.5, borderRadius: '14px' }}
                      aria-label="enviar mensaje"
                    >
                      <Send size={19} />
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Floating button — posición fija siempre ─── */}
        <motion.div
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          style={{ pointerEvents: 'all' }}
        >
          <IconButton
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'cerrar asistente' : 'abrir asistente'}
            sx={{
              width: 64,
              height: 64,
              bgcolor: open ? 'primary.main' : 'secondary.main',
              color: 'white',
              boxShadow: open ? '0 14px 36px rgba(18,49,43,0.35)' : '0 18px 42px rgba(233,95,42,0.4)',
              border: '3.5px solid rgba(255,255,255,0.9)',
              transition: 'background-color 0.22s ease, box-shadow 0.22s ease',
              '&:hover': { bgcolor: open ? 'primary.dark' : 'secondary.dark' },
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'close' : 'open'}
                initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'grid' }}
              >
                {open ? <X size={28} /> : <MessageCircle size={28} />}
              </motion.span>
            </AnimatePresence>
          </IconButton>
        </motion.div>
      </Box>
    </>
  );
};

export default ChatBubble;
