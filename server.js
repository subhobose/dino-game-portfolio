const http = require('http');
const fs = require('fs');
const path = require('path');

const DEFAULT_PORT = Number(process.env.PORT || 8080);
const HOST = '0.0.0.0';
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(clean);
  const target = normalized === '/' || normalized === '\\' ? 'index.html' : normalized.replace(/^[/\\]+/, '');
  return path.resolve(ROOT, target);
}

const server = http.createServer((req, res) => {
  const filePath = safePath(req.url || '/');

  if (!filePath.startsWith(ROOT)) {
    return send(res, 403, 'Forbidden');
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      return send(res, 404, 'Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        return send(res, 500, 'Server Error');
      }
      send(res, 200, data, type);
    });
  });
});

function listen(port) {
  server.listen(port, HOST, () => {
    console.log(`Dino game running at http://localhost:${port}`);
    console.log(`Fallback URL: http://127.0.0.1:${port}`);
  });
}

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    const fallback = DEFAULT_PORT + 1;
    console.warn(`Port ${DEFAULT_PORT} is busy. Switching to ${fallback}.`);
    server.removeAllListeners('error');
    listen(fallback);
    return;
  }

  console.error('Server failed to start:', err && err.message ? err.message : err);
  process.exit(1);
});

listen(DEFAULT_PORT);
