// // auth/AuthContext.jsx
// import { createContext, useContext, useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem("token");
      
//       if (token) {
//         try {
//           // Decode token to get basic user info
//           const decoded = jwtDecode(token);
          
//           // Get additional user data from localStorage if available
//           const userData = localStorage.getItem("userData");
//           const fullUserData = userData ? JSON.parse(userData) : {};
          
//           setUser({ 
//             token,
//             id: decoded.id,
//             email: decoded.email,
//             analysisCount: decoded.analysisCount || 0,
//             ...fullUserData
//           });
//         } catch (error) {
//           console.error("Invalid token:", error);
//           localStorage.removeItem("token");
//           localStorage.removeItem("userData");
//           setUser(null);
//         }
//       }
//       setLoading(false);
//     };

//     checkAuth();
//   }, []);

//   const login = (token, userData) => {
//     localStorage.setItem("token", token);
    
//     if (userData) {
//       localStorage.setItem("userData", JSON.stringify(userData));
//     }
    
//     try {
//       const decoded = jwtDecode(token);
//       setUser({ 
//         token,
//         id: decoded.id,
//         email: decoded.email,
//         analysisCount: decoded.analysisCount || 0,
//         ...userData
//       });
//     } catch (error) {
//       console.error("Invalid token:", error);
//       localStorage.removeItem("token");
//       localStorage.removeItem("userData");
//     }
//   };

//   const logout = () => {
//     console.log("Logging out");
//     localStorage.removeItem("token");
//     localStorage.removeItem("userData");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       login, 
//       logout, 
//       loading
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          // Decode token to get basic user info
          const decoded = jwtDecode(token);
          
          // Get additional user data from localStorage if available
          const userData = localStorage.getItem("userData");
          const fullUserData = userData ? JSON.parse(userData) : {};
          
          setUser({ 
            token,
            id: decoded.id,
            email: decoded.email,
            analysisCount: decoded.analysisCount || 0,
            ...fullUserData
          });
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
    
    try {
      const decoded = jwtDecode(token);
      setUser({ 
        token,
        id: decoded.id,
        email: decoded.email,
        analysisCount: decoded.analysisCount || 0,
        ...userData
      });
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);