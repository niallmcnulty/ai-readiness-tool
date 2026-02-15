import React, { useState, useEffect } from 'react';
import { dimensions } from './data/dimensions';
import { retryPendingSubmission } from './utils/api';
import IntroScreen from './components/IntroScreen';
import QuestionScreen from './components/QuestionScreen';
import ResultsScreen from './components/ResultsScreen';

const STORAGE_KEY = 'mcnulty-ai-readiness';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0); // 0=intro, 1-5=dimensions, 6=results
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [schoolName, setSchoolName] = useState('');

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.answers) setAnswers(data.answers);
        if (data.name) setName(data.name);
        if (data.email) setEmail(data.email);
        if (data.schoolName) setSchoolName(data.schoolName);
        if (data.currentStep != null) setCurrentStep(data.currentStep);
      }
    } catch {}
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, name, email, schoolName, currentStep }));
    } catch {}
  }, [answers, name, email, schoolName, currentStep]);

  // Retry any pending submissions when back online
  useEffect(() => {
    const handler = () => retryPendingSubmission();
    window.addEventListener('online', handler);
    retryPendingSubmission();
    return () => window.removeEventListener('online', handler);
  }, []);

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const clearAndRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setName('');
    setEmail('');
    setSchoolName('');
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  if (currentStep === 0) {
    return (
      <IntroScreen
        name={name}
        email={email}
        schoolName={schoolName}
        onNameChange={setName}
        onEmailChange={setEmail}
        onSchoolChange={setSchoolName}
        onStart={() => setCurrentStep(1)}
      />
    );
  }

  if (currentStep === 6) {
    return (
      <ResultsScreen
        name={name}
        email={email}
        schoolName={schoolName}
        answers={answers}
        onRestart={clearAndRestart}
      />
    );
  }

  const currentDimension = dimensions[currentStep - 1];

  return (
    <QuestionScreen
      dimension={currentDimension}
      stepIndex={currentStep}
      answers={answers}
      onAnswer={handleAnswer}
      onNext={() => setCurrentStep(currentStep + 1)}
      onBack={() => setCurrentStep(currentStep - 1)}
    />
  );
}
