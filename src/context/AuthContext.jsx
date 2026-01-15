import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verificar si el token sigue siendo válido
        verificarToken(storedToken);
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Verificar validez del token con el backend
  const verificarToken = async (authToken) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verificar', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Token inválido o expirado
        console.warn('Token inválido o expirado');
        logout();
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      // No hacemos logout aquí para no cerrar sesión si hay problemas de red
    }
  };

  // Login con el token y datos del usuario desde la API
  const login = (authToken, userData) => {
    setToken(authToken);
    setUser({
      id: userData.id,
      name: userData.nombre,
      usuario: userData.usuario,
      dni: userData.dni,
      role: 'Usuario', // Puedes ajustar según tu lógica
      avatar: userData.nombre.charAt(0).toUpperCase()
    });
    
    // Guardar en localStorage (persiste entre pestañas y recargas)
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify({
      id: userData.id,
      name: userData.nombre,
      usuario: userData.usuario,
      dni: userData.dni,
      role: 'Usuario',
      avatar: userData.nombre.charAt(0).toUpperCase()
    }));
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Limpiar almacenamiento
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user'); // Limpiar también sessionStorage por compatibilidad
  };

  // Función helper para obtener headers autorizados
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
    getAuthHeaders // Útil para hacer peticiones autenticadas
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};