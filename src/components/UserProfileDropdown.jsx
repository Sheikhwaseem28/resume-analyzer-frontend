import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Mail, Calendar, Shield } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const UserProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.token) {
      try {
        const decoded = jwtDecode(user.token);
        setUserInfo(decoded);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, [user]);

  // Close dropdown when clicking outside
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

  // Extract initials from email or token
  const getUserInitials = () => {
    if (userInfo?.email) {
      return userInfo.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (userInfo?.name) {
      return userInfo.name;
    }
    if (userInfo?.email) {
      return userInfo.email.split('@')[0];
    }
    return "User";
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 sm:p-2 rounded-full hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 border border-transparent hover:border-gray-300"
        aria-label="User menu"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 rounded-full flex items-center justify-center text-white font-semibold shadow">
          <span className="text-sm sm:text-base">{getUserInitials()}</span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 sm:mt-2 w-72 sm:w-80 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-300 py-2 z-50 animate-fadeIn">
          {/* User Info */}
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-300">
            <div className="flex items-center gap-3 sm:gap-4 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow flex-shrink-0">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {getUserDisplayName()}
                </p>
                {userInfo?.email && (
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 truncate mt-0.5">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="truncate">{userInfo.email}</span>
                  </div>
                )}
              </div>
            </div>
            
            {userInfo?.iat && (
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Member since {formatDate(userInfo.iat)}</span>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1 sm:py-2">
            <div className="px-3 sm:px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account
            </div>
            

            <div className="border-t border-gray-300 my-1.5 sm:my-2"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 sm:px-5 py-2.5 text-sm sm:text-base text-red-600 hover:bg-red-50 transition-all duration-150 hover:text-red-700 group"
            >
              <div className="p-1.5 bg-red-100 rounded-lg group-hover:bg-red-200">
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span>Sign Out</span>
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-5 py-2.5 border-t border-gray-300">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>SkillScan<span className="text-blue-700">AI</span></span>
              <span className="bg-gray-100 px-2 py-0.5 rounded-full border border-gray-300">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;