import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ResumeUpload from "../components/ResumeUpload";
import AnalysisResult from "../components/AnalysisResult";
import UserProfileDropdown from "../components/UserProfileDropdown";
import { useAuth } from "../auth/AuthContext";
import { Upload, Sparkles, AlertCircle, CheckCircle, Brain, Shield, Mail, RefreshCw, LogOut, Zap, Target, BarChart3, Star, Phone, MessageSquare } from "lucide-react";

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

  // Motivational quotes for analysis
  const motivationalQuotes = [
    "Your next career breakthrough starts with the right analysis.",
    "Great opportunities don't happen, you create them.",
    "The best way to predict your future is to create it.",
    "Success is where preparation and opportunity meet.",
    "Your resume is your story. Make it count.",
    "Every job description is a puzzle. We help you find the perfect fit.",
    "Stand out in the crowd with data-driven insights.",
    "Your dream job is waiting. Let's find the path.",
    "Transform your resume into a career magnet.",
    "Data beats opinions. Get the insights that matter."
  ];

  const [currentQuote, setCurrentQuote] = useState("");

  useEffect(() => {
    // Set initial random quote
    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    
    // Change quote every 10 seconds
    const interval = setInterval(() => {
      setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                  SkillScan<span className="text-blue-600">AI</span>
                </h1>
                <p className="text-xs text-gray-500 font-medium">Intelligent Career Analysis</p>
              </div>
            </div>

            {/* Stats and User Info */}
            <div className="flex items-center gap-6">
              {user && (
                <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100">
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-500">Analyses Left</div>
                    <div className="text-lg font-bold text-blue-700">{remainingAnalyses}</div>
                  </div>
                  <div className="h-8 w-px bg-blue-200"></div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-500">Total Used</div>
                    <div className="text-lg font-bold text-indigo-700">{analysisCount}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                {user ? (
                  <UserProfileDropdown user={user} onLogout={logout} />
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Zap className="w-4 h-4" />
                    Get Started
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Motivational Quote Banner */}
      <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-blue-600/10 border-y border-blue-200/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <Star className="w-5 h-5 text-blue-600" />
            <p className="text-center text-sm md:text-base font-medium text-gray-700 italic animate-fadeIn">
              {currentQuote}
            </p>
            <Star className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              AI-Powered Resume Analysis
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your resume, paste the job description, and get instant insights to improve your chances
            </p>
          </div>
          {/* Main Analysis Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 mb-8 border border-gray-200">
            {/* Step 1: Resume Upload */}
            <div className="mb-10 sm:mb-12">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl border border-blue-300 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    1
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Upload Your Resume
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    We support PDF, DOCX formats • Maximum 5MB
                  </p>
                </div>
              </div>
              
              <ResumeUpload 
                setResumeId={handleResumeUploaded} 
                setFileName={setUploadedFileName}
              />
              
              {uploadedFileName && (
                <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl sm:rounded-2xl animate-fadeIn">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 bg-green-100 rounded-lg border border-green-300">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-lg truncate">{uploadedFileName}</p>
                      <p className="text-xs sm:text-sm text-green-700 mt-0.5">Ready for AI-powered analysis</p>
                    </div>
                    <div className="px-3 sm:px-4 py-2 bg-green-100 text-green-800 text-xs sm:text-sm font-semibold rounded-full border border-green-300 whitespace-nowrap flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Upload Complete
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="relative mb-10 sm:mb-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-gray-500">Next Step</span>
              </div>
            </div>

            {/* Step 2: Job Description */}
            <div className="mb-10 sm:mb-12">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl border border-indigo-300 flex items-center justify-center">
                    <Target className="w-6 h-6 text-indigo-700" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    2
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Target Job Description
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Paste the job description you're applying for
                  </p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
                <div className="relative">
                  <textarea
                    className="w-full h-56 sm:h-72 bg-white border border-gray-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-gray-900 
                             focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                             resize-none transition-all duration-200 text-base sm:text-lg placeholder-gray-500
                             shadow-inner"
                    placeholder="Paste the job description here...
                    
For example:
• Responsibilities
• Required skills
• Qualifications
• Experience needed
..."
                    value={jd}
                    onChange={(e) => {
                      setJd(e.target.value);
                      setError("");
                    }}
                    disabled={showSessionExpired}
                  />
                  <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center gap-2">
                    <div className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-600 text-xs sm:text-sm font-medium rounded-full border border-blue-200">
                      {jd.length} characters
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {(error || showSessionExpired) && (
              <div className="mb-6 sm:mb-8 animate-fadeIn">
                <div className={`p-5 rounded-2xl flex items-start gap-4 shadow-lg ${
                  error.includes("limit") || error.includes("429") 
                    ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200' 
                    : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
                }`}>
                  <div className={`p-2 rounded-lg ${
                    error.includes("limit") || error.includes("429") 
                      ? 'bg-red-100' 
                      : 'bg-amber-100'
                  }`}>
                    <AlertCircle className={`w-6 h-6 ${
                      error.includes("limit") || error.includes("429") 
                        ? 'text-red-600' 
                        : 'text-amber-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base sm:text-lg mb-1 ${
                      error.includes("limit") || error.includes("429") 
                        ? 'text-red-800' 
                        : 'text-amber-800'
                    }`}>
                      {error.includes("limit") || error.includes("429") 
                        ? "Analysis Limit Reached" 
                        : "Session Expired"}
                    </h3>
                    <p className={`text-sm sm:text-base mb-4 ${
                      error.includes("limit") || error.includes("429") 
                        ? 'text-red-700' 
                        : 'text-amber-700'
                    }`}>
                      {error}
                    </p>
                    
                    {/* Show actions for session expired */}
                    {showSessionExpired && (
                      <div className="flex gap-3">
                        <button
                          onClick={handleLoginAgain}
                          className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-sm font-semibold rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-200 flex items-center gap-2 shadow hover:shadow-md"
                        >
                          <LogOut className="w-4 h-4" />
                          Login Again
                        </button>
                        <button
                          onClick={clearErrors}
                          className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={analyze}
                disabled={loading || !resumeId || !jd.trim() || remainingAnalyses <= 0 || showSessionExpired}
                className={`
                  relative group px-8 sm:px-16 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-xl
                  transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  w-full max-w-md
                  ${loading 
                    ? 'bg-gradient-to-r from-blue-700 to-indigo-800' 
                    : remainingAnalyses <= 0
                    ? 'bg-gradient-to-r from-red-600 to-red-700'
                    : showSessionExpired
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
                  }
                  text-white shadow-2xl hover:shadow-3xl
                `}
              >
                {/* Button glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                
                <div className="relative flex items-center justify-center gap-3 sm:gap-4">
                  {showSessionExpired ? (
                    <>
                      <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span>Session Expired - Please Login</span>
                    </>
                  ) : remainingAnalyses <= 0 ? (
                    <>
                      <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span>Limit Reached ({analysisCount}/15)</span>
                    </>
                  ) : loading ? (
                    <>
                      <div className="w-6 h-6 sm:w-7 sm:h-7 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>AI Analysis in Progress...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span>Launch AI Analysis</span>
                    </>
                  )}
                </div>
                
                {/* Analysis count badge */}
                {remainingAnalyses > 0 && !showSessionExpired && !loading && (
                  <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-lg">
                    {remainingAnalyses} left
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

          {/* Features Showcase */}
          {!result && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Precision Matching</h3>
                <p className="text-sm text-gray-600">AI-powered analysis for perfect job-resume alignment</p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Actionable Insights</h3>
                <p className="text-sm text-gray-600">Get specific recommendations to improve your resume</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">SkillScan AI</h3>
                  <p className="text-sm text-gray-600">Intelligent Career Analysis</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-md">
                Empowering job seekers with AI-powered insights to land their dream jobs.
                Transform your resume and optimize your job search with our intelligent analysis platform.
              </p>
            </div>
            
            {/* Contact Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Support</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="p-2 bg-white rounded-lg border border-blue-200">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email Support</h4>
                    <a 
                      href="mailto:sheikhwaseem2803@gmail.com" 
                      className="text-blue-600 hover:text-blue-800 text-sm transition-colors break-all"
                    >
                      sheikhwaseem2803@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              "The only way to do great work is to love what you do." — Steve Jobs
            </p>
            <div className="mt-4 text-xs text-gray-500">
              © {new Date().getFullYear()} SkillScan AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Analyze;