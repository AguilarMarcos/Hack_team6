import { useState } from 'react';
import { Box, Button, Chip, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { businesses, routePlans } from '../data/durango';
import { useAuth } from '../context/useAuth';

const prompts = ['Comer barato', 'Plan familiar', 'Cafe tranquilo', 'Comprar artesanias', 'Ruta corta'];

const ChatBubble = () => {
  const { user } = useAuth();
  const isGuest = user?.role === 'guest';
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [answers, setAnswers] = useState([
    'Hola, soy tu asistente de Durango. Preguntame por comida, museos, tiendas o experiencias cercanas.',
  ]);

  const sendMessage = (event) => {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;

    const place = businesses.find((business) => `${business.name} ${business.category} ${business.tags.join(' ')}`.toLowerCase().includes(text.toLowerCase().split(' ')[0])) || businesses[Math.floor(Math.random() * businesses.length)];
    const route = routePlans[Math.floor(Math.random() * routePlans.length)];

    setAnswers((current) => [
      ...current,
      isGuest
        ? `Te recomiendo explorar ${place.name} en ${place.location}. Como visitante puedes ver informacion, pero necesitas cuenta para rutas y como llegar.`
        : `Te recomiendo ${place.name}. Si quieres un plan completo, combina esta parada con la ruta "${route.title}" de ${route.duration}.`,
    ]);
    setMessage('');
  };

  return (
    <Box sx={{ position: 'fixed', right: { xs: 16, md: 28 }, bottom: { xs: 94, md: 108 }, zIndex: 1300 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.9, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 24, scale: 0.92, filter: 'blur(6px)' }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
          >
            <Paper
              className="soft-panel"
              elevation={0}
              sx={{
                width: { xs: 'calc(100vw - 32px)', sm: 390 },
                maxHeight: { xs: '68vh', sm: 560 },
                borderRadius: '30px',
                overflow: 'hidden',
                mb: 2,
              }}
            >
              <Box sx={{ p: 2.5, bgcolor: 'primary.main', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.12)', right: -42, top: -64 }} />
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ position: 'relative' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width: 46, height: 46, borderRadius: '18px', bgcolor: 'secondary.main', display: 'grid', placeItems: 'center' }}>
                      <Sparkles size={24} />
                    </Box>
                    <Box>
                      <Typography variant="h3" sx={{ color: 'white', fontSize: '1.25rem' }}>Asistente Durango</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.78)' }}>{isGuest ? 'Modo visitante' : 'Cuenta completa'}</Typography>
                    </Box>
                  </Stack>
                  <IconButton onClick={() => setOpen(false)} aria-label="cerrar chat" sx={{ color: 'white' }}>
                    <X size={22} />
                  </IconButton>
                </Stack>
              </Box>

              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2 }}>
                  {prompts.filter((prompt) => !isGuest || !prompt.toLowerCase().includes('ruta')).map((prompt) => (
                    <Chip key={prompt} label={prompt} onClick={() => setMessage(prompt)} color={message === prompt ? 'secondary' : 'default'} variant={message === prompt ? 'filled' : 'outlined'} />
                  ))}
                </Stack>

                <Stack spacing={1.4} sx={{ maxHeight: 250, overflowY: 'auto', pr: 0.5, mb: 2 }}>
                  {answers.map((answer, index) => (
                    <Box key={`${answer}-${index}`} sx={{ alignSelf: index === 0 ? 'flex-start' : 'flex-end', maxWidth: '92%' }}>
                      <Box sx={{ p: 1.8, borderRadius: index === 0 ? '20px 20px 20px 6px' : '20px 20px 6px 20px', bgcolor: index === 0 ? 'rgba(18,49,43,0.08)' : 'rgba(233,95,42,0.12)', border: '1px solid', borderColor: index === 0 ? 'divider' : 'rgba(233,95,42,0.24)' }}>
                        <Typography variant="body2">{answer}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>

                <Box component="form" onSubmit={sendMessage}>
                  <Stack direction="row" spacing={1}>
                    <TextField size="small" fullWidth placeholder="Escribe tu pregunta" value={message} onChange={(event) => setMessage(event.target.value)} />
                    <Button variant="contained" color="secondary" type="submit" sx={{ minWidth: 56, px: 1.5 }} aria-label="enviar mensaje">
                      <Send size={20} />
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.96 }}>
        <IconButton
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? 'cerrar asistente' : 'abrir asistente'}
          sx={{
            width: 68,
            height: 68,
            bgcolor: 'secondary.main',
            color: 'white',
            boxShadow: '0 18px 42px rgba(233,95,42,0.38)',
            border: '4px solid rgba(255,255,255,0.82)',
            '&:hover': { bgcolor: 'secondary.dark' },
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={open ? 'close' : 'open'} initial={{ rotate: -45, opacity: 0, scale: 0.7 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 45, opacity: 0, scale: 0.7 }} transition={{ duration: 0.18 }} style={{ display: 'grid' }}>
              {open ? <X size={30} /> : <MessageCircle size={30} />}
            </motion.span>
          </AnimatePresence>
        </IconButton>
      </motion.div>
    </Box>
  );
};

export default ChatBubble;
