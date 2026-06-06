import { useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Container, Stack, TextField, Typography } from '@mui/material';
import { Bot, LockKeyhole, Send, Sparkles } from 'lucide-react';
import { businesses, routePlans } from '../data/durango';
import { useAuth } from '../context/useAuth';

const prompts = [
  'Tengo 2 horas y quiero caminar poco',
  'Quiero comer barato cerca del centro',
  'Plan familiar con fotos bonitas',
  'Compras artesanales y cafe',
];

const Assistant = () => {
  const { user } = useAuth();
  const isGuest = user?.role === 'guest';
  const [message, setMessage] = useState(prompts[0]);
  const [answers, setAnswers] = useState([
    'Bienvenido. Puedo ayudarte a encontrar negocios y experiencias. Las rutas completas requieren cuenta.',
  ]);

  const sendMessage = (event) => {
    event.preventDefault();
    const place = businesses[Math.floor(Math.random() * businesses.length)];
    const route = routePlans[Math.floor(Math.random() * routePlans.length)];

    setAnswers((current) => [
      ...current,
      isGuest
        ? `Para: "${message}" puedes explorar ${place.name}. Como visitante no puedo generar rutas completas; crea una cuenta para desbloquear recorridos y paradas.`
        : `Para: "${message}" te sugiero ${place.name} y la ruta "${route.title}". Considera ${route.duration}, ${route.accessibility.toLowerCase()} y paradas como ${route.stops.slice(0, 2).join(' y ')}.`,
    ]);
    setMessage('');
  };

  return (
    <Box sx={{ pt: { xs: 11, md: 13 }, pb: 4 }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Chip icon={<Bot size={18} />} label="Asistente inteligente" color="secondary" sx={{ mb: 2 }} />
            <Typography variant="h1" color="primary" sx={{ mb: 2 }}>
              Pregunta en lenguaje natural y recibe una recomendacion util.
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 740, mb: 4 }}>
              {isGuest ? 'Modo visitante: recomendaciones sin rutas completas.' : 'Version simulada para el hackathon: responde con negocios y rutas del catalogo local.'}
            </Typography>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 3 }}>
              {prompts.map((prompt) => (
                <Chip key={prompt} label={prompt} onClick={() => setMessage(prompt)} color={message === prompt ? 'primary' : 'default'} variant={message === prompt ? 'filled' : 'outlined'} />
              ))}
            </Stack>

            <Card className="soft-panel" sx={{ borderRadius: '32px' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={2.2} sx={{ mb: 3, maxHeight: 420, overflowY: 'auto' }}>
                  {answers.map((answer, index) => (
                    <Box key={`${answer}-${index}`} sx={{ p: 2.5, borderRadius: '22px', bgcolor: index === 0 ? 'rgba(18,49,43,0.08)' : 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Box sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: '14px', p: 1 }}>
                          <Sparkles size={20} />
                        </Box>
                        <Typography variant="body1">{answer}</Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>

                <Box component="form" onSubmit={sendMessage}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <TextField fullWidth label="Escribe lo que necesitas" value={message} onChange={(event) => setMessage(event.target.value)} />
                    <Button type="submit" variant="contained" color="secondary" endIcon={<Send size={18} />} disabled={!message.trim()}>
                      Enviar
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Card sx={{ width: { xs: '100%', lg: 360 }, borderRadius: '32px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h2" sx={{ mb: 2 }}>Puede ayudarte con</Typography>
              <Stack spacing={1.2}>
                <Chip icon={isGuest ? <LockKeyhole size={16} /> : undefined} label={isGuest ? 'Rutas bloqueadas' : 'Rutas de bajo esfuerzo'} color="primary" />
                <Chip label="Negocios cercanos" color="primary" variant="outlined" />
                <Chip label="Presupuesto y horarios" color="primary" variant="outlined" />
                <Chip label="Ideas para familias" color="primary" variant="outlined" />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
};

export default Assistant;
