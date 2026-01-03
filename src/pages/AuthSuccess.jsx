// pages/AuthSuccess.jsx
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
      login(token);
      
      // Redirect to analyze page
      navigate("/analyze", { replace: true });
    } else {
      // No token found, redirect to login
      console.error("No token found in URL");
      navigate("/login", { replace: true });
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">
          Signing you in...
        </h2>
        <p className="text-gray-600 mt-2">
          Please wait while we complete the authentication.
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;
