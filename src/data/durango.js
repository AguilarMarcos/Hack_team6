export const businessCategories = ['Todos', 'Comida', 'Cafe', 'Cultura', 'Artesanias', 'Naturaleza'];

export const businesses = [
  {
    id: 1, name: 'Gorditas Dona Ale', type: 'Comida tradicional', category: 'Comida', price: '$', rating: 4.8, reviews: 248,
    img: '/discover-images/gorditas-dona-ale.svg',
    location: 'Centro Historico', distance: '6 min caminando', pos: [24.025, -104.655],
    hours: '8:00 AM - 5:00 PM', phone: '+52 618 123 4567',
    tags: ['Asado verde', 'Acceso facil', 'Familiar'],
    desc: 'Gorditas rellenas de guisos duranguenses con porciones generosas, servicio rapido y mesas amplias.',
  },
  {
    id: 2, name: 'Museo Francisco Villa', type: 'Turismo e historia', category: 'Cultura', price: 'Entrada libre', rating: 4.9, reviews: 516,
    img: '/discover-images/museo-francisco-villa.svg',
    location: 'Zona Centro', distance: '10 min caminando', pos: [24.028, -104.65],
    hours: '10:00 AM - 6:00 PM', phone: '+52 618 134 5678',
    tags: ['Historia', 'Guias', 'Foto spot'],
    desc: 'Recorrido por salones historicos y exposiciones sobre el Centauro del Norte en un edificio emblematico.',
  },
  {
    id: 3, name: 'Cafe Analco', type: 'Cafe de especialidad', category: 'Cafe', price: '$$', rating: 4.7, reviews: 189,
    img: '/discover-images/cafe-analco.svg',
    location: 'Barrio de Analco', distance: '8 min en auto', pos: [24.0178, -104.6632],
    hours: '7:30 AM - 9:00 PM', phone: '+52 618 145 6789',
    tags: ['Pan dulce', 'Pet friendly', 'WiFi'],
    desc: 'Cafe tranquilo con granos regionales, pan horneado en casa y rincones comodos para descansar.',
  },
  {
    id: 4, name: 'Mercado Gomez Palacio', type: 'Mercado local', category: 'Comida', price: '$', rating: 4.6, reviews: 604,
    img: '/discover-images/mercado-gomez-palacio.svg',
    location: 'Centro', distance: '5 min caminando', pos: [24.0236, -104.6539],
    hours: '7:00 AM - 7:00 PM', phone: '+52 618 156 7890',
    tags: ['Desayunos', 'Compras', 'Tradicion'],
    desc: 'Puestos de comida, dulces regionales, quesos y productos locales con trato directo de comerciantes.',
  },
  {
    id: 5, name: 'Taller de Rebozos La Perla', type: 'Artesanias y textiles', category: 'Artesanias', price: '$$', rating: 4.8, reviews: 93,
    img: '/discover-images/taller-rebozos-la-perla.svg',
    location: 'Calle Constitucion', distance: '12 min caminando', pos: [24.0264, -104.6486],
    hours: '11:00 AM - 8:00 PM', phone: '+52 618 167 8901',
    tags: ['Hecho a mano', 'Souvenirs', 'Taller vivo'],
    desc: 'Espacio para comprar piezas artesanales, conocer el proceso y apoyar a productores duranguenses.',
  },
  {
    id: 6, name: 'Paseo del Viejo Oeste', type: 'Experiencia familiar', category: 'Cultura', price: '$$', rating: 4.7, reviews: 731,
    img: '/discover-images/paseo-viejo-oeste.svg',
    location: 'Carretera Durango-Parral', distance: '18 min en auto', pos: [24.0903, -104.6177],
    hours: '10:00 AM - 7:00 PM', phone: '+52 618 178 9012',
    tags: ['Shows', 'Familias', 'Cine'],
    desc: 'Set cinematografico con espectaculos, fotografia tematica y actividades para todas las edades.',
  },
  {
    id: 7, name: 'Mirador Los Remedios', type: 'Vista panoramica', category: 'Naturaleza', price: 'Gratis', rating: 4.9, reviews: 412,
    img: '/discover-images/mirador-los-remedios.svg',
    location: 'Cerro de los Remedios', distance: '9 min en auto', pos: [24.0341, -104.6694],
    hours: 'Abierto todo el dia', phone: null,
    tags: ['Atardecer', 'Fotos', 'Vista'],
    desc: 'Uno de los mejores puntos para ver la ciudad, ideal para visitas tranquilas y fotografias al atardecer.',
  },
  {
    id: 8, name: 'Restaurante Mezcal y Maiz', type: 'Cocina duranguense', category: 'Comida', price: '$$$', rating: 4.8, reviews: 156,
    img: '/discover-images/mezcal-y-maiz.svg',
    location: 'Av. 20 de Noviembre', distance: '7 min en auto', pos: [24.0304, -104.6419],
    hours: '1:00 PM - 11:00 PM', phone: '+52 618 189 0123',
    tags: ['Reservas', 'Mezcal', 'Cena'],
    desc: 'Menu contemporaneo con ingredientes locales, cocteleria con mezcal y atencion para grupos.',
  },
  {
    id: 9, name: 'Taqueria Los Dorados', type: 'Tacos tradicionales', category: 'Comida', price: '$', rating: 4.7, reviews: 312,
    img: '/discover-images/taqueria-los-dorados.svg',
    location: 'Barrio del Calvario', distance: '7 min caminando', pos: [24.0251, -104.6498],
    hours: '7:00 AM - 4:00 PM', phone: '+52 618 200 1234',
    tags: ['Tacos de canasta', 'Desayuno', 'Economico'],
    desc: 'Los mejores tacos de canasta de Durango desde 1982. Asado de puerco, frijoles y chicharron.',
  },
  {
    id: 10, name: 'Cerveceria Artesanal Durango', type: 'Bar y cerveceria', category: 'Cafe', price: '$$', rating: 4.6, reviews: 224,
    img: '/discover-images/cerveceria-durango.svg',
    location: 'Calle Aquiles Serdan', distance: '10 min caminando', pos: [24.0285, -104.6512],
    hours: '2:00 PM - 12:00 AM', phone: '+52 618 211 2345',
    tags: ['Cervezas locales', 'Ambiente', 'Grupos'],
    desc: 'Cervezas artesanales elaboradas en Durango. 12 variedades en grifo, botanas y musica en vivo los viernes.',
  },
  {
    id: 11, name: 'Parque Guadiana', type: 'Parque y recreacion', category: 'Naturaleza', price: 'Gratis', rating: 4.8, reviews: 890,
    img: '/discover-images/parque-guadiana.svg',
    location: 'Fraccionamiento Guadiana', distance: '12 min en auto', pos: [24.0189, -104.6712],
    hours: '6:00 AM - 9:00 PM', phone: null,
    tags: ['Caminar', 'Familias', 'Ciclismo'],
    desc: 'El parque mas visitado de Durango. Senderos, areas de juego, lago artificial y espacio para deporte al aire libre.',
  },
  {
    id: 12, name: 'Centro Cultural Universitario', type: 'Arte y cultura', category: 'Cultura', price: 'Entrada libre', rating: 4.7, reviews: 178,
    img: '/discover-images/centro-cultural-universitario.svg',
    location: 'Ciudad Universitaria', distance: '15 min en auto', pos: [24.0152, -104.6581],
    hours: '9:00 AM - 7:00 PM', phone: '+52 618 233 4567',
    tags: ['Arte', 'Exposiciones', 'Eventos'],
    desc: 'Exposiciones de arte contemporaneo, presentaciones musicales y obras de teatro en un espacio universitario moderno.',
  },
  {
    id: 13, name: 'Heladeria La Paloma', type: 'Postres y helados', category: 'Comida', price: '$', rating: 4.8, reviews: 542,
    img: '/discover-images/heladeria-la-paloma.svg',
    location: 'Calle 5 de Febrero', distance: '8 min caminando', pos: [24.0272, -104.6526],
    hours: '11:00 AM - 10:00 PM', phone: '+52 618 244 5678',
    tags: ['Helados artesanales', 'Nieves', 'Familiar'],
    desc: 'Helados y nieves artesanales desde 1965. Sabores locales: leche quemada, guayaba, tamarindo y membrillo.',
  },
  {
    id: 14, name: 'Mercado de Artesanias', type: 'Artesanias y recuerdos', category: 'Artesanias', price: '$$', rating: 4.5, reviews: 387,
    img: '/discover-images/mercado-artesanias.svg',
    location: 'Plaza de Armas', distance: '4 min caminando', pos: [24.0268, -104.6535],
    hours: '9:00 AM - 8:00 PM', phone: '+52 618 255 6789',
    tags: ['Recuerdos', 'Ceramica', 'Textiles'],
    desc: 'El mercado de artesanias mas completo del centro. Ceramica, textiles, joyeria y recuerdos hechos por artesanos locales.',
  },
  {
    id: 15, name: 'Jardin Botanico de Durango', type: 'Area natural y flora', category: 'Naturaleza', price: '$', rating: 4.6, reviews: 143,
    img: '/discover-images/jardin-botanico-durango.svg',
    location: 'Zona Norte', distance: '20 min en auto', pos: [24.0462, -104.6453],
    hours: '8:00 AM - 5:00 PM', phone: '+52 618 266 7890',
    tags: ['Flora nativa', 'Educativo', 'Tranquilo'],
    desc: 'Coleccion de plantas nativas del estado de Durango. Recorridos guiados, zona de mariposas y area infantil educativa.',
  },
  {
    id: 16, name: 'Restaurante El Tepehuano', type: 'Cocina regional', category: 'Comida', price: '$$', rating: 4.7, reviews: 267,
    img: '/discover-images/restaurante-tepehuano.svg',
    location: 'Av. Universidad', distance: '11 min en auto', pos: [24.0196, -104.6478],
    hours: '12:00 PM - 10:00 PM', phone: '+52 618 277 8901',
    tags: ['Cocina sierra', 'Asado', 'Familiar'],
    desc: 'Cocina de la Sierra Madre Occidental. Especialidades en venado en salsa de chile pasilla, birria y gallina en mole negro.',
  },
];

