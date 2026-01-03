import { useState } from "react";
import api from "../api/axios";
import { Upload, FileText, X, Loader2 } from "lucide-react";

const ResumeUpload = ({ setResumeId, setFileName }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    const validTypes = ['application/pdf', 
                       'application/msword', 
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload PDF or DOCX files only");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setUploading(true);
      setError("");
      
      // Set preview
      setPreview({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.name.split('.').pop().toUpperCase()
      });

      const token = localStorage.getItem("token");
      const res = await api.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      
      setResumeId(res.data._id);
      setFileName(file.name);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to upload resume. Please try again."
      );
      setPreview(null);
      setResumeId(null);
      setFileName("");
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setPreview(null);
    setResumeId(null);
    setFileName("");
    setError("");
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {!preview ? (
        <div className="relative">
          <input
            type="file"
            onChange={uploadResume}
            accept=".pdf,.doc,.docx"
            className="hidden"
            id="resume-upload"
            disabled={uploading}
          />
          <label
            htmlFor="resume-upload"
            className={`
              flex flex-col items-center justify-center 
              border-2 border-dashed border-slate-700/50
              rounded-xl sm:rounded-2xl p-8 sm:p-12 
              cursor-pointer transition-all duration-200
              bg-slate-900/40 hover:bg-slate-800/60
              hover:border-violet-500/50 hover:shadow-lg
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
              group
            `}
          >
            <div className="p-3 sm:p-4 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-xl mb-3 sm:mb-4 group-hover:from-violet-600/30 group-hover:to-purple-600/30 transition-all duration-200">
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-violet-400 group-hover:text-violet-300" />
            </div>
            <div className="text-center">
              <p className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                Click to upload resume
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                PDF or DOCX • Max 5MB
              </p>
            </div>
            <div className="mt-4 sm:mt-6 px-4 py-1.5 bg-slate-800/60 border border-slate-700 rounded-full">
              <span className="text-xs text-slate-400">Browse files</span>
            </div>
          </label>
        </div>
      ) : (
        <div className="border border-violet-700/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gradient-to-r from-violet-900/10 to-purple-900/10 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-lg sm:rounded-xl border border-violet-500/20 flex-shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white text-sm sm:text-base truncate">
                  {preview.name}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {preview.size} • {preview.type}
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-1.5 sm:p-2 hover:bg-slate-800/50 rounded-lg sm:rounded-xl transition-all duration-200 border border-slate-700/50 hover:border-red-500/30 hover:bg-red-900/10 flex-shrink-0"
              title="Remove file"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 hover:text-red-400" />
            </button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center gap-3 px-4 py-2.5 bg-slate-900/40 border border-slate-700/50 rounded-xl">
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400 animate-spin" />
            <p className="text-sm sm:text-base text-slate-300">Processing your resume...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 sm:p-4 bg-gradient-to-r from-red-900/20 to-pink-900/10 border border-red-800/30 rounded-xl sm:rounded-2xl">
          <p className="text-red-300 text-xs sm:text-sm flex items-start gap-2">
            <span className="font-medium">Error:</span> 
            <span className="text-red-200">{error}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;