// auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Check for token on initial load
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      
      if (token) {
        // You might want to validate the token here
        // For now, just set user to true if token exists
        setUser({ token }); // Store token in user object
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser({ token });
  };

  const logout = () => {
    console.log("Logging out");
    localStorage.removeItem("token");
    setUser(null);
  };

  // Add token validation if needed
  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    // You can add API call to validate token here
    // For now, we'll just check if it exists
    setUser({ token });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading // Export loading state
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);