const { getKey } = require('./keygen');

function requestError(message, fix) {
  const error = new Error(message);
  error.fix = fix;
  return error;
}

async function askOpenAIRequest(report, apiKey, instructions) {
  return fetch('https://api.openai.com/v1/responses', {
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
}

async function askOpenAI(report) {
  const fs = require('node:fs');
  const path = require('node:path');
  const instructions = fs.readFileSync(path.join(__dirname, 'BRIEF.md'), 'utf8');
  let response = await askOpenAIRequest(report, await getKey(), instructions);

  if (response.status === 401) {
    response = await askOpenAIRequest(report, await getKey({ forceRefresh: true }), instructions);
  }

  if (!response.ok) {
    throw requestError(
      'I could not get an answer from the AI.',
      `OpenAI returned HTTP ${response.status}. Check the key service and OpenAI access.`
    );
  }

  const data = await response.json();
  const answer = data.output_text || data.output?.flatMap((item) => item.content || [])
    .filter((item) => item.type === 'output_text')
    .map((item) => item.text)
    .join('\n');

  if (!answer) {
    throw requestError(
      'The AI returned an empty answer.',
      'Check the OpenAI response format and try the report again.'
    );
  }
  return answer;
}

module.exports = { askOpenAI };
