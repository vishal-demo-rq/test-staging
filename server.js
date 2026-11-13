const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const rootDirectory = __dirname;
const port = Number(process.env.PORT) || 4173;
const publicFiles = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/styles.css", "styles.css"],
  ["/script.js", "script.js"]
]);
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' https://images.unsplash.com; " +
    "style-src 'self' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; script-src 'self'; " +
    "base-uri 'self'; object-src 'none'; " +
    "frame-ancestors 'self' https://revolte.io https://*.revolte.io"
};

const server = http.createServer((request, response) => {
  Object.entries(securityHeaders).forEach(([header, value]) => {
    response.setHeader(header, value);
  });

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
    return;
  }

  let requestedPath;
  try {
    requestedPath = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname
    );
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }

  if (requestedPath === "/health") {
    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(request.method === "HEAD" ? undefined : "ok");
    return;
  }

  const publicFile = publicFiles.get(requestedPath);
  if (!publicFile) {
    response.writeHead(404).end("Not found");
    return;
  }

  const filePath = path.join(rootDirectory, publicFile);
  fs.readFile(filePath, (error, contents) => {
    if (error) {
      process.stderr.write(`Failed to read ${publicFile}: ${error.message}\n`);
      response.writeHead(500).end("Server error");
      return;
    }

    const contentType = contentTypes[path.extname(filePath)];
    response.writeHead(200, { "Content-Type": contentType });
    response.end(request.method === "HEAD" ? undefined : contents);
  });
});

server.listen(port, "0.0.0.0", () => {
  process.stdout.write(`Static blog listening on port ${port}\n`);
});
