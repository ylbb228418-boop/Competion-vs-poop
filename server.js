const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

function loadLocalEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const envText = fs.readFileSync(envPath, 'utf8');
  for (const name of ['KEYGEN_URL', 'KEYGEN_TOKEN']) {
    if (process.env[name]) continue;
    const line = envText.split(/\r?\n/).find((item) => item.startsWith(`${name}=`));
    if (line) process.env[name] = line.slice(name.length + 1).trim();
  }
}

loadLocalEnv();
const { askOpenAI } = require('./ask-openai');

const publicDir = path.join(__dirname, 'public');
const port = 3000;

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function sendError(res, error) {
  const message = error.message || 'I could not finish that check.';
  const fix = error.fix || 'Check the server logs and configuration.';
  console.error(`[Anti-bullies] ${fix}`);
  sendJson(res, 502, { error: { message, fix } });
}

function serveFile(req, res) {
  const requested = new URL(req.url, `http://${req.headers.host}`).pathname;
  const safePath = requested === '/' ? '/index.html' : requested;
  const filePath = path.resolve(publicDir, `.${safePath}`);
  if (!filePath.startsWith(publicDir) || !fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
  res.writeHead(200, { 'Content-Type': `${types[path.extname(filePath)] || 'text/plain'}; charset=utf-8` });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/analyze') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; if (body.length > 20000) req.destroy(); });
    req.on('end', async () => {
      try {
        const { report } = JSON.parse(body || '{}');
        if (!report || typeof report !== 'string') return sendJson(res, 400, { error: 'Please write what happened first.' });
        const answer = await askOpenAI(report.slice(0, 10000));
        sendJson(res, 200, { answer });
      } catch (error) {
        sendError(res, error);
      }
    });
    return;
  }
  serveFile(req, res);
});

server.listen(port, () => {
  console.log(`Anti-bullies is running at http://localhost:${port}`);
});
