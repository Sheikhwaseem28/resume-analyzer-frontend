import { TrendingUp, Target, Lightbulb, AlertTriangle, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";

const AnalysisResult = ({ result }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Score color based on value (dark theme version)
  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-gradient-to-r from-emerald-900/30 via-green-900/20 to-emerald-900/20";
    if (score >= 60) return "bg-gradient-to-r from-amber-900/30 via-yellow-900/20 to-amber-900/20";
    return "bg-gradient-to-r from-red-900/30 via-rose-900/20 to-red-900/20";
  };

  const getScoreBarColor = (score) => {
    if (score >= 80) return "bg-gradient-to-r from-emerald-500 to-green-500";
    if (score >= 60) return "bg-gradient-to-r from-amber-500 to-yellow-500";
    return "bg-gradient-to-r from-red-500 to-rose-500";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Score Card */}
      <div className={`p-6 sm:p-8 rounded-xl sm:rounded-2xl ${getScoreBgColor(result.matchScore)} border border-slate-700/50 backdrop-blur-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Analysis Results</h2>
            </div>
            <p className="text-slate-900 text-sm sm:text-base">
              Based on the job description and your resume
            </p>
          </div>
          <div className="text-center bg-slate-900/60 border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 min-w-[140px]">
            <div className={`text-4xl sm:text-5xl font-bold ${getScoreColor(result.matchScore)}`}>
              {result.matchScore}%
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">
                Match Score
              </span>
            </div>
          </div>
        </div>
        
        {/* Score Bar */}
        <div className="mt-6 sm:mt-8">
          <div className="flex justify-between text-xs sm:text-sm text-slate-800 mb-2">
            <span>Low Match</span>
            <span>High Match</span>
          </div>
          <div className="h-2.5 sm:h-3 bg-slate-800/60 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${getScoreBarColor(result.matchScore)}`}
              style={{ width: `${result.matchScore}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-slate-800">0-59%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs text-slate-800">60-79%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-slate-800">80-100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Strengths */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 p-5 sm:p-6 hover:border-emerald-700/50 hover:bg-slate-800/60 transition-all duration-200">
          <button
            onClick={() => toggleSection('strengths')}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-900/30 to-green-900/30 rounded-lg sm:rounded-xl border border-emerald-700/30">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-sm sm:text-base">Strengths</h3>
                <p className="text-xs sm:text-sm text-slate-900">
                  {result.strengths.length} skills matched
                </p>
              </div>
            </div>
            <ChevronRight 
              className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform flex-shrink-0 ${
                expandedSection === 'strengths' ? 'rotate-90' : ''
              }`}
            />
          </button>
          
          {(expandedSection === 'strengths' || !expandedSection) && (
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
              {result.strengths.map((strength, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-emerald-900/20 to-green-900/10 rounded-lg sm:rounded-xl border border-emerald-700/20"
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <span className="text-slate-200 text-sm sm:text-base leading-relaxed">{strength}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Missing Skills */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 p-5 sm:p-6 hover:border-red-700/50 hover:bg-slate-800/60 transition-all duration-200">
          <button
            onClick={() => toggleSection('weaknesses')}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-red-900/30 to-rose-900/30 rounded-lg sm:rounded-xl border border-red-700/30">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-sm sm:text-base">Missing Skills</h3>
                <p className="text-xs sm:text-sm text-slate-900">
                  {result.weaknesses.length} skills to improve
                </p>
              </div>
            </div>
            <ChevronRight 
              className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform flex-shrink-0 ${
                expandedSection === 'weaknesses' ? 'rotate-90' : ''
              }`}
            />
          </button>
          
          {(expandedSection === 'weaknesses' || !expandedSection) && (
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
              {result.weaknesses.map((skill, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-red-900/20 to-rose-900/10 rounded-lg sm:rounded-xl border border-red-700/20"
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <span className="text-slate-200 text-sm sm:text-base leading-relaxed">{skill}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 p-5 sm:p-6 hover:border-violet-700/50 hover:bg-slate-800/60 transition-all duration-200">
        <button
          onClick={() => toggleSection('suggestions')}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-lg sm:rounded-xl border border-violet-700/30">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white text-sm sm:text-base">AI Suggestions</h3>
              <p className="text-xs sm:text-sm text-slate-900">
                {result.suggestions.length} recommendations
              </p>
            </div>
          </div>
          <ChevronRight 
            className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform flex-shrink-0 ${
              expandedSection === 'suggestions' ? 'rotate-90' : ''
            }`}
          />
        </button>
        
        {(expandedSection === 'suggestions' || !expandedSection) && (
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            {result.suggestions.map((suggestion, i) => (
              <div 
                key={i} 
                className="p-3 sm:p-4 bg-gradient-to-r from-violet-900/20 to-purple-900/10 rounded-xl sm:rounded-xl border border-violet-700/20"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed">{suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

{/* Legend for Score Ranges */}
<div className="p-4 sm:p-5 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl">
  <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">Understanding Your Score</h4>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
    {/* Needs Work (0-59%) */}
    <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-red-900/20 via-rose-900/10 to-red-900/10 rounded-lg border border-red-700/30 hover:border-red-600/50 transition-all duration-200">
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
          0-59
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-800"></div>
      </div>
      <div>
        <p className="text-sm font-semibold text-white mb-0.5">Needs Work</p>
        <p className="text-xs text-slate-800 leading-relaxed">Major improvements needed to match requirements</p>
      </div>
    </div>

    {/* Good Match (60-79%) */}
    <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-amber-900/20 via-yellow-900/10 to-amber-900/10 rounded-lg border border-amber-700/30 hover:border-amber-600/50 transition-all duration-200">
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
          60-79
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-slate-800"></div>
      </div>
      <div>
        <p className="text-sm font-semibold text-white mb-0.5">Good Match</p>
        <p className="text-xs text-slate-800 leading-relaxed">Minor improvements for better alignment</p>
      </div>
    </div>

    {/* Excellent Fit (80-100%) */}
    <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-emerald-900/20 via-green-900/10 to-emerald-900/10 rounded-lg border border-emerald-700/30 hover:border-emerald-600/50 transition-all duration-200">
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
          80-100
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-800"></div>
      </div>
      <div>
        <p className="text-sm font-semibold text-white mb-0.5">Excellent Fit</p>
        <p className="text-xs text-slate-800 leading-relaxed">Highly competitive and well-aligned</p>
      </div>
    </div>
  </div>
  
  {/* Score Interpretation Guide */}
  <div className="mt-4 pt-4 border-t border-slate-700/50">
    <div className="flex items-center justify-between text-xs text-slate-900 mb-2">
      <span>How to improve your score:</span>
      <span className="px-2 py-0.5 bg-slate-900/50 rounded-full border border-slate-700/50 text-xs">
        Tips
      </span>
    </div>
    <ul className="space-y-1.5 text-xs text-slate-900">
      <li className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
        <span>Address missing skills from the job description</span>
      </li>
      <li className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
        <span>Highlight relevant experience and achievements</span>
      </li>
      <li className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
        <span>Use keywords from the job description in your resume</span>
      </li>
    </ul>
  </div>
</div>
    </div>
  );
};

export default AnalysisResult;