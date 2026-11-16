function readApiKey() {
  return String(process.env.OPENAI_API_KEY || '').trim();
}

async function askOpenAI(report) {
  const apiKey = readApiKey();
  if (!apiKey || apiKey === 'paste-your-key-here') {
    throw new Error('OPENAI_KEY_MISSING');
  }

  const fs = require('node:fs');
  const path = require('node:path');
  const instructions = fs.readFileSync(path.join(__dirname, 'BRIEF.md'), 'utf8');
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-5.6-luna',
      instructions,
      input: `A student shared this report. Explain what may be happening first, using simple and kind words. Mention the duration and frequency as signals. Do not label it as a final bullying finding. Suggest a trusted adult and safe next step. If there is immediate danger, prioritize emergency help.\n\nReport:\n${report}`
    })
  });

  if (!response.ok) {
    throw new Error('OPENAI_REQUEST_FAILED');
  }

  const data = await response.json();
  const answer = data.output_text || data.output?.flatMap((item) => item.content || [])
    .filter((item) => item.type === 'output_text')
    .map((item) => item.text)
    .join('\n');

  if (!answer) throw new Error('OPENAI_EMPTY_RESPONSE');
  return answer;
}

module.exports = { askOpenAI };
