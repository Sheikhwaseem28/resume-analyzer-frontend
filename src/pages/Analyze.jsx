import { useState } from "react";
import api from "../api/axios";
import ResumeUpload from "../components/ResumeUpload";
import AnalysisResult from "../components/AnalysisResult";
import { Upload, Sparkles, AlertCircle, CheckCircle } from "lucide-react";

const Analyze = () => {
  const [resumeId, setResumeId] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Resume Analyzer
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Upload your resume and job description to get AI-powered insights
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Resume Upload Section */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                1. Upload Resume
              </h2>
            </div>
            <ResumeUpload 
              setResumeId={handleResumeUploaded} 
              setFileName={setUploadedFileName}
            />
            
            {uploadedFileName && (
              <div className="mt-4 flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{uploadedFileName}</span>
                <span className="text-sm text-gray-500">✓ Ready for analysis</span>
              </div>
            )}
          </div>

          {/* Job Description Section */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Enter Job Description
              </h2>
            </div>
            
            <div className="relative">
              <textarea
                className="w-full h-64 border border-gray-300 rounded-xl p-5 text-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         resize-none transition-all duration-200 text-lg"
                placeholder="Paste the job description here... 
You can also include:
• Required skills
• Qualifications
• Responsibilities
• Company information"
                value={jd}
                onChange={(e) => {
                  setJd(e.target.value);
                  setError("");
                }}
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                {jd.length} characters
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Analyze Button */}
          <div className="flex justify-center">
            <button
              onClick={analyze}
              disabled={loading || !resumeId || !jd.trim()}
              className={`
                px-8 py-4 rounded-xl font-semibold text-lg
                transition-all duration-300 transform hover:scale-[1.02]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                ${loading 
                  ? 'bg-blue-500 cursor-wait' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                }
                text-white shadow-lg hover:shadow-xl
                w-full max-w-md
              `}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing with Gemini AI...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Resume Match</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8 animate-fadeIn">
            <AnalysisResult result={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;