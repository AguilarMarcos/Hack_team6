import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('durangoUser').then((val) => {
      if (val) setUser(JSON.parse(val));
      setLoading(false);
    });
  }, []);

  const saveUser = async (next) => {
    setUser(next);
    await AsyncStorage.setItem('durangoUser', JSON.stringify(next));
  };

  const loginAsGuest = () => saveUser({
    role: 'guest', name: 'Visitante', username: 'Visitante',
    email: '', gender: '', interests: ['Explorar'],
  });

  const createAccount = ({ email, gender, username, interests }) => saveUser({
    role: 'user', name: username, username, email, gender, interests,
  });

  const loginWithGoogle = () => saveUser({
    role: 'user', name: 'Usuario Google', username: 'usuario.google',
    email: 'usuario@gmail.com', gender: 'Prefiero no decirlo',
    interests: ['Comida local', 'Cafes', 'Museos'],
  });

  const updateUser = (updates) => saveUser({
    ...user, ...updates,
    name: updates.username || updates.name || user?.name,
  });

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('durangoUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAsGuest, createAccount, loginWithGoogle, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
