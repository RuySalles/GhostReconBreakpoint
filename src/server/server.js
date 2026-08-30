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
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain'
};

// Request handler function
function handleRequest(req, res) {
    // Prevent directory traversal attacks
    let safeUrl = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    
    // Convert all backslashes to forward slashes for reliable string matching on Windows
    let posixUrl = safeUrl.replace(/\\/g, '/');

    // Default to index.html
    if (posixUrl === '/') {
        posixUrl = '/index.html';
    }

    let filePath;
    // Determine which directory to serve from
    if (posixUrl.startsWith('/data-out/')) {
        // Remove the /data-out/ prefix so we can join it with DATA_OUT_DIR
        const subPath = posixUrl.replace(/^\/data-out\//, '');
        filePath = path.join(DATA_OUT_DIR, subPath);
    } else {
        // Anything else comes from public
        // Remove leading slash for safe join
        const subPath = posixUrl.replace(/^\//, '');
        filePath = path.join(PUBLIC_DIR, subPath);
    }

    // Ensure the path stays within allowed directories
    if (!filePath.startsWith(PUBLIC_DIR) && !filePath.startsWith(DATA_OUT_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden: Access denied.');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`<h1>404 Not Found</h1><p>The requested file <i>${safeUrl}</i> was not found on this server.</p>`);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        
        const stream = fs.createReadStream(filePath);
        stream.on('error', (streamErr) => {
            console.error(`Stream error for ${safeUrl}:`, streamErr.message);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Internal Server Error');
        });
        stream.pipe(res);
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
