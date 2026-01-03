// AnalysisResult.jsx
import { TrendingUp, Target, Lightbulb, AlertTriangle, ChevronRight } from "lucide-react";
import { useState } from "react";

const AnalysisResult = ({ result }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-gradient-to-r from-green-50 to-emerald-50";
    if (score >= 60) return "bg-gradient-to-r from-yellow-50 to-amber-50";
    return "bg-gradient-to-r from-red-50 to-rose-50";
  };

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className={`p-8 rounded-2xl ${getScoreBgColor(result.matchScore)}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Results</h2>
            <p className="text-gray-600">
              Based on the job description and your resume
            </p>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${getScoreColor(result.matchScore)}`}>
              {result.matchScore}%
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium text-gray-600">
                Match Score
              </span>
            </div>
          </div>
        </div>
        
        {/* Score Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Low Match</span>
            <span>High Match</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${
                result.matchScore >= 80 ? "bg-green-500" :
                result.matchScore >= 60 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${result.matchScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <button
            onClick={() => toggleSection('strengths')}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900">Strengths</h3>
                <p className="text-sm text-gray-500">
                  {result.strengths.length} skills matched
                </p>
              </div>
            </div>
            <ChevronRight 
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSection === 'strengths' ? 'rotate-90' : ''
              }`}
            />
          </button>
          
          {(expandedSection === 'strengths' || !expandedSection) && (
            <div className="mt-6 space-y-3">
              {result.strengths.map((strength, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-800">{strength}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Missing Skills */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <button
            onClick={() => toggleSection('weaknesses')}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900">Missing Skills</h3>
                <p className="text-sm text-gray-500">
                  {result.weaknesses.length} skills to improve
                </p>
              </div>
            </div>
            <ChevronRight 
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedSection === 'weaknesses' ? 'rotate-90' : ''
              }`}
            />
          </button>
          
          {(expandedSection === 'weaknesses' || !expandedSection) && (
            <div className="mt-6 space-y-3">
              {result.weaknesses.map((skill, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-3 p-3 bg-red-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-800">{skill}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <button
          onClick={() => toggleSection('suggestions')}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900">AI Suggestions</h3>
              <p className="text-sm text-gray-500">
                {result.suggestions.length} recommendations
              </p>
            </div>
          </div>
          <ChevronRight 
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expandedSection === 'suggestions' ? 'rotate-90' : ''
            }`}
          />
        </button>
        
        {(expandedSection === 'suggestions' || !expandedSection) && (
          <div className="mt-6 space-y-4">
            {result.suggestions.map((suggestion, i) => (
              <div 
                key={i} 
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-white border border-blue-200 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                    {i + 1}
                  </span>
                  <p className="text-gray-800 leading-relaxed">{suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;