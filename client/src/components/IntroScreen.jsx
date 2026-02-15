import React from 'react';
import { dimensions } from '../data/dimensions';
import DimensionIcon from './DimensionIcon';

export default function IntroScreen({ name, email, schoolName, onNameChange, onEmailChange, onSchoolChange, onStart }) {
  const canStart = name.trim().length > 0 && email.trim().length > 0 && schoolName.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-navy-deep flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">AI Readiness Assessment</h1>
          <p className="text-warm-grey">Framework for International Schools</p>
        </div>

        <div className="space-y-6 mb-8">
          <p className="text-navy-deep">
            This assessment will help you understand your school's readiness to adopt AI across five key dimensions.
            It takes about 5 minutes to complete.
          </p>

          <div className="grid grid-cols-5 gap-2 text-center">
            {dimensions.map((dim) => (
              <div key={dim.id} className="p-2">
                <div className="flex justify-center mb-1 text-slate">
                  <DimensionIcon dimensionId={dim.id} size={28} />
                </div>
                <div className="text-xs text-warm-grey">{dim.name.split('&')[0].trim()}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-deep mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="e.g. Jane Mensah"
                className="w-full px-4 py-3 border border-sand rounded-lg focus:ring-2 focus:ring-coral focus:border-coral outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-deep mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="jane@school.edu.gh"
                className="w-full px-4 py-3 border border-sand rounded-lg focus:ring-2 focus:ring-coral focus:border-coral outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-deep mb-1">School Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => onSchoolChange(e.target.value)}
                placeholder="e.g. Accra International School"
                className="w-full px-4 py-3 border border-sand rounded-lg focus:ring-2 focus:ring-coral focus:border-coral outline-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          disabled={!canStart}
          className="w-full py-4 bg-coral text-white rounded-lg font-semibold hover:bg-coral/90 disabled:bg-sand disabled:text-warm-grey disabled:cursor-not-allowed transition-colors"
        >
          Start Assessment
        </button>

        <p className="text-xs text-center text-warm-grey mt-4">
          The AI Readiness Framework
        </p>
      </div>
    </div>
  );
}
