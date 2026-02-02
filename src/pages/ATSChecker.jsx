import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, FileText, ShieldCheck, ArrowLeft, CheckCircle, XCircle, 
  AlertTriangle, TrendingUp, FileCheck, Star, Clock, Target,
  Zap, BarChart3, Search, Edit3, Download, Eye, Award
} from 'lucide-react';

const ATSChecker = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setError('');
        setResult(null);
      } else {
        setError('Please upload a PDF file only');
        setFile(null);
        setFileName('');
      }
    }
  };

  // Enhanced mock data generator
  const generateMockAnalysis = () => {
    // Random score between 65-95
    const score = Math.floor(Math.random() * (95 - 65 + 1)) + 65;
    
    // Categories scores
    const categories = [
      { name: 'Keyword Optimization', score: Math.floor(Math.random() * 20) + 70, icon: '🔑' },
      { name: 'Format & Structure', score: Math.floor(Math.random() * 20) + 75, icon: '📐' },
      { name: 'Content Quality', score: Math.floor(Math.random() * 20) + 65, icon: '✍️' },
      { name: 'ATS Compliance', score: Math.floor(Math.random() * 20) + 80, icon: '🤖' },
    ];

    // Mock analysis data
    return {
      score,
      grade: score >= 90 ? 'Excellent' : score >= 80 ? 'Very Good' : score >= 70 ? 'Good' : score >= 60 ? 'Fair' : 'Needs Work',
      categories,
      strengths: [
        'Professional and clean visual presentation',
        'Clear section hierarchy and organization',
        'Effective use of bullet points for readability',
        'Appropriate font selection and sizing',
        'Consistent formatting throughout document',
        'Contact information is clearly visible',
        'Proper use of white space and margins'
      ],
      weaknesses: [
        'Industry-specific keywords could be increased',
        'Quantifiable achievements need more emphasis',
        'Skills section requires more detailed breakdown',
        'Action verbs should be more impactful',
        'Professional summary could be more targeted',
        'Could include more metrics and data points',
        'Consider adding a core competencies section'
      ],
      recommendations: [
        'Incorporate 8-10 industry-specific keywords from job descriptions',
        'Quantify achievements with specific numbers (e.g., "Increased revenue by 35%")',
        'Use power verbs like "Spearheaded", "Engineered", "Optimized"',
        'Add a skills matrix with proficiency levels',
        'Create a targeted professional summary for each application',
        'Optimize document for both ATS and human readers',
        'Include specific technical skills and certifications',
        'Ensure consistent date formatting throughout'
      ],
      missingKeywords: [
        'Project Management',
        'Data Analysis',
        'Team Leadership',
        'Strategic Planning',
        'Budget Management',
        'Cross-functional Collaboration',
        'Performance Metrics',
        'Stakeholder Engagement',
        'Process Improvement',
        'Risk Assessment',
        'Agile Methodology',
        'KPI Tracking'
      ],
      formattingIssues: [
        'Use standard fonts: Arial, Calibri, Times New Roman, or Georgia',
        'Maintain consistent spacing between all sections (1.5 line spacing recommended)',
        'Remove tables and graphics that ATS might not parse correctly',
        'Use standard section headers: Experience, Education, Skills, etc.',
        'Save with "YourName_Resume.pdf" format for professional appearance',
        'Keep resume length to 1-2 pages maximum',
        'Use black text on white background for maximum readability'
      ],
      improvementTips: [
        { tip: 'Tailor resume for each job application', icon: '🎯', color: 'from-red-500 to-orange-500' },
        { tip: 'Use 10-15 relevant industry keywords', icon: '🔑', color: 'from-blue-500 to-cyan-500' },
        { tip: 'Save as PDF with professional filename', icon: '💾', color: 'from-green-500 to-emerald-500' },
        { tip: 'Include quantifiable achievements', icon: '📊', color: 'from-purple-500 to-pink-500' },
        { tip: 'Proofread multiple times', icon: '👁️', color: 'from-indigo-500 to-violet-500' },
        { tip: 'Get feedback from peers', icon: '👥', color: 'from-yellow-500 to-amber-500' }
      ],
      nextSteps: [
        'Download the analysis report for reference',
        'Use the resume builder to implement changes',
        'Re-analyze after making improvements',
        'Compare against industry benchmarks'
      ]
    };
  };

  const analyzeResume = () => {
    if (!file) {
      setError('Please upload a resume file first');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResult(null);

    // Simulate API call with realistic delay
    setTimeout(() => {
      const mockAnalysis = generateMockAnalysis();
      setResult(mockAnalysis);
      setIsAnalyzing(false);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }, 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10B981'; // Emerald
    if (score >= 80) return '#3B82F6'; // Blue
    if (score >= 70) return '#8B5CF6'; // Violet
    if (score >= 60) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'Excellent': return '#10B981';
      case 'Very Good': return '#3B82F6';
      case 'Good': return '#8B5CF6';
      case 'Fair': return '#F59E0B';
      default: return '#EF4444';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-sans">
      {/* Header/Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <ShieldCheck size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ResumeAI+
                </h1>
                <p className="text-xs text-gray-500">ATS Resume Analyzer</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3 md:mb-4">
            ATS Resume <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Analyzer</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Upload your resume to get an instant ATS compatibility score and actionable improvement suggestions
          </p>
          
          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="font-semibold text-gray-700">99% ATS Accuracy</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="font-semibold text-gray-700">Instant Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="font-semibold text-gray-700">Free Forever</span>
            </div>
          </div>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 mb-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                <Upload size={32} className="text-blue-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                Upload Your Resume PDF
              </h2>
              <p className="text-gray-600">
                Get instant feedback on ATS compatibility, formatting, and content quality
              </p>
            </div>

            {/* Upload Area */}
            <div className="relative">
              <div className="border-3 border-dashed border-gray-300 rounded-2xl p-8 md:p-12 text-center hover:border-blue-400 transition-all duration-300 bg-gradient-to-b from-white to-gray-50/50">
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <label 
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer shadow-lg shadow-blue-500/25 mb-6"
                >
                  <Upload size={20} />
                  Choose PDF File
                </label>
                
                <p className="text-sm text-gray-500 mb-4">
                  Supported: PDF files up to 10MB
                </p>
                
                {/* File Preview */}
                {fileName && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-md mx-auto animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <FileText size={24} className="text-blue-600" />
                      <div className="flex-1 text-left">
                        <p className="font-bold text-gray-900 truncate">{fileName}</p>
                        <p className="text-sm text-gray-500">Ready for analysis</p>
                      </div>
                      <button
                        onClick={() => {
                          setFile(null);
                          setFileName('');
                          setResult(null);
                        }}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold animate-fadeIn">
                    {error}
                  </div>
                )}

                {/* Analyze Button */}
                <button
                  onClick={analyzeResume}
                  disabled={!file || isAnalyzing}
                  className={`mt-8 px-10 py-4 rounded-xl font-bold transition-all flex items-center gap-3 mx-auto ${
                    !file || isAnalyzing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing Resume...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      <span>Analyze Resume</span>
                    </>
                  )}
                </button>

                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                    <Clock size={20} className="text-blue-600 mb-2" />
                    <span className="text-sm font-semibold text-gray-700">30 Sec Analysis</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                    <ShieldCheck size={20} className="text-green-600 mb-2" />
                    <span className="text-sm font-semibold text-gray-700">Secure & Private</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                    <Star size={20} className="text-yellow-600 mb-2" />
                    <span className="text-sm font-semibold text-gray-700">Free Analysis</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                    <Target size={20} className="text-purple-600 mb-2" />
                    <span className="text-sm font-semibold text-gray-700">Actionable Tips</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div id="results-section" className="space-y-8 animate-fadeIn">
            {/* Score Card */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl p-6 md:p-8 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-4">
                      <Award size={18} />
                      <span className="text-sm font-semibold">ATS Compatibility Score</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black mb-3">
                      How Well Does Your Resume <br className="hidden lg:block" />Perform with ATS?
                    </h2>
                    <p className="text-blue-100/90 mb-6 max-w-lg">
                      Your resume scores better than <span className="font-bold text-white">72%</span> of resumes analyzed this month. 
                      Here's how you compare to Fortune 500 ATS standards.
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        <span className="font-black text-lg" style={{ color: getGradeColor(result.grade) }}>
                          {result.grade}
                        </span>
                      </div>
                      <div className="text-sm">
                        {result.score >= 90 ? 'Exceptional ATS compatibility' : 
                         result.score >= 80 ? 'Very good for most ATS systems' : 
                         result.score >= 70 ? 'Good, some improvements needed' : 
                         result.score >= 60 ? 'Fair, significant improvements needed' : 
                         'Needs major revisions'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center flex-shrink-0">
                    <div className="relative">
                      <div className="text-6xl md:text-7xl font-black mb-2" style={{ color: getScoreColor(result.score) }}>
                        {result.score}
                        <span className="text-2xl md:text-3xl text-white/70">/100</span>
                      </div>
                      
                      {/* Circular Progress */}
                      <div className="relative w-48 h-48 mx-auto">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-black" style={{ color: getScoreColor(result.score) }}>
                              {result.score}%
                            </div>
                            <div className="text-sm text-white/80">Score</div>
                          </div>
                        </div>
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" strokeLinecap="round"></circle>
                          <circle cx="50" cy="50" r="45" fill="none" stroke={getScoreColor(result.score)} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${result.score * 2.83} 283`} className="transition-all duration-1000"></circle>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {result.categories.map((category, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-all hover:shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <h3 className="font-bold text-gray-900">{category.name}</h3>
                    </div>
                    <span className="text-2xl font-black" style={{ color: getScoreColor(category.score) }}>
                      {category.score}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${category.score}%`,
                        background: getScoreColor(category.score)
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {category.score >= 85 ? 'Excellent' : 
                     category.score >= 75 ? 'Very Good' : 
                     category.score >= 65 ? 'Good' : 
                     'Needs Improvement'}
                  </p>
                </div>
              ))}
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Strengths</h3>
                    <p className="text-sm text-gray-500">What your resume does well</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {result.strengths.map((strength, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                      <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800 font-medium">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <AlertTriangle size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Areas for Improvement</h3>
                    <p className="text-sm text-gray-500">What needs attention</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {result.weaknesses.map((weakness, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-100 rounded-lg">
                      <XCircle size={18} className="text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800 font-medium">{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <FileCheck size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Actionable Recommendations</h3>
                  <p className="text-sm text-gray-500">Step-by-step improvements</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-gray-800 font-medium">{rec}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords & Formatting */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Search size={24} className="text-blue-600" />
                  <h3 className="text-xl font-black text-gray-900">Suggested Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((keyword, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg font-semibold border border-blue-200 hover:border-blue-300 transition-colors cursor-pointer hover:shadow-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Incorporate these keywords naturally into your resume to improve ATS matching by up to 40%
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Edit3 size={24} className="text-purple-600" />
                  <h3 className="text-xl font-black text-gray-900">Formatting Guidelines</h3>
                </div>
                <div className="space-y-3">
                  {result.formattingIssues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
              <h3 className="text-xl font-black text-gray-900 mb-6">Pro Tips for ATS Success</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.improvementTips.map((tip, i) => (
                  <div 
                    key={i} 
                    className={`bg-gradient-to-br ${tip.color} rounded-xl p-5 text-white transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className="text-3xl mb-3">{tip.icon}</div>
                    <p className="font-semibold">{tip.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps - Ultra Compact */}
<div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
    <div className="text-center sm:text-left">
      <h3 className="text-lg font-bold text-gray-900">Ready to Build Your Resume?</h3>
      <p className="text-sm text-gray-500 mt-1">Use your analysis to create an ATS-optimized resume</p>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-3">
      <button 
        onClick={() => navigate('/resume-builder')}
        className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all text-sm shadow-md hover:shadow-lg"
      >
        Create ATS Resume
      </button>
      
      <button 
        onClick={() => {
          setFile(null);
          setFileName('');
          setResult(null);
        }}
        className="px-5 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg font-bold hover:border-blue-400 hover:text-blue-600 transition-all text-sm"
      >
        New Analysis
      </button>
    </div>
  </div>
</div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            ResumeAI+ ATS Analyzer • Your data is secure and never stored • 
            <span className="font-semibold text-blue-600 ml-2">Free Forever</span>
          </p>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ATSChecker;