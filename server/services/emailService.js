import { Resend } from 'resend';

let resend;

export function initEmail() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 're_xxxxx') {
    console.warn('Resend API key not configured — emails will be skipped');
    return;
  }
  resend = new Resend(apiKey);
}

export async function sendReport({ to, name, schoolName, totalScore, readinessLevel, pdfBuffer }) {
  if (!resend) {
    console.warn(`Email skipped (no API key): would send to ${to}`);
    return { skipped: true };
  }

  const fromEmail = process.env.FROM_EMAIL || 'report@niallmcnulty.com';
  const filename = `AI-Readiness-Report-${schoolName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;

  const { data, error } = await resend.emails.send({
    from: `Niall McNulty <${fromEmail}>`,
    to: [to],
    subject: `Your AI Readiness Report \u2014 ${schoolName}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0B1D29;">
        <div style="background-color: #1B3A4B; padding: 24px 32px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #FAF9F6; font-size: 20px; margin: 0;">AI Readiness Report</h1>
          <p style="color: #FAF9F6; opacity: 0.8; font-size: 13px; margin: 6px 0 0;">The McNulty Framework for International Schools</p>
        </div>

        <div style="padding: 32px; border: 1px solid #D4C5B2; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${name},</p>

          <p>Thank you for completing the AI Readiness Assessment for <strong>${schoolName}</strong>.</p>

          <p>Your school's overall readiness score is <strong>${totalScore}%</strong> \u2014 <strong>${readinessLevel}</strong>.</p>

          <p>Your personalised report is attached as a PDF. It includes:</p>
          <ul style="color: #0B1D29;">
            <li>Radar chart showing your score across 5 dimensions</li>
            <li>Your strongest area and priority focus area</li>
            <li>Quick wins you can implement immediately</li>
            <li>An action planning framework</li>
          </ul>

          <p><strong>Next steps:</strong></p>
          <ul>
            <li>Review the report with your leadership team</li>
            <li>Identify one quick win to implement in the next 2 weeks</li>
            <li>Connect with me for a follow-up conversation</li>
          </ul>

          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #D4C5B2;">
            <p style="margin: 0; font-weight: 600; color: #1B3A4B;">Niall McNulty</p>
            <p style="margin: 4px 0; color: #6B6B6B; font-size: 13px;">Product Lead for AI, Cambridge University Press & Assessment</p>
            <p style="margin: 4px 0; font-size: 13px;">
              <a href="https://niallmcnulty.com" style="color: #E07A5F;">niallmcnulty.com</a>
              &nbsp;\u00B7&nbsp;
              <a href="https://linkedin.com/in/niallmcnulty" style="color: #E07A5F;">LinkedIn</a>
            </p>
          </div>
        </div>
      </div>
    `,
    attachments: [
      {
        filename,
        content: pdfBuffer.toString('base64'),
        contentType: 'application/pdf',
      },
    ],
  });

  if (error) {
    throw new Error(`Email send failed: ${error.message}`);
  }

  return data;
}