export const routePlans = [
  {
    id: 'centro-sabores',
    title: 'Centro, sabores y compras',
    mood: 'Tranquila',
    duration: '3 horas',
    accessibility: 'Poco traslado',
    budget: 'Economica',
    stops: ['Mercado Gomez Palacio', 'Museo Francisco Villa', 'Gorditas Dona Ale', 'Taller de Rebozos La Perla'],
    color: '#0E7C66',
    rating: 4.8,
    totalReviews: 47,
  },
  {
    id: 'familia-cine',
    title: 'Dia familiar cinematografico',
    mood: 'Familiar',
    duration: '5 horas',
    accessibility: 'Auto recomendado',
    budget: 'Media',
    stops: ['Paseo del Viejo Oeste', 'Cafe Analco', 'Mirador Los Remedios'],
    color: '#D16014',
    rating: 4.7,
    totalReviews: 38,
  },
  {
    id: 'atardecer-local',
    title: 'Atardecer local',
    mood: 'Fotografica',
    duration: '4 horas',
    accessibility: 'Ritmo pausado',
    budget: 'Flexible',
    stops: ['Cafe Analco', 'Taller de Rebozos La Perla', 'Mirador Los Remedios', 'Restaurante Mezcal y Maiz'],
    color: '#6C4AB6',
    rating: 4.9,
    totalReviews: 62,
  },
];

