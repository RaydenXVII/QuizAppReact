import React, { useState, useEffect } from 'react';

const Quiz = ({ quizData, answers, onAnswer, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(quizData.timeLimit);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const answeredCount = answers.filter(answer => answer !== null).length;

  useEffect(() => {
    const savedTime = localStorage.getItem('quiz_time_remaining');
    if (savedTime) {
      setTimeRemaining(parseInt(savedTime));
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        localStorage.setItem('quiz_time_remaining', newTime.toString());
        
        if (newTime <= 0) {
          handleTimeUp();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); 
  useEffet(() => {
    const lastAnsweredIndex = answers.findIndex(answer => answer === null);
    if (lastAnsweredIndex !== -1) {
      setCurrentQuestionIndex(lastAnsweredIndex);
    }
  }, []); 

  useEffect(() => {
    if (answers.every(answer => answer !== null) && answers.length === quizData.questions.length) {
      setTimeout(() => {
        handleQuizComplete();
      }, 1500); 
    }
  }, [answers]);

  const handleTimeUp = () => {
    const results = calculateResults();
    onComplete(results);
  };  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    
    onAnswer(currentQuestionIndex, answer);
    
    setTimeout(() => {
      if (currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      }
    }, 1000); 
  };

  const handleQuizComplete = () => {
    const results = calculateResults();
    onComplete(results);
  };

  const calculateResults = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    answers.forEach((answer, index) => {
      if (answer === null) {
        unanswered++;
      } else if (answer === quizData.questions[index].correct_answer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    return {
      correct,
      incorrect,
      unanswered,
      total: quizData.questions.length,
      score: Math.round((correct / quizData.questions.length) * 100)
    };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-6">
          <div className="text-sm font-medium text-gray-600">
            Question {currentQuestionIndex + 1} of {quizData.questions.length}
          </div>
          <div className="text-sm font-medium text-gray-600">
            Answered: {answeredCount}/{quizData.questions.length}
          </div>
        </div>
        <div className={`text-lg font-bold ${timeRemaining <= 60 ? 'text-red-600' : 'text-blue-600'}`}>
          ⏰ {formatTime(timeRemaining)}
        </div>
      </div>

      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {currentQuestion.category}
          </span>
          <span className={`ml-2 text-xs font-medium px-2.5 py-0.5 rounded ${
            currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {decodeHTML(currentQuestion.question)}
        </h2>
      </div>

      <div className="space-y-4">
        {currentQuestion.all_answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(answer)}
            disabled={selectedAnswer !== null}
            className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
              selectedAnswer === null
                ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                : selectedAnswer === answer
                  ? answer === currentQuestion.correct_answer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-red-500 bg-red-50 text-red-800'
                  : answer === currentQuestion.correct_answer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
            }`}
          >
            <div className="flex items-center">
              <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium mr-4">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-lg">{decodeHTML(answer)}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => handleAnswerSelect(null)}
          className="px-6 py-2 text-gray-500 hover:text-gray-700 text-sm"
        >
          Skip Question
        </button>
      </div>
    </div>
  );
};

export default Quiz;
