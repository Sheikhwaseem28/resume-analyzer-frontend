import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, Calendar, Key, User, Shield, Settings, CreditCard } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

const UserProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.token) {
        try {
          const decoded = jwtDecode(user.token);
          
          if (decoded.name && decoded.email) {
            setUserInfo(decoded);
            setLoading(false);
          } else {
            try {
              const response = await api.get("/users/profile");
              setUserInfo(response.data.user);
            } catch (apiError) {
              console.error("Failed to fetch user profile:", apiError);
              setUserInfo({ id: decoded.id });
            }
            setLoading(false);
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    navigate("/login");
  };

  const getUserDisplayName = () => {
    if (userInfo?.name) return userInfo.name;
    if (userInfo?.email) {
      const emailPrefix = userInfo.email.split('@')[0];
      const nameParts = emailPrefix.split(/[._]/);
      return nameParts.map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join(' ');
    }
    return "User";
  };

  const getUserEmail = () => {
    return userInfo?.email || "No email provided";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserAvatar = () => {
    if (userInfo?.profileImage && userInfo?.authProvider === "google") {
      return (
        <div className="relative">
          <img 
            src={userInfo.profileImage} 
            alt={getUserDisplayName()}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-lg ring-2 ring-white"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
      );
    }
    
    return (
      <div className="relative">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-white">
          <span className="text-sm sm:text-base">{getUserInitials()}</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
    );
  };

  const getLargeAvatar = () => {
    if (userInfo?.profileImage && userInfo?.authProvider === "google") {
      return (
        <div className="relative">
          <img 
            src={userInfo.profileImage} 
            alt={getUserDisplayName()}
            className="w-14 h-14 rounded-full object-cover shadow-lg ring-3 ring-blue-100"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white"></div>
        </div>
      );
    }
    
    return (
      <div className="relative">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ring-3 ring-blue-100">
          <span>{getUserInitials()}</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white"></div>
      </div>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp < 10000000000 ? new Date(timestamp * 1000) : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAuthSourceBadge = () => {
    if (userInfo?.authProvider === "google") {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center justify-center w-7 h-7 bg-white rounded-full shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Signed in with</p>
            <p className="text-sm font-semibold text-blue-700">Google</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center justify-center w-7 h-7 bg-white rounded-full shadow-sm">
            <Key className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Signed in with</p>
            <p className="text-sm font-semibold text-gray-700">Email</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-gray-50"
        aria-label="User menu"
      >
        {getUserAvatar()}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {getUserDisplayName()}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-[120px]">
            {getUserEmail()}
          </p>
        </div>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-3 z-50 animate-fadeIn backdrop-blur-sm bg-white/95">
          {/* Header Section */}
          <div className="px-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              {getLargeAvatar()}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {loading ? "Loading..." : getUserDisplayName()}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-600 truncate">
                    {getUserEmail()}
                  </p>
                </div>
              </div>
            </div>
            
            {getAuthSourceBadge()}
            
            {(userInfo?.iat || userInfo?.createdAt) && !loading && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Member since</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {formatDate(userInfo.iat || userInfo.createdAt)}
                  </p>
                </div>
              </div>
            )}
          </div>


          {/* Sign Out Section */}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-150 group"
            >
              <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-semibold">Sign Out</span>
              <svg className="ml-auto w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SA</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">SkillScan AI</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-600">Account ID</p>
                <p className="text-xs font-mono text-gray-400">
                  {userInfo?.id ? userInfo.id.slice(-8).toUpperCase() : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default UserProfileDropdown;