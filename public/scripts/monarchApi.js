export async function login(username, password, deviceUuid, otp = null) {
  const res = await fetch('/.netlify/functions/monarchLogin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, deviceUuid, otp })
  });
  return res.json();
}

export async function fetchAccounts(token) {
  const res = await fetch('/.netlify/functions/monarchAccounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  return res.json();
}

export async function mapAccounts(token, mappings) {
  const res = await fetch('/.netlify/functions/mapAccounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, mappings })
  });
  return res.json();
}

export async function generateStatements(accounts) {
  const res = await fetch('/.netlify/functions/generateStatements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accounts })
  });
  return res.json();
}
