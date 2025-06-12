export async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  const data = await res.json();
  
  if (!res.ok) throw new Error(data.error || data.message || 'API error');
  
  return data
}
