import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Sparkles, Brain } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token);
      navigate("/analyze", { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

const handleGoogleLogin = () => {
  // Use the full backend URL for Google OAuth
  const backendUrl = import.meta.env.VITE_API_URL;
  window.location.href = `${backendUrl}/api/auth/google`;
};



  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-6">
      {/* Animated background elements - Updated colors */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-blue-50 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-[420px] mx-auto relative z-10">
        {/* Brand Header - Left aligned with logo and name */}
        <div className="mb-10 md:mb-12 animate-fade-in">
          <div className="flex items-center gap-4 md:gap-5">
            {/* SkillScan AI Logo - Updated to dark blue */}
            <div className="flex-shrink-0">
              <div className="relative w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 rounded-2xl shadow-lg">
                <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 text-white" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-blue-300" />
              </div>
            </div>
            
            {/* Brand Name and Tagline - Updated colors */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  SkillScan
                </h1>
                <span className="text-sm md:text-base font-semibold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                  AI
                </span>
              </div>
              <p className="text-gray-600 font-medium text-sm md:text-base tracking-wide mt-1">
                Intelligent Resume Analyzer
              </p>
            </div>
          </div>
        </div>

        {/* Login Card - Updated to use light gray background */}
        <div className="bg-gray-50 rounded-2xl shadow-lg p-7 md:p-8 border border-gray-200">
          {/* Card Header */}
          <div className="mb-8 md:mb-10 text-center md:text-left">
            <h2 className="text-2xl md:text-2xl font-bold text-gray-900 tracking-tight">
              Welcome Back 👋
            </h2>
            <p className="text-gray-600 mt-1.5 text-sm md:text-base">
              Sign in to access your AI-powered resume analyzer
            </p>
          </div>

          {/* Error Message - Updated colors */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 text-sm font-medium leading-tight">
                {error}
              </span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-7">
            {/* Email Field - Updated colors */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-gray-900 pl-0.5">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-blue-600" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-900 placeholder-gray-500 text-sm md:text-base hover:border-gray-400 disabled:opacity-60 disabled:cursor-not-allowed group"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field - Updated colors */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pl-0.5">
                <label className="block text-sm font-semibold text-gray-900">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform">
                  <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-blue-600" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-900 placeholder-gray-500 text-sm md:text-base hover:border-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors p-1 hover:scale-110"
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Primary Sign In Button - Updated to dark blue */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl font-semibold text-base transition-all duration-300 transform ${
                  loading
                    ? "bg-blue-800 cursor-not-allowed opacity-80"
                    : "bg-blue-800 hover:bg-blue-900 active:scale-[0.99] shadow hover:shadow-md"
                } text-white disabled:cursor-not-allowed relative overflow-hidden group`}
              >
                {/* Button Glow Effect - Updated color */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-600/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                {loading ? (
                  <span className="flex items-center justify-center relative">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="relative flex items-center justify-center gap-2">
                    Sign In
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </div>

            {/* Divider - Updated to cool gray */}
            <div className="relative my-6 md:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-gray-50 text-gray-600 text-sm font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Secondary Google Login Button - White with border */}
            <div>
             <button
  type="button"
  onClick={handleGoogleLogin}
  disabled={loading}
  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-300 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 active:scale-[0.99] shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
>
                {/* Subtle hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100/0 via-gray-100/20 to-gray-100/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                <svg className="w-5 h-5 flex-shrink-0 relative" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium text-sm md:text-base relative">
                  Continue with Google
                </span>
              </button>
            </div>
          </form>

          {/* Register Link - Updated to use light blue for links */}
          <div className="mt-5 md:mt-12 pt-6 md:pt-10 border-t border-gray-300">
            <p className="text-center text-gray-600 font-medium text-sm md:text-base">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors inline-flex items-center gap-2 group"
              >
                <span>Create account</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Add this to your global CSS or component CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;