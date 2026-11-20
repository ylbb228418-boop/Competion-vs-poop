import { askOpenAI } from '../ask-openai.js';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

function errorResponse(error) {
  const message = error.message || 'I could not finish that check.';
  const fix = error.fix || 'Check the server logs and configuration.';
  console.error(`[Anti-bullies] ${fix}`);
  return json({ error: { message, fix } }, 502);
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
    return errorResponse(error);
  }
}
