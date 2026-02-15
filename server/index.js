import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { initDatabase } from './services/database.js';
import { initEmail } from './services/emailService.js';
import submitRoute from './routes/submit.js';
import reportRoute from './routes/report.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'data', 'assessments.db');
initDatabase(dbPath);
initEmail();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/submit', submitRoute);
app.use('/api/report', reportRoute);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Serve static frontend (production)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AI Readiness Tool running on http://localhost:${PORT}`);
});
