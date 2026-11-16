import { askOpenAI } from '../ask-openai.js';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

export default async function handler(request) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  try {
    const { report } = await request.json();
    if (!report || typeof report !== 'string') {
      return json({ error: 'Please write what happened first.' }, 400);
    }
    const answer = await askOpenAI(report.slice(0, 10000));
    return json({ answer });
  } catch (error) {
    const message = error.message === 'OPENAI_KEY_MISSING' || error.message === 'OPENAI_REQUEST_FAILED'
      ? 'I could not connect to the AI. Please ask a trusted adult to check the OpenAI key and internet connection.'
      : 'I could not finish that check. Please try again or tell a trusted adult.';
    return json({ error: message }, 502);
  }
}
