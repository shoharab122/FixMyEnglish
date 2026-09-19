
import http from 'node:http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { log } from './lib/logger.js';
import { attachSocketGateway } from './sockets/gateway.js';

// A closed stdout/stderr pipe (EPIPE) should not crash the server.
for (const stream of [process.stdout, process.stderr]) {
  stream.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EPIPE') return;
    throw err;
  });
}

const app = createApp();
const server = http.createServer(app);
attachSocketGateway(server);

const port = Number(process.env.PORT) || env.port;

server.listen(port, '0.0.0.0', () => {
  log.info(`API listening on port ${port}`);
});
