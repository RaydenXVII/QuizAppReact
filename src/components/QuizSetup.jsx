import React, { useState } from 'react';
import axios from 'axios';

const QuizSetup = ({ onStartQuiz }) => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    amount: 10,
    category: '',
    difficulty: '',
    type: '',
    timeLimit: 300
  });

  const categories = [
    { id: '', name: 'Any Category' },
    { id: '9', name: 'General Knowledge' },
    { id: '17', name: 'Science & Nature' },
    { id: '18', name: 'Science: Computers' },
    { id: '19', name: 'Science: Mathematics' },
    { id: '21', name: 'Sports' },
    { id: '22', name: 'Geography' },
    { id: '23', name: 'History' },
    { id: '27', name: 'Animals' }
  ];

  const difficulties = [
    { value: '', label: 'Any Difficulty' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const types = [
    { value: '', label: 'Any Type' },
    { value: 'multiple', label: 'Multiple Choice' },
    { value: 'boolean', label: 'True / False' }
  ];

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let url = `https://opentdb.com/api.php?amount=${settings.amount}`;
      if (settings.category) url += `&category=${settings.category}`;
      if (settings.difficulty) url += `&difficulty=${settings.difficulty}`;
      if (settings.type) url += `&type=${settings.type}`;

      const response = await axios.get(url);
      
      if (response.data.response_code === 0) {
        const quizData = {
          questions: response.data.results.map(q => ({
            ...q,
            all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
          })),
          timeLimit: settings.timeLimit,
          totalQuestions: response.data.results.length
        };
        onStartQuiz(quizData);
      } else {
        alert('Failed to fetch questions. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Error fetching questions. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Setup Your Quiz</h2>
        <p className="text-gray-600">Configure your quiz preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={settings.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Limit (seconds)
          </label>
          <input
            type="number"
            min="60"
            max="3600"
            value={settings.timeLimit}
            onChange={(e) => handleInputChange('timeLimit', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={settings.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={settings.difficulty}
            onChange={(e) => handleInputChange('difficulty', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {difficulties.map(diff => (
              <option key={diff.value} value={diff.value}>{diff.label}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Type
          </label>
          <select
            value={settings.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {types.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>      <button
        onClick={fetchQuestions}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Loading Questions...
          </>
        ) : (
          'Start Quiz'
        )}
      </button>
    </div>
  );
};

export default QuizSetup;
