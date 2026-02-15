import { dimensions, readinessLevels } from '../data/dimensions';

export function calculateDimensionScore(dimension, answers) {
  const questionIds = dimension.questions.map((q) => q.id);
  const answered = questionIds.filter((id) => answers[id] !== undefined);
  if (answered.length === 0) return 0;
  const sum = answered.reduce((acc, id) => acc + answers[id], 0);
  return Math.round((sum / (answered.length * 5)) * 100);
}

export function calculateTotalScore(answers) {
  const allQuestions = dimensions.flatMap((d) => d.questions);
  const answered = allQuestions.filter((q) => answers[q.id] !== undefined);
  if (answered.length === 0) return 0;
  const sum = answered.reduce((acc, q) => acc + answers[q.id], 0);
  return Math.round((sum / (answered.length * 5)) * 100);
}

export function getReadinessLevel(score) {
  return readinessLevels.find((level) => score >= level.min && score <= level.max) || readinessLevels[0];
}

export function getAllDimensionScores(answers) {
  return dimensions.map((dim) => ({
    id: dim.id,
    name: dim.name,
    score: calculateDimensionScore(dim, answers),
  }));
}

export function getLowestDimension(answers) {
  return dimensions.reduce((lowest, dim) => {
    return calculateDimensionScore(dim, answers) < calculateDimensionScore(lowest, answers) ? dim : lowest;
  }, dimensions[0]);
}

export function getHighestDimension(answers) {
  return dimensions.reduce((highest, dim) => {
    return calculateDimensionScore(dim, answers) > calculateDimensionScore(highest, answers) ? dim : highest;
  }, dimensions[0]);
}
