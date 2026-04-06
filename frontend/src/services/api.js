const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function triageIssue(title, description) {
  const response = await fetch(`${BASE_URL}/api/triage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
