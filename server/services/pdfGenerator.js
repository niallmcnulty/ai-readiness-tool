import PDFDocument from 'pdfkit';

// Brand colours (hex strings for PDFKit)
const NAVY = '#1B3A4B';
const DEEP_NAVY = '#0B1D29';
const CORAL = '#E07A5F';
const SAND = '#D4C5B2';
const WARM_GREY = '#6B6B6B';
const SAGE = '#6B9080';
const SLATE = '#4A6FA5';

const DIMENSION_NAMES = ['Leadership', 'Policy', 'Infrastructure', 'Capacity', 'Curriculum'];
const DIMENSION_FULL = [
  'Leadership & Governance',
  'Policy & Ethics',
  'Infrastructure & Resources',
  'Staff Capacity',
  'Curriculum & Pedagogy',
];

const READINESS_LEVELS = [
  { min: 0, max: 40, label: 'Foundation Building', color: '#ef4444', description: 'Focus on governance and policy first' },
  { min: 41, max: 60, label: 'Early Adoption', color: '#f97316', description: 'Build staff capacity while strengthening infrastructure' },
  { min: 61, max: 80, label: 'Active Implementation', color: '#eab308', description: "Scale what's working; address remaining gaps" },
  { min: 81, max: 100, label: 'Transformation', color: '#22c55e', description: 'Lead innovation; share learning with others' },
];

const QUICK_WINS = {
  leadership: [
    'Designate an AI lead (even a part-time role)',
    'Add AI to your standing leadership meeting agenda',
    'Create a simple decision-making flowchart for new AI tools',
  ],
  policy: [
    'Adapt an existing AI acceptable use template for your school',
    'Run a staff session on academic integrity and AI',
    'Audit which AI tools are currently in use and what data they access',
  ],
  infrastructure: [
    'Test your bandwidth with AI tools during peak hours',
    'Survey current device availability across staff and students',
    'Create an inventory of AI tools already in use at your school',
  ],
  capacity: [
    'Start a voluntary AI exploration group for interested staff',
    'Share one AI tool demo per staff meeting',
    'Partner with another school that is further along in AI adoption',
  ],
  curriculum: [
    'Pilot AI integration in one subject area this term',
    'Redesign one assessment to be AI-appropriate',
    'Run a student AI literacy workshop',
  ],
};

function getLevel(score) {
  return READINESS_LEVELS.find((l) => score >= l.min && score <= l.max) || READINESS_LEVELS[0];
}

function drawRadarChart(doc, cx, cy, radius, scores) {
  const numAxes = 5;
  const levels = 5;

  const getPoint = (index, fraction) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * radius * fraction,
      y: cy + Math.sin(angle) * radius * fraction,
    };
  };

  // Concentric pentagon grid
  for (let level = 1; level <= levels; level++) {
    const frac = level / levels;
    const points = Array.from({ length: numAxes }, (_, i) => getPoint(i, frac));

    doc.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      doc.lineTo(points[i].x, points[i].y);
    }
    doc.closePath();
    doc.strokeColor(SAND).lineWidth(0.5).stroke();
  }

  // Axis lines (spokes)
  for (let i = 0; i < numAxes; i++) {
    const p = getPoint(i, 1);
    doc.moveTo(cx, cy).lineTo(p.x, p.y).strokeColor(SAND).lineWidth(0.5).stroke();
  }

  // Data polygon (filled) — coral with transparency
  const dataPoints = scores.map((s, i) => getPoint(i, s / 100));
  doc.save();
  doc.moveTo(dataPoints[0].x, dataPoints[0].y);
  for (let i = 1; i < dataPoints.length; i++) {
    doc.lineTo(dataPoints[i].x, dataPoints[i].y);
  }
  doc.closePath();
  doc.fillColor(CORAL).fillOpacity(0.25).fill();
  doc.restore();

  // Data polygon outline
  doc.save();
  doc.moveTo(dataPoints[0].x, dataPoints[0].y);
  for (let i = 1; i < dataPoints.length; i++) {
    doc.lineTo(dataPoints[i].x, dataPoints[i].y);
  }
  doc.closePath();
  doc.strokeColor(CORAL).lineWidth(2).stroke();
  doc.restore();

  // Data points (dots)
  dataPoints.forEach((p) => {
    doc.save();
    doc.circle(p.x, p.y, 3).fillColor(CORAL).fillOpacity(1).fill();
    doc.restore();
  });

  // Labels with scores
  const labelDist = radius + 20;
  DIMENSION_NAMES.forEach((label, i) => {
    const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
    const cosA = Math.cos(angle);
    const lx = cx + cosA * labelDist;
    const ly = cy + Math.sin(angle) * labelDist;

    let align = 'center';
    let offsetX = -35;
    if (cosA < -0.1) { align = 'right'; offsetX = -70; }
    else if (cosA > 0.1) { align = 'left'; offsetX = 0; }

    doc.save();
    doc.fontSize(8).fillColor(NAVY).fillOpacity(1).font('Helvetica-Bold');
    doc.text(label, lx + offsetX, ly - 10, { width: 70, align });
    doc.fontSize(8).fillColor(WARM_GREY).font('Helvetica');
    doc.text(`${scores[i]}%`, lx + offsetX, ly + 1, { width: 70, align });
    doc.restore();
  });
}

