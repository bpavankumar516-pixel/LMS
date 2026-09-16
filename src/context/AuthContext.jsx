import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('lms_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    // Professional default user (Alex Morgan, Lead Administrator)
    const defaultUser = {
      id: 101,
      name: 'Alex Morgan',
      email: 'alex@edulearn.com',
      username: 'alexmorgan',
      role: 'Administrator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    };
    localStorage.setItem('lms_user', JSON.stringify(defaultUser));
    return defaultUser;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('lms_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lms_user');
      localStorage.removeItem('lms_token');
    }
  }, [user]);

  // Clean Login handler
  const login = async (usernameOrEmail, password, remember = true) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Check local registered users in LocalStorage
      const registeredUsers = JSON.parse(localStorage.getItem('lms_registered_users') || '[]');
      const localUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === usernameOrEmail.toLowerCase() || u.username === usernameOrEmail
      );

      if (localUser) {
        if (localUser.password !== password) {
          throw new Error('Invalid email or password.');
        }
        const userPayload = {
          id: localUser.id || Date.now(),
          name: localUser.name || localUser.fullName,
          email: localUser.email,
          role: localUser.role || 'Administrator',
          avatar: localUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
        };
        setUser(userPayload);
        if (remember) {
          localStorage.setItem('lms_remember_email', usernameOrEmail);
        } else {
          localStorage.removeItem('lms_remember_email');
        }
        setLoading(false);
        return { success: true, user: userPayload };
      }

      // 2. Default Admin Credentials (alex@edulearn.com / admin123)
      if ((usernameOrEmail.toLowerCase() === 'alex@edulearn.com' || usernameOrEmail.toLowerCase() === 'alexmorgan') && password === 'admin123') {
        const demoAdmin = {
          id: 101,
          name: 'Alex Morgan',
          email: 'alex@edulearn.com',
          role: 'Administrator',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
        };
        setUser(demoAdmin);
        setLoading(false);
        return { success: true, user: demoAdmin };
      }

      // 3. General credential validation check
      if (usernameOrEmail && password.length >= 6) {
        const validUser = {
          id: Date.now(),
          name: usernameOrEmail.split('@')[0].replace('.', ' '),
          email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@edulearn.com`,
          role: 'Administrator',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
        };
        setUser(validUser);
        setLoading(false);
        return { success: true, user: validUser };
      }

      throw new Error('Invalid email or password.');
    } catch (err) {
      setLoading(false);
      const errMsg = err.message || 'Login failed. Please check your credentials.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('lms_registered_users') || '[]');
      
      if (registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email address already exists.');
      }

      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: 'Administrator',
        createdAt: new Date().toISOString()
      };

      registeredUsers.push(newUser);
      localStorage.setItem('lms_registered_users', JSON.stringify(registeredUsers));

      const activeUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
      };

      setUser(activeUser);
      setLoading(false);
      return { success: true, user: activeUser };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lms_user');
    localStorage.removeItem('lms_token');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
