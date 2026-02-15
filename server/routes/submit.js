import { Router } from 'express';
import { randomUUID } from 'crypto';
import { insertAssessment } from '../services/database.js';
import { generatePdf } from '../services/pdfGenerator.js';
import { sendReport } from '../services/emailService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, schoolName, answers, totalScore, readinessLevel, dimensionScores } = req.body;

    // Validation
    if (!name || !email || !schoolName || !answers || totalScore == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = randomUUID();
    const createdAt = new Date().toISOString();

    // Store in database
    insertAssessment({
      id,
      createdAt,
      name,
      email,
      schoolName,
      totalScore,
      readinessLevel,
      dimensionScores,
      answers,
    });

    // Generate PDF
    const pdfBuffer = await generatePdf({
      schoolName,
      totalScore,
      readinessLevel,
      dimensionScores,
    });

    // Send email
    try {
      await sendReport({
        to: email,
        name,
        schoolName,
        totalScore,
        readinessLevel,
        pdfBuffer,
      });
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
      // Don't fail the whole request if email fails — data is saved
      return res.json({
        success: true,
        id,
        emailSent: false,
        message: 'Assessment saved but email could not be sent. Please use the download button.',
      });
    }

    res.json({
      success: true,
      id,
      emailSent: true,
      message: `Report sent to ${email}`,
    });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

export default router;
