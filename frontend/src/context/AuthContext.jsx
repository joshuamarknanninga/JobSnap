import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import apiClient, { setAuthToken } from '../api/client';

const AuthContext = createContext(null);

const tokenKey = 'jobsnap_token';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(tokenKey));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      apiClient
        .get('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          setToken(null);
          localStorage.removeItem(tokenKey);
          setAuthToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (payload) => {
    const res = await apiClient.post('/auth/login', payload);
    setToken(res.data.token);
    localStorage.setItem(tokenKey, res.data.token);
    setAuthToken(res.data.token);
    setUser({ _id: res.data._id, name: res.data.name, email: res.data.email, business: res.data.business });
  };

  const register = async (payload) => {
    const res = await apiClient.post('/auth/register', payload);
    setToken(res.data.token);
    localStorage.setItem(tokenKey, res.data.token);
    setAuthToken(res.data.token);
    setUser({ _id: res.data._id, name: res.data.name, email: res.data.email, business: res.data.business });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(tokenKey);
    setAuthToken(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, isAuthenticated: Boolean(token), login, register, logout }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
