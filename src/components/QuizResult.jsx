import React from 'react';

const QuizResult = ({ results, onRestart }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Excellent! 🏆';
    if (score >= 80) return 'Great job! 🎉';
    if (score >= 70) return 'Good work! 👍';
    if (score >= 60) return 'Not bad! 👌';
    return 'Keep practicing! 💪';
  };

  const getPerformanceIcon = (score) => {
    if (score >= 80) return '🌟';
    if (score >= 60) return '⭐';
    return '📚';
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{getPerformanceIcon(results.score)}</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
        <p className="text-xl text-gray-600">{getScoreMessage(results.score)}</p>
      </div>

      {/* Score Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={results.score >= 80 ? '#10b981' : results.score >= 60 ? '#f59e0b' : '#ef4444'}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2.51 * results.score} 251.2`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor(results.score)}`}>
              {results.score}%
            </span>
          </div>
        </div>
      </div>

      {/* Results Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{results.correct}</div>
          <div className="text-green-800 font-medium">Correct</div>
          <div className="text-sm text-green-600 mt-1">
            {Math.round((results.correct / results.total) * 100)}%
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">{results.incorrect}</div>
          <div className="text-red-800 font-medium">Incorrect</div>
          <div className="text-sm text-red-600 mt-1">
            {Math.round((results.incorrect / results.total) * 100)}%
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-gray-600 mb-2">{results.unanswered}</div>
          <div className="text-gray-800 font-medium">Unanswered</div>
          <div className="text-sm text-gray-600 mt-1">
            {Math.round((results.unanswered / results.total) * 100)}%
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz Summary</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Total Questions:</span>
            <span className="font-medium">{results.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Questions Attempted:</span>
            <span className="font-medium">{results.correct + results.incorrect}</span>
          </div>
          <div className="flex justify-between">
            <span>Accuracy Rate:</span>
            <span className="font-medium">
              {results.correct + results.incorrect > 0 
                ? Math.round((results.correct / (results.correct + results.incorrect)) * 100)
                : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Performance Badge */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
          results.score >= 90 ? 'bg-yellow-100 text-yellow-800' :
          results.score >= 80 ? 'bg-green-100 text-green-800' :
          results.score >= 70 ? 'bg-blue-100 text-blue-800' :
          results.score >= 60 ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          {results.score >= 90 ? '🥇 Master' :
           results.score >= 80 ? '🥈 Expert' :
           results.score >= 70 ? '🥉 Proficient' :
           results.score >= 60 ? '📖 Learner' :
           '🔰 Beginner'}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRestart}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Take Another Quiz
        </button>
        
        <button
          onClick={() => {
            const shareText = `I just scored ${results.score}% on a quiz! 🎯\n\n` +
              `✅ Correct: ${results.correct}\n` +
              `❌ Incorrect: ${results.incorrect}\n` +
              `⏭️ Unanswered: ${results.unanswered}\n\n` +
              `${getScoreMessage(results.score)}`;
            
            if (navigator.share) {
              navigator.share({
                title: 'My Quiz Results',
                text: shareText
              });
            } else {
              navigator.clipboard.writeText(shareText);
              alert('Results copied to clipboard!');
            }
          }}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Share Results
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
