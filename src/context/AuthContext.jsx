import { useState } from 'react';
import { AuthContext } from './authStore';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const s = window.sessionStorage.getItem('durangoLocalUser');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const saveUser = (nextUser) => {
    setUser(nextUser);
    try { window.sessionStorage.setItem('durangoLocalUser', JSON.stringify(nextUser)); } catch { /* silent */ }
  };

  const loginAsGuest = () => {
    saveUser({
      role: 'guest',
      name: 'Visitante',
      username: 'Visitante',
      email: '',
      gender: '',
      interests: ['Explorar'],
      limitations: ['Sin rutas', 'Sin como llegar', 'Sin calificaciones'],
    });
  };

  const createAccount = ({ email, gender, username, interests }) => {
    saveUser({
      role: 'user',
      name: username,
      username,
      email,
      gender,
      interests,
      accountGoal: 'Cuenta completa con rutas, como llegar y calificaciones.',
    });
  };

  const loginWithGoogle = () => {
    saveUser({
      role: 'user',
      name: 'Usuario Google',
      username: 'usuario.google',
      email: 'usuario@gmail.com',
      gender: 'Prefiero no decirlo',
      interests: ['Comida local', 'Cafes', 'Museos'],
      accountGoal: 'Cuenta completa con rutas, como llegar y calificaciones.',
      provider: 'google',
    });
    window.history.replaceState(null, '', '/');
  };

  const loginWithRole = (role, name, extra = {}) => {
    saveUser({ role, name, username: name, interests: extra.interests || [], accountGoal: extra.accountGoal || '' });
  };

  const updateUser = (updates) => {
    saveUser({ ...user, ...updates, name: updates.username || updates.name || user?.name });
  };

  const logout = () => {
    setUser(null);
    // Limpia sesión y todos los datos de la app
    try { window.sessionStorage.clear(); } catch { /* silent */ }
    try {
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith('durango'))
        .forEach((k) => window.localStorage.removeItem(k));
    } catch { /* silent */ }
  };

  return (
    <AuthContext.Provider value={{ user, loginAsGuest, createAccount, loginWithGoogle, loginWithRole, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
