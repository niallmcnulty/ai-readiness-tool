const PENDING_KEY = 'mcnulty-ai-readiness-pending';

export async function submitAssessment(data) {
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    clearPendingSubmission();
    return result;
  } catch (err) {
    savePendingSubmission(data);
    throw err;
  }
}

export async function downloadPdf(data) {
  const response = await fetch('/api/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AI-Readiness-Report-${data.schoolName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function savePendingSubmission(data) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {}
}

function clearPendingSubmission() {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {}
}

export async function retryPendingSubmission() {
  try {
    const pending = localStorage.getItem(PENDING_KEY);
    if (!pending) return null;

    const { data } = JSON.parse(pending);
    return await submitAssessment(data);
  } catch {
    return null;
  }
}
