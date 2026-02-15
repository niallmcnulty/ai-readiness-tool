import React, { useState } from 'react';
import { dimensions, quickWins } from '../data/dimensions';
import { calculateDimensionScore, calculateTotalScore, getReadinessLevel, getLowestDimension, getHighestDimension } from '../utils/scoring';
import { submitAssessment, downloadPdf } from '../utils/api';
import RadarChart from './RadarChart';
import DimensionIcon from './DimensionIcon';

export default function ResultsScreen({ name, email, schoolName, answers, onRestart }) {
  const [emailStatus, setEmailStatus] = useState(null); // null | 'sending' | 'sent' | 'error'
  const [downloadStatus, setDownloadStatus] = useState(null); // null | 'downloading' | 'error'

  const totalScore = calculateTotalScore(answers);
  const level = getReadinessLevel(totalScore);
  const lowest = getLowestDimension(answers);
  const highest = getHighestDimension(answers);
  const lowestScore = calculateDimensionScore(lowest, answers);
  const highestScore = calculateDimensionScore(highest, answers);
  const focusWins = quickWins[lowest.id] || [];

  const radarScores = dimensions.map((dim) => calculateDimensionScore(dim, answers));
  const dimensionScores = {};
  dimensions.forEach((dim) => {
    dimensionScores[dim.id] = calculateDimensionScore(dim, answers);
  });

  const payload = {
    name,
    email,
    schoolName,
    answers,
    totalScore,
    readinessLevel: level.label,
    dimensionScores,
  };

  const handleEmail = async () => {
    setEmailStatus('sending');
    try {
      await submitAssessment(payload);
      setEmailStatus('sent');
    } catch {
      setEmailStatus('error');
    }
  };

  const handleDownload = async () => {
    setDownloadStatus('downloading');
    try {
      await downloadPdf(payload);
      setDownloadStatus(null);
    } catch {
      setDownloadStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-navy-deep p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-navy mb-1">{schoolName}</h1>
            <p className="text-warm-grey">AI Readiness Assessment Results</p>
          </div>

          {/* Radar Chart */}
          <div className="mb-8">
            <RadarChart scores={radarScores} size={400} />
          </div>

          {/* Overall Score */}
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-navy mb-2">{totalScore}%</div>
            <span
              className="inline-block px-4 py-2 rounded-full text-white font-semibold text-sm"
              style={{ backgroundColor: level.color }}
            >
              {level.label}
            </span>
            <p className="text-warm-grey mt-2 text-sm">{level.description}</p>
          </div>

          {/* Dimension Breakdown */}
          <div className="space-y-3 mb-8">
            <h3 className="font-semibold text-navy">Score by Dimension</h3>
            {dimensions.map((dim) => {
              const score = calculateDimensionScore(dim, answers);
              const dimLevel = getReadinessLevel(score);
              return (
                <div key={dim.id} className="flex items-center gap-3">
                  <div className="w-8 flex justify-center text-slate">
                    <DimensionIcon dimensionId={dim.id} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-navy-deep">{dim.name}</span>
                      <span className="text-warm-grey">{score}%</span>
                    </div>
                    <div className="h-3 bg-warm-white rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${score}%`, backgroundColor: dimLevel.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Insights */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-sage/10 border border-sage/30 rounded-lg p-4">
              <div className="text-sage font-semibold mb-1 text-sm">Strongest Area</div>
              <div className="text-navy-deep font-medium">{highest.name}</div>
              <div className="text-sm text-warm-grey">{highestScore}%</div>
            </div>
            <div className="bg-coral/10 border border-coral/30 rounded-lg p-4">
              <div className="text-coral font-semibold mb-1 text-sm">Focus Area</div>
              <div className="text-navy-deep font-medium">{lowest.name}</div>
              <div className="text-sm text-warm-grey">{lowestScore}%</div>
            </div>
          </div>

          {/* Quick Wins */}
          <div className="bg-warm-white border border-sand rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-navy mb-3">
              Quick wins for {lowest.name}
            </h3>
            <ul className="space-y-2">
              {focusWins.map((win, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-navy-deep">
                  <span className="text-coral mt-0.5">&#x2022;</span>
                  <span>{win}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleDownload}
              disabled={downloadStatus === 'downloading'}
              className="w-full py-4 bg-navy text-white rounded-lg font-semibold hover:bg-navy-deep transition-colors disabled:opacity-60"
            >
              {downloadStatus === 'downloading' ? 'Generating PDF...' : downloadStatus === 'error' ? 'Download failed \u2014 try again' : 'Download Report (PDF)'}
            </button>
            <button
              onClick={handleEmail}
              disabled={emailStatus === 'sending' || emailStatus === 'sent'}
              className="w-full py-4 bg-coral text-white rounded-lg font-semibold hover:bg-coral/90 transition-colors disabled:opacity-60"
            >
              {emailStatus === 'sending'
                ? 'Sending...'
                : emailStatus === 'sent'
                  ? 'Report sent \u2014 check your inbox'
                  : emailStatus === 'error'
                    ? 'Send failed \u2014 try again'
                    : 'Email My Report'}
            </button>
            <button
              onClick={onRestart}
              className="w-full py-2 text-navy font-medium hover:bg-warm-white rounded-lg transition-colors text-sm"
            >
              Start New Assessment
            </button>
          </div>
        </div>

        <div className="text-center text-white/60 text-sm">
          AI Readiness Framework | niallmcnulty.com
        </div>
      </div>
    </div>
  );
}
