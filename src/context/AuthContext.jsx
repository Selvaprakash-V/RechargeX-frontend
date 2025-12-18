import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';

const AuthContext = createContext(null);

// Get initial auth state from localStorage (only token and basic info, NOT profile photo)
const getInitialAuthState = () => {
  const storedAuth = localStorage.getItem('rechargex_auth');
  if (storedAuth) {
    try {
      const authData = JSON.parse(storedAuth);
      return {
        userId: authData.userId,
        token: authData.token,
        isLoggedIn: true,
        userRole: authData.userRole,
      };
    } catch {
      localStorage.removeItem('rechargex_auth');
    }
  }
  return { userId: null, token: null, isLoggedIn: false, userRole: null };
};

export const AuthProvider = ({ children }) => {
  const initialState = getInitialAuthState();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(initialState.token);
  const [isLoggedIn, setIsLoggedIn] = useState(initialState.isLoggedIn);
  const [userRole, setUserRole] = useState(initialState.userRole);
  const [loading, setLoading] = useState(initialState.isLoggedIn); // Loading if we need to fetch user

  // Fetch user profile from MongoDB Atlas on mount if logged in
  useEffect(() => {
    const fetchUserFromDB = async () => {
      if (initialState.token && initialState.userId) {
        try {
          const response = await API.get('/users/profile');
          setUser(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Token might be invalid, clear auth
          logout();
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUserFromDB();
  }, []);

  // Save only token and basic info to localStorage (NO profile photo)
  const saveAuthToStorage = (userId, jwtToken, role) => {
    localStorage.setItem('rechargex_auth', JSON.stringify({ 
      userId, 
      token: jwtToken, 
      userRole: role 
    }));
  };

  // User login - authenticate against MongoDB with JWT
  const loginUser = async (email, password) => {
    try {
      const response = await API.post('/users/login', { email, password });
      const data = response.data;
      
      setUser(data.user);
      setToken(data.token);
      setIsLoggedIn(true);
      setUserRole(data.user.role?.toLowerCase() || 'user');
      saveAuthToStorage(data.user._id, data.token, data.user.role?.toLowerCase() || 'user');
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Network error. Please try again.' };
    }
  };

  // Signup - create user in MongoDB with JWT
  const signup = async (userData) => {
    try {
      const response = await API.post('/users/register', { ...userData, role: 'USER' });
      const data = response.data;
      
      setUser(data.user);
      setToken(data.token);
      setIsLoggedIn(true);
      setUserRole('user');
      saveAuthToStorage(data.user._id, data.token, 'user');
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Signup failed' };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem('rechargex_auth');
  };

  // Refresh user data from MongoDB Atlas
  const refreshUser = async () => {
    try {
      const response = await API.get('/users/profile');
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error refreshing user:', error);
      return null;
    }
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      const response = await API.put(`/users/${user._id}`, updatedData);
      setUser(response.data);
      return { success: true, user: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Update failed' };
    }
  };

  const value = {
    user,
    setUser,
    token,
    isLoggedIn,
    userRole,
    loading,
    loginUser,
    signup,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