export function generatePdf(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 0 });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageW = 595.28;
      const margin = 50;
      const contentW = pageW - margin * 2;
      let y = 0;

      const scores = [
        data.dimensionScores.leadership || 0,
        data.dimensionScores.policy || 0,
        data.dimensionScores.infrastructure || 0,
        data.dimensionScores.capacity || 0,
        data.dimensionScores.curriculum || 0,
      ];

      const dimIds = ['leadership', 'policy', 'infrastructure', 'capacity', 'curriculum'];
      const totalScore = data.totalScore;
      const level = getLevel(totalScore);

      // --- Light header (no heavy block) ---
      y = 36;

      // Thin coral accent line at top
      doc.moveTo(margin, 24).lineTo(pageW - margin, 24).strokeColor(CORAL).lineWidth(2).stroke();

      doc.fillColor(NAVY).fontSize(20).font('Helvetica-Bold');
      doc.text('AI Readiness Report', margin, y);
      y += 22;
      doc.fontSize(10).font('Helvetica').fillColor(SLATE);
      doc.text('Framework for International Schools', margin, y);
      y += 20;

      // --- School info ---
      doc.fillColor(DEEP_NAVY).fontSize(16).font('Helvetica-Bold');
      doc.text(data.schoolName, margin, y);
      y += 20;
      doc.fontSize(9).font('Helvetica').fillColor(WARM_GREY);
      const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      doc.text(`Assessment Date: ${dateStr}`, margin, y);
      y += 18;

      // --- Radar Chart ---
      const chartCx = pageW / 2;
      const chartCy = y + 72;
      const chartRadius = 62;

      drawRadarChart(doc, chartCx, chartCy, chartRadius, scores);

      y = chartCy + chartRadius + 32;

      // --- Overall Score ---
      doc.save();
      doc.fillColor(NAVY).fontSize(32).font('Helvetica-Bold');
      doc.text(`${totalScore}%`, margin, y, { width: contentW, align: 'center' });
      y += 34;

      doc.fillColor(level.color).fontSize(12).font('Helvetica-Bold');
      doc.text(level.label, margin, y, { width: contentW, align: 'center' });
      y += 16;
      doc.fillColor(WARM_GREY).fontSize(9).font('Helvetica');
      doc.text(level.description, margin, y, { width: contentW, align: 'center' });
      y += 18;
      doc.restore();

      // --- Divider ---
      doc.moveTo(margin, y).lineTo(pageW - margin, y).strokeColor(SAND).lineWidth(0.5).stroke();
      y += 12;

      // --- Dimension Breakdown ---
      doc.fillColor(NAVY).fontSize(11).font('Helvetica-Bold');
      doc.text('Score by Dimension', margin, y);
      y += 16;

      const barX = margin + 130;
      const barW = contentW - 170;
      const barH = 9;

      DIMENSION_FULL.forEach((name, i) => {
        const score = scores[i];
        const dimLevel = getLevel(score);

        doc.save();
        doc.fontSize(9).font('Helvetica').fillColor(DEEP_NAVY);
        doc.text(name, margin, y + 1);

        // Background bar
        doc.roundedRect(barX, y, barW, barH, 3).fillColor(SAND).fillOpacity(0.3).fill();

        // Score bar with readiness colour
        if (score > 0) {
          const fillW = Math.max(6, (score / 100) * barW);
          doc.roundedRect(barX, y, fillW, barH, 3).fillColor(dimLevel.color).fillOpacity(1).fill();
        }

        // Score text
        doc.fillColor(WARM_GREY).fillOpacity(1).fontSize(9);
        doc.text(`${score}%`, barX + barW + 8, y + 1);
        doc.restore();

        y += 16;
      });

      y += 4;

      // --- Insights ---
      const lowestIdx = scores.indexOf(Math.min(...scores));
      const highestIdx = scores.indexOf(Math.max(...scores));

      doc.moveTo(margin, y).lineTo(pageW - margin, y).strokeColor(SAND).lineWidth(0.5).stroke();
      y += 10;

      // Strongest
      doc.save();
      doc.fontSize(9).font('Helvetica-Bold').fillColor(SAGE);
      doc.text('Strongest Area', margin, y);
      doc.font('Helvetica').fillColor(DEEP_NAVY);
      doc.text(`${DIMENSION_FULL[highestIdx]} (${scores[highestIdx]}%)`, margin + 80, y);

      // Focus
      doc.font('Helvetica-Bold').fillColor(CORAL);
      doc.text('Focus Area', pageW / 2 + 10, y);
      doc.font('Helvetica').fillColor(DEEP_NAVY);
      doc.text(`${DIMENSION_FULL[lowestIdx]} (${scores[lowestIdx]}%)`, pageW / 2 + 70, y);
      doc.restore();

      y += 18;

      // --- Quick Wins ---
      doc.moveTo(margin, y).lineTo(pageW - margin, y).strokeColor(SAND).lineWidth(0.5).stroke();
      y += 10;

      doc.fillColor(NAVY).fontSize(11).font('Helvetica-Bold');
      doc.text(`Quick Wins: ${DIMENSION_FULL[lowestIdx]}`, margin, y);
      y += 14;

      const wins = QUICK_WINS[dimIds[lowestIdx]] || [];
      wins.forEach((win) => {
        doc.save();
        doc.fontSize(9).fillColor(CORAL).font('Helvetica');
        doc.text('\u2022', margin + 4, y);
        doc.fillColor(DEEP_NAVY);
        doc.text(win, margin + 14, y, { width: contentW - 14 });
        doc.restore();
        y += 13;
      });

      y += 6;

      // --- Action Planning (more room for writing) ---
      doc.moveTo(margin, y).lineTo(pageW - margin, y).strokeColor(SAND).lineWidth(0.5).stroke();
      y += 10;

      doc.fillColor(NAVY).fontSize(11).font('Helvetica-Bold');
      doc.text('Your Action Plan', margin, y);
      y += 16;

      const actions = [
        { label: 'Action 1 (within 2 weeks)', desc: 'Quick win \u2014 no budget, no approval needed' },
        { label: 'Action 2 (this term)', desc: 'May need a conversation or small investment' },
        { label: 'Action 3 (this academic year)', desc: 'Your strategic move \u2014 be ambitious' },
      ];

      actions.forEach((action) => {
        doc.save();
        doc.fontSize(9).font('Helvetica-Bold').fillColor(NAVY);
        doc.text(action.label, margin, y);
        doc.restore();
        y += 11;
        doc.save();
        doc.font('Helvetica').fillColor(WARM_GREY).fontSize(8);
        doc.text(action.desc, margin, y);
        doc.restore();
        y += 32;
        // Dotted line for writing
        doc.moveTo(margin, y).lineTo(pageW - margin, y).strokeColor(SAND).lineWidth(0.3).dash(2, { space: 2 }).stroke();
        doc.undash();
        y += 18;
      });

      // --- Footer ---
      const footerY = 800;
      doc.moveTo(margin, footerY).lineTo(pageW - margin, footerY).strokeColor(CORAL).lineWidth(1).stroke();

      doc.save();
      doc.fontSize(7.5).fillColor(WARM_GREY).font('Helvetica');
      doc.text('AI Readiness Framework', margin, footerY + 6);
      doc.text('Niall McNulty | Product Lead for AI, Cambridge University Press & Assessment', margin, footerY + 16);
      doc.restore();

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
