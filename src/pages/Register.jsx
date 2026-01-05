import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Sparkles, Brain } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: e.target.name.value.trim(),
        email: e.target.email.value.trim(),
        password: e.target.password.value
      });

      alert("Registered successfully. Please login.");
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-6">
      {/* Animated background elements */}
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
            
            {/* Brand Name and Tagline */}
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
                Intelligent Resume Analysis
              </p>
            </div>
          </div>
        </div>

        {/* Register Card */}
        <div className="bg-gray-50 rounded-2xl shadow-lg p-7 md:p-8 border border-gray-200">
          {/* Card Header */}
          <div className="mb-8 md:mb-10 text-center md:text-left">
            <h2 className="text-2xl md:text-2xl font-bold text-gray-900 tracking-tight">
              Join SkillScan AI 🚀
            </h2>
            <p className="text-gray-600 mt-1.5 text-sm md:text-base">
              Create your account to unlock AI-powered resume analysis
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 text-sm font-medium leading-tight">
                {error}
              </span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-7">
            {/* Name Field */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-gray-900 pl-0.5">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5 text-gray-500 group-focus-within:text-blue-600" />
                </div>
                <input
                  name="name"
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-900 placeholder-gray-500 text-sm md:text-base hover:border-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                  disabled={loading}
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email Field */}
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
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-900 placeholder-gray-500 text-sm md:text-base hover:border-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pl-0.5">
                <label className="block text-sm font-semibold text-gray-900">
                  Password
                </label>
                <span className="text-xs md:text-sm text-gray-600 font-medium">
                  Minimum 6 characters
                </span>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform">
                  <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-blue-600" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-900 placeholder-gray-500 text-sm md:text-base hover:border-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                  minLength="6"
                  disabled={loading}
                  autoComplete="new-password"
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


            {/* Register Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl font-semibold text-base transition-all duration-300 transform ${
                  loading
                    ? "bg-blue-800 cursor-not-allowed opacity-80"
                    : "bg-blue-800 hover:bg-blue-900 active:scale-[0.99] shadow hover:shadow-md"
                } text-white disabled:cursor-not-allowed relative overflow-hidden group`}
              >
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-600/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                {loading ? (
                  <span className="flex items-center justify-center relative">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="relative flex items-center justify-center gap-2">
                    Create Account
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Login Navigation */}
          <div className="mt-4 md:mt-12 pt-6 md:pt-10 border-t border-gray-300">
            <p className="text-center text-gray-600 font-medium text-sm md:text-base">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors inline-flex items-center gap-2 group"
              >
                <span>Sign in here</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </p>
          </div>
        </div>


      </div>

      {/* CSS Animation */}
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

export default Register;