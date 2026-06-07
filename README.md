# Durango Guide — Expo Go

## Setup

```bash
npm install
npx expo start
```

Escanea el QR con la app **Expo Go** en tu celular.

## Estructura

```
app/
  _layout.jsx          # Root layout: fuentes + auth provider
  index.jsx            # Redirect a auth o tabs
  auth.jsx             # Pantalla de login / registro
  (tabs)/
    _layout.jsx        # Bottom nav pill animada
    index.jsx          # Descubre — grid de lugares
    map.jsx            # Mapa con react-native-maps
    routes.jsx         # Rutas expandibles
    profile.jsx        # Perfil editable

src/
  context/AuthContext.js   # Auth con AsyncStorage
  data/durango.js          # Datos sin cambios del proyecto web
  theme/theme.js           # Colores, radios, sombras
```

## Dependencias clave

| Librería | Uso |
|---|---|
| expo-router | File-based routing |
| react-native-maps | Mapa con marcadores |
| @expo-google-fonts/outfit | Tipografía Outfit |
| @react-native-async-storage | Persistencia de sesión |
| expo-linear-gradient | Fondo en AuthGateway |
| react-native-safe-area-context | Safe areas iOS/Android |

## Notas

- `react-native-maps` en Expo Go usa la implementación de Google Maps en Android
  y Apple Maps en iOS. No requiere API key para uso básico en Expo Go.
- Los datos de `durango.js` son idénticos al proyecto web original.