export const routeDescriptions = {
  'centro-sabores': 'Comienza en el Mercado Gomez Palacio para desayunar entre comerciantes locales con productos frescos. Recorre el Museo Francisco Villa y conoce la historia del Centauro del Norte. Come gorditas autenticas en Dona Ale con guisos tradicionales duranguenses. Cierra comprando una pieza artesanal en el Taller de Rebozos La Perla.',
  'familia-cine': 'Empieza en el Paseo del Viejo Oeste con shows en vivo, actividades y fotos tematicas para toda la familia. El Cafe Analco ofrece un receso perfecto con pan recien horneado. Cierra el dia contemplando toda la ciudad desde el Mirador Los Remedios durante la hora dorada.',
  'atardecer-local': 'Inicia con un cafe de especialidad en el tranquilo Barrio de Analco. Explora el Taller de Rebozos La Perla y aprende sobre la artesania textil duranguense. Captura el atardecer mas bonito de la ciudad desde el Mirador Los Remedios. Termina con cocina de autor y mezcal regional en Restaurante Mezcal y Maiz.',
};

export const businessReviews = {
  1: [
    { id: 1, user: 'Marta C.', avatar: 'M', rating: 5, comment: 'Las gorditas de asado verde son increibles. Servicio muy rapido y precio justo.', date: 'Mayo 2025' },
    { id: 2, user: 'Jorge H.', avatar: 'J', rating: 5, comment: 'Mejor desayuno del centro. Porciones enormes y sabor autentico.', date: 'Abril 2025' },
  ],
  2: [
    { id: 1, user: 'Elena P.', avatar: 'E', rating: 5, comment: 'Recorrido fascinante. Los guias conocen muy bien la historia.', date: 'Mayo 2025' },
    { id: 2, user: 'Ramon T.', avatar: 'R', rating: 4, comment: 'Exposicion bien organizada. Ideal para ninos tambien.', date: 'Abril 2025' },
  ],
  3: [
    { id: 1, user: 'Camila V.', avatar: 'C', rating: 5, comment: 'El cafe de especialidad es de los mejores. El ambiente es muy tranquilo.', date: 'Mayo 2025' },
    { id: 2, user: 'Diego S.', avatar: 'D', rating: 5, comment: 'El pan dulce casero esta delicioso. Regresare seguro.', date: 'Abril 2025' },
  ],
  4: [
    { id: 1, user: 'Hector B.', avatar: 'H', rating: 4, comment: 'Variedad increible de productos. Los quesos son excelentes.', date: 'Mayo 2025' },
    { id: 2, user: 'Isabel M.', avatar: 'I', rating: 5, comment: 'Ambiente autentico y precios muy buenos. Trato amable.', date: 'Marzo 2025' },
  ],
  5: [
    { id: 1, user: 'Valentina S.', avatar: 'V', rating: 5, comment: 'Los rebozos son obras de arte. Me lleve uno para regalo.', date: 'Abril 2025' },
    { id: 2, user: 'Pablo R.', avatar: 'P', rating: 5, comment: 'Ver el proceso artesanal en vivo es muy especial.', date: 'Marzo 2025' },
  ],
  6: [
    { id: 1, user: 'Fernando L.', avatar: 'F', rating: 5, comment: 'El show del Viejo Oeste es espectacular. Familia encantada.', date: 'Mayo 2025' },
    { id: 2, user: 'Alicia R.', avatar: 'A', rating: 4, comment: 'Las fotos tematicas son muy divertidas para los ninos.', date: 'Abril 2025' },
  ],
  7: [
    { id: 1, user: 'Miguel A.', avatar: 'M', rating: 5, comment: 'El atardecer desde aqui es de los mas bonitos de Durango.', date: 'Mayo 2025' },
    { id: 2, user: 'Gabriela N.', avatar: 'G', rating: 5, comment: 'Vista panoramica espectacular. Vale mucho la subida.', date: 'Abril 2025' },
  ],
  8: [
    { id: 1, user: 'Andres C.', avatar: 'A', rating: 5, comment: 'La cocina duranguense contemporanea es excepcional.', date: 'Mayo 2025' },
    { id: 2, user: 'Sofia M.', avatar: 'S', rating: 5, comment: 'Ambiente increible para una cena especial.', date: 'Abril 2025' },
  ],
  9: [
    { id: 1, user: 'Lucia T.', avatar: 'L', rating: 5, comment: 'Los tacos de canasta son los mejores que he probado en Durango.', date: 'Mayo 2025' },
  ],
  10: [
    { id: 1, user: 'Omar V.', avatar: 'O', rating: 4, comment: 'Excelente seleccion de cervezas locales. El ambiente es muy bueno.', date: 'Mayo 2025' },
  ],
  11: [
    { id: 1, user: 'Patricia N.', avatar: 'P', rating: 5, comment: 'El mejor parque de la ciudad. Ideal para correr o pasear con la familia.', date: 'Mayo 2025' },
  ],
  12: [
    { id: 1, user: 'Alberto G.', avatar: 'A', rating: 5, comment: 'Exposicion de arte muy interesante. La entrada es libre.', date: 'Abril 2025' },
  ],
  13: [
    { id: 1, user: 'Claudia R.', avatar: 'C', rating: 5, comment: 'El helado de leche quemada es increible. Los ninos lo amaron.', date: 'Mayo 2025' },
    { id: 2, user: 'Marco A.', avatar: 'M', rating: 5, comment: 'Sabores originales que no encuentras en otro lado.', date: 'Abril 2025' },
  ],
  14: [
    { id: 1, user: 'Beatriz L.', avatar: 'B', rating: 4, comment: 'Buenos precios en artesanias. Los vendedores son muy amables.', date: 'Mayo 2025' },
  ],
  15: [
    { id: 1, user: 'Rodrigo F.', avatar: 'R', rating: 5, comment: 'Muy educativo para los ninos. La zona de mariposas es espectacular.', date: 'Abril 2025' },
  ],
  16: [
    { id: 1, user: 'Sandra C.', avatar: 'S', rating: 5, comment: 'El venado en salsa de chile pasilla es extraordinario.', date: 'Mayo 2025' },
    { id: 2, user: 'Gustavo M.', avatar: 'G', rating: 4, comment: 'Sabores autenticos de la sierra. Muy buena cocina regional.', date: 'Abril 2025' },
  ],
};

