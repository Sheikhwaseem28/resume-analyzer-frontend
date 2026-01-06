import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ResumeUpload from "../components/ResumeUpload";
import AnalysisResult from "../components/AnalysisResult";
import UserProfileDropdown from "../components/UserProfileDropdown";
import { useAuth } from "../auth/AuthContext";
import { Upload, Sparkles, AlertCircle, CheckCircle, Brain, Shield, Mail, RefreshCw, LogOut } from "lucide-react";

const Analyze = () => {
  const [resumeId, setResumeId] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [analysisCount, setAnalysisCount] = useState(0);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Load user's analysis count
  useEffect(() => {
    const loadUserData = async () => {
      if (user && user.token) {
        try {
          // Decode token to get analysisCount
          const tokenData = JSON.parse(atob(user.token.split('.')[1]));
          if (tokenData.analysisCount !== undefined) {
            setAnalysisCount(tokenData.analysisCount);
          }
          
          // Also fetch fresh data from server
          const token = localStorage.getItem("token");
          const response = await api.get("/users/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.user?.analysisCount !== undefined) {
            setAnalysisCount(response.data.user.analysisCount);
          }
        } catch (error) {
          if (error.response?.status === 401) {
            setShowSessionExpired(true);
          }
        }
      }
    };
    
    loadUserData();
  }, [user]);

  const analyze = async () => {
    if (!resumeId) {
      setError("Please upload a resume first");
      return;
    }

    if (!jd.trim()) {
      setError("Please enter a job description");
      return;
    }

    const remaining = 15 - analysisCount;
    if (remaining <= 0) {
      setError("You have used all 15 free analyses. Contact support for more.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setShowSessionExpired(false);

      const token = localStorage.getItem("token");
      
      // Check if token exists
      if (!token) {
        setError("Please login to continue");
        setShowSessionExpired(true);
        return;
      }

      // Decode token to check expiry
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = tokenData.exp * 1000;
        const currentTime = Date.now();
        
        if (currentTime > expiryTime) {
          setError("Your session has expired. Please login again.");
          setShowSessionExpired(true);
          return;
        }
      } catch (decodeError) {
        setError("Invalid session. Please login again.");
        setShowSessionExpired(true);
        return;
      }

      const res = await api.post(
        "/analyze",
        {
          resumeId,
          jobDescription: jd
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update analysis count
      if (res.data.analysisCount !== undefined) {
        setAnalysisCount(res.data.analysisCount);
      }
      
      setResult(res.data.data);
      
    } catch (err) {
      if (err.response?.status === 429) {
        // Rate limit exceeded
        const errorMsg = err.response.data.message || "You have reached your analysis limit.";
        setError(errorMsg);
        
        if (err.response.data.used !== undefined) {
          setAnalysisCount(err.response.data.used);
        }
      } else if (err.response?.status === 401) {
        const backendMessage = err.response.data?.message || "Authentication failed";
        setShowSessionExpired(true);
        setError(`${backendMessage}. Click 'Login Again' to continue.`);
      } else if (err.response?.status === 403) {
        setError("You don't have permission to perform this action.");
      } else if (err.code === 'ERR_NETWORK') {
        setError("Network error. Please check your connection.");
      } else {
        setError(
          err.response?.data?.message ||
          "Analysis failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => {
    setError("");
    setShowSessionExpired(false);
  };

  const handleResumeUploaded = (id, fileName) => {
    setResumeId(id);
    setUploadedFileName(fileName);
    setError("");
    setShowSessionExpired(false);
  };

  const refreshAnalysisCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowSessionExpired(true);
        return;
      }
      
      const response = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.user?.analysisCount !== undefined) {
        setAnalysisCount(response.data.user.analysisCount);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setShowSessionExpired(true);
      }
    }
  };

  const handleLoginAgain = () => {
    logout();
    navigate("/login", { state: { from: "/analyze" } });
  };

  const remainingAnalyses = 15 - analysisCount;
  const usedPercentage = (analysisCount / 15) * 100;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-50 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 rounded-xl shadow">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  SkillScan<span className="text-blue-700">AI</span>
                </h1>
                <p className="text-xs text-gray-600">Intelligent Resume Analyzer</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Analysis Counter Display */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {remainingAnalyses}/15 analyses left
                </span>
                <button 
                  onClick={refreshAnalysisCount}
                  className="p-1 hover:bg-blue-100 rounded"
                  title="Refresh count"
                >
                  <RefreshCw className="w-3 h-3 text-blue-500" />
                </button>
              </div>
              
              <div className="flex items-center">
                {user ? (
                  <UserProfileDropdown user={user} onLogout={logout} />
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-800 text-white rounded-xl hover:bg-blue-900 transition-all duration-200 font-medium shadow hover:shadow-md"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Analysis Counter Card */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white border border-blue-300 rounded-xl shadow-sm">
                  <Shield className="w-8 h-8 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Your Analysis Credits</h2>
                  <p className="text-gray-700">
                    Each user gets <span className="font-bold text-blue-700">15 free AI analyses</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-800">{remainingAnalyses}</div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">{analysisCount}</div>
                  <div className="text-sm text-gray-600">Used</div>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress: {analysisCount} of 15 analyses used</span>
                <span>{Math.round(usedPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    remainingAnalyses > 5 ? 'bg-green-500' : 
                    remainingAnalyses > 0 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${usedPercentage}%` }}
                ></div>
              </div>
              <div className="mt-3 flex justify-between">
                <div className="text-sm">
                  {remainingAnalyses === 0 ? (
                    <span className="text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      All analyses used
                    </span>
                  ) : remainingAnalyses <= 5 ? (
                    <span className="text-yellow-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {remainingAnalyses} analysis{remainingAnalyses !== 1 ? 'es' : ''} remaining
                    </span>
                  ) : (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {remainingAnalyses} analyses available
                    </span>
                  )}
                </div>
                <button 
                  onClick={refreshAnalysisCount}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
              </div>
            </div>
            
            {/* Session Expired Warning */}
            {showSessionExpired && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-orange-800 mb-2">Session Expired</p>
                    <p className="text-sm text-orange-700 mb-3">
                      Your session has expired. Please login again to continue using the analysis feature.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleLoginAgain}
                        className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Login Again
                      </button>
                      <button
                        onClick={() => setShowSessionExpired(false)}
                        className="px-4 py-2 text-sm font-medium text-orange-700 hover:text-orange-900"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Analysis Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 mb-8 border border-gray-300">
            {/* Resume Upload Section */}
            <div className="mb-10 sm:mb-12">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="p-2.5 sm:p-3 bg-blue-100 rounded-xl border border-blue-300">
                  <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    1. Upload Your Resume
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    PDF or DOCX format • Max 5MB
                  </p>
                </div>
              </div>
              
              <ResumeUpload 
                setResumeId={handleResumeUploaded} 
                setFileName={setUploadedFileName}
              />
              
              {uploadedFileName && (
                <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-lg truncate">{uploadedFileName}</p>
                      <p className="text-xs sm:text-sm text-green-700 mt-0.5">Ready for AI-powered analysis</p>
                    </div>
                    <div className="px-3 sm:px-4 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-medium rounded-full border border-green-300 whitespace-nowrap">
                      ✓ Upload Complete
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Job Description Section */}
            <div className="mb-10 sm:mb-12">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="p-2.5 sm:p-3 bg-blue-100 rounded-xl border border-blue-300">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
                    <span className="text-base sm:text-lg font-bold text-blue-700">2</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Enter Job Description
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Paste the job description for analysis
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <textarea
                  className="w-full h-56 sm:h-72 bg-white border border-gray-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-gray-900 
                           focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                           resize-none transition-all duration-200 text-base sm:text-lg placeholder-gray-500"
                  placeholder="Paste the job description here..."
                  value={jd}
                  onChange={(e) => {
                    setJd(e.target.value);
                    setError("");
                  }}
                  disabled={showSessionExpired}
                />
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 text-xs sm:text-sm font-medium rounded-full border border-gray-300">
                  {jd.length} characters
                </div>
              </div>
            </div>

            {/* Error Message */}
            {(error || showSessionExpired) && (
              <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-xl sm:rounded-2xl flex items-start gap-3 sm:gap-4"
                  style={{
                    backgroundColor: error.includes("limit") || error.includes("429") 
                      ? '#fef2f2' 
                      : '#fff7ed',
                    borderColor: error.includes("limit") || error.includes("429") 
                      ? '#fecaca' 
                      : '#fed7aa'
                  }}>
                <AlertCircle className={`w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0 ${
                  error.includes("limit") || error.includes("429") 
                    ? 'text-red-600' 
                    : 'text-orange-600'
                }`} />
                <div className="flex-1">
                  <p className={`font-medium text-sm sm:text-base mb-1 ${
                    error.includes("limit") || error.includes("429") 
                      ? 'text-red-800' 
                      : 'text-orange-800'
                  }`}>
                    {error.includes("limit") || error.includes("429") 
                      ? "Analysis Limit Reached" 
                      : "Session Expired"}
                  </p>
                  <p className={`text-sm sm:text-base ${
                    error.includes("limit") || error.includes("429") 
                      ? 'text-red-700' 
                      : 'text-orange-700'
                  }`}>
                    {error}
                  </p>
                  
                  {/* Show actions for session expired */}
                  {showSessionExpired && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={handleLoginAgain}
                        className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Login Again
                      </button>
                      <button
                        onClick={clearErrors}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <div className="flex justify-center">
              <button
                onClick={analyze}
                disabled={loading || !resumeId || !jd.trim() || remainingAnalyses <= 0 || showSessionExpired}
                className={`
                  px-6 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-xl
                  transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  ${loading 
                    ? 'bg-blue-800 cursor-wait' 
                    : remainingAnalyses <= 0
                    ? 'bg-red-600 hover:bg-red-700 cursor-not-allowed'
                    : showSessionExpired
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950'
                  }
                  text-white shadow-lg hover:shadow-xl relative overflow-hidden group w-full max-w-md
                `}
              >
                {showSessionExpired ? (
                  <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Session Expired - Please Login</span>
                  </div>
                ) : remainingAnalyses <= 0 ? (
                  <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Limit Reached ({analysisCount}/15)</span>
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 sm:border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing with AI...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 sm:gap-4 relative">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Analyze Resume ({remainingAnalyses} left)</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="mt-8 sm:mt-12 animate-fadeIn">
              <AnalysisResult result={result} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-300 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 text-sm">
            Each user receives 15 free AI-powered resume analyses. Contact support for additional credits.
          </p>
          <div className="mt-4 text-xs text-gray-500">
            © {new Date().getFullYear()} SkillScan AI
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Analyze;