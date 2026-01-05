import { TrendingUp, Target, Lightbulb, AlertTriangle, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";

const AnalysisResult = ({ result }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const getScoreBarColor = (score) => {
    if (score >= 80) return "bg-gradient-to-r from-green-500 to-emerald-500";
    if (score >= 60) return "bg-gradient-to-r from-amber-500 to-yellow-500";
    return "bg-gradient-to-r from-red-500 to-rose-500";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Score Card */}
      <div className={`p-6 sm:p-8 rounded-xl sm:rounded-2xl ${getScoreBgColor(result.matchScore)} border`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Analysis Results</h2>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              Based on the job description and your resume
            </p>
          </div>
          <div className="text-center bg-white border border-gray-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 min-w-[140px] shadow-sm">
            <div className={`text-4xl sm:text-5xl font-bold ${getScoreColor(result.matchScore)}`}>
              {result.matchScore}%
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Match Score
              </span>
            </div>
          </div>
        </div>
        
        {/* Score Bar */}
        <div className="mt-6 sm:mt-8">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
            <span>Low Match</span>
            <span>High Match</span>
          </div>
          <div className="h-2.5 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${getScoreBarColor(result.matchScore)}`}
              style={{ width: `${result.matchScore}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-700">0-59%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-gray-700">60-79%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-700">80-100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Strengths */}
        <div className="bg-white border border-gray-300 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-green-400 hover:shadow-md transition-all duration-200">
          <button
            onClick={() => toggleSection('strengths')}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg sm:rounded-xl border border-green-300">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Strengths</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {result.strengths.length} skills matched
                </p>
              </div>
            </div>
            <ChevronRight 
              className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform flex-shrink-0 ${
                expandedSection === 'strengths' ? 'rotate-90' : ''
              }`}
            />
          </button>
          
          {(expandedSection === 'strengths' || !expandedSection) && (
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
              {result.strengths.map((strength, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-3 p-3 bg-green-50 rounded-lg sm:rounded-xl border border-green-200"
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <span className="text-gray-800 text-sm sm:text-base leading-relaxed">{strength}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Missing Skills */}
        <div className="bg-white border border-gray-300 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-red-400 hover:shadow-md transition-all duration-200">
          <button
            onClick={() => toggleSection('weaknesses')}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg sm:rounded-xl border border-red-300">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-700" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Missing Skills</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {result.weaknesses.length} skills to improve
                </p>
              </div>
            </div>
            <ChevronRight 
              className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform flex-shrink-0 ${
                expandedSection === 'weaknesses' ? 'rotate-90' : ''
              }`}
            />
          </button>
          
          {(expandedSection === 'weaknesses' || !expandedSection) && (
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
              {result.weaknesses.map((skill, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-3 p-3 bg-red-50 rounded-lg sm:rounded-xl border border-red-200"
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <span className="text-gray-800 text-sm sm:text-base leading-relaxed">{skill}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white border border-gray-300 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-blue-400 hover:shadow-md transition-all duration-200">
        <button
          onClick={() => toggleSection('suggestions')}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl border border-blue-300">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">AI Suggestions</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {result.suggestions.length} recommendations
              </p>
            </div>
          </div>
          <ChevronRight 
            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform flex-shrink-0 ${
              expandedSection === 'suggestions' ? 'rotate-90' : ''
            }`}
          />
        </button>
        
        {(expandedSection === 'suggestions' || !expandedSection) && (
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            {result.suggestions.map((suggestion, i) => (
              <div 
                key={i} 
                className="p-3 sm:p-4 bg-blue-50 rounded-xl sm:rounded-xl border border-blue-200"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-gray-800 text-sm sm:text-base leading-relaxed">{suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend for Score Ranges */}
      <div className="p-4 sm:p-5 bg-white border border-gray-300 rounded-xl sm:rounded-2xl">
        <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Understanding Your Score</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Needs Work (0-59%) */}
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200 hover:border-red-300 hover:shadow-sm transition-all duration-200">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-xs font-bold text-white shadow">
                0-59
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-0.5">Needs Work</p>
              <p className="text-xs text-gray-700 leading-relaxed">Major improvements needed to match requirements</p>
            </div>
          </div>

          {/* Good Match (60-79%) */}
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200 hover:border-amber-300 hover:shadow-sm transition-all duration-200">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center text-xs font-bold text-white shadow">
                60-79
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-300 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-0.5">Good Match</p>
              <p className="text-xs text-gray-700 leading-relaxed">Minor improvements for better alignment</p>
            </div>
          </div>

          {/* Excellent Fit (80-100%) */}
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:border-green-300 hover:shadow-sm transition-all duration-200">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow">
                80-100
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-0.5">Excellent Fit</p>
              <p className="text-xs text-gray-700 leading-relaxed">Highly competitive and well-aligned</p>
            </div>
          </div>
        </div>
        
        {/* Score Interpretation Guide */}
        <div className="mt-4 pt-4 border-t border-gray-300">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>How to improve your score:</span>
            <span className="px-2 py-0.5 bg-gray-100 rounded-full border border-gray-300 text-xs">
              Tips
            </span>
          </div>
          <ul className="space-y-1.5 text-xs text-gray-700">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
              <span>Address missing skills from the job description</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
              <span>Highlight relevant experience and achievements</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
              <span>Use keywords from the job description in your resume</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;