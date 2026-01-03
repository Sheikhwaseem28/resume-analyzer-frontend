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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 flex items-center justify-center p-4 md:p-6">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-[420px] mx-auto relative z-10">
        {/* Brand Header - Left aligned with logo and name */}
        <div className="mb-10 md:mb-12 animate-fade-in">
          <div className="flex items-center gap-4 md:gap-5">
            {/* SkillScan AI Logo */}
            <div className="flex-shrink-0">
              <div className="relative w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl shadow-2xl ring-2 ring-purple-500/30 shadow-purple-500/20">
                <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 text-white" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-pink-300" />
              </div>
            </div>
            
            {/* Brand Name and Tagline */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  SkillScan
                </h1>
                <span className="text-sm md:text-base font-semibold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                  AI
                </span>
              </div>
              <p className="text-slate-300 font-medium text-sm md:text-base tracking-wide mt-1">
                Intelligent Resume Analysis
              </p>
            </div>
          </div>
        </div>

        {/* Premium Register Card */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl p-7 md:p-8 border border-slate-700/50">
          {/* Card Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-pink-500/10 rounded-2xl -z-10"></div>
          
          {/* Card Header */}
          <div className="mb-8 md:mb-10 text-center md:text-left">
            <h2 className="text-2xl md:text-2xl font-bold text-white tracking-tight">
              Join SkillScan AI 🚀
            </h2>
            <p className="text-slate-400 mt-1.5 text-sm md:text-base">
              Create your account to unlock AI-powered resume analysis
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-900/30 to-pink-900/20 border border-red-800/30 rounded-xl flex items-start space-x-3 animate-fadeIn backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-red-200 text-sm font-medium leading-tight">
                {error}
              </span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-7">
            {/* Name Field */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-slate-200 pl-0.5">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5 text-slate-400 group-focus-within:text-violet-400" />
                </div>
                <input
                  name="name"
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/40 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 focus:bg-slate-900/60 transition-all duration-200 outline-none text-white placeholder-slate-500 text-sm md:text-base hover:border-slate-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                  disabled={loading}
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-slate-200 pl-0.5">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-violet-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/40 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 focus:bg-slate-900/60 transition-all duration-200 outline-none text-white placeholder-slate-500 text-sm md:text-base hover:border-slate-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pl-0.5">
                <label className="block text-sm font-semibold text-slate-200">
                  Password
                </label>
                <span className="text-xs md:text-sm text-slate-500 font-medium">
                  Minimum 6 characters
                </span>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform">
                  <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-violet-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-900/40 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 focus:bg-slate-900/60 transition-all duration-200 outline-none text-white placeholder-slate-500 text-sm md:text-base hover:border-slate-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                  minLength="6"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-violet-300 transition-colors p-1 hover:scale-110"
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
                    ? "bg-gradient-to-r from-violet-700 to-purple-700 cursor-not-allowed opacity-80"
                    : "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 active:scale-[0.99] shadow-lg hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5"
                } text-white disabled:cursor-not-allowed relative overflow-hidden group`}
              >
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 via-transparent to-fuchsia-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
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
          <div className="mt-4 md:mt-12 pt-6 md:pt-10 border-t border-slate-700/50">
            <p className="text-center text-slate-400 font-medium text-sm md:text-base">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-violet-400 hover:text-violet-300 font-semibold hover:underline transition-colors inline-flex items-center gap-2 group"
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