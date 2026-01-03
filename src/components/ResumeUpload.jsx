// ResumeUpload.jsx
import { useState } from "react";
import api from "../api/axios";
import { Upload, FileText, X } from "lucide-react";

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
    <div className="space-y-4">
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
              border-2 border-dashed border-gray-300 
              rounded-2xl p-12 cursor-pointer 
              transition-all duration-200
              hover:border-blue-500 hover:bg-blue-50
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="p-4 bg-blue-100 rounded-full mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700 mb-1">
                Click to upload resume
              </p>
              <p className="text-gray-500 text-sm">
                PDF or DOCX • Max 5MB
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-2xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{preview.name}</p>
                <p className="text-sm text-gray-500">{preview.size} • {preview.type}</p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="Remove file"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="text-center py-4">
          <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-2">Processing your resume...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 text-sm flex items-center gap-2">
            <span className="font-medium">Error:</span> {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;