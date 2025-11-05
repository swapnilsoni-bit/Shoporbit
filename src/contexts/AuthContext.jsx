import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGuest, setIsGuest] = useState(true); // ✅ NEW - Guest Mode

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setIsGuest(false); // ✅ NEW - User is logged in
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
        setIsGuest(true); // ✅ NEW - Default to guest
      }
    } else {
      setIsGuest(true); // ✅ NEW - No user = guest mode
    }
    setLoading(false);
  }, []);

  // ✅ NEW - Login with username and password
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      // API Call to FakeStore Auth endpoint
      const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      if (data.token) {
        // Success - store user and token
        const userData = {
          username: username,
          token: data.token,
          email: `${username}@fakestoreapi.com`,
          loginTime: new Date().toISOString(),
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', data.token);
        setUser(userData);
        setIsAuthenticated(true);
        setIsGuest(false); // ✅ NEW - Not guest anymore
        setError(null);
        return true;
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Try: mor_2314 / 83r5^_';
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      setIsGuest(true); // ✅ NEW - Back to guest on error
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW - Register (for simple registration)
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Simple registration (no backend needed for demo)
      const userData = {
        name: name,
        email: email,
        token: 'demo-token-' + Date.now(),
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', userData.token);
      setUser(userData);
      setIsAuthenticated(true);
      setIsGuest(false); // ✅ NEW - Not guest after register
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      setIsGuest(true); // ✅ NEW - Back to guest on error
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(true); // ✅ NEW - Back to guest mode
    setError(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    isGuest, // ✅ NEW - Export guest mode
    login,
    register, // ✅ NEW - Export register
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
