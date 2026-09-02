import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDefaultRoute = (rol = user?.rol) => {
    switch (rol) {
      case 'ADMIN':
        return '/admin';
      case 'GERENTE':
        return '/gerente';
      case 'RECEPCIONISTA':
        return '/recepcion';
      default:
        return '/dashboard';
    }
  };

  const hasRole = (role) => user?.rol === role;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, nombres, rol } = response.data;

      localStorage.setItem('token', token);
      const userData = { email, nombres, rol };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Credenciales incorrectas'
      };
    }
  };

  // ✅ NUEVO: Registro de usuario
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/registro', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al registrar usuario'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading,
      isAuthenticated: !!user,
      hasRole,
      getDefaultRoute,
    }}>
      {children}
    </AuthContext.Provider>
  );
};