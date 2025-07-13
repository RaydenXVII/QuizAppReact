import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import QuizSetup from './components/QuizSetup';
import Quiz from './components/Quiz';
import QuizResult from './components/QuizResult';
import './App.css';

const STORAGE_KEYS = {
  USER: 'quiz_user',
  QUIZ_STATE: 'quiz_state',
  QUIZ_ANSWERS: 'quiz_answers',
  QUIZ_TIME: 'quiz_time_remaining'
};

function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [quizData, setQuizData] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const savedQuizState = localStorage.getItem(STORAGE_KEYS.QUIZ_STATE);
    const savedAnswers = localStorage.getItem(STORAGE_KEYS.QUIZ_ANSWERS);

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      
      if (savedQuizState && savedAnswers) {
        setQuizData(JSON.parse(savedQuizState));
        setQuizAnswers(JSON.parse(savedAnswers));
        setCurrentScreen('quiz');
      } else {
        setCurrentScreen('setup');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setCurrentScreen('setup');
  };

  const handleStartQuiz = (quiz) => {
    setQuizData(quiz);
    setQuizAnswers(new Array(quiz.questions.length).fill(null));
    setCurrentScreen('quiz');
    
    localStorage.setItem(STORAGE_KEYS.QUIZ_STATE, JSON.stringify(quiz));
    localStorage.setItem(STORAGE_KEYS.QUIZ_ANSWERS, JSON.stringify(new Array(quiz.questions.length).fill(null)));
  };

  const handleQuizAnswer = (questionIndex, answer) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answer;
    setQuizAnswers(newAnswers);
    
    localStorage.setItem(STORAGE_KEYS.QUIZ_ANSWERS, JSON.stringify(newAnswers));
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setCurrentScreen('results');
    
    localStorage.removeItem(STORAGE_KEYS.QUIZ_STATE);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_ANSWERS);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_TIME);
  };

  const handleRestartQuiz = () => {
    setQuizData(null);
    setQuizAnswers([]);
    setQuizResults(null);
    setCurrentScreen('setup');
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_STATE);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_ANSWERS);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_TIME);
    
    setUser(null);
    setQuizData(null);
    setQuizAnswers([]);
    setQuizResults(null);
    setCurrentScreen('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {user && (
          <header className="mb-8 flex justify-between items-center bg-white rounded-lg shadow-md p-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quiz App</h1>
              <p className="text-gray-600">Welcome, {user.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </header>
        )}

        {currentScreen === 'login' && (
          <LoginForm onLogin={handleLogin} />
        )}

        {currentScreen === 'setup' && (
          <QuizSetup onStartQuiz={handleStartQuiz} />
        )}

        {currentScreen === 'quiz' && quizData && (
          <Quiz
            quizData={quizData}
            answers={quizAnswers}
            onAnswer={handleQuizAnswer}
            onComplete={handleQuizComplete}
          />
        )}

        {currentScreen === 'results' && quizResults && (
          <QuizResult
            results={quizResults}
            onRestart={handleRestartQuiz}
          />
        )}
      </div>
    </div>
  );
}

export default App;
