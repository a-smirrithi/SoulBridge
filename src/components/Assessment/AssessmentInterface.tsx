import React, { useState } from 'react';
import { Brain, AlertCircle, CheckCircle, Clock, FileText, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockAssessmentTools, mockUsers } from '../../data/mockData';
import { AssessmentTool, AssessmentResult, AssessmentQuestion } from '../../types';

const AssessmentInterface: React.FC = () => {
  const { user } = useAuth() || {};
  const [selectedTool, setSelectedTool] = useState<AssessmentTool | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const translations = {
    en: {
      title: 'Psychological Assessment Tools',
      subtitle: 'Evidence-based screening tools for mental health evaluation',
      selectTool: 'Select Assessment Tool',
      startAssessment: 'Start Assessment',
      viewHistory: 'View Assessment History',
      question: 'Question',
      of: 'of',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit Assessment',
      restart: 'Take Another Assessment',
      riskLevel: 'Risk Level',
      score: 'Score',
      recommendations: 'Recommendations',
      seekProfessional: 'Seek Professional Help',
      monitorSymptoms: 'Monitor Symptoms',
      selfCare: 'Focus on Self-Care',
      emergency: 'Emergency Support',
      completedAssessments: 'Completed Assessments',
      noHistory: 'No previous assessments found'
    },
    hi: {
      title: 'मनोवैज्ञानिक मूल्यांकन उपकरण',
      subtitle: 'मानसिक स्वास्थ्य मूल्यांकन के लिए साक्ष्य-आधारित स्क्रीनिंग उपकरण',
      selectTool: 'मूल्यांकन उपकरण चुनें',
      startAssessment: 'मूल्यांकन शुरू करें',
      viewHistory: 'मूल्यांकन इतिहास देखें',
      question: 'प्रश्न',
      of: 'का',
      next: 'अगला',
      previous: 'पिछला',
      submit: 'मूल्यांकन जमा करें',
      restart: 'एक और मूल्यांकन लें',
      riskLevel: 'जोखिम स्तर',
      score: 'अंक',
      recommendations: 'सिफारिशें',
      seekProfessional: 'पेशेवर सहायता लें',
      monitorSymptoms: 'लक्षणों की निगरानी करें',
      selfCare: 'स्वयं की देखभाल पर ध्यान दें',
      emergency: 'आपातकालीन सहायता',
      completedAssessments: 'पूर्ण मूल्यांकन',
      noHistory: 'कोई पिछला मूल्यांकन नहीं मिला'
    },
    ta: {
      title: 'உளவியல் மதிப்பீட்டு கருவிகள்',
      subtitle: 'மனநல மதிப்பீட்டிற்கான சான்று அடிப்படையிலான திரையிடல் கருவிகள்',
      selectTool: 'மதிப்பீட்டு கருவியைத் தேர்ந்தெடுக்கவும்',
      startAssessment: 'மதிப்பீட்டை தொடங்கவும்',
      viewHistory: 'மதிப்பீட்டு வரலாற்றைக் காண்க',
      question: 'கேள்வி',
      of: 'இல்',
      next: 'அடுத்து',
      previous: 'முந்தைய',
      submit: 'மதிப்பீட்டை சமர்ப்பிக்கவும்',
      restart: 'மற்றொரு மதிப்பீட்டை எடுங்கள்',
      riskLevel: 'ஆபத்து நிலை',
      score: 'மதிப்பெண்',
      recommendations: 'பரிந்துரைகள்',
      seekProfessional: 'தொழில்முறை உதவியை நாடுங்கள்',
      monitorSymptoms: 'அறிகுறிகளைக் கண்காணிக்கவும்',
      selfCare: 'சுய பராமரிப்பில் கவனம் செலுத்துங்கள்',
      emergency: 'அவசர ஆதரவு',
      completedAssessments: 'முடிக்கப்பட்ட மதிப்பீடுகள்',
      noHistory: 'முந்தைய மதிப்பீடுகள் எதுவும் கிடைக்கவில்லை'
    }
  };

  const currentLang = user?.languagePreference || 'en';
  const t = translations[currentLang];

  const handleToolSelection = (tool: AssessmentTool) => {
    setSelectedTool(tool);
    setCurrentQuestionIndex(0);
    setResponses([]);
    setIsCompleted(false);
    setAssessmentResult(null);
  };

  const handleResponse = (score: number) => {
    const newResponses = [...responses];
    newResponses[currentQuestionIndex] = score;
    setResponses(newResponses);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < selectedTool!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = (): AssessmentResult => {
    const totalScore = responses.reduce((sum, score) => sum + score, 0);
    const maxScore = selectedTool!.questions.length * Math.max(...selectedTool!.questions[0].options.map(opt => opt.score));
    
    let riskLevel: 'low' | 'moderate' | 'high' | 'severe';
    let recommendations: string[];

    // PHQ-9 scoring
    if (selectedTool!.id === 'phq9') {
      if (totalScore <= 4) {
        riskLevel = 'low';
        recommendations = ['Continue regular self-care practices', 'Maintain healthy lifestyle habits'];
      } else if (totalScore <= 9) {
        riskLevel = 'moderate';
        recommendations = ['Consider counseling or therapy', 'Monitor symptoms closely', 'Practice stress management techniques'];
      } else if (totalScore <= 14) {
        riskLevel = 'high';
        recommendations = ['Seek professional mental health support', 'Consider medication evaluation', 'Regular therapy sessions recommended'];
      } else {
        riskLevel = 'severe';
        recommendations = ['Immediate professional intervention required', 'Consider intensive therapy or hospitalization', 'Crisis intervention may be necessary'];
      }
    }
    // GAD-7 scoring
    else if (selectedTool!.id === 'gad7') {
      if (totalScore <= 4) {
        riskLevel = 'low';
        recommendations = ['Practice relaxation techniques', 'Maintain regular exercise routine'];
      } else if (totalScore <= 9) {
        riskLevel = 'moderate';
        recommendations = ['Consider anxiety management strategies', 'Seek counseling support', 'Practice mindfulness techniques'];
      } else if (totalScore <= 14) {
        riskLevel = 'high';
        recommendations = ['Professional anxiety treatment recommended', 'Consider cognitive behavioral therapy', 'Medication evaluation may be helpful'];
      } else {
        riskLevel = 'severe';
        recommendations = ['Immediate professional treatment required', 'Comprehensive anxiety disorder evaluation', 'Intensive therapy program recommended'];
      }
    }
    // Default scoring for other tools
    else {
      const percentage = (totalScore / maxScore) * 100;
      if (percentage <= 25) {
        riskLevel = 'low';
        recommendations = ['Continue current wellness practices', 'Regular self-assessment recommended'];
      } else if (percentage <= 50) {
        riskLevel = 'moderate';
        recommendations = ['Consider professional consultation', 'Implement stress reduction strategies'];
      } else if (percentage <= 75) {
        riskLevel = 'high';
        recommendations = ['Professional evaluation recommended', 'Regular monitoring required'];
      } else {
        riskLevel = 'severe';
        recommendations = ['Immediate professional attention required', 'Comprehensive evaluation needed'];
      }
    }

    return {
      id: `${selectedTool!.id}-${Date.now()}`,
      userId: user!.id,
      toolId: selectedTool!.id,
      toolName: selectedTool!.name,
      score: totalScore,
      maxScore,
      riskLevel,
      recommendations,
      completedAt: new Date().toISOString(),
      responses
    };
  };

  const submitAssessment = () => {
    const result = calculateScore();
    setAssessmentResult(result);
    setIsCompleted(true);
    
    // In a real app, you'd save this to a database
    console.log('Assessment Result:', result);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-success';
      case 'moderate': return 'text-warning';
      case 'high': return 'text-error';
      case 'severe': return 'text-error font-bold';
      default: return 'text-base-content';
    }
  };

  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case 'low': return 'badge-success';
      case 'moderate': return 'badge-warning';
      case 'high': return 'badge-error';
      case 'severe': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  if (!selectedTool) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-base-content flex items-center justify-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            {t.title}
          </h1>
          <p className="text-base-content/70">{t.subtitle}</p>
        </div>

        {/* Assessment Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAssessmentTools.map((tool) => (
            <div key={tool.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <h3 className="card-title text-lg">{tool.name}</h3>
                <p className="text-base-content/70 text-sm mb-4">{tool.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-base-content/60 mb-4">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {tool.questions.length} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    ~{Math.ceil(tool.questions.length / 2)} min
                  </span>
                </div>

                <div className="card-actions justify-end">
                  <button
                    onClick={() => handleToolSelection(tool)}
                    className="btn btn-primary btn-sm"
                  >
                    {t.startAssessment}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* History Button */}
        <div className="text-center">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="btn btn-outline"
          >
            <TrendingUp className="w-4 h-4" />
            {t.viewHistory}
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted && assessmentResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Header */}
        <div className="text-center space-y-2">
          <CheckCircle className="w-16 h-16 text-success mx-auto" />
          <h1 className="text-3xl font-bold text-base-content">Assessment Complete</h1>
          <p className="text-base-content/70">{selectedTool.name}</p>
        </div>

        {/* Results Card */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Score */}
              <div className="stat">
                <div className="stat-title">{t.score}</div>
                <div className="stat-value text-primary">
                  {assessmentResult.score} / {assessmentResult.maxScore}
                </div>
              </div>

              {/* Risk Level */}
              <div className="stat">
                <div className="stat-title">{t.riskLevel}</div>
                <div className={`stat-value ${getRiskLevelColor(assessmentResult.riskLevel)}`}>
                  <span className={`badge ${getRiskLevelBadge(assessmentResult.riskLevel)} badge-lg`}>
                    {assessmentResult.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                {t.recommendations}
              </h3>
              <ul className="space-y-2">
                {assessmentResult.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-base-content/80">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergency Notice */}
            {assessmentResult.riskLevel === 'severe' && (
              <div className="alert alert-error mt-6">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <h4 className="font-semibold">{t.emergency}</h4>
                  <p>If you're experiencing thoughts of self-harm, please contact emergency services or a crisis helpline immediately.</p>
                </div>
              </div>
            )}

            <div className="card-actions justify-center mt-6">
              <button
                onClick={() => {
                  setSelectedTool(null);
                  setIsCompleted(false);
                  setAssessmentResult(null);
                }}
                className="btn btn-primary"
              >
                {t.restart}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = selectedTool.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / selectedTool.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-base-content">{selectedTool.name}</h1>
        <p className="text-base-content/70">
          {t.question} {currentQuestionIndex + 1} {t.of} {selectedTool.questions.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-base-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="text-xl font-semibold mb-6">{currentQuestion.text}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="cursor-pointer">
                <input
                  type="radio"
                  name="response"
                  value={option.score}
                  checked={responses[currentQuestionIndex] === option.score}
                  onChange={() => handleResponse(option.score)}
                  className="radio radio-primary mr-3"
                />
                <span className="text-base-content">{option.text}</span>
              </label>
            ))}
          </div>

          <div className="card-actions justify-between mt-8">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="btn btn-outline"
            >
              {t.previous}
            </button>

            {currentQuestionIndex === selectedTool.questions.length - 1 ? (
              <button
                onClick={submitAssessment}
                disabled={responses[currentQuestionIndex] === undefined}
                className="btn btn-primary"
              >
                {t.submit}
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                disabled={responses[currentQuestionIndex] === undefined}
                className="btn btn-primary"
              >
                {t.next}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentInterface;