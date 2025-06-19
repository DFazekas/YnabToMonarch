/**
 * Sends a POST request with a JSON payload and parses the JSON response.
 *
 * Automatically stringifies the body and sets the appropriate `Content-Type` header.
 * If the response has a non-2xx status code, it throws an error with a relevant message.
 *
 * @param {string} url - The endpoint URL to which the request should be sent.
 * @param {Object} body - The request payload to be sent as JSON.
 *
 * @returns {Promise<Object>} - Resolves with the parsed JSON response body.
 *
 * @throws {Error} - If the response status is not OK (e.g., 4xx or 5xx), or if the
 *                   response contains an `error` or `message` field.
 */
export async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || 'API error');
  }
  return data
}
