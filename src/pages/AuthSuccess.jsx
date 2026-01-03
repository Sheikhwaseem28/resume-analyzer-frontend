// // pages/AuthSuccess.jsx
// import { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext";

// const AuthSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = searchParams.get("token");
    
//     if (token) {
//       login(token);
      
//       // Redirect to analyze page
//       navigate("/analyze", { replace: true });
//     } else {
//       // No token found, redirect to login
//       console.error("No token found in URL");
//       navigate("/login", { replace: true });
//     }
//   }, [searchParams, login, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//         <h2 className="text-xl font-semibold text-gray-800">
//           Signing you in...
//         </h2>
//         <p className="text-gray-600 mt-2">
//           Please wait while we complete the authentication.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AuthSuccess;

// AuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (token) {
      try {
        login(token);
        // Optional: Store token in localStorage for persistence
        localStorage.setItem("token", token);
        
        // Redirect to analyze page
        setTimeout(() => {
          navigate("/analyze", { replace: true });
        }, 1000);
      } catch (error) {
        console.error("Login error:", error);
        navigate("/login", { 
          replace: true,
          state: { error: "Authentication failed" }
        });
      }
    } else {
      console.error("No token found in URL");
      navigate("/login", { 
        replace: true,
        state: { error: "No authentication token received" }
      });
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 flex items-center justify-center">
      <div className="text-center bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-white">
          Completing Sign In...
        </h2>
        <p className="text-slate-300 mt-2">
          Please wait while we redirect you.
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;
