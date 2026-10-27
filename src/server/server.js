const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8443;
const PROJECT_ROOT = path.join(__dirname, '..', '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const DATA_OUT_DIR = path.join(PROJECT_ROOT, 'data-out');

// SSL options
let sslOptions;
try {
    sslOptions = {
        key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem'))
    };
    console.log("SSL Certificates loaded successfully.");
} catch (err) {
    console.error("Warning: Failed to load SSL certificates. Falling back to HTTP server.", err.message);
}

// MIME Types lookup
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
    '.wav': 'audio/wav',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8'
};

function sendText(res, status, message, headers) {
    res.writeHead(status, Object.assign({ 'Content-Type': 'text/plain; charset=utf-8' }, headers));
    res.end(message);
}

// Only true if target is root itself or inside it (a plain startsWith would accept "public-evil/")
function isInside(root, target) {
    const rel = path.relative(root, target);
    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

// Parses a single "bytes=start-end" range (also "start-" and "-suffix").
// Returns { start, end }, null when there is no usable Range header, or false when it can't be satisfied.
function parseRange(header, size) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(header || '');
    if (!match || (match[1] === '' && match[2] === '')) return null;

    let start, end;
    if (match[1] === '') {
        // Suffix range: the last N bytes
        start = Math.max(size - Number(match[2]), 0);
        end = size - 1;
    } else {
        start = Number(match[1]);
        end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1);
    }
    if (start >= size || start > end) return false;
    return { start, end };
}

// Request handler function
function handleRequest(req, res) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        sendText(res, 405, '405 Method Not Allowed', { 'Allow': 'GET, HEAD' });
        return;
    }

    // Drop the query string and decode %XX (file names with accents, spaces...)
    let urlPath;
    try {
        urlPath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
    } catch (err) {
        sendText(res, 400, '400 Bad Request: malformed URL.');
        return;
    }
    if (urlPath.includes('\0')) {
        sendText(res, 400, '400 Bad Request: malformed URL.');
        return;
    }

    // Convert all backslashes to forward slashes for reliable string matching on Windows
    let posixUrl = urlPath.replace(/\\/g, '/');

    // Default to index.html
    if (posixUrl === '/') {
        posixUrl = '/index.html';
    }

    // Determine which directory to serve from
    let root, subPath;
    if (posixUrl.startsWith('/data-out/')) {
        root = DATA_OUT_DIR;
        subPath = posixUrl.replace(/^\/data-out\//, '');
    } else {
        // Anything else comes from public
        root = PUBLIC_DIR;
        subPath = posixUrl.replace(/^\/+/, '');
    }
    const filePath = path.join(root, subPath);

    // Prevent directory traversal attacks (checked after decoding, so %2e%2e is covered too)
    if (!isInside(root, filePath)) {
        sendText(res, 403, '403 Forbidden: Access denied.');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            sendText(res, 404, `404 Not Found: ${posixUrl}`);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const headers = {
            'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
            'Accept-Ranges': 'bytes'
        };

        // Audio/video players request pieces of the file (seek, Safari/iOS playback)
        let status = 200;
        let range = null;
        if (req.headers.range) {
            range = parseRange(req.headers.range, stats.size);
            if (range === false) {
                sendText(res, 416, '416 Range Not Satisfiable', { 'Content-Range': `bytes */${stats.size}` });
                return;
            }
        }
        if (range) {
            status = 206;
            headers['Content-Range'] = `bytes ${range.start}-${range.end}/${stats.size}`;
            headers['Content-Length'] = range.end - range.start + 1;
        } else {
            headers['Content-Length'] = stats.size;
        }

        if (req.method === 'HEAD') {
            res.writeHead(status, headers);
            res.end();
            return;
        }

        const stream = fs.createReadStream(filePath, range || undefined);
        stream.on('open', () => {
            res.writeHead(status, headers);
            stream.pipe(res);
        });
        stream.on('error', (streamErr) => {
            console.error(`Stream error for ${posixUrl}:`, streamErr.message);
            if (res.headersSent) {
                res.destroy();
            } else {
                sendText(res, 500, '500 Internal Server Error');
            }
        });
        // Client gave up (e.g. player jumped to another range): stop reading the file
        res.on('close', () => stream.destroy());
    });
}

// Start Both HTTPS and HTTP Servers
const HTTP_PORT = 8080;

if (sslOptions) {
    https.createServer(sslOptions, handleRequest).listen(PORT, () => {
        console.log(`\n======================================================`);
        console.log(`[SECURE SERVER] Operations Command Room running at:`);
        console.log(`HTTPS Url: https://localhost:${PORT}`);
        console.log(`======================================================\n`);
    });
}

http.createServer(handleRequest).listen(HTTP_PORT, () => {
    console.log(`\n======================================================`);
    console.log(`[HTTP SERVER] Operations Command Room running at:`);
    console.log(`HTTP Url: http://localhost:${HTTP_PORT}`);
    console.log(`======================================================\n`);
});
