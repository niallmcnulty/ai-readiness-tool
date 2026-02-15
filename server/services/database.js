import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db;

export function initDatabase(dbPath) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      school_name TEXT NOT NULL,
      total_score INTEGER NOT NULL,
      readiness_level TEXT NOT NULL,
      score_leadership INTEGER,
      score_policy INTEGER,
      score_infrastructure INTEGER,
      score_capacity INTEGER,
      score_curriculum INTEGER,
      answers_json TEXT NOT NULL
    )
  `);

  return db;
}

export function insertAssessment(assessment) {
  const stmt = db.prepare(`
    INSERT INTO assessments (id, created_at, name, email, school_name, total_score, readiness_level,
      score_leadership, score_policy, score_infrastructure, score_capacity, score_curriculum, answers_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    assessment.id,
    assessment.createdAt,
    assessment.name,
    assessment.email,
    assessment.schoolName,
    assessment.totalScore,
    assessment.readinessLevel,
    assessment.dimensionScores.leadership,
    assessment.dimensionScores.policy,
    assessment.dimensionScores.infrastructure,
    assessment.dimensionScores.capacity,
    assessment.dimensionScores.curriculum,
    JSON.stringify(assessment.answers)
  );
}

export function getAssessmentCount() {
  return db.prepare('SELECT COUNT(*) as count FROM assessments').get().count;
}

export function getDatabase() {
  return db;
}
