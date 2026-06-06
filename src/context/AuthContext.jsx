import { useState } from 'react';
import { AuthContext } from './authStore';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = window.localStorage.getItem('durangoLocalUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const saveUser = (nextUser) => {
    setUser(nextUser);
    window.localStorage.setItem('durangoLocalUser', JSON.stringify(nextUser));
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
  };

  const loginWithRole = (role, name, extra = {}) => {
    saveUser({ role, name, username: name, interests: extra.interests || [], accountGoal: extra.accountGoal || '' });
  };

  const updateUser = (updates) => {
    saveUser({ ...user, ...updates, name: updates.username || updates.name || user?.name });
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem('durangoLocalUser');
  };

  return (
    <AuthContext.Provider value={{ user, loginAsGuest, createAccount, loginWithGoogle, loginWithRole, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
