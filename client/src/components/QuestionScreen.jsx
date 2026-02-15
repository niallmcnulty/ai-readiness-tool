import React from 'react';
import DimensionIcon from './DimensionIcon';

export default function QuestionScreen({ dimension, stepIndex, answers, onAnswer, onNext, onBack }) {
  const allAnswered = dimension.questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-navy-deep p-4">
      <div className="max-w-xl mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70 text-sm">Dimension {stepIndex} of 5</span>
            <span className="text-white/70 text-sm">{Math.round((stepIndex / 5) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-coral rounded-full transition-all duration-300"
              style={{ width: `${(stepIndex / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Dimension Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-warm-white rounded-xl flex items-center justify-center text-slate">
              <DimensionIcon dimensionId={dimension.id} size={26} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy">{dimension.name}</h2>
              <p className="text-sm text-warm-grey">{dimension.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            {dimension.questions.map((question, idx) => (
              <div key={question.id} className="space-y-3">
                <p className="text-navy-deep font-medium">
                  {idx + 1}. {question.text}
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => onAnswer(question.id, value)}
                      className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                        answers[question.id] === value
                          ? 'bg-coral text-white shadow-md'
                          : 'bg-warm-white text-navy-deep hover:bg-sand/50'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-warm-grey">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {stepIndex > 1 && (
            <button
              onClick={onBack}
              className="flex-1 py-4 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={onNext}
            disabled={!allAnswered}
            className="flex-1 py-4 bg-white text-navy rounded-lg font-semibold hover:bg-warm-white disabled:bg-white/50 disabled:text-warm-grey disabled:cursor-not-allowed transition-colors"
          >
            {stepIndex === 5 ? 'See Results' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
