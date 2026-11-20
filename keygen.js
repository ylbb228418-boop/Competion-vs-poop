const keyCache = {
  apiKey: '',
  expiresAt: 0
};

function configError(message, fix) {
  const error = new Error(message);
  error.fix = fix;
  return error;
}

function expirationTime(value) {
  const time = typeof value === 'number' ? value : Date.parse(value);
  return Number.isFinite(time) && time > 0 ? time : 0;
}

async function getKey(options = {}) {
  const forceRefresh = Boolean(options.forceRefresh);
  if (!forceRefresh && keyCache.apiKey && keyCache.expiresAt > Date.now() + 5000) {
    return keyCache.apiKey;
  }

  const keygenUrl = String(process.env.KEYGEN_URL || '').trim().replace(/\/$/, '');
  const keygenToken = String(process.env.KEYGEN_TOKEN || '').trim();
  if (!keygenUrl || !keygenToken) {
    throw configError(
      'The AI key service is not configured.',
      'Set KEYGEN_URL and KEYGEN_TOKEN in the local .env file and in the Vercel environment settings.'
    );
  }

  let response;
  try {
    response = await fetch(`${keygenUrl}/api/lookup-key`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${keygenToken}`,
        Accept: 'application/json'
      }
    });
  } catch {
    throw configError(
      'The AI key service could not be reached.',
      'Check the key service URL and the server internet connection.'
    );
  }

  if (!response.ok) {
    throw configError(
      'The AI key service did not provide a key.',
      `The key service returned HTTP ${response.status}. Check KEYGEN_URL and KEYGEN_TOKEN.`
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw configError(
      'The AI key service returned an unreadable response.',
      'Check that the key service returns JSON with apiKey and expiresAt.'
    );
  }

  const apiKey = typeof data.apiKey === 'string' ? data.apiKey.trim() : '';
  const expiresAt = expirationTime(data.expiresAt);
  if (!apiKey || !expiresAt || expiresAt <= Date.now()) {
    throw configError(
      'The AI key service returned an unusable key.',
      'Check that the key service returns a non-empty apiKey and a future expiresAt value.'
    );
  }

  keyCache.apiKey = apiKey;
  keyCache.expiresAt = expiresAt;
  return apiKey;
}

module.exports = { getKey };
