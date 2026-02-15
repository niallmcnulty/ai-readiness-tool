import { Router } from 'express';
import { generatePdf } from '../services/pdfGenerator.js';

const router = Router();

// POST /api/report — generate and download PDF without emailing
router.post('/', async (req, res) => {
  try {
    const { schoolName, totalScore, readinessLevel, dimensionScores } = req.body;

    if (!schoolName || totalScore == null || !dimensionScores) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pdfBuffer = await generatePdf({
      schoolName,
      totalScore,
      readinessLevel,
      dimensionScores,
    });

    const filename = `AI-Readiness-Report-${schoolName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Report generation error:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;
