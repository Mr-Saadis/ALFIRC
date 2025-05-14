// src/lib/analytics.js
export async function recordAnonymousEvent() {
  try {
    await fetch('/api/anonymousUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ }),
    });
  } catch (err) {
    console.error('Analytics event failed:', err);
  }
}

export async function recordView(questionId) {
  const res = await fetch('/api/views', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ questionId }),
  })
  if (!res.ok) throw new Error(`View tracking failed: ${res.status}`)
  return res.json()
}

export async function bookmarkAdd(questionId) {
  const res = await fetch('/api/bookmark', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ questionId }),
  })
  if (!res.ok) throw new Error(`View tracking failed: ${res.status}`)
  return res.json()
}
