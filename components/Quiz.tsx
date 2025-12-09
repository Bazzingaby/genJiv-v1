import React, { useState, useEffect } from 'react';
import { generateQuiz } from '../services/gemini';
import { QuizQuestion } from '../types';

interface QuizProps {
  onComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadQuiz = async () => {
    setLoading(true);
    const qs = await generateQuiz("Endangered Species and Habitat Conservation");
    setQuestions(qs);
    setLoading(false);
  };

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === questions[currentQ].correctAnswer) {
      setScore(s => s + 100);
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else {
      onComplete(score);
    }
  };

  if (loading) return <div className="p-8 text-center text-jungle-green font-bold text-xl animate-pulse">Loading Quiz Challenge...</div>;
  if (questions.length === 0) return <div className="p-8 text-center">Failed to load quiz. Try again later.</div>;

  const q = questions[currentQ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto border-t-8 border-jungle-green">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">Question {currentQ + 1} of {questions.length}</span>
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm">Score: {score}</span>
      </div>

      <h3 className="text-xl md:text-2xl font-display font-bold text-gray-800 mb-6">{q.question}</h3>

      <div className="space-y-3">
        {q.options.map((opt, idx) => {
          let btnClass = "w-full text-left p-4 rounded-xl font-bold transition-all border-2 ";
          if (showExplanation) {
             if (idx === q.correctAnswer) btnClass += "bg-green-100 border-green-500 text-green-800";
             else if (idx === selectedOption) btnClass += "bg-red-100 border-red-500 text-red-800";
             else btnClass += "border-gray-100 text-gray-400";
          } else {
             btnClass += "bg-gray-50 border-gray-100 hover:border-jungle-green hover:bg-green-50 text-gray-700";
          }

          return (
            <button
              key={idx}
              onClick={() => !showExplanation && handleAnswer(idx)}
              className={btnClass}
              disabled={showExplanation}
            >
              <span className="mr-2 opacity-50">{String.fromCharCode(65 + idx)}.</span> {opt}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="mt-6 animate-fade-in">
          <div className={`p-4 rounded-xl mb-4 ${selectedOption === q.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
            <p className="font-bold mb-1">{selectedOption === q.correctAnswer ? '🎉 Correct!' : '🤔 Not quite...'}</p>
            <p className="text-sm">{q.explanation}</p>
          </div>
          <button 
            onClick={nextQuestion}
            className="w-full py-3 bg-jungle-green text-white font-bold rounded-xl hover:bg-deep-forest transition-colors shadow-lg"
          >
            {currentQ === questions.length - 1 ? 'Finish Quiz' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;