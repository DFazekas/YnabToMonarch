export async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const errorRes = await res.json();
  if (!res.ok) throw new Error(errorRes.error || errorRes.message || 'API error');
  return res.json();
}