export const routeReviews = {
  'centro-sabores': [
    { id: 1, user: 'Maria R.', avatar: 'M', rating: 5, comment: 'Perfecta para conocer el centro, todo a pie y muy accesible.', date: 'Mayo 2025' },
    { id: 2, user: 'Carlos M.', avatar: 'C', rating: 4, comment: 'Buena ruta, el mercado fue lo mejor. Recomendable para familias.', date: 'Abril 2025' },
    { id: 3, user: 'Sofia L.', avatar: 'S', rating: 5, comment: 'Los rebozos son increibles, me lleve varios de recuerdo.', date: 'Marzo 2025' },
  ],
  'familia-cine': [
    { id: 1, user: 'Pedro A.', avatar: 'P', rating: 5, comment: 'Mis hijos amaron el Viejo Oeste. El cafe de regreso fue perfecto.', date: 'Mayo 2025' },
    { id: 2, user: 'Ana G.', avatar: 'A', rating: 4, comment: 'El mirador al atardecer es espectacular. Vale cada kilometro.', date: 'Abril 2025' },
  ],
  'atardecer-local': [
    { id: 1, user: 'Luis F.', avatar: 'L', rating: 5, comment: 'El atardecer desde Los Remedios es unico. Ruta muy bien pensada.', date: 'Mayo 2025' },
    { id: 2, user: 'Daniela V.', avatar: 'D', rating: 5, comment: 'El mezcal y maiz fue el broche de oro perfecto para la tarde.', date: 'Mayo 2025' },
    { id: 3, user: 'Roberto S.', avatar: 'R', rating: 4, comment: 'Impresionante vista, la ruta esta bien balanceada en tiempo.', date: 'Abril 2025' },
  ],
};

export const accountTypes = [
  { role: 'tourist', title: 'Turista', helper: 'Guarda rutas, lugares favoritos y recomendaciones segun tu tiempo.' },
  { role: 'local', title: 'Habitante local', helper: 'Recomienda joyas de barrio y reporta cambios de horarios.' },
  { role: 'merchant', title: 'Negocio', helper: 'Publica promociones, recibe visitantes y mejora tu ficha.' },
  { role: 'guide', title: 'Guia turistico', helper: 'Crea recorridos, agenda grupos y comparte experiencias.' },
];
