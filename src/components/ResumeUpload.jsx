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
              border-2 border-dashed border-gray-400
              rounded-xl sm:rounded-2xl p-8 sm:p-12 
              cursor-pointer transition-all duration-200
              bg-white hover:bg-gray-50
              hover:border-blue-500 hover:shadow-lg
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
              group
            `}
          >
            <div className="p-3 sm:p-4 bg-blue-100 rounded-xl mb-3 sm:mb-4 group-hover:bg-blue-200 transition-all duration-200">
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-blue-700 group-hover:text-blue-800" />
            </div>
            <div className="text-center">
              <p className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                Click to upload resume
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                PDF or DOCX • Max 5MB
              </p>
            </div>
            <div className="mt-4 sm:mt-6 px-4 py-1.5 bg-gray-100 border border-gray-300 rounded-full">
              <span className="text-xs text-gray-600">Browse files</span>
            </div>
          </label>
        </div>
      ) : (
        <div className="border border-blue-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-blue-50">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl border border-blue-300 flex-shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {preview.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                  {preview.size} • {preview.type}
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-lg sm:rounded-xl transition-all duration-200 border border-gray-300 hover:border-red-400 hover:bg-red-50 flex-shrink-0"
              title="Remove file"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 hover:text-red-600" />
            </button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center gap-3 px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-xl">
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 animate-spin" />
            <p className="text-sm sm:text-base text-gray-700">Processing your resume...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl">
          <p className="text-red-700 text-xs sm:text-sm flex items-start gap-2">
            <span className="font-medium">Error:</span> 
            <span className="text-red-600">{error}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;