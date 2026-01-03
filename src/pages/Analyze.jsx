import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ResumeUpload from "../components/ResumeUpload";
import AnalysisResult from "../components/AnalysisResult";
import UserProfileDropdown from "../components/UserProfileDropdown";
import { useAuth } from "../auth/AuthContext";
import { Upload, Sparkles, AlertCircle, CheckCircle, Brain, Shield, Mail, Linkedin, Twitter, Github } from "lucide-react";

const Analyze = () => {
  const [resumeId, setResumeId] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const analyze = async () => {
    if (!resumeId) {
      setError("Please upload a resume first");
      return;
    }

    if (!jd.trim()) {
      setError("Please enter a job description");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const token = localStorage.getItem("token");
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

      setResult(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Analysis failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUploaded = (id, fileName) => {
    setResumeId(id);
    setUploadedFileName(fileName);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-xl shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  SkillScan<span className="text-violet-400">AI</span>
                </h1>
                <p className="text-xs text-slate-300">Intelligent Resume Analysis</p>
              </div>
            </div>

            {/* Tagline - Hidden on mobile for better spacing */}
            <div className="hidden lg:block text-center flex-1 px-8">
              <p className="text-slate-300 italic text-sm">
                "Transform your resume into a career magnet"
              </p>
            </div>

            {/* User Profile */}
            <div className="flex items-center">
              {user ? (
                <UserProfileDropdown user={user} onLogout={logout} />
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Quote */}
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              AI-Powered Resume <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Analysis</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-900 max-w-3xl mx-auto leading-relaxed">
              "Your resume is your story. Make sure it's compelling enough to land the interview."
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 sm:mb-10 border border-slate-700/50">
            {/* Resume Upload Section */}
            <div className="mb-10 sm:mb-12">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-xl border border-violet-500/30">
                  <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    1. Upload Your Resume
                  </h2>
                  <p className="text-sm sm:text-base text-slate-400 mt-1">
                    PDF or DOCX format • Max 5MB
                  </p>
                </div>
              </div>
              
              <ResumeUpload 
                setResumeId={handleResumeUploaded} 
                setFileName={setUploadedFileName}
              />
              
              {uploadedFileName && (
                <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gradient-to-r from-emerald-900/20 to-green-900/20 border border-emerald-700/30 rounded-xl sm:rounded-2xl">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm sm:text-lg truncate">{uploadedFileName}</p>
                      <p className="text-xs sm:text-sm text-emerald-300 mt-0.5">Ready for AI-powered analysis</p>
                    </div>
                    <div className="px-3 sm:px-4 py-1 bg-emerald-900/50 text-emerald-300 text-xs sm:text-sm font-medium rounded-full border border-emerald-700 whitespace-nowrap">
                      ✓ Upload Complete
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Job Description Section */}
            <div className="mb-10 sm:mb-12">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-xl border border-violet-500/30">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
                    <span className="text-base sm:text-lg font-bold text-violet-400">2</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Enter Job Description
                  </h2>
                  <p className="text-sm sm:text-base text-slate-400 mt-1">
                    Paste the complete job description for analysis
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <textarea
                  className="w-full h-56 sm:h-72 bg-slate-900/60 border border-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white 
                           focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500
                           resize-none transition-all duration-200 text-base sm:text-lg placeholder-slate-500"
                  placeholder="Paste the job description here...

You can include:
• Required skills and qualifications
• Job responsibilities
• Company information
• Any specific requirements"
                  value={jd}
                  onChange={(e) => {
                    setJd(e.target.value);
                    setError("");
                  }}
                />
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 px-2 sm:px-3 py-1 bg-slate-900/80 text-slate-400 text-xs sm:text-sm font-medium rounded-full border border-slate-700">
                  {jd.length} characters
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-gradient-to-r from-red-900/30 to-pink-900/20 border border-red-800/30 rounded-xl sm:rounded-2xl flex items-start gap-3 sm:gap-4">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-red-300 text-sm sm:text-base mb-1">Analysis Error</p>
                  <p className="text-red-200 text-sm sm:text-base">{error}</p>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <div className="flex justify-center">
              <button
                onClick={analyze}
                disabled={loading || !resumeId || !jd.trim()}
                className={`
                  px-6 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-xl
                  transition-all duration-300 transform hover:scale-[1.02]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  ${loading 
                    ? 'bg-gradient-to-r from-violet-700 to-purple-700 cursor-wait' 
                    : 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500'
                  }
                  text-white shadow-2xl hover:shadow-3xl relative overflow-hidden group w-full max-w-md
                `}
              >
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 via-transparent to-fuchsia-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                {loading ? (
                  <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 sm:border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing with AI...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Analyze Resume Match</span>
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

          {/* Bottom Quote */}
          <div className="text-center mt-12 sm:mt-16 p-6 sm:p-8 bg-gradient-to-r from-violet-900/20 to-purple-900/20 border border-violet-700/30 rounded-2xl sm:rounded-3xl">
            <p className="text-lg sm:text-2xl text-slate-800 italic mb-3 sm:mb-4 leading-relaxed">
              "The difference between the almost right word and the right word is really a large matter—it's the difference between the lightning bug and the lightning."
            </p>
            <p className="text-slate-700 text-sm sm:text-base">— Mark Twain</p>
            <p className="text-xs sm:text-sm text-slate-700 mt-3 sm:mt-4">Let AI help you find the right words for your resume</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-gray-900 border-t border-slate-800 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8 sm:mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-lg">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">SkillScan<span className="text-violet-400">AI</span></h2>
                  <p className="text-xs sm:text-sm text-slate-400">Intelligent Resume Analyzer</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                "Your career success begins with a compelling resume. Let AI guide your journey."
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-white text-base sm:text-lg mb-3 sm:mb-4">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">sheikhwaseem2803@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="text-sm sm:text-base">+91 9171417168</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
                © {new Date().getFullYear()} SkillScan AI. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Analyze;